import { handleMcpMessage } from "./mcpCore";

function send(message: unknown) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

let buffer = "";
for await (const chunk of Bun.stdin.stream()) {
  buffer += new TextDecoder().decode(chunk);
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const response = await handleMcpMessage(JSON.parse(line));
      if (response) send(response);
    } catch { /* Некорректное сообщение не останавливает сервер. */ }
  }
}
