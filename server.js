const DataStore = require('./library.js')
const express = require('express')
const path = require('path')
const app = express()
const staticDir = path.resolve('./client/public')
const port = process.env.PORT || 5000

const movieDB = new DataStore('mongodb://localhost:27017', 'blockbuster', 'movies')

app.use(express.static(staticDir))

//api endpoint routes
app.get('/moviestore', async (req, res) => {
  let allMovies = await movieDB.getAll()

  res.json(allMovies)
})

app.listen(port, () => {
  console.log("listening on port", port)
})
