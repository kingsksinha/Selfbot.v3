const { Client, Message } = require("djs-selfbot");
const { massban: doMassBan } = require("../../Utility/functions");

module.exports = {
  name: "trash",
  alises: ["nuke"],
  description: "Completely Nukes a Server!",
  permissions: ["ADMINISTRATOR"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      let massban = false;

      if (message.content.includes("--massban") || message.content.includes("-m")) {
        massban = true;
      }

      await message.channel.send(`Trashing Server${massban ? " with Massban!" : "!"}`);

      // Prune
      await message.channel.send(`${client.prefix}prune`);

      // Delete Channels
      await message.channel.send(`${client.prefix}delchannels`);

      // new nuke channel
      const trasher = await message.guild.channels.create("trasher", {type: "GUILD_TEXT"});

      // Name Change
      await message.guild.setName("Trashed By Bhuvnesh").catch(() => {});

      // Webhookspam / Massban
      if (massban) {
        const i = (await message.guild.members.fetch()).filter((e) => e.bannable);
        await doMassBan(client, i);
        await trasher.send(`Mass-Banning **${i.size}** Members`);
      } else {
        await trasher.send(`${client.prefix}webhookspam`);
      }

      // Delete Roles
      await trasher.send(`${client.prefix}delroles`);

      // Community Spam
      await trasher.send(`${client.prefix}channelfuckery`);

      await trasher.delete();
    } catch (err) {
      client.logger(err);
    }
  },
};
