const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const User = require('../models/user')
const helper = require('../utils/for_testing')


describe('GET /api/users', async () => {

  beforeAll(async () => {
    await User.remove({})
    const p1 = (new User(helper.listOfUsers[0])).save()
    const p2 = (new User(helper.listOfUsers[1])).save()
    Promise.all([p1, p2])
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two users', async () => {
    const response = await api
      .get('/api/users')
    expect(response.body.length).toBe(2)
  })

  test('the first user is Test User 1', async () => {
    const response = await api
      .get('/api/users')
    expect(response.body[0].name).toBe(helper.listOfUsers[0].name)
  })
})

describe('POST /api/users', async () => {

  beforeEach(async () => await User.remove({}))

  test('a valid user can be added ', async () => {
    const newUser = {
      	name: "Test User X",
		username: "Test User X",
		password: "Test User X",
		adult: false
    }

    const usersBefore = await helper.usersInDb()
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    const response = await api
      .get('/api/users')

    expect(usersAfter.length).toBe(usersBefore.length + 1)
    expect(response.body[0].username).toBe(newUser.username)
  })

  test('an invalid user cannot be added ', async () => {
    const newUser = {
      	name: "Test User Y",
		//username: "Test User Y",
		password: "Test User Y",
		adult: false
    }

    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
  })

  test('user must have password that is at lest tree characters long', async () => {
    const newUser = {
      	name: "Test User W",
		username: "Test User W",
		password: "Te",
		adult: false
    }

    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
  })

  test('a user without adult field is nevertheless saved as an adult', async () => {
    const newUser = {
      	name: "Test User Z",
		username: "Test User Z",
		password: "Test User Z"
    }

    const usersBefore = await helper.usersInDb()
	console.log("users before length", usersBefore.length)

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    console.log("users after length", usersAfter.length)
    const response = await api
      .get('/api/users')

    expect(usersAfter.length).toBe(usersBefore.length + 1)
    expect(response.body[0].adult).toBe(true)
  })  
})

afterAll(() => {
  server.close()
})