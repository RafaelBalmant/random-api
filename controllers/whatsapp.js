const routes = {
  handshake: {
    method: "get",
    path: "/handshake",
    handler: ({ res }) => {
      return res.status(200).json({
        status: "ok",
        message: "handshake ok",
      });
    },
  },
  webhook: {
    method: "get",
    path: "/webhook",
    handler: ({ req, res }) => {
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];
      const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN;

      if (mode === "subscribe" && token === verifyToken) {
        return res.status(200).send(challenge);
      }

      return res.sendStatus(403);
    },
  },
  receiveWebhook: {
    method: "post",
    path: "/webhook",
    handler: ({ req, res }) => {
      try {
        const body = req.body;

        console.log("Webhook recebido:");
        console.dir(body, { depth: null });

        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message) {
          const from = message.from;
          const text = message.text?.body;

          console.log("De:", from);
          console.log("Mensagem:", text);
        }

        return res.sendStatus(200);
      } catch (err) {
        console.error("Erro webhook:", err);
        return res.sendStatus(500);
      }
    },
  },
};

export function whatsappController() {
  function registerRoutes(application) {
    Object.values(routes).forEach((route) => {
      application[route.method](route.path, (req, res) => route.handler({ req, res }));
    });
  }

  return {
    registerRoutes,
  };
}
