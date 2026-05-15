import { useMultiFileAuthState } from "@whiskeysockets/baileys";

export async function auth() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  return { state, saveCreds };
}
