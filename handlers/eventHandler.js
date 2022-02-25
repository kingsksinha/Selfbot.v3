const { Client } = require("djs-selfbot");
const fs = require("fs");
const { line, info, success } = require("../Utility/logger");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  line();
  info("Handling Events..")
  const eventsDir = fs.readdirSync("./events");
  for (const eventFile of eventsDir) {
    const event = require(`../events/${eventFile}`),
      eventName = eventFile.split(".")[0].trim();
    
    client.on(eventName, event.bind(null, client));
    success(`Loaded [`+ eventName.cyan +`] Event`.green)
  }
  line();
};
