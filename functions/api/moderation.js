const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
const authorized=(request,env)=>{const h=request.headers.get("Authorization")||"";return !!env.ADMIN_TOKEN && h==="Bearer "+env.ADMIN_TOKEN};
export async function onRequestGet({request,env}) {
  if(!authorized(request,env)) return json({error:"Нет доступа"},401);
  try { const {results=[]}=await env.DB.prepare("SELECT id,title,title_tj AS titleTj,description,category,price,price10,price50,seller,phone,'/api/images/' || image_key AS image,created_at AS createdAt FROM products WHERE status='pending' ORDER BY created_at DESC LIMIT 200").all(); return json({products:results}); }
  catch(e){return json({error:"Database is not configured"},503);}
}
export async function onRequestPatch({request,env}) {
  if(!authorized(request,env)) return json({error:"Нет доступа"},401);
  try { const d=await request.json(); if(!d.id || !["approved","rejected"].includes(d.status)) return json({error:"Некорректный запрос"},400);
    const r=await env.DB.prepare("UPDATE products SET status=? WHERE id=? AND status='pending'").bind(d.status,String(d.id)).run();
    if(!r.meta?.changes) return json({error:"Заявка не найдена или уже обработана"},404);
    return json({ok:true});
  } catch(e){return json({error:"Не удалось обновить статус"},503);}
}
