const { Message, Client, GuildEmoji, Guild } = require("djs-selfbot");
const { default: ThreadPool } = require("threadpool");

module.exports = {
  name: "delemotes",
  aliases: ["delemojis"],
  description: "Deletes All Emojis",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const { guild } = message;

      /**
       *
       * @param {Guild} guild
       * @param {GuildEmoji} emoji
       */
      const delete_emoji = async (guild, emoji) => {
        try {
          const ok = await axios({ url: `https://discord.com/api/v${[8, 9].random()}/guilds/${guild.id}/emojis/${emoji.id}`, method: "DELETE", headers: { Authorization: client.token } });
          if (ok.status === 429) {
            await message.reply(`[DELEMOTES] Got Rate limited, Trying Again in **${ok.data["retry_after"]}** Seconds`);
            console.log(`[DELEMOTES] - ${guild.name} (${guild.id}) | Got Rate limited`.red);
            setTimeout(() => delete_emoji(guild, emoji), ok.data["retry_after"] * 1000);
          } else if (ok.status === 200 || ok.status === 201) {
            await message.reply(`[DELEMOTES] Successfully Deleted \`${emoji.toString()}\``);
            console.log(`[DELEMOTES] - ${guild.name} (${guild.id}) | Deleted ${emoji.name}`.green);
          }
        } catch (err) {
          client.logger(err);
        }
      };

      try {
        const threadpool = new ThreadPool(500, { errorHandler: (e) => {} });
        guild.emojis.cache.map(
          /** @param {GuildEmoji} emoji */ async (emoji) => {
            threadpool.queue(async () => {
              delete_emoji(guild, emoji);
            });
          }
        );
        threadpool.run();
        try {
          await threadpool.waitComplete();
        } catch {}
      } catch {}
    } catch (err) {
      client.logger(err);
    }
  },
};
