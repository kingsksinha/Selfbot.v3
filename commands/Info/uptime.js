const { Message, Client } = require("djs-selfbot");
const prettyMiliseconds = require("pretty-ms");
module.exports = {
  name: "uptime",
  aliases: [],
  description: "Shows from how much time bot is Online",
  dm: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      await message.reply(`Uptime : ${prettyMiliseconds(client.uptime)}\nUp From: <t:${Math.round((Date.now() + client.uptime) / 1000)}:F>`);
    } catch (err) {
      client.logger(err);
    }
  },
};
