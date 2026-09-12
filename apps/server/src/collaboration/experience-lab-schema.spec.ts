import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { getSchema } from '@tiptap/core';
import { tiptapExtensions } from './collaboration.util';
const fixture=JSON.parse(readFileSync(join(__dirname,'fixtures/experience-lab.template.json'),'utf8'));
function resolve(value:any):any {
 if(Array.isArray(value))return value.map(resolve);
 if(value&&typeof value==='object'){
  if(value.$media)return value.field==='size'?100:value.field==='id'?'11111111-1111-4111-8111-111111111111':'/api/files/11111111-1111-4111-8111-111111111111/'+value.$media;
  return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,resolve(v)]));
 }
 return value;
}
describe('Experience Lab server persistence',()=>{
 it('keeps every fixture node and authored attribute through Yjs, including Tabs',()=>{
  const content=resolve({type:'doc',content:[...fixture.chapters.flatMap((c:any)=>c.nodes),{type:'footnotes',content:fixture.footnotes}]});
  const schema=getSchema(tiptapExtensions);schema.nodeFromJSON(content).check();
  const doc=TiptapTransformer.toYdoc(content,'default',tiptapExtensions);
  const result=TiptapTransformer.fromYdoc(doc,'default');
  function verify(actual:any,expected:any){
   expect(actual.type).toBe(expected.type);
   for(const [k,v] of Object.entries(expected.attrs??{}))if(v!==null)expect(actual.attrs?.[k]).toEqual(v);
   if(expected.text)expect(actual.text).toBe(expected.text);
   if(expected.marks)for(const mark of expected.marks){const found=actual.marks?.find((m:any)=>m.type===mark.type);expect(found).toBeTruthy();for(const [k,v] of Object.entries(mark.attrs??{}))expect(found.attrs?.[k]).toEqual(v);}
   expect(actual.content?.length??0).toBe(expected.content?.length??0);
   (expected.content??[]).forEach((n:any,i:number)=>verify(actual.content[i],n));
  }
  verify(result,content);doc.destroy();
 });
});

describe('rejected replacement preserves existing content',()=>{
 it('converts unsupported input before deleting the current Yjs fragment',async()=>{
  const {CollaborationHandler}=await import('./collaboration.handler');
  const before={type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'Keep this authored content'}]}]};
  const doc=TiptapTransformer.toYdoc(before,'default',tiptapExtensions);
  const initial=TiptapTransformer.fromYdoc(doc,'default');
  const handler=new CollaborationHandler();
  jest.spyOn(handler,'withYdocConnection').mockImplementation(async(_h,_name,_context,fn)=>{fn(doc as any)});
  await expect(handler.getHandlers({} as any).updatePageContent('page.test',{operation:'replace',prosemirrorJson:{type:'doc',content:[{type:'notASupportedNode'}]},user:{} as any})).rejects.toThrow();
  expect(TiptapTransformer.fromYdoc(doc,'default')).toEqual(initial);
  doc.destroy();
 });
});
