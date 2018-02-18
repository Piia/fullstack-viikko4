const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('users')

    response.json(blogs)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const token = getTokenFrom(request)
    //const decodedToken = jwt.verify(token, process.env.SECRET)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const body = request.body
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    if( (blog.title === undefined) ||
        (blog.author === undefined) ||
        (blog.url === undefined)  ) {
      return response.status(400).json(({error: 'undefined fields'})) 
    }

    if(blog.likes === undefined) {
      blog.likes = 0
    }

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    const savedUser = await user.save()

    response.status(201).json(savedBlog)
  } catch(exception) {
    console.log(exception)
    response.status(500).json({error: 'something went wrong'})
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const token = getTokenFrom(request)
    //const decodedToken = jwt.verify(token, process.env.SECRET)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if ( blog.user.toString() !== decodedToken.id.toString() ) {
      return response.status(401).json({ error: 'unauthorized deletion' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
  }
  try {
    const updated = await Blog.findByIdAndUpdate(request.params.id, 
      blog, { new: true } )
    response.json(updated)
  } catch(exception) {
      console.log(exception)
      response.status(400).send({ error: 'malformatted id' })
    }
})

blogsRouter.patch('/:id/like', async (request, response) => {
  try {
    let blog = await Blog.findById(request.params.id)
    blog.likes++
    const saved = await blog.save()
    response.json(saved)
  } catch(exception) {
    console.log(exception)
      response.status(400).send({ error: 'malformatted id' })
  }
})

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

module.exports = blogsRouter