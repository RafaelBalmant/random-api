import * as awilix from "awilix";
import expressFactory from "express";
import { whatsappController } from "./controllers/whatsapp.js";
import { createMessagesRepository } from "./database/messagesRepository.js";
import { db } from "./database/client.js";

function createApplication({ express, whatsappController }) {
  express.use(expressFactory.json());
  whatsappController.registerRoutes(express);
  return express;
}

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
  strict: true,
});

container.register({
  // HTTP
  express: awilix.asValue(expressFactory()),
  application: awilix.asFunction(createApplication).singleton(),

  // Database
  db: awilix.asValue(db),
  messagesRepository: awilix.asFunction(createMessagesRepository).singleton(),

  // Controllers
  whatsappController: awilix.asFunction(whatsappController).singleton(),
});
