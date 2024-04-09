const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())

let persons = [


  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).json({
      error: 'id no existe'
    })
  }
})

app.get('/api/info', (request, response) => {
  response.send(`
<div>
  <p>tienes ${persons.length} contactos</p>
</div>
<div>
  <p> ${new Date().toString()} <p>
</div>
`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.use(express.json())

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const genId = () => {
  const id = Math.random()
  const unico = persons.find(person => person.id === id)
  if (unico) {
    genId()
  } else {
    return id
  }

}
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'el nombre es necesario'
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: "nombre ya existente"
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: "el numero es necesario"
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: genId(),
  }

  persons = persons.concat(person)
  response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
