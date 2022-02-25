const { default: axios } = require("axios");
const { Client, Collection } = require("djs-selfbot");
const { color, prefix, allowed, logger } = require("../config.json");
const { line, info, green } = require("../Utility/logger");
const MyDB = require("../modules/MyDB");

Array.prototype.random = function () {
  let n = this[Math.floor(Math.random() * this.length)];
  for (; !n; ) n = this[Math.floor(Math.random() * this.length)];
  return n;
};

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  line();
  info("Handling Client..");

  client.color = color;
  green("Set client color");
  client.prefix = prefix;
  green("Set client prefix");
  client.allowed = allowed;
  green("Set Allowed Members: " + `[${allowed.join(", ")}]`);

  /**
   //  * @type {Collection<key: string, { name: String, description: String, dm: Boolean, run: (client: Client, message: Message, args: String[]): void }>}
   //  */
  client.commands = new Collection();
  green(`Set Empty Commands Collection`);

  client.db = new MyDB("./data/db");
  green(`Set Client Database`);

  client.db.on("INIT", () => console.log(`[DATABASE] Initialised`.green)).on("LOADED", () => console.log(`[DATABASE] Loaded`.green));

  client.logger = async (data) => {
    try {
      const isURL = (k) => {
        try {
          new URL(k);
          return true;
        } catch {
          return false;
        }
      };
      if (isURL(logger)) {
        await axios({ url: logger, method: "POST", data: { content: data } });
        console.log(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  green(`Set Client Logger`);

  line();
};
