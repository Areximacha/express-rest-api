var mongoose = require('mongoose')
var Schema = mongoose.Schema

var HeroSchema = new Schema({
  name: String
})

module.exports = mongoose.model('Hero', HeroSchema)