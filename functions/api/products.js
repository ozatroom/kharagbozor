const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
export async function onRequestGet({env}) {
  try {
    const {results=[]}=await env.DB.prepare("SELECT id,title,title_tj AS titleTj,description,category,price,price10,price50,seller,phone,'/api/images/' || image_key AS image FROM products WHERE status='approved' ORDER BY created_at DESC LIMIT 300").all();
    return json({products:results});
  } catch(e) { return json({error:"Database is not configured"},503); }
}
export async function onRequestPost({request,env}) {
  try {
    const d=await request.json();
    const required=["title","category","seller","phone","image"];
    if(required.some(k=>!String(d[k]||"").trim()) || !Number.isFinite(Number(d.price)) || Number(d.price)<=0) return json({error:"Заполните обязательные поля и проверьте цену."},400);
    if(String(d.title).length>80 || String(d.seller).length>80 || String(d.phone).length>40 || String(d.description||"").length>180) return json({error:"Слишком длинные данные."},400);
    let imageKey="";
    if(String(d.image).startsWith("data:image/")) {
      const m=String(d.image).match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
      if(!m) return json({error:"Поддерживаются JPG, PNG и WebP."},400);
      const bytes=Uint8Array.from(atob(m[2]),c=>c.charCodeAt(0));
      if(bytes.byteLength>6*1024*1024) return json({error:"Фото после обработки должно быть меньше 6 МБ."},413);
      imageKey=crypto.randomUUID()+({ "image/jpeg":".jpg","image/png":".png","image/webp":".webp"}[m[1]]);
      await env.PRODUCT_IMAGES.put(imageKey,bytes,{httpMetadata:{contentType:m[1]}});
    } else {
      let u; try{u=new URL(d.image)}catch{return json({error:"Укажите корректную ссылку на фото."},400)}
      if(u.protocol!=="https:") return json({error:"Ссылка на фото должна начинаться с https://"},400);
      return json({error:"Загрузите фото файлом — внешние ссылки пока не принимаются."},400);
    }
    const id=crypto.randomUUID();
    await env.DB.prepare("INSERT INTO products (id,title,title_tj,description,category,price,price10,price50,image_key,seller,phone,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending')")
      .bind(id,String(d.title).trim(),String(d.titleTj||"").trim(),String(d.description||"").trim(),String(d.category),Number(d.price),d.price10?Number(d.price10):null,d.price50?Number(d.price50):null,imageKey,String(d.seller).trim(),String(d.phone).trim()).run();
    return json({ok:true,id,message:"Товар отправлен на модерацию."},201);
  } catch(e) { return json({error:"Не удалось сохранить товар. Проверьте настройки Cloudflare."},503); }
}
