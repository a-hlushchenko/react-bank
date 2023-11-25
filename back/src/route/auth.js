const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')
const {
  NOTIFICATION_TYPE,
} = require('../utils/notification-type')

User.create({
  firstname: 'Anton',
  lastname: 'Hlushchenko',
  email: 'glantoshka@gmail.com',
  password: 'Qwerty123',
})

User.create({
  firstname: 'Danya',
  lastname: 'Hlushchenko',
  email: 'test@gmail.com',
  password: 'Qwerty123',
})

router.post('/signup', function (req, res) {
  const { firstname, lastname, email, password } = req.body

  const firstnameNew = firstname.trim()
  const lastnameNew = lastname.trim()

  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      message: `Error. There are no required fields.`,
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: `The user with this email is already registered!`,
      })
    }

    const newUser = User.create({
      firstnameNew,
      lastnameNew,
      email,
      password,
    })
    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'The user has been successfully registered',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: `Error creating user.`,
    })
  }
})

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: `Error, required fields are missing!`,
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: `Error, you are not logged in!`,
      })
    }

    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: `The code is not valid!`,
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: `The code is not valid!`,
      })
    }

    session.user.isConfirm = true

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: `The user with this email does not exist!`,
      })
    }

    user.isConfirm = true

    return res.status(200).json({
      message: 'User is verified!',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/signin', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: `Error. There are no required fields!`,
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: `The user with this email does not exist!`,
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: `The password is incorrect!`,
      })
    }

    if (!user.isConfirm) {
      Confirm.create(email)
    }

    const session = Session.create(user)

    const notification = Notification.create(
      NOTIFICATION_TYPE.WARNING,
      'New login',
    )

    user.addNotification(notification)

    return res.status(200).json({
      message: 'Login successful!',
      session,
    })
  } catch (e) {
    console.log(e)

    return res.status(400).json({
      message: `Login error!`,
    })
  }
})

router.post('/recovery', function (req, res) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message: `Error, please enter your email address!`,
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: `The user with this email does not exist!`,
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Code sent!',
    })
  } catch (err) {
    return res.status(400).json({
      message: `Error, try again!`,
    })
  }
})

router.post('/recovery-confirm', function (req, res) {
  const { code, password } = req.body

  if (!code || !password) {
    return res.status(400).json({
      message: `Error, required fields are missing!`,
    })
  }

  try {
    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: `The code is not valid!`,
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: `The user with this email does not exist!`,
      })
    }

    user.password = password

    const notification = Notification.create(
      NOTIFICATION_TYPE.WARNING,
      'Recovery password',
    )

    user.addNotification(notification)

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Password changed!',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: `Error!`,
    })
  }
})

router.post('/resend-code', function (req, res) {
  const { email } = req.query

  if (!email) {
    return res.status(400).json({
      message: `Error, required fields are missing!`,
    })
  }

  try {
    Confirm.create(email)

    return res.status(200).json({
      message: 'Code is sent!',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

module.exports = router
