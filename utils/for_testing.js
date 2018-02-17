const Blog = require('../models/blog')

const totalLikes = (blogs) => {
	return arrayOfLikes(blogs).reduce((a, b) => a + b)
}

const arrayOfLikes = (blogs) => {
	return blogs.map(blog => blog.likes)
}

const mostLikes = (blogs) => {
	const likes = arrayOfLikes(blogs)
	const indexOfGreatest = likes.indexOf(Math.max(...likes))
	return blogs[indexOfGreatest]
}

const authorOfMostBlogs = (blogs) => {
	const blogCount = []
	const authors = []

	blogs.forEach(blog => {
		let i = authors.indexOf(blog.author)
		if(i == -1) {
			blogCount.push(1)
			authors.push(blog.author)
		}  else {
			blogCount[i]++
		}
	})

	const authorIndex = blogCount.indexOf(Math.max(...blogCount))
	return 	{ 	author: authors[authorIndex], 
				blogs: blogCount[authorIndex]}
}

const mostLikedAuthor = (blogs) => {
	const likeCount = []
	const authors = []

	blogs.forEach(blog => {
		let i = authors.indexOf(blog.author)
		if(i == -1) {
			likeCount.push(blog.likes)
			authors.push(blog.author)
		}  else {
			likeCount[i] += blog.likes
		}
	})

	const authorIndex = likeCount.indexOf(Math.max(...likeCount))
	return 	{ 	author: authors[authorIndex], 
				likes: likeCount[authorIndex]}
}

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

const listOfBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs
}

module.exports = {
  totalLikes,
  listOfBlogs,
  mostLikes,
  listWithOneBlog,
  authorOfMostBlogs,
  mostLikedAuthor,
  blogsInDb
}
