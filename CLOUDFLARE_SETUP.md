# KHARAGBOZOR — подключение продавцов и модерации

Для работы заявок продавцов проект использует Cloudflare Pages Functions, D1 и R2.

## 1. Создать D1
1. Cloudflare Dashboard → Storage & databases → D1 SQL Database → Create.
2. Название: `kharagbozor-db`.
3. Откройте базу → Console → выполните весь SQL из файла `schema.sql`.

## 2. Создать R2
1. Cloudflare Dashboard → R2 Object Storage → Create bucket.
2. Название: `kharagbozor-product-images`.

## 3. Привязать ресурсы к Pages
1. Workers & Pages → Pages → `kharagbozor` → Settings → Functions.
2. В D1 database bindings добавьте binding:
   - Variable name: `DB`
   - D1 database: `kharagbozor-db`
3. В R2 bucket bindings добавьте binding:
   - Variable name: `PRODUCT_IMAGES`
   - R2 bucket: `kharagbozor-product-images`
4. В Settings → Variables and Secrets добавьте секрет:
   - Name: `ADMIN_TOKEN`
   - Value: придумайте длинный случайный пароль (не публикуйте его в коде и GitHub).

## 4. Повторный деплой
После сохранения привязок запустите Retry deployment или сделайте новый commit. Проверьте статус Success.

## Как работает
- Продавец отправляет форму и фото через `POST /api/products`.
- Фото хранится в приватном R2 bucket, запись товара — в D1 со статусом `pending`.
- Каталог получает только товары со статусом `approved`.
- Кнопка «Модерация» запрашивает секрет администратора. Секрет проверяется сервером, а не хранится в репозитории.
- Одобрение/отклонение меняет статус через `PATCH /api/moderation`.

## Важно
Пока D1, R2 и секрет не созданы и не привязаны в Cloudflare, отправка товара не будет работать — API вернёт ошибку настройки. Не вставляйте ADMIN_TOKEN в HTML, сообщения или GitHub. Перед открытием публичной регистрации продавцов дополнительно рекомендуется включить Cloudflare Turnstile и ограничение частоты запросов.
