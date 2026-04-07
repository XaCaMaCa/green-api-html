const API_URL = "https://api.greenapi.com";

const $ = (id) => document.getElementById(id);

const ui = {
  idInstance: $("idInstance"),
  apiTokenInstance: $("apiTokenInstance"),
  msgChatId: $("msgChatId"),
  msgText: $("msgText"),
  fileChatId: $("fileChatId"),
  fileUrl: $("fileUrl"),
  response: $("response"),
  btnGetSettings: $("btnGetSettings"),
  btnGetState: $("btnGetState"),
  btnSendMessage: $("btnSendMessage"),
  btnSendFileByUrl: $("btnSendFileByUrl"),
};

function requireValue(el, errorMessage) {
  const value = (el?.value ?? "").trim();
  if (!value) throw new Error(errorMessage);
  return value;
}

function getAuth() {
  return {
    idInstance: requireValue(ui.idInstance, "Введите idInstance"),
    apiTokenInstance: requireValue(ui.apiTokenInstance, "Введите ApiTokenInstance"),
  };
}

function endpoint(method) {
  const { idInstance, apiTokenInstance } = getAuth();
  return `${API_URL}/waInstance${encodeURIComponent(idInstance)}/${method}/${encodeURIComponent(apiTokenInstance)}`;
}

function setLoading(isLoading) {
  ui.btnGetSettings.disabled = isLoading;
  ui.btnGetState.disabled = isLoading;
  ui.btnSendMessage.disabled = isLoading;
  ui.btnSendFileByUrl.disabled = isLoading;
}

function print(text) {
  ui.response.value = text;
}

function prettyBody(bodyText) {
  try {
    const json = JSON.parse(bodyText);
    return JSON.stringify(json, null, 2);
  } catch {
    return bodyText;
  }
}

function guessFileName(urlFile) {
  try {
    const u = new URL(urlFile);
    const last = u.pathname.split("/").filter(Boolean).pop() ?? "";
    if (last.includes(".")) return last;
  } catch {
    // ignore
  }
  return "file";
}

async function callApi({ method, httpMethod, body }) {
  const url = endpoint(method);
  const options = { method: httpMethod, headers: {} };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const t0 = performance.now();
  const res = await fetch(url, options);
  const ms = Math.round(performance.now() - t0);

  const text = await res.text();
  return { url, status: res.status, ms, text };
}

async function run(title, handler) {
  setLoading(true);
  print("Запрос выполняется...");

  try {
    const { url, status, ms, text } = await handler();
    print(`${title}\n${url}\nHTTP ${status} • ${ms} мс\n\n${prettyBody(text)}\n`);
  } catch (e) {
    print(`Ошибка: ${e instanceof Error ? e.message : String(e)}`);
  } finally {
    setLoading(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  print("Введите idInstance и ApiTokenInstance, затем нажмите нужную кнопку.");

  ui.btnGetSettings.addEventListener("click", () =>
    run("getSettings", () => callApi({ method: "getSettings", httpMethod: "GET" }))
  );

  ui.btnGetState.addEventListener("click", () =>
    run("getStateInstance", () => callApi({ method: "getStateInstance", httpMethod: "GET" }))
  );

  ui.btnSendMessage.addEventListener("click", () =>
    run("sendMessage", () => {
      const chatId = requireValue(ui.msgChatId, "Введите chatId для sendMessage");
      const message = requireValue(ui.msgText, "Введите текст сообщения");
      return callApi({ method: "sendMessage", httpMethod: "POST", body: { chatId, message } });
    })
  );

  ui.btnSendFileByUrl.addEventListener("click", () =>
    run("sendFileByUrl", () => {
      const chatId = requireValue(ui.fileChatId, "Введите chatId для sendFileByUrl");
      const urlFile = requireValue(ui.fileUrl, "Введите ссылку на файл");
      const fileName = guessFileName(urlFile);
      return callApi({ method: "sendFileByUrl", httpMethod: "POST", body: { chatId, urlFile, fileName } });
    })
  );
});
