import Kia from "https://deno.land/x/kia@0.4.1/mod.ts";

/**
 * Starts an entry on cli with a spinner
 * Could be used, for example, to show the "working" state for one action
 * To build a log of actions and their statuses, call startKia multiple times per action which should be logged
 * @param text
 * @returns
 */
async function startKia(text: string): Promise<Kia> {
  const kia = new Kia(text);
  await kia.start();
  return kia;
}

export { Kia, startKia };
