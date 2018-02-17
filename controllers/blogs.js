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

module.exports = blogsRouter