const { Message, Client, GuildMember } = require("djs-selfbot");

/**
 *
 * @param {Client} client
 * @param {GuildMember} old_mem
 * @param {GuildMember} new_mem
 */
module.exports = async (client, old_mem, new_mem) => {
  try {
    const { guild } = old_mem;
    // Nickupdated
    if (old_mem.nickname !== new_mem.nickname && old_mem.id === client.user.id && new_mem.id === client.user.id) {
      const nick = client.db.get("nickdata")[guild.id];
      if (nick) {
        await new_mem.setNickname(nick);
      }
    }
  } catch (err) {
    client.logger(err);
  }
};
