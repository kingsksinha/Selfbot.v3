const { Message, Client, GuildMemberManager } = require("djs-selfbot");

module.exports = {
  name: "detectprune",
  aliases: ["checkprune", "dprune", "cprune"],
  description: "Shows How many Members Ban Be Pruned",
  permissions: ["KICK_MEMBERS"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const { guild } = message;

      let count = 0;
      
      const msg = await message.reply("Detecting Prune!");

      const roles = await message.guild.roles.fetch();

      const sorted = roles.cache.sort((a, b) => {
        if (a.members.size < b.members.size) return 1;
        if (a.members.size > b.members.size) return -1;
        return 0;
      });

      if (!isNaN((i = parseInt(args[0]))) && i <= 30 && i >= 1) {
        count = await guild.members.prune({ days: i, dry: true, roles: sorted.map((e) => e.id).slice(0, 100) });
      } else {
        count = await guild.members.prune({ days: 1, dry: true, roles: sorted.map((e) => e.id).slice(0, 100) });
      }

      await msg.edit(`**${count}** Members Can be Pruned!`);
    } catch (err) {
      client.logger(err);
    }
  },
};
