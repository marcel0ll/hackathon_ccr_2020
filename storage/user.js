class User {
  firstName;
  phoneNumber;
  chatId;
  state = "init";
  lastPlaceVisitedId;
  options;

  constructor(firstName, chatId) {
    this.firstName = firstName;
    this.chatId = chatId;
  }

  get id() {
    return { chatId: this.chatId };
  }
}

module.exports = User;
