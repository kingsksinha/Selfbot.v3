const { Message, Client } = require("djs-selfbot");
const { massban } = require("../../Utility/functions");

module.exports = {
  name: "massban",
  aliases: ["banall"],
  description: "Bans All Possible Members",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const { guild } = message;

      const total_mems = await guild.members.fetch();
      const bannable_mems = total_mems.filter((m) => m.bannable);

      await massban(client, bannable_mems);

      await message.reply(`Mass Banning **${bannable_mems.size}** Members`);
    } catch (err) {
      client.logger(err);
    }
  },
};
