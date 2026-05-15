import express from "express";
import dotenv from "dotenv";
import { container } from "./container.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

// Middleware
app.use(express.json());

// webhook (GET - validação da Meta)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log(challenge);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log('token verified');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`server rodando na porta ${PORT}`);
});
