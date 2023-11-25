const {
  TRANSACTION_TYPE,
} = require('../utils/transaction-type')

class User {
  static #list = []

  static #count = 1

  constructor({ firstname, lastname, email, password }) {
    this.id = User.#count++
    this.email = String(email).toLowerCase()
    this.password = password
    this.isConfirm = false
    this.transactions = []
    this.notifications = []
    this.balance = 0
    this.firstname = firstname
    this.lastname = lastname
  }

  static create(data) {
    const user = new User(data)

    this.#list.push(user)

    return user
  }

  static getByEmail(email) {
    return (
      this.#list.find(
        (user) =>
          user.email === String(email).toLowerCase(),
      ) || null
    )
  }

  static getById(id) {
    return (
      this.#list.find((user) => user.id === Number(id)) ||
      null
    )
  }

  static getList = () => this.#list

  addNotification = (notification) => {
    this.notifications.push(notification)
  }

  addTransaction = (type, transaction) => {
    if (type === TRANSACTION_TYPE.PLUS && transaction) {
      this.transactions.push({
        type: TRANSACTION_TYPE.PLUS,
        transaction: transaction,
      })

      this.balance += Number(transaction.amount)

      return
    } else if (
      type === TRANSACTION_TYPE.MINUS &&
      transaction
    ) {
      this.transactions.push({
        type: TRANSACTION_TYPE.MINUS,
        transaction,
      })

      this.balance -= transaction.amount
    }
  }
}

module.exports = {
  User,
}
