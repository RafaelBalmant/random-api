import express from "express";
import dotenv from "dotenv";
import { container } from "./container.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

app.use(express.json());

/**
 * GET - Verificação do webhook (Meta)
 */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/**
 * POST - Recebe mensagens reais do WhatsApp
 */
app.post("/webhook", (req, res) => {
  try {
    const body = req.body;

    // Logs completos do evento
    console.log("📩 Webhook recebido:");
    console.dir(body, { depth: null });

    // Verifica se existe mensagem
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const message = value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body;

      console.log("👤 De:", from);
      console.log("💬 Mensagem:", text);

      // aqui você pode chamar IA ou lógica de resposta
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("Erro webhook:", err);
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`server rodando na porta ${PORT}`);
});
