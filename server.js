import dotenv from "dotenv";
import { container } from "./container.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";
const app = container.resolve("application");

app.listen(PORT, HOST, () => {
  console.log(`server rodando em http://${HOST}:${PORT}`);
});
