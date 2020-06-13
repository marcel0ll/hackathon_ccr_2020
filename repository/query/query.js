const OP = {
  EQUAL_TO: "EQUAL_TO",
  DIFFER_FROM: "DIFFER_FROM",
  GREATER_THAN: "GREATER_THAN",
  GREATER_THAN_EQUAL: "GREATER_THAN_EQUAL",
  LESS_THAN: "LESS_THAN",
  LESS_THAN_EQUAL: "LESS_THAN_EQUAL",
};

class Query {
  constructor() {
    this.conditions = [[]];

    return this;
  }

  _addOp(map, op) {
    Object.getOwnPropertyNames(map).forEach((key) => {
      this._lastCondition.push({ op, key, value: map[key] });
    });

    return this;
  }

  get _lastCondition() {
    return this.conditions[this.conditions.length - 1];
  }

  equalTo(map) {
    return this._addOp(map, OP.EQUAL_TO);
  }

  differFrom(map) {
    return this._addOp(map, OP.DIFFER_FROM);
  }

  greaterThan(map) {
    return this._addOp(map, OP.GREATER_THAN);
  }

  greaterThanEqual(map) {
    return this._addOp(map, OP.GREATER_THAN_EQUAL);
  }

  lessThan(map) {
    return this._addOp(map, OP.LESS_THAN);
  }

  lessThanEqual(map) {
    return this._addOp(map, OP.LESS_THAN_EQUAL);
  }

  get and() {
    return this;
  }

  get or() {
    this.conditions.push([]);

    return this;
  }
}

module.exports = {
  operators: OP,
  Query,
};
