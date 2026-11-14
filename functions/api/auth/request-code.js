export async function onRequestPost() {
  return new Response(JSON.stringify({
    error: "Авторизация ещё не подключена. Для отправки SMS и email-кодов необходимо настроить провайдера и секреты Cloudflare."
  }), {
    status: 503,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
