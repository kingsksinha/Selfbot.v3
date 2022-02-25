const { Message, Client } = require("djs-selfbot");
const { default: ThreadPool } = require("threadpool");

module.exports = {
  name: "clearchannels",
  aliases: ["cc"],
  description: "Delete Channels with Same Name Provided",
  usage: "moderator-only,rules",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const { guild } = message;

      const names = args.join(" ").split(/,/);

      const channels = guild.channels.cache.filter((e) => names.includes(e.name));
      const runDelete = () => {
        channels
          .filter((e) => !e.deltd)
          .map(async (c) => {
            !c.deltd &&
              c.deletable &&
              (await c
                .delete()
                .then((h) => (h.deltd = true))
                .catch(() => {}));
          });
      };

      const threadPool = new ThreadPool(500, { errorHandler: (e) => {} });

      for (let e = 0; e < 500; e++) {
        threadPool.queue(runDelete);
      }

      threadPool.run();
      try {
        await threadPool.waitComplete();
      } catch (err) {
        client.logger(err);
      }
    } catch (err) {
      client.logger(err);
    }
  },
};
