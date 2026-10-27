import { describe, expect, test } from "bun:test";
import { handleMcpMessage } from "./mcpCore";

describe("integrated MCP endpoint", () => {
  test("lists the three project tools", async () => {
    const response = await handleMcpMessage({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }) as any;
    expect(response.result.tools.map((tool: { name: string }) => tool.name)).toEqual([
      "get_learning_progress",
      "fill_expedition_form",
      "fill_final_results",
    ]);
  });
});
