class User {
  firstName;
  phone;
  chatId;

  constructor(firstName, chatId) {
    this.firstName = firstName;
    this.chatId = chatId;
  }
}

module.exports = User;
