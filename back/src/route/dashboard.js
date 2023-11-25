const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
const { Transaction } = require('../class/transaction')
const { Notification } = require('../class/notification')
const {
  NOTIFICATION_TYPE,
} = require('../utils/notification-type')

router.get(
  '/transaction/:transactionId',
  function (req, res) {
    const { transactionId } = req.params
    const { email } = req.query

    if (!email || !transactionId) {
      return res.status(400).json({
        message: `Error, required variables are missing!`,
      })
    }

    try {
      const user = User.getByEmail(email)

      if (!user) {
        return res.status(400).json({
          message: `The user with this email does not exist!`,
        })
      }

      const transaction = user.transactions.find(
        (transaction) =>
          transaction.transaction.id ===
          Number(transactionId),
      )

      if (!transaction) {
        return res.status(400).json({
          message: `The transaction with this id does not exist!`,
        })
      }

      let companyName = null

      if (
        transaction.transaction.from &&
        transaction.transaction.from.companyName
      ) {
        companyName =
          transaction.transaction.from.companyName
      }

      let transactionEmail

      if (transaction.type === 'PLUS') {
        transactionEmail =
          transaction.transaction.from.email
      } else {
        transactionEmail = transaction.transaction.to.email
      }

      return res.status(200).json({
        message: 'Data transaction are sent!',
        transaction: {
          amount: transaction.transaction.amount,
          date: transaction.transaction.date,
          type: transaction.type,
          transactionEmail: transactionEmail,
          companyName: companyName,
        },
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        message: err,
      })
    }
  },
)

router.get('/balance', function (req, res) {
  const { email } = req.query

  if (!email) {
    return res.status(400).json({
      message: `Error, required fields are missing!`,
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: `The user with this email does not exist!`,
      })
    }

    return res.status(200).json({
      message: 'Data user are sent!',
      user: {
        balance: user.balance,

        transactions: user.transactions.map(
          (transaction) => {
            let firstname
            let lastname
            let companyName
            if (transaction.type === 'PLUS') {
              companyName =
                transaction.transaction.from.companyName
              firstname =
                transaction.transaction.from.firstname
              lastname =
                transaction.transaction.from.lastname
            } else {
              firstname =
                transaction.transaction.to.firstname
              lastname = transaction.transaction.to.lastname
            }

            return {
              type: transaction.type,
              firstname: firstname,
              lastname: lastname,
              companyName: companyName,
              amount: transaction.transaction.amount,
              date: transaction.transaction.date,
              id: transaction.transaction.id,
            }
          },
        ),
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: err,
    })
  }
})

router.post('/receive', function (req, res) {
  const { amount, companyName, email } = req.body

  if (!amount || !companyName) {
    return res.status(400).json({
      message: `Error, required fields are missing!`,
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: `The user with this email does not exist!`,
      })
    }

    Transaction.create(
      { companyName: companyName },
      user,
      amount,
    )

    const notification = Notification.create(
      NOTIFICATION_TYPE.ANNOUNCEMENT,
      `Received $${amount}`,
    )

    user.addNotification(notification)

    return res.status(200).json({
      message: 'Money are sent!',
      user: {
        balance: user.balance,

        transactions: user.transactions.map(
          (transaction) => {
            let firstname
            let lastname
            let companyName
            if (transaction.type === 'PLUS') {
              companyName =
                transaction.transaction.from.companyName
              firstname =
                transaction.transaction.from.firstname
              lastname =
                transaction.transaction.from.lastname
            } else {
              firstname =
                transaction.transaction.to.firstname
              lastname = transaction.transaction.to.lastname
            }

            return {
              type: transaction.type,
              firstname: firstname,
              lastname: lastname,
              companyName: companyName,
              amount: transaction.transaction.amount,
              date: transaction.transaction.date,
              id: transaction.transaction.id,
            }
          },
        ),
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: err,
    })
  }
})

router.post('/send', function (req, res) {
  const { amount, senderEmail, email } = req.body

  if (!amount || !email || !senderEmail) {
    return res.status(400).json({
      message: `Error, required fields are missing!`,
    })
  }

  try {
    const user = User.getByEmail(email)
    const senderUser = User.getByEmail(senderEmail)

    if (!user || !senderUser) {
      return res.status(400).json({
        message: `The user with this email does not exist!`,
      })
    }

    if (user === senderUser) {
      return res.status(400).json({
        message: `You cannot send money to yourself!`,
      })
    }

    if (senderUser.balance < amount) {
      return res.status(400).json({
        message: `insufficient funds!`,
      })
    }

    const notification = Notification.create(
      NOTIFICATION_TYPE.ANNOUNCEMENT,
      `Received $${amount}`,
    )

    user.addNotification(notification)

    const SenderNotification = Notification.create(
      NOTIFICATION_TYPE.ANNOUNCEMENT,
      `Sent $${amount}`,
    )

    senderUser.addNotification(SenderNotification)

    Transaction.create(senderUser, user, amount)

    return res.status(200).json({
      message: 'Money are sent!',
      user: {
        balance: senderUser.balance,

        transactions: senderUser.transactions.map(
          (transaction) => {
            let firstname
            let lastname
            let companyName
            if (transaction.type === 'PLUS') {
              companyName =
                transaction.transaction.from.companyName
              firstname =
                transaction.transaction.from.firstname
              lastname =
                transaction.transaction.from.lastname
            } else {
              firstname =
                transaction.transaction.to.firstname
              lastname = transaction.transaction.to.lastname
            }

            return {
              type: transaction.type,
              firstname: firstname,
              lastname: lastname,
              companyName: companyName,
              amount: transaction.transaction.amount,
              date: transaction.transaction.date,
              id: transaction.transaction.id,
            }
          },
        ),
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: err,
    })
  }
})

router.post('/settings-change-email', function (req, res) {
  const { email, newemail, password } = req.body

  if (!email || !newemail || !password) {
    return res.status(400).json({
      message: `Error, required fields are missing!`,
    })
  }

  const userWithNewEmail = User.getByEmail(newemail)

  if (userWithNewEmail) {
    return res.status(400).json({
      message: `The user with this email is already registered!`,
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: `The user with this email does not exist!`,
      })
    }

    if (password !== user.password) {
      return res.status(400).json({
        message: `Password does not correct!`,
      })
    }

    user.email = newemail

    const notification = Notification.create(
      NOTIFICATION_TYPE.WARNING,
      'Change email',
    )

    user.addNotification(notification)

    const session = Session.create(user)

    session.user.isConfirm = true

    return res.status(200).json({
      message: 'Email is changed!',
      session,
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: err,
    })
  }
})

router.post(
  '/settings-change-password',
  function (req, res) {
    const { email, oldpassword, newpassword } = req.body

    if (!email || !newpassword || !oldpassword) {
      return res.status(400).json({
        message: `Error, required fields are missing!`,
      })
    }

    if (oldpassword === newpassword) {
      return res.status(400).json({
        message: `Passwords is similary!`,
      })
    }

    try {
      const user = User.getByEmail(email)

      if (!user) {
        return res.status(400).json({
          message: `The user with this email does not exist!`,
        })
      }

      if (oldpassword !== user.password) {
        return res.status(400).json({
          message: `Old password does not correct!`,
        })
      }

      user.password = newpassword

      const notification = Notification.create(
        NOTIFICATION_TYPE.WARNING,
        'Change password',
      )

      user.addNotification(notification)

      const session = Session.create(user)

      session.user.isConfirm = true

      return res.status(200).json({
        message: 'Password is changed!',
        session,
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        message: err,
      })
    }
  },
)

router.get('/notifications', function (req, res) {
  const { email } = req.query

  if (!email) {
    return res.status(400).json({
      message: `Error, required fields are missing!`,
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: `The user with this email does not exist!`,
      })
    }

    return res.status(200).json({
      message: 'Data notifications are sent!',

      notifications: user.notifications.map(
        (notification) => ({
          message: notification.message,
          type: notification.type,
          date: notification.date,
          id: notification.id,
        }),
      ),
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: err,
    })
  }
})

module.exports = router
