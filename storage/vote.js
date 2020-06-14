class Vote {
  placeId;
  userId;
  createdAt = Date.now();

  constructor(user, place) {
    if (place) this.placeId = place.id;
    if (user) this.userId = user.id;
  }

  get id() {
    return {
      ...this.placeId,
      ...this.userId,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Vote;
