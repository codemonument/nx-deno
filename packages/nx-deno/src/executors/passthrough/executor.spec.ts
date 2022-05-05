import { PassthroughExecutorSchema } from "./schema";
import executor from "./executor";

const options: PassthroughExecutorSchema = { cmd: `--version` };

describe("Deno Passthrough Executor", () => {
  it("can run --version", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
