const { Message, Client, MessageEmbed } = require("djs-selfbot");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Stop it..! Get Some Help!",
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
      const categs = [...new Set(client.commands.map((e) => e.directory))].map((n) => {
        const cmds = client.commands.filter((e) => e.directory === n).map(({ name: e, description: n }) => ({ name: e, description: n }));
        return { name: n, commands: cmds };
      });

      const categ = args[0];
      if (categ) {
        if ((cmd = client.commands.find((e) => e.name === categ))) {
          return await message.reply({
            content: `**Bhuv SB v3**\n\`'${cmd.name}'\` Command Help\n__**Description:**__ ${cmd.description || "N/A"}\n__**Aliases:**__ ${
              cmd.aliases?.length ? `\`${cmd.aliases.join(" | ")}\`` : "N/A"
            }\n__**Category:**__ ${cmd.directory || "N/A"}\n__**DM Support?:**__ ${cmd.dm ? "Yes" : "No"}\n__**Permission(s) Required:**__ ${
              cmd.permissions ? `\`${cmd.permissions.join(", ")}\`` : "N/A"
            }`,
          });
        } else {
          const o = categs.find((e) => e.name.toLowerCase() === categ.toLowerCase());
          if (o) {
            return await message.reply({
              content: `**Bhuv SB v3**\n**${o.name}** Category Help\n**Total ${o.name} Commands: ** **\`${o.commands.length}\`**\n${[
                ...o.commands.map(({ name: e, description: n }) => `**\`${e}\`** - ${n}`),
              ].join("\n")}`,
            });
          } else {
            return await message.reply({
              content: `**Bhuv SB v3**\nUnknown Category: **\`${categ}\`**\n**Total Commands: ** **\`${e.commands.size}\`**\n**__Categories!__**\n${[
                ...t.map(({ name: e, commands: n }) => `**\`${e}\`** - **\`${n.length}\`** Commands`),
              ].join("\n")}\n\n**\`${s}help [category]\`** for more!`,
            });
          }
        }
      }

      await message.reply({
        content: `**Bhuv SB v3**\n${[...categs.map(({ name: e, commands: n }) => `**\`${e}\`** - **\`${n.length}\`** Commands`)].join("\n")}\n\n**\`${client.prefix}help [category]\`** for more!`,
      });
    } catch (err) {
      client.logger(err);
    }
  },
};
