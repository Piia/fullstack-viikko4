const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blogs')

    response.json(users)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if( (body.name === undefined) || 
        (body.username === undefined) || 
        (body.password === undefined)) {
      return response.status(400).json({ error: 'malformatted fields' })
    }

    const existing = await User.find({username: body.username})
    if (existing.length > 0) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    if(body.password.length < 3) {
      return response.status(400).json({ error: 'password must be at least tree characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      adult: body.adult || true
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter