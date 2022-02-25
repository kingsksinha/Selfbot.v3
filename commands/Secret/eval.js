const { Message, Client, MessageEmbed, default: Discord } = require("djs-selfbot");

module.exports = {
  name: "eval",
  description: "Evaluates Javascript Code",
  dm: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const embed = new MessageEmbed().setColor(client.color).setFooter({ text: `Made by ${client.owner.tag}`, iconURL: client.owner.displayAvatarURL({ dynamic: true }) });
      const content = message.content.split(" ").slice(1).join(" ");
      const result = new Promise((resolve) => resolve(eval(content)));
      return result
        .then(async (output) => {
          if (typeof output !== "string") {
            output = require("util").inspect(output, { depth: 0 });
          }
          if (output.includes(client.token)) {
            output = output.replace(client.token, "");
          }
          embed.setTitle(`COMPILED CODE RESULT`).setDescription(`\`\`\`js\n${output}\n\`\`\``);
          await message.reply({ content: `${embed.title}\n${embed.description}` });
        })
        .catch(async (err) => {
          err = err.toString();
          if (err.includes(client.token)) {
            err = err.replace(client.token, "");
          }
          embed.setTitle(`ERROR WHILE COMPILING`).setDescription(`\`\`\`js\n${err}\n\`\`\``);
          await message.reply({ content: `${embed.title}\n${embed.description}` });
        });
    } catch (err) {
      client.logger(err);
    }
  },
};
