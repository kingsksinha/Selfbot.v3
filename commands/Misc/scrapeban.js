const { Message, Client } = require("djs-selfbot");
const { scrapeban, massban } = require("../../Utility/functions");
// require("snowflake-regex")
module.exports = {
  name: "scrapeban",
  aliases: [],
  description: "Scrapes Server Members then Bans all them in Provided Server",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const { guild } = message;

      if (!args[0]) {
        return await message.reply(`Must Provide Server ID / Name`);
      }

      let name_id;
      let limit;

      if (/[""]/.test(message.content)) {
        name_id = message.content.split(/[""]/)[1];
      } else {
        name_id = args[0];
      }
      if (/\?l[ ]+/.test(message.content)) {
        limit = message.content.split(/\?l +/)[1].split(/ +/)[0];
        if (isNaN(parseInt(limit))) {
          return await message.reply(`Expected \`... ?l <number>\`\nProvided \`... ?l <string>\``);
        } else {
          limit = parseInt(limit);
        }
      }
      const toBanGuild = client.guilds.cache.find((e) => e.id === name_id || e.name === name_id);

      if (!toBanGuild) {
        return await message.reply(`\`${name_id}\` isn't a Valid Server ID / Name`);
      }

      const scraped_mems = await guild.members.fetch(limit ? { limit } : null);

      await message.reply(`Scraped **${scraped_mems.size}** Members`);

      if (!toBanGuild.me.permissions.has("BAN_MEMBERS")) {
        return await message.reply(`LMAO! You Dont Have Ban Perm in \`${toBanGuild.name}\``);
      }

      scrapeban(client, toBanGuild, scraped_mems);
      await message.reply(`Banning **${scraped_mems.size}** Members...`);
    } catch (err) {
      client.logger(err);
    }
  },
};
