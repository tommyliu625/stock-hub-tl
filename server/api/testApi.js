const router = require('express').Router()
const axios = require('axios').default
const newData = require('./dummyData/dummyData')
const menDataUnfiltered = require('./dummyData/mensData')

var options = {
  method: 'GET',
  url: 'https://target1.p.rapidapi.com/products/list',
  params: {
    storeId: '911',
    endecaId: '5xu2f',
    pageSize: '100',
    pageNumber: '1',
    sortBy: 'relevance',
  },
  headers: {
    'x-rapidapi-key': '992521ed6emsha320dcf85e319d0p1fc948jsn5cedd6c040ca',
    'x-rapidapi-host': 'target1.p.rapidapi.com',
  },
}

router.get('/', async (req, res, next) => {
  try {
    const womenDataUnfiltered = (await axios.request(options)).data.products
    let womenDataFiltered = womenDataUnfiltered.map((product) => {
      return {
        name: product.title,
        price: Number(product.price.formatted_current_price.slice(1)),
        imageUrl: product.images.primaryUri,
        category: 'jewelry',
        description: product.description,
        reviews: product.guestReviews.mostHelpfulReviews,
      }
    })
    let womenData = womenDataFiltered.filter((product) => {
      if (!product.description || !product.price || !product.reviews) {
        return false
      }
      return true
    })
    res.json(womenData)
    // res.send(menDataFiltered)
  } catch (err) {
    next(err)
  }
})

module.exports = router

// let newDataWithoutReviews = newData.map((product) => {
//   return {
//     name: product.title,
//     price: Number(product.price.formatted_current_price.slice(1)),
//     imageUrl: product.images.primaryUri,
//     category: 'mens clothing',
//     description: product.description,
//     reviews: {
//       overallRating: product.guestReviews.overallGuestRating,
//       reviewCount: product.guestReviews.guestReviewCount,
//       reviewSubmissions: product.guestReviews.mostHelpfulReviews,
//     },
//   }
// })
