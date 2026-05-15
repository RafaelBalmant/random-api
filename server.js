import express from "express";
import { container } from "./container.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// webhook (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  return res.status(200).send(challenge);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`server rodando na porta ${PORT}`);
});
