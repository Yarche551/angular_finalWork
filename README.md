## requires
Нужны Node.js 22+ и запущенная MongoDB на `localhost:27017`.

1. Распаковать `Проект бэкенда.zip`, внутри — `project.zip`, распаковать и его.
2. Распаковать `images.zip` и скопировать все картинки в `project/public/images`.
   Файл `image3.jpg.jpg` переименовать в `image3.jpg` — иначе у одной статьи не будет картинки.
3. В папке `project`:

```bash
npm i
```

```bash
npx migrate-mongo up
```

```bash
npm start
```

Бэкенд поднимется на `http://localhost:3000`. Тестовый пользователь из миграции:
`test@gmail.com` / `12345678`.

### 2. Фронтенд (эта папка)

```bash
npm install
```

```bash
npm start
```

Сайт откроется на `http://localhost:4200`. Адрес API задан в `src/environments/environment.ts`.

### Остальные команды

| Команда         | Что делает                          |
| --------------- | ----------------------------------- |
| `npm run build` | продакшн-сборка в `dist/it-storm`   |
| `npm test`      | unit-тесты (Vitest)                 |
| `npm run lint`  | проверка кода линтером              |