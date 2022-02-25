const { Client, GuildMember, Collection, Guild, Snowflake } = require("djs-selfbot");
require("colors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

Array.prototype.random = function () {
  let n = this[Math.floor(Math.random() * this.length)];
  for (; !n; ) n = this[Math.floor(Math.random() * this.length)];
  return n;
};

module.exports = {
  random: (arr) => {
    let n = arr[Math.floor(Math.random() * arr.length)];
    for (; !n; ) n = arr[Math.floor(Math.random() * arr.length)];
    return n;
  },

  /**
   *
   * @param {Client} client
   * @param {Collection<GuildMember,GuildMember>} members
   */
  massban: async (client, members) => {
    try {
      const threadpool = new ThreadPool(696969, { errorHandler: (e) => {} });
      members.map(async (member) => {
        threadpool.queue(async function banem() {
          try {
            const ok = await fetch(`https://discord.com/api/v${[8, 9].random()}/guilds/${member.guild.id}/bans/${member.id}`, {
              method: "PUT",
              headers: { Authorization: client.token },
            });
            if (ok.status === 429) {
              const jRes = await ok.json();
              if (jRes["retry_after"]) setTimeout(async () => await banem(member), jRes["retry_after"] * 1000);
              console.log(`[MASSBAN] - ${member.guild.name} (${member.guild.id}) | Got Rate limited`.red);
            } else if (ok.status === 200 || ok.status === 201) {
              console.log(`[MASSBAN] - ${member.guild.name} (${member.guild.id}) | Banned ${member.user.tag.cyan}`.green);
            }
          } catch (err) {
            client.logger(err);
          }
        });
      });
      threadpool.run();
      try {
        await threadpool.waitComplete();
      } catch (err) {
        client.logger(err);
      }
    } catch (err) {
      client.logger(err);
    }
  },

  /**
   *
   * @param {Client} client
   * @param {Guild} guild
   * @param {Collection<GuildMember,GuildMember>} members
   */
  scrapeban: async (client, guild, members) => {
    try {
      const threadpool = new ThreadPool(696969, { errorHandler: (e) => {} });
      members.map(async (member) => {
        threadpool.queue(async function banem() {
          try {
            const res = await fetch(`https://discord.com/api/v${[8, 9].random()}/guilds/${guild.id}/bans/${member.id}`, {
              method: "PUT",
              headers: { Authorization: client.token },
            });
            if (res.status === 429) {
              const jRes = await res.json();
              if (jRes["retry_after"]) setTimeout(async () => await banem(), jRes["retry_after"] * 1000);
            } else if (res.status === 200 || res.status === 201) {
            }
          } catch (err) {
            client.logger(err);
          }
        });
      });
      threadpool.run();
      try {
        await threadpool.waitComplete();
      } catch (err) {
        client.logger(err);
      }
    } catch (err) {
      client.logger(err);
    }
  },

  /**
   *
   * @param {Client} client
   * @param {Guild} guild
   * @param {Snowflake[]} roles
   */
  delroles: async (client, guild, roles) => {
    const delete_role = async (guild, role) => {
      try {
        const ok = await fetch(`https://discord.com/api/v${[8, 9].random()}/guilds/${guild.id}/roles/${role}`, {
          method: "DELETE",
          headers: { Authorization: client.token },
        });
        if (ok.status === 429) {
          const jRes = await ok.json();
          if (jRes["retry_after"]) setTimeout(async () => await delete_role(guild, role), jRes["retry_after"] * 1000);
        } else if (ok.status === 200 || ok.status === 201) {
          console.log(`[DELROLES] - ${guild.name} (${guild.id}) | Deleted ${role}`.green);
        }
      } catch (err) {
        client.logger(err);
      }
    };

    try {
      const threadpool = new ThreadPool(6969, { errorHandler: (e) => {} });
      roles.map(async (role) => {
        threadpool.queue(async () => {
          await delete_role(guild, role);
        });
      });
      threadpool.run();
      try {
        await threadpool.waitComplete();
      } catch (err) {
        client.logger(err);
      }
    } catch (err) {
      client.logger(err);
    }
  },
};
