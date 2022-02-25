const { default: fs, existsSync: doPathExists, mkdirSync, writeFileSync, readFileSync, watchFile } = require("fs");
const { base64decode, base64encode } = require("./Base64");

const path = require("path");
const EventEmitter = require("events");

/**
 *
 * @param {String} json_string
 */
const isValidJSON = (json_string) => {
  try {
    return JSON.parse(json_string);
  } catch {
    return false;
  }
};

class MyDBError extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
    this.message = message;
  }
}

class MyDB extends EventEmitter {
  #data = {};
  #filepath = "";
  /**
   *
   * @param {String} filepath - Custom Path for Database File
   * @example
   * const db = new MyDB("../data/my_database_file");
   */
  constructor(filepath = "./db") {
    super();
    // Check if Database Path exists?
    // if no then create one and load the file in db
    const filename = path.basename(filepath);
    this.#filepath = filepath.split(filename)[0] + filename;
    if (doPathExists(filepath)) {
      // will load
      const base64data = readFileSync(filepath, "utf-8");
      const data = base64decode(base64data);

      if (!isValidJSON(data)) {
        throw new MyDBError(`Database File Currupted!`);
      } else {
        this.#loadData(isValidJSON(data));
        watchFile(this.#filepath, (_old, _new) => {
          if (_new.nlink && !_old.nlink) {
            console.info("Database File got Deleted!\nRecovering File..! Stop the Application to Prevent Recoveration!");
            writeFileSync(filepath.split(filename)[0] + filename, base64encode(JSON.stringify(this.#data)));
          } else {
          }
        });
      }
    } else {
      try {
        mkdirSync(filepath.split(filename)[0], { recursive: true });
        writeFileSync(filepath.split(filename)[0] + "/" + filename, "ewogICJkb2N1bWVudHMiOiB7fQp9");
        console.log(filepath.split(filename)[0] + filename);

        this.emit("INIT");
      } catch (err) {
        console.error(err);
      }
    }
  }

  #loadData = (data) => {
    this.#data = data;

    this.emit("LOADED");
  };

  /**
   *
   * @param {"nickdata"|"status"} key
   * @param {any} value
   * @returns
   */
  set = (key, value) => {
    this.#data.documents[key] = value;
    writeFileSync(this.#filepath, base64encode(JSON.stringify(this.#data)));
    return this.#data.documents[key];
  };

  /**
   *
   * @param {String} key
   * @param {any} default_value
   * @returns {?any|undefined}
   */
  get = (key, default_value) => {
    if (!this.#data.documents[key]) {
      return default_value || undefined;
    } else {
      return this.#data.documents[key];
      // writeFileSync(this.#filepath, base64encode(JSON.stringify(this.#data)));
    }
  };

  /**
   *
   * @param {String} key
   * @returns {?any|undefined}
   */
  delete = (key) => {
    if (this.#data.documents[key]) {
      delete this.#data.documents[key];
      writeFileSync(this.#filepath, base64encode(JSON.stringify(this.#data)));
      return true;
    } else {
      return false;
    }
  };
}

module.exports = MyDB;
