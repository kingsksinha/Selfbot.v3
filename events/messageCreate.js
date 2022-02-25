const { Message, Client } = require("djs-selfbot");
const { music, allowed, whitelisted } = require("../config.json");
const { perms, permissionStrings } = require("../Utility/idk");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

/**
 *
 * @param {Message} message
 * @return {Message<true>}
 */
const fetch_message = async (message) => {
  try {
    const fetched = await fetch(`https://discord.com/api/v${[8, 9].random()}/channels/${message.channel.id}/messages?limit=3`, {
      headers: { "Content-Type": "application/json", Authorization: message.client.token },
    });
    if (fetched.status !== 200) {
      return false;
    }
    const json = await fetched.json();
    const the_msg_we_need = json?.find((d) => d.id === message.id);
    if (the_msg_we_need) {
      return new Message(message.client, the_msg_we_need);
    }
  } catch {
    return false;
  }
};

/**
 *
 * @param {Client} client
 * @param {Message} _message
 */
module.exports = async (client, _message) => {
  try {
    const message = await fetch_message(_message);

    if (!message) return;

    if (message.mentions.users.has(client.user.id) && client.afk?.enabled) {
      await message.reply(`I'm AFK, ${client.afk.msg}`);
    }

    const { prefix } = client;

    if (![...allowed, client.user.id].includes(message.author.id)) return;

    if ((message.content.trim() === prefix && prefix !== "") || (message.content.trim() === "purge" && prefix !== "")) {
      message.delete().catch(() => {});
      const msgs = await message.channel.messages.fetch({ limit: 100 });
      const toDel = msgs.filter((e) => e.content.startsWith(prefix));
      const toDel2 = msgs.filter((e) => e.reference && msgs.map((e) => e.id).includes(e.reference.messageId));
      toDel.map((e) => e.delete().catch(() => {}));
      toDel2.map((e) => e.delete().catch(() => {}));
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/[ ]+/);
    const argCmd = args.shift().toLowerCase();
    const command = client.commands.find((c) => c.name === argCmd) || client.commands.find((al) => al.aliases && al.aliases.includes(argCmd));

    if (!command) {
      // message.edit()
      return;
    }

    if (command.permissions) {
      if (command.dm || message.channel.type === "DM") {
      } else {
        for (const permission of command.permissions) {
          if (!permissionStrings.includes(permission)) {
            await message.reply("Error 500: Internal Error Occured");
            return console.log(`Command: ${command.name}\nError: ${permission} is not a valid permission String`);
          }

          if (!message.guild.me.permissions.has(permission)) {
            if (!(await message.guild.members.fetch("794061930054418483").catch(() => null)) && permission === "EMBED_LINKS") {
              return await message.reply(`Dummy! Who Will Gimme **${perms[permission] || permission}** Perm?`);
              // spy security is there!
            }
          }
        }
      }
    }

    try {
      if (command.directory === "Music" && !music.enabled) {
        await message.reply("Music Module isn't Enabled");
      } else if (command.directory === "Nuking" && message.guildId.includes(whitelisted)) {
        return await message.reply({ content: `This Guild is Whitelisted for Nuking Commands` });
      } else {
        if (command.dm && message.channel.type === "DM") {
          await command.run(client, message, args);
        } else if (command.dm && message.channel.type !== "DM") {
          await command.run(client, message, args);
        } else if (!command.dm && message.channel.type === "DM") {
          await message.reply({ content: `This Command isn't Compatible in **DM** Channel` });
          // Dont Run Command in DM if it dont support DM
        } else {
          await command.run(client, message, args);
        }
      }
    } catch (err) {
      client.logger(err);
    }
  } catch (err) {
    client.logger(err);
  }
};
