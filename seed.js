const db = require('./server/db')
const Author = require('./server/db/models/author')
const Message = require('./server/db/models/message')

const authors = [
  {
    name: 'Cody',
    image: '/images/cody.jpg',
  },
  {
    name: 'Ben',
    image: '/images/ben.jpg',
  },
  {
    name: 'Star',
    image: '/images/star.jpg',
  },
  {
    name: 'Batman',
    image: '/images/batman.jpg',
  },
  {
    name: 'Elliott',
    image: '/images/elliott.jpg',
  },
  {
    name: 'Fira',
    image: '/images/fira.jpg',
  },
  {
    name: 'Henry',
    image: '/images/henry.jpg',
  },
  {
    name: 'Marcy',
    image: '/images/marcy.jpg',
  },
  {
    name: 'Milton',
    image: '/images/milton.jpg',
  },
  {
    name: 'Murphy',
    image: '/images/murphy.jpg',
  },
  {
    name: 'Raffi',
    image: '/images/raffi.jpg',
  },
  {
    name: 'Tulsi',
    image: '/images/tulsi.jpg',
  },
  {
    name: 'Pork Chop',
    image: '/images/pork_chop.jpg',
  },
  {
    name: 'Ribs',
    image: '/images/ribs.jpg',
  },
  {
    name: 'Stacey',
    image: '/images/stacey.jpg',
  },
  {
    name: 'JD',
    image: '/images/jd.jpg',
  },
  {
    name: 'BenBen',
    image: '/images/benben.png',
  },
  {
    name: 'Odie',
    image: '/images/odie.jpg',
  },
]

const id = () => Math.round(Math.random() * (authors.length - 1)) + 1

const messages = [
  // {authorId: id(), content: 'I like React!'},
  {authorId: id(), content: 'I like Redux!'},
  {authorId: id(), content: 'I like React-Redux!'},
  // {authorId: id(), content: 'I like writing web apps!'},
  // {authorId: id(), content: 'You should learn JavaScript!'},
  // {authorId: id(), content: 'JavaScript is pretty great!'},
  // {authorId: id(), content: 'Dogs are great!'},
  // {authorId: id(), content: 'Cats are also great!'},
  // {authorId: id(), content: 'Why must we fight so?'},
  // {authorId: id(), content: 'I want to get tacos!'},
  // {authorId: id(), content: 'I want to get salad!'},
  // {authorId: id(), content: 'I want a taco salad!'},
  // {authorId: id(), content: 'My name is Tommy'},
]

const seed = async () => {
  console.log('Syncing db...')
  await db.sync({force: true})
  console.log('Seeding database...')
  await Promise.all(
    authors.map((author) => {
      return Author.create(author)
    })
  )
  await Promise.all(
    messages.map((message) => {
      return Message.create(message)
    })
  )
}

const main = async () => {
  try {
    await seed()
    console.log('Seeding successful')
    await db.close()
  } catch (err) {
    console.log('Error while seeding')
    console.log(err.stack)
  }
}

main()
