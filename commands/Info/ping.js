const { Message, Client } = require("djs-selfbot");

module.exports = {
  name: "ping",
  aliases: ["latency"],
  description: "Shows bot lantency",
  dm: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      await message.reply(`latency : \`${Math.round(client.ws.ping)}\``);
    } catch (err) {
      client.logger(err);
    }
  },
};
