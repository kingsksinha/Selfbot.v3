// const { info } = require("console");
const { Client } = require("djs-selfbot");
const fs = require("fs");
const { line, info, error, success } = require("../Utility/logger");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  line();
  info("Handling Commands..");
  const commandsDir = fs.readdirSync("./commands");
  for (const commandFile of commandsDir) {
    const command = fs.readdirSync(`./commands/${commandFile}`).filter((client) => client.endsWith(".js"));
    for (const r of command) {
      const command = require(`../commands/${commandFile}/${r}`);
      if (!command.name) {
        error(`Failed to load [` + r.cyan + `] Command.. Missing Name!`.red);
      } else if (!command.run) {
        error(`Failed to load [` + command.name.cyan + `] Command.. Missing Run Function!`.red);
      } else {
        client.commands.set(command.name, command);
        command.directory = commandFile;
        success(`Loaded [` + command.name.cyan + `] Command`.green);
      }
    }
  }
  line();
};
