const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('añade el pass como argumento')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://ashurcesare:${password}@cluster0.yygrneq.mongodb.net/agendaBack?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

personSchema.set('toJSON', {
  transform: (document, returnedOnbject) => {
    returnedOnbject.id = returnedOnbject._id.toString()
    delete returnedOnbject._id
    delete returnedOnbject._v
  }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(n => {
      console.log(n)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length !== 5) {
  console.log('el numero de argumentos es incorrecto, deben ser 5')
  mongoose.connection.close()
} else {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log('persona guardada', result)
    mongoose.connection.close()
  })
}
