const { Message, Client } = require("djs-selfbot");

module.exports = {
  name: "spam",
  description: "You like Spamming? me too",
  dm: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const amount = args[0];
      if (!amount || isNaN(parseInt(amount)) || !args[1]) return;
      for (let n = 0; n < parseInt(amount); n++) message.channel.send(message.content.split(amount)[1]).catch(() => {});
    } catch (err) {
      client.logger(err);
    }
  },
};
