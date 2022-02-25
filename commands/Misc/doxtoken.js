const { default: axios } = require("axios");
const { Message, Client, MessageEmbed } = require("djs-selfbot");

module.exports = {
  name: "doxtoken",
  aliases: [],
  description: "Shows Information of given Token",
  permissions: ["EMBED_LINKS"],
  dm: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      if (!args[0]) {
        return await message.reply(`Bruhh...! Token is Missing!`);
      }

      const token = args[0];

      let tried = false;
      const doxToken = async (tkn) => {
        try {
          const res = await axios({ url: `https://discord.com/api/v9/users/@me`, headers: { Authorization: tkn } });

          const d = res.data;

          return {
            rawData: {
              Name: `${d.username}#${d.discriminator}`,
              ID: d.id,
              Email: d.email || `N/A`,
              Phone: d.phone || `N/A`,
              "Bot?": d.bot ? "Yes" : "No",
              "Token Locked?": d.verified ? "No" : "Yes",
              Premium: d.premium_type === 1 ? "Nitro Classic" : d.premium_type === 2 ? "Nitro Booster" : "None",
              "2fa Enabled": d.mfa_enabled ? "Yes" : "No",
              "NSFW Allowed": d.nsfw_allowed ? "Yes" : "No",
            },
            bannerURL: d.banner ? `https://cdn.discordapp.com/banners/${d.id}/${d.banner}${d.banner.startsWith("a_") ? ".gif" : ".png"}?size=4096` : null,
            avatarURL: d.avatar ? `https://cdn.discordapp.com/avatars/${d.id}/${d.avatar}${d.avatar.startsWith("a_") ? ".gif" : ".png"}?size=4096` : null,
          };
        } catch (err) {
          if (!tried) {
            tried = true;
            return await doxToken(`Bot ${tkn}`);
          } else {
            return err.toString();
          }
        }
      };

      const res = await doxToken(token);

      if (typeof res === "string") {
        return await message.reply(`Invalid Token!`);
      }

      let rawStringData = [];
      for (const i in res.rawData) {
        rawStringData.push(`**__${i}__**: ${res.rawData[i]}`);
      }

      rawStringData = rawStringData.join("\n");

      const msg = `Bhuv SB v3\n**Token DoXing**\n${rawStringData}`;

      return await message.reply({ content: msg });
    } catch (err) {
      client.logger(err);
    }
  },
};
