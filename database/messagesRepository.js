import { eq, desc } from "drizzle-orm";
import { messages } from "./schema.js";

export function createMessagesRepository({ db }) {
  return {
    async create(message) {
      const now = new Date();
      const result = await db.insert(messages).values({
        messageId: message.messageId,
        phone: message.phone,
        content: message.content,
        role: message.role,
        type: message.type || "text",
        mediaUrl: message.mediaUrl,
        createdAt: now,
        updatedAt: now,
        status: message.status || "sent",
        senderName: message.senderName,
      });

      return result;
    },

    // Buscar mensagem por ID
    async findById(id) {
      return await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    },

    // Buscar mensagens por telefone
    async findByPhone(phone) {
      return await db
        .select()
        .from(messages)
        .where(eq(messages.phone, phone))
        .orderBy(desc(messages.createdAt));
    },

    // Buscar todas as mensagens
    async findAll(limit = 100) {
      return await db
        .select()
        .from(messages)
        .orderBy(desc(messages.createdAt))
        .limit(limit);
    },

    // Atualizar mensagem
    async update(id, updates) {
      const now = new Date();
      return await db
        .update(messages)
        .set({
          content: updates.content,
          isRead: updates.isRead,
          isEdited: updates.isEdited,
          status: updates.status,
          updatedAt: now,
        })
        .where(eq(messages.id, id));
    },

    // Deletar mensagem
    async delete(id) {
      return await db.delete(messages).where(eq(messages.id, id));
    },

    // Buscar mensagens não lidas
    async findUnread() {
      return await db
        .select()
        .from(messages)
        .where(eq(messages.isRead, false))
        .orderBy(desc(messages.createdAt));
    },

    // Contar mensagens por telefone
    async countByPhone(phone) {
      const result = await db
        .select({ count: db.sql`count(*)` })
        .from(messages)
        .where(eq(messages.phone, phone));

      return result[0]?.count || 0;
    },
  };
}

