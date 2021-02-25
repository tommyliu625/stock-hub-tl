const GET_STOCK = 'GET_STOCK'

export const getStock = (stock) => {
  return {
    type: GET_STOCK,
    stock,
  }
}

export default (state = [], action) => {
  switch (action.type) {
    case GET_STOCK:
      return action.stock
    default:
      return state
  }
}
