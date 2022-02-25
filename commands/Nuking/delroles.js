const { Message, Client } = require("djs-selfbot");
const { default: ThreadPool } = require("threadpool");
const { delroles } = require("../../Utility/functions");

module.exports = {
  name: "delroles",
  aliases: [],
  description: "Deletes all roles fastly asfff",
  permissions: ["MANAGE_ROLES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const { guild } = message;

      const roles = (await guild.roles.fetch()).cache.filter((e) => e.rawPosition < guild.me.roles.highest.rawPosition);

      delroles(client, guild, roles.map(e => e.id))
      
      await message.reply(`Deleting **${roles.size}** Roles`)
    } catch (err) {
      client.logger(err);
    }
  },
};
