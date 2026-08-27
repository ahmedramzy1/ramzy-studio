export type ExternalVideoProvider = "youtube" | "vimeo";

export function youtubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be" || parsed.hostname.endsWith(".youtu.be")) {
      return parsed.pathname.split("/").filter(Boolean)[0] || null;
    }
    if (!parsed.hostname.includes("youtube.com")) return null;
    if (parsed.pathname.startsWith("/shorts/") || parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/")[2] || null;
    }
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

export function vimeoVideoId(url: string): string | null {
  try {
    return (
      new URL(url).pathname.split("/").filter(Boolean).reverse().find((part) => /^\d+$/.test(part)) || null
    );
  } catch {
    return null;
  }
}

export function detectExternalVideoProvider(url: string): ExternalVideoProvider | null {
  if (youtubeVideoId(url)) return "youtube";
  if (vimeoVideoId(url)) return "vimeo";
  return null;
}

export function externalVideoEmbedUrl(
  provider: ExternalVideoProvider,
  url: string,
): string | null {
  if (provider === "youtube") {
    const id = youtubeVideoId(url);
    if (!id) return null;
    const params = new URLSearchParams({ rel: "0", playsinline: "1", enablejsapi: "1" });
    if (typeof window !== "undefined") {
      const origin = /^https?:/.test(window.location.origin) ? window.location.origin : "";
      const referrer = /^https?:/.test(window.location.href) ? window.location.href : document.referrer;
      if (origin) params.set("origin", origin);
      if (referrer) params.set("widget_referrer", referrer);
    }
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }

  const id = vimeoVideoId(url);
  if (!id) return null;
  return `https://player.vimeo.com/video/${id}?playsinline=1`;
}
