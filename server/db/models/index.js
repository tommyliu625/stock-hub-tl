const Message = require('./message')
const Author = require('./author')

Author.hasMany(Message)
Message.belongsTo(Author)

module.exports = {
  Message,
  Author,
}
