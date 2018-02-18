const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/for_testing')


describe('GET /api/blogs', async () => {

  beforeAll(async () => {
    await Blog.remove({})
    const promise1 = (new Blog(helper.listOfBlogs[0])).save()
    const promise2 = (new Blog(helper.listOfBlogs[1])).save()
    await Promise.all([promise1, promise2])
  })

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
    expect(response.body[0].author).toBe(helper.listOfBlogs[0].author)
  })
})

describe('POST /api/blogs', async () => {

  beforeEach(async () => {
    await Blog.remove({})
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: "testiblogi",
      author: "testaaja",
      url: "http://testi",
      likes: 0
    }

    const blogsBefore = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    const response = await api
      .get('/api/blogs')

    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
    expect(response.body[0].title).toBe(newBlog.title)
  })

  test('an invalid blog cannot be added ', async () => {
    const newBlog = {
      title: "testiblogi",
      author: "testaaja",
      //url: "http://testi",
      likes: 0
    }

    const blogsBefore = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length)
  })

  test('a blog without likes is saved and likes are set to zero', async () => {
    const newBlog = {
      title: "testiblogi",
      author: "testaaja",
      url: "http://testi"
      //likes: 0
    }

    const blogsBefore = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    const response = await api
      .get('/api/blogs')

    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
    expect(response.body[0].likes).toBe(0)
  })  
})

afterAll(() => {
  server.close()
})
