const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('conecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('conected to mongoDB')
  })
  .catch(error => {
    console.log('error connecting to mongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{5,15}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
    required: [true, "User phone number required"],
  },

})

personSchema.set('toJSON', {
  transform: (document, returnedOnbject) => {
    returnedOnbject.id = returnedOnbject._id.toString()
    delete returnedOnbject._id
    delete returnedOnbject._v
  }
})

module.exports = mongoose.model('Person', personSchema)
