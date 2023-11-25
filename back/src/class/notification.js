const {
  NOTIFICATION_TYPE,
} = require('../utils/notification-type')

class Notification {
  static #list = []

  constructor(type, message) {
    this.type = type
    this.message = message
    this.date = new Date().getTime()
    this.id = Notification.generateId()
  }

  static generateId = () => {
    const id = Math.floor(10000 + Math.random() * 90000)

    for (const el of this.#list) {
      if (id === el.id) {
        return Transaction.generateId()
      }
    }

    return id
  }

  static create = (type, message) => {
    if (type && message) {
      const notification = new Notification(type, message)
      this.#list.push(notification)

      return notification
    }
  }
}

module.exports = {
  Notification,
}
