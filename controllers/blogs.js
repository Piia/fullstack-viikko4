const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  if( (blog.title === undefined) ||
      (blog.author === undefined) ||
      (blog.url === undefined)  ) {
    response.status(400).json()
    return
  } else if(blog.likes === undefined) {
    blog.likes = 0
  }

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.put('/api/blogs/:id', async (request, response) => {
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

blogsRouter.patch('/api/blogs/:id/like', async (request, response) => {
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

module.exports = blogsRouter