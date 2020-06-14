class Repository {
  static repositories = new Map();

  constructor(recordClass, recordName, options) {
    this.options = options;
    this.recordClass = recordClass;
    this.recordName = recordName;

    Repository.repositories.set(recordName, this);
  }

  new(...parameters) {
    let instance = new this.recordClass(...parameters);

    instance = this.addHelpers(instance);

    return instance;
  }

  from(record) {
    let instance = this.new();

    for (let key in instance) {
      if (record.hasOwnProperty(key)) {
        instance[key] = record[key];
      }
    }

    console.log(instance);

    return instance;
  }

  async find(queryObject) {}

  async findOne(queryObject) {}

  async list() {}

  async insert(asset) {}

  async update(queryObject, data) {}

  async updateOne(asset) {}

  async delete(queryObject) {}

  async has(queryObject) {}

  setCreatedAt(asset) {
    asset.createdAt = Date.now();
    asset.updatedAt = Date.now();
  }

  setUpdatedAt(asset) {
    asset.updatedAt = Date.now();
  }

  addHelpers(asset) {
    asset.save = this.insert.bind(this, asset);
    asset.update = this.updateOne.bind(this, asset);
    asset.delete = this.delete.bind(this, asset);
    asset.recordName = this.recordName;

    return asset;
  }

  removeHelpers(asset) {
    if (asset.save) delete asset.save;
    if (asset.update) delete asset.update;
    if (asset.delete) delete asset.delete;
    if (asset.recordName) delete asset.recordName;
    if (asset._id) delete asset._id;

    return asset;
  }
}

module.exports = Repository;
