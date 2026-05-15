import { makeWASocket } from "@whiskeysockets/baileys";
import { DisconnectReason } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";

export async function whatsappChat({ whatsAppAuth, messagesRepository }) {
  const { state, saveCreds } = await whatsAppAuth();
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    console.log("UPDATE:", update);

    if (qr) {
      console.log("📱 Escaneie o QR:");

      qrcode.generate(qr, {
        small: true,
      });
    }

    if (connection === "open") {
      console.log("✅ WhatsApp conectado");
    }

    if (connection === "close") {
      console.log("❌ Conexão fechada");

      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("🔄 Reconectando...");
        whatsappChat({ whatsAppAuth, messagesRepository });
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0];

      console.log(msg.pushName);

      const text = msg.message?.conversation;

      const senderId = msg.key.remoteJid?.replace("@s.whatsapp.net", "");

      const messageId = msg.key.id;

      console.log(`📨 Mensagem de ${senderId}: ${text}`);

      await messagesRepository.create({
        messageId: messageId,
        phone: senderId,
        content: text,
        senderName: msg.pushName,
        role: "user",
        type: "text",
        status: "received",
      });

      console.log(`✅ Mensagem salva no banco`);
    } catch (error) {
      console.error("❌ Erro ao processar mensagem:", error.message);
    }
  });
}
