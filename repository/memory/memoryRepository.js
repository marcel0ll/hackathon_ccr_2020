const Repository = require("../repository");

class MemoryRepository extends Repository {
  constructor(recordClass, recordName, options) {
    super(recordClass, recordName, options);
    this.data = [];
  }

  async find(queryObject = {}) {
    let found = this.data.filter((asset) => {
      for (let key in queryObject) {
        if (queryObject.hasOwnProperty(key)) {
          let dotPattern = key.split(".");
          let attribute = dotPattern.reduce((acc, key) => acc[key], asset);
          if (attribute !== queryObject[key]) {
            return false;
          }
        }
      }
      return true;
    });

    found.forEach((asset) => {
      this.addHelpers(asset);
    });

    return found;
  }

  async findOne(queryObject = {}) {
    let found = await this.find(queryObject);
    return found[0];
  }

  async list() {
    return this.find();
  }

  async insert(asset) {
    this.setCreatedAt(asset);
    if (await this.has(asset)) {
      return false;
    }

    this.removeHelpers(asset);
    this.data.push(asset);
    this.addHelpers(asset);
    return asset;
  }

  async update(queryObject = {}, data) {
    this.data.forEach((asset) => {
      for (let key in queryObject) {
        if (queryObject.hasOwnProperty(key)) {
          if (asset[key] !== queryObject[key]) {
            return;
          }
        }
      }

      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          asset[key] = data[key];
        }
      }

      this.setUpdatedAt(asset);
    });

    return true;
  }

  async updateOne(asset) {
    return this.update(asset, asset);
  }

  async delete(queryObject = {}) {
    this.data = this.data.filter((asset) => {
      for (let key in queryObject) {
        if (queryObject.hasOwnProperty(key)) {
          if (asset[key] !== queryObject[key]) {
            return true;
          }
        }
      }
      return false;
    });

    return true;
  }

  async has(queryObject = {}) {
    return (await this.find(queryObject)).length > 0;
  }
}

module.exports = MemoryRepository;
