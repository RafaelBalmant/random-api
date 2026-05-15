import * as awilix from 'awilix';
import { auth } from "./services/providers/whatsapp/auth.js";
import { whatsappChat } from "./services/providers/whatsapp/chat.js";
import { createMessagesRepository } from "./database/messagesRepository.js";
import { db } from "./database/client.js";

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
  strict: true,
});

container.register({
  // Database
  db: awilix.asValue(db),
  messagesRepository: awilix.asFunction(createMessagesRepository).singleton(),

  // WhatsApp
  whatsAppAuth: awilix.asValue(auth),
  whatsappChat: awilix.asFunction(whatsappChat).singleton(),
});
