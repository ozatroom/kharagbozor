export async function onRequestGet({params,env}) {
  const key=String(params.key||"");
  if(!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(key)) return new Response("Not found",{status:404});
  const object=await env.PRODUCT_IMAGES.get(key);
  if(!object) return new Response("Not found",{status:404});
  const headers=new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag",object.httpEtag);
  headers.set("cache-control","public, max-age=31536000, immutable");
  headers.set("x-content-type-options","nosniff");
  return new Response(object.body,{headers});
}
