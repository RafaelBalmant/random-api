import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Identificação
  messageId: text("message_id").unique().notNull(), // ID único do WhatsApp
  phone: text("phone").notNull(), // Telefone do remetente
  senderName: text("sender_name").notNull(),

  // Conteúdo
  content: text("content").notNull(), // Texto da mensagem
  role: text("role").notNull(), // "user" ou "assistant"

  // Tipo de mensagem
  type: text("type").default("text"), // "text", "image", "audio", "video", etc
  mediaUrl: text("media_url"), // URL da mídia se houver

  // Metadados
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  isEdited: integer("is_edited", { mode: "boolean" }).default(false),

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),

  // Status
  status: text("status").default("sent"), // "sent", "delivered", "read", "failed"
});
