# GREEN-API HTML Demo

Тестовое задание: HTML-страница с вызовами методов GREEN-API и выводом ответа.

- `getSettings`
- `getStateInstance`
- `sendMessage`
- `sendFileByUrl`

## Соответствие требованиям

- На странице есть поля `idInstance` и `ApiTokenInstance`
- Реализованы кнопки вызова всех 4 методов из задания
- Ответ каждого метода выводится справа в отдельное read-only поле

## Как запустить локально

### Через Go (основной способ)

Нужен [Go 1.22+](https://go.dev/dl/).

```bash
go run .
```

Откройте `http://127.0.0.1:8080/`.

Порт можно задать переменной окружения `PORT`:

```bash
set PORT=8081
go run .
```

Сборка одного exe:

```bash
go build -o green-api-html.exe .
```

### Через Python (без Go)

```bash
py -m http.server 5173
```

После запуска откройте `http://127.0.0.1:5173/`.

## Как пользоваться

1. Введите `idInstance` и `ApiTokenInstance` (берутся из `https://console.green-api.com/`).
2. Нажмите `getStateInstance` и убедитесь, что `stateInstance` = `authorized`.
3. Нажмите `getSettings` — просто чтобы увидеть, что доступ есть.
4. Для `sendMessage` заполните `chatId` (например `79990001122@c.us`) и текст сообщения.
5. Для `sendFileByUrl` заполните `chatId` и `urlFile` (прямая ссылка на файл). `fileName` берётся из URL автоматически.

## Примечания

- Базовый хост API используется: `https://api.greenapi.com`
- Ответ выводится как: `URL`, `HTTP-статус`, время запроса и тело ответа (pretty JSON).

