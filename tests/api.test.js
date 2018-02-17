const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const listHelper = require('../utils/for_testing')

const initialBlogs = listHelper.listOfBlogs

beforeAll(async () => {
  await Blog.remove({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('when GET-request', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(2)
  })

  test('the first blog is by Michael Chan', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0].author).toBe(initialBlogs[0].author)
  })

})

describe('when POST-request', () => {

  test('a valid blog can be added ', async () => {
    const newBlog = {
    title: "testiblogi",
    author: "testaaja",
    url: "http://testi",
    likes: 0
  }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(3)
    expect(response.body[2].title).toBe("testiblogi")
  })

  test('an invalid blog cannot be added ', async () => {
    const newBlog = {
    title: "testiblogi",
    author: "testaaja",
    //url: "http://testi",
    likes: 0
  }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

  })

  test('a blog without likes is saved and likes are set to zero', async () => {
    const newBlog = {
    title: "testiblogi",
    author: "testaaja",
    url: "http://testi"
    //likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(4)
    expect(response.body[2].likes).toBe(0)

  })  

})

afterAll(() => {
  server.close()
})