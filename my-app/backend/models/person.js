const mongoose = require('mongoose')

// Disable strictQuery to prepare for Mongoose 7/8 changes
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

// console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
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
    required: true,
    validate: {
      validator: function(v) {
        // Validates that the number is in the format XX-XXXXXXX or XXX-XXXXXXX
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number! Phone number must be at least 8 digits long and in the format XX-XXXXXXX or XXX-XXXXXXX.`
    }
  }
})

// Transform the output to remove MongoDB-specific fields
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)