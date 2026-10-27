const SHEET_NAME = "Отзывы";

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || "{}");
    const expectedToken = PropertiesService.getScriptProperties().getProperty("FEEDBACK_TOKEN");
    if (!expectedToken || data.token !== expectedToken) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Дата", "Имя", "ID", "Оценка", "Комментарий",
        "Время, мин", "Этапы", "Ошибки", "Подсказки"
      ]);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      safeCell(data.savedAt),
      safeCell(data.name),
      safeCell(data.learnerId),
      Number(data.rating || 0),
      safeCell(data.comment),
      Number(data.durationMinutes || 0),
      Number(data.completedStages || 0),
      Number(data.errors || 0),
      Number(data.hints || 0),
    ]);
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function safeCell(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
