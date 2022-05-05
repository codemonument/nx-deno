import { PassthroughExecutorSchema } from "./schema";
import * as execa from "execa";

export default async function runExecutor(options: PassthroughExecutorSchema) {
  const { cmd } = options;

  const { stdout } = await execa("deno", [cmd]);
  console.log("Deno Passthrough Executor ran", { options, stdout });
  return {
    success: true,
  };
}
