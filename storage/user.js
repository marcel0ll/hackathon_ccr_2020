class User {
  firstName;
  phone;
  chatId;

  constructor(firstName, chatId) {
    this.firstName = firstName;
    this.chatId = chatId;
  }

  get id() {
    return { chatId: this.chatId };
  }
}

module.exports = User;
