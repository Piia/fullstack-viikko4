const listHelper = require('../utils/for_testing')

describe('total likes', () => {

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple blogs equals the likes of those', () => {
    const result = listHelper.totalLikes(listHelper.listOfBlogs)
    expect(result).toBe(36)
  })
})

describe('most likes', () => {

  test('when list one blog equals that', () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog)
    expect(result).toEqual(listHelper.listWithOneBlog[0])
  })

  test('when list has multiple blogs equals the most liked', () => {
    const result = listHelper.mostLikes(listHelper.listOfBlogs)
    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    })
  })

  test('when list has multiple blogs equals the most liked authors likes', () => {
    const result = listHelper.mostLikedAuthor(listHelper.listOfBlogs)
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })

  test('when list has multiple blogs equals the most blogging author', () => {
    const result = listHelper.authorOfMostBlogs(listHelper.listOfBlogs)
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3
    })
  })

})