require("colors")

class Logger {
  static line() {
    console.log("-".repeat(36).yellow);
  }

  static success(msg) {
    console.log(`[✔] ${msg}`.green);
  }

  static green(msg) {
    console.log(`[✔] ${msg}`.green);
  }

  static red(msg) {
    console.log(`[⨯] ${msg}`.red);
  }
  static error(msg) {
    console.log(`[⨯] ${msg}`.red);
  }

  static info(msg) {
    console.log(`[!] ${msg}`.blue);
  }
  static blue(msg) {
    console.log(`[!] ${msg}`.blue);
  }
}

module.exports = Logger;
