const { default: axios } = require("axios");
const { Client, Message, MessageEmbed } = require("djs-selfbot");

module.exports = {
  name: "whois",
  aliases: ["userinfo", "ui"],
  description: "Shows Information About Member!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    try {
      const user = args[0] ? message.mentions.members.first() || message.guild.member(args[0]) : message.member;

      if (!user) {
        return message.reply({ content: `**Bhuv SB v3**\nUnknown User - ${args[0]}` });
      }

      const { id, joinedTimestamp, user: mUser, nickname, guild } = user;
      const { createdTimestamp, username } = mUser;
      const joinedTime = `<t:${Math.round(joinedTimestamp / 1000)}:f> (<t:${Math.round(joinedTimestamp / 1000)}:R>)`;
      const createdTime = `<t:${Math.round(createdTimestamp / 1000)}:f> (<t:${Math.round(createdTimestamp / 1000)}:R>)`;
      const icon = user.user.displayAvatarURL({ dynamic: true });

      const req = await axios({ method: "GET", url: `https://discord.com/api/v9/users/${user.id}`, headers: { Authorization: client.token } });
      const bannerCode = req.data.banner;
      let banner;
      if (bannerCode) {
        banner = `https://cdn.discordapp.com/banners/${user.id}/${bannerCode}${bannerCode.startsWith("a_") ? ".gif" : ".png"}?size=4096`;
      }

      const perms = {
        CREATE_INSTANT_INVITE: "Create Invite",
        KICK_MEMBERS: "Kick Members",
        BAN_MEMBERS: "Ban Members",
        ADMINISTRATOR: "Administrator",
        MANAGE_CHANNELS: "Manage Channels",
        MANAGE_GUILD: "Manage Guild",
        ADD_REACTIONS: "React Messages",
        VIEW_AUDIT_LOG: "Audit Access",
        MANAGE_MESSAGES: "Manage Messages",
        EMBED_LINKS: "Embeds Links",
        ATTACH_FILES: "Attach Files",
        MENTION_EVERYONE: "Mention Everyone",
        USE_EXTERNAL_EMOJIS: "External Emoji",
        CHANGE_NICKNAME: "Change Nick",
        MANAGE_NICKNAMES: "Manage Nick",
        MANAGE_ROLES: "Manage Roles",
        MANAGE_WEBHOOKS: "Manage Webhooks",
        MANAGE_EMOJIS: "Manage Emojis",
        MANAGE_EVENTS: "Manage Events",
        MODERATE_MEMBERS: "Moderate Members",
      };

      const userperms = user.permissions.toArray();

      const finalPerms = [];
      userperms.map((p) => {
        if (perms[p]) finalPerms.push(perms[p]);
      });

      const yesNo = (bool = false, emoji = false) => (bool ? (emoji ? "✅" : "Yes") : emoji ? "❌" : "No");

      const roles = user.roles;

      const rolesOrdered = roles.cache.sort((a, b) => b.rawPosition - a.rawPosition);

      const content = `**Bhuv SB v3**
Whois **${user.user.tag}**?

__General information__
**Name:** ${mUser.tag}
**ID:** ${id}
${nickname && `**Nickname:** ${nickname}`}
${icon && `**Avatar URL**: ${icon}`}
${banner && `**Banner URL**: ${banner}`}
**Bot?:** ${yesNo(user.user.bot, true)}
**Account created:** ${createdTime}
**Server joined:** ${joinedTime}

__Role info__
**Total Roles:** ${roles.cache.size}
**Highest Role:** ${roles.highest.toString()}
**Roles:** ${rolesOrdered.size < 40 ? `\`\`\`${rolesOrdered.map((e) => `${e.name}`).join(", ")}\`\`\`` : "Too Many Roles To Display!"}
**Color:** ${user.displayHexColor}

__Permissions__
${finalPerms.join(", ")}`;
      await message.reply({ content });
    } catch (err) {
      throw new Error(err);
    }
  },
};
