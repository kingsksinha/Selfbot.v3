const { Client: SBClient } = require("djs-selfbot");
require("colors");
require("dotenv").config();
const fs = require("fs");

console.clear();
console.log(`[!] Starting Bhuvnesh Selfbot v3`.blue);
console.log("-".repeat(36).yellow);

try {
  const bhuvsb = new SBClient({
    intents: ["GUILDS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_WEBHOOKS", "DIRECT_MESSAGES"],
    allowedMentions: { repliedUser: false },
    partials: ["CHANNEL"],
  });
  const handlers = fs.readdirSync("./handlers/");

  handlers.forEach((handler) => {
    require(`./handlers/${handler}`)(bhuvsb);
  });
  bhuvsb.login(process.env.TOKEN).catch((err) => console.log(`[×] Wrong Bot Token Provided.\n`.red, err));
} catch (err) {
  console.log("[ERROR], ", err);
}
