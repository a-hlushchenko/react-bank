const {
  TRANSACTION_TYPE,
} = require('../utils/transaction-type')

class Transaction {
  static #list = []

  constructor(from, to, amount) {
    this.from = from
    this.to = to
    this.amount = amount
    this.date = Transaction.getDate()
    this.id = Transaction.generateId()
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

  static getDate = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const currentDate = new Date()
    const day = currentDate.getDate()
    const monthIndex = currentDate.getMonth()
    const month = months[monthIndex]
    const hours = currentDate.getHours()
    const minutes = currentDate.getMinutes()
    const formattedMinutes =
      (minutes < 10 ? '0' : '') + minutes

    const formattedDate = `${day} ${month}, ${hours}:${formattedMinutes}`
    return formattedDate
  }

  static create = (from, to, amount) => {
    if (from && to.email) {
      if (from.email && from.balance >= amount) {
        const transaction = new Transaction(
          from,
          to,
          amount,
        )

        from.addTransaction(
          TRANSACTION_TYPE.MINUS,
          transaction,
        )

        to.addTransaction(
          TRANSACTION_TYPE.PLUS,
          transaction,
        )

        this.#list.push(transaction)
      } else if (from.companyName) {
        const transaction = new Transaction(
          from,
          to,
          amount,
        )

        to.addTransaction(
          TRANSACTION_TYPE.PLUS,
          transaction,
        )

        this.#list.push(transaction)
      }
    }
  }
}

module.exports = {
  Transaction,
}
