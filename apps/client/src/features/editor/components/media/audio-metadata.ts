// Browser-side, dependency-free best-effort audio metadata extraction.
// Metadata is enrichment only: parsing failure never blocks upload/playback.
// Supports ID3v2 (MP3/compatible) and MP4/M4A ilst metadata, including artwork.

export interface ExtractedAudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  artworkFile?: File;
}

const textDecoderUtf8 = new TextDecoder("utf-8");
const textDecoderLatin1 = new TextDecoder("iso-8859-1");

function syncSafe(bytes: Uint8Array, offset: number) {
  return (
    (((bytes[offset] ?? 0) & 0x7f) * 0x200000) +
    (((bytes[offset + 1] ?? 0) & 0x7f) * 0x4000) +
    (((bytes[offset + 2] ?? 0) & 0x7f) * 0x80) +
    ((bytes[offset + 3] ?? 0) & 0x7f)
  );
}

function uint32(bytes: Uint8Array, offset: number) {
  return (
    (bytes[offset] ?? 0) * 0x1000000 +
    ((bytes[offset + 1] ?? 0) << 16) +
    ((bytes[offset + 2] ?? 0) << 8) +
    (bytes[offset + 3] ?? 0)
  ) >>> 0;
}

function trimNulls(value: string) {
  return value.replace(/\u0000/g, "").trim();
}

function decodeUtf16(bytes: Uint8Array, littleEndian: boolean) {
  if (bytes.length < 2) return "";
  const usable = bytes.length - (bytes.length % 2);
  const codeUnits: number[] = [];
  for (let i = 0; i < usable; i += 2) {
    const a = bytes[i] ?? 0;
    const b = bytes[i + 1] ?? 0;
    codeUnits.push(littleEndian ? a | (b << 8) : (a << 8) | b);
  }
  let out = "";
  for (let i = 0; i < codeUnits.length; i += 2048) {
    out += String.fromCharCode(...codeUnits.slice(i, i + 2048));
  }
  return out;
}

function decodeId3Text(bytes: Uint8Array) {
  if (!bytes.length) return "";
  const encoding = bytes[0] ?? 0;
  let body = bytes.subarray(1);

  if (encoding === 0) return trimNulls(textDecoderLatin1.decode(body));
  if (encoding === 3) return trimNulls(textDecoderUtf8.decode(body));

  if (encoding === 1) {
    let little = true;
    if (body[0] === 0xfe && body[1] === 0xff) {
      little = false;
      body = body.subarray(2);
    } else if (body[0] === 0xff && body[1] === 0xfe) {
      body = body.subarray(2);
    }
    return trimNulls(decodeUtf16(body, little));
  }

  if (encoding === 2) return trimNulls(decodeUtf16(body, false));
  return trimNulls(textDecoderUtf8.decode(body));
}

function terminatorLength(encoding: number) {
  return encoding === 1 || encoding === 2 ? 2 : 1;
}

function findEncodedTerminator(bytes: Uint8Array, offset: number, encoding: number) {
  if (encoding === 1 || encoding === 2) {
    for (let i = offset; i + 1 < bytes.length; i += 2) {
      if (bytes[i] === 0 && bytes[i + 1] === 0) return i;
    }
    return bytes.length;
  }

  for (let i = offset; i < bytes.length; i += 1) {
    if (bytes[i] === 0) return i;
  }
  return bytes.length;
}

function extensionForMime(mime: string) {
  const lower = mime.toLowerCase();
  if (lower.includes("png")) return "png";
  if (lower.includes("webp")) return "webp";
  if (lower.includes("gif")) return "gif";
  if (lower.includes("avif")) return "avif";
  return "jpg";
}

function parseId3Artwork(frame: Uint8Array): File | undefined {
  if (frame.length < 5) return undefined;
  const encoding = frame[0] ?? 0;
  let cursor = 1;

  let mimeEnd = cursor;
  while (mimeEnd < frame.length && frame[mimeEnd] !== 0) mimeEnd += 1;
  const mime =
    trimNulls(textDecoderLatin1.decode(frame.subarray(cursor, mimeEnd))) ||
    "image/jpeg";
  cursor = Math.min(frame.length, mimeEnd + 1);

  cursor += 1; // picture type
  if (cursor >= frame.length) return undefined;

  const descriptionEnd = findEncodedTerminator(frame, cursor, encoding);
  cursor = Math.min(frame.length, descriptionEnd + terminatorLength(encoding));
  if (cursor >= frame.length) return undefined;

  const data = frame.slice(cursor);
  if (data.length < 16) return undefined;
  return new File([data], `embedded-artwork.${extensionForMime(mime)}`, {
    type: mime,
  });
}

async function parseId3(file: File): Promise<ExtractedAudioMetadata | undefined> {
  const header = new Uint8Array(await file.slice(0, 10).arrayBuffer());
  if (
    header.length < 10 ||
    String.fromCharCode(...header.subarray(0, 3)) !== "ID3"
  ) {
    return undefined;
  }

  const version = header[3] ?? 4;
  const tagSize = syncSafe(header, 6);
  if (tagSize <= 0) return {};

  const readSize = Math.min(
    file.size,
    Math.min(tagSize + 10, 16 * 1024 * 1024),
  );
  const bytes = new Uint8Array(await file.slice(0, readSize).arrayBuffer());
  const result: ExtractedAudioMetadata = {};
  let cursor = 10;

  while (cursor + 10 <= bytes.length) {
    const id = textDecoderLatin1.decode(bytes.subarray(cursor, cursor + 4));
    if (!id.trim() || /^\x00+$/.test(id)) break;
    if (!/^[A-Z0-9]{4}$/.test(id)) break;

    const size =
      version >= 4 ? syncSafe(bytes, cursor + 4) : uint32(bytes, cursor + 4);
    if (!size || size < 0) break;
    const start = cursor + 10;
    const end = Math.min(bytes.length, start + size);
    if (end <= start) break;
    const frame = bytes.subarray(start, end);

    if (id === "TIT2") result.title = decodeId3Text(frame) || result.title;
    else if (id === "TPE1") result.artist = decodeId3Text(frame) || result.artist;
    else if (id === "TALB") result.album = decodeId3Text(frame) || result.album;
    else if (id === "APIC" && !result.artworkFile) {
      result.artworkFile = parseId3Artwork(frame);
    }

    cursor = start + size;
  }

  return result;
}

type Atom = { type: string; start: number; dataStart: number; end: number };

function atomType(bytes: Uint8Array, offset: number) {
  return textDecoderLatin1.decode(bytes.subarray(offset, offset + 4));
}

function readAtoms(bytes: Uint8Array, start: number, end: number): Atom[] {
  const atoms: Atom[] = [];
  let cursor = start;
  while (cursor + 8 <= end) {
    let size = uint32(bytes, cursor);
    const type = atomType(bytes, cursor + 4);
    let headerSize = 8;

    if (size === 1 && cursor + 16 <= end) {
      const hi = uint32(bytes, cursor + 8);
      const lo = uint32(bytes, cursor + 12);
      size = hi * 0x100000000 + lo;
      headerSize = 16;
    } else if (size === 0) {
      size = end - cursor;
    }

    if (!Number.isFinite(size) || size < headerSize || cursor + size > end) {
      break;
    }
    atoms.push({ type, start: cursor, dataStart: cursor + headerSize, end: cursor + size });
    cursor += size;
  }
  return atoms;
}

function findChild(atoms: Atom[], type: string) {
  return atoms.find((atom) => atom.type === type);
}

function decodeMp4Data(bytes: Uint8Array, tag: Atom) {
  const dataAtom = findChild(readAtoms(bytes, tag.dataStart, tag.end), "data");
  if (!dataAtom || dataAtom.dataStart + 8 > dataAtom.end) return undefined;
  return bytes.subarray(dataAtom.dataStart + 8, dataAtom.end);
}

async function parseMp4(file: File): Promise<ExtractedAudioMetadata | undefined> {
  const probe = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (probe.length < 12 || atomType(probe, 4) !== "ftyp") return undefined;
  if (file.size > 128 * 1024 * 1024) return {};

  const bytes = new Uint8Array(await file.arrayBuffer());
  const root = readAtoms(bytes, 0, bytes.length);
  const moov = findChild(root, "moov");
  if (!moov) return {};
  const udta = findChild(readAtoms(bytes, moov.dataStart, moov.end), "udta");
  if (!udta) return {};
  const meta = findChild(readAtoms(bytes, udta.dataStart, udta.end), "meta");
  if (!meta) return {};

  const ilst = findChild(readAtoms(bytes, meta.dataStart + 4, meta.end), "ilst");
  if (!ilst) return {};
  const tags = readAtoms(bytes, ilst.dataStart, ilst.end);
  const result: ExtractedAudioMetadata = {};

  const textTag = (name: string) => {
    const atom = findChild(tags, name);
    const data = atom ? decodeMp4Data(bytes, atom) : undefined;
    return data ? trimNulls(textDecoderUtf8.decode(data)) : undefined;
  };

  result.title = textTag("©nam");
  result.artist = textTag("©ART") || textTag("aART");
  result.album = textTag("©alb");

  const cover = findChild(tags, "covr");
  const dataAtom = cover
    ? findChild(readAtoms(bytes, cover.dataStart, cover.end), "data")
    : undefined;
  if (dataAtom && dataAtom.dataStart + 8 < dataAtom.end) {
    const typeIndicator = uint32(bytes, dataAtom.dataStart);
    const mime = typeIndicator === 14 ? "image/png" : "image/jpeg";
    const data = bytes.slice(dataAtom.dataStart + 8, dataAtom.end);
    if (data.length >= 16) {
      result.artworkFile = new File(
        [data],
        `embedded-artwork.${extensionForMime(mime)}`,
        { type: mime },
      );
    }
  }

  return result;
}

export async function extractAudioMetadata(
  file: File,
): Promise<ExtractedAudioMetadata> {
  try {
    return (await parseId3(file)) ?? (await parseMp4(file)) ?? {};
  } catch {
    return {};
  }
}
