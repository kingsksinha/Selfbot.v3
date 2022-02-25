const { Message, Client } = require("djs-selfbot");
const { perms } = require("../../Utility/idk");

module.exports = {
  name: "setnick",
  description: "Set nickname for a server, Permanent until you reset, No one can change or reset your nick until your permission got removed",
  permissions: ["CHANGE_NICKNAME"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const { guild } = message;
      const nick = args.join(" ").trim();

      if (nick.length > 32) {
        return message.reply(`Nick length must be less then **32**`);
      } else if (!guild.me.permissions.has("CHANGE_NICKNAME")) {
        return await message.reply(`Dummy! Who Will Gimme **${perms["CHANGE_NICKNAME"]}** Perm?`);
      }

      await guild.me.setNickname(nick);

      const data = client.db.get("nickdata", {});
      client.db.set("nickdata", (data[guild.id] = nick));
    } catch (err) {
      client.logger(err);
    }
  },
};
