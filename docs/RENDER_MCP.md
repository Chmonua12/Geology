# Развёртывание MCP на Render

Основной Django-сайт уже работает на `https://geology-0en5.onrender.com/`. Второй сервис `geology-mcp` создаётся из того же репозитория по файлу `render.yaml` и одновременно обслуживает:

- Vite-форму персональной экспедиции;
- REST API и SQLite;
- WebSocket для заполнения открытого сайта;
- HTTP MCP endpoint `/mcp`.

## Создание сервиса

1. В Render открыть **Blueprints → New Blueprint Instance**.
2. Выбрать репозиторий `Chmonua12/Geology` и ветку `main`.
3. Render прочитает `render.yaml` и предложит создать только сервис `geology-mcp`.
4. В поле `POLZA_API_KEY` вставить ключ из `https://polza.ai/dashboard/api-keys`.
5. Применить Blueprint и дождаться статуса **Live**.
6. Проверить `https://geology-mcp.onrender.com/api/health`.

`MCP_AUTH_TOKEN` Render создаёт автоматически. Его значение понадобится в настройке MCP-клиента. Если Render назначил сервису адрес с дополнительным суффиксом, этот фактический адрес нужно указать в переменных `GEOLOGY_API_URL` и `GEOLOGY_FORM_URL` Django-сервиса.

## Настройка существующего Django-сервиса

В сервисе `geology-0en5` открыть **Environment** и задать:

```text
GEOLOGY_API_URL=https://geology-mcp.onrender.com
GEOLOGY_FORM_URL=https://geology-mcp.onrender.com
```

После сохранения выбрать **Save and deploy**. Если новый сервис получил другой адрес, использовать его без завершающего `/`.

## Подключение MCP-клиента

Скопировать `mcp.json.example` и заменить `<MCP_AUTH_TOKEN_FROM_RENDER>` значением `MCP_AUTH_TOKEN` из Render. Итоговый endpoint:

```text
https://geology-mcp.onrender.com/mcp
```

Секреты нельзя добавлять в GitHub. `POLZA_API_KEY` и `MCP_AUTH_TOKEN` должны храниться только в Render и конфигурации MCP-клиента.

## Хранение данных

На бесплатном тарифе SQLite находится во временной файловой системе. После перезапуска Bun-сервиса база может очиститься, но открытый Django-сайт повторно отправляет сохранённый в браузере прогресс. Для постоянного хранения можно подключить Render Persistent Disk и задать `GEOLOGY_DB_PATH=/var/data/geology.sqlite`.
