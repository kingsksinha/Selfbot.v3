const { Client } = require("djs-selfbot");

const { stream } = require("../config.json");
const { line, success } = require("../Utility/logger");
/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
  try {
    line();
    success(`Selfbot Ready as ${client.user.tag}`);

    client.owner = await client.users.fetch("921354871054147584");
    stream && client.user.setActivity("Bhuvnesh Selfbot v3", { name: "Bhuvnesh Selfbot v3", type: "STREAMING", url: "https://www.twitch.tv/#" });
  } catch (e) {
    console.log(`[ERROR] :`, e);
  }
};
