//const http = require('http')
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

//const password = process.argv[2]

// const databaseName = 'noteApp'

// const url = `mongodb+srv://fullstack:${password}@cluster0.jitffgi.mongodb.net/${databaseName}?retryWrites=true&w=majority`

// mongoose.set('strictQuery', false)
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Note = mongoose.model('Note', noteSchema)

// let notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     important: true,
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only JavaScript',
//     important: false,
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     important: true,
//   },
// ]

app.get('/', (request, response) => {
  response.send('<h1>Hello Tiger!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })

  // const id = Number(request.params.id)
  // console.log(id)
  // const note = notes.find((note) => {
  //   console.log(note.id, typeof note.id, id, typeof id, note.id === id)
  //   return note.id === id
  // })
  // if (note) {
  //   response.json(note)
  // } else {
  //   response.status(404).end()
  // }
})



app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndRemove(request.params.id).then((note) => {
    console.log('deleted', note)
    response.status(204).end()
  })
  // const id = Number(request.params.id)
  // notes = notes.filter((note) => note.id !== id)
  // response.status(204).end()
})

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0
//   return maxId + 1
// }

app.post('/api/notes', (request, response) => {
  //const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0

  const body = request.body
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = Note({
    content: body.content,
    important: body.important || false,
    //id: generateId(),
  })
  note.save().then((savedNote) => {
    response.json(savedNote)
  })
  //notes = [...notes, note]
  //console.log(request.headers)
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body
  const note = {
    content: body.content,
    important: body.important,
  }
  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote)
    })
    .catch((error) => {
      next(error)
    })

  // const id = Number(request.params.id)
  // const newObj = request.body
  // notes = notes.map((note) => {
  //   return note.id === id ? newObj : note
  // })
  // //console.log(newObj)
  // response.json(newObj)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
