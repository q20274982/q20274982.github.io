export const checkout = (actionField = {}, products = null) => {
  return {
    event: 'checkout',
    ecommerce: {
      checkout: {
        actionField,
        products
        // products: [{
        //   name: '',
        //   id: '',
        //   price: '15',
        //   brand: '',
        //   category: '',
        //   variant: 'gray',
        //   quantity: 0,
        // }]
      }
    }
  }
}

export const browseProductList = (impressions = []) => {
  return {
    'ecommerce': {
      currencyCode: 'TWD',
      impressions
      // impressions: [
      // {
      //   name: 'Donut Friday Scented T-Shirt',
      //   id: '67890',
      //   price: '33.75',
      //   brand: 'Google',
      //   category: 'Apparel',
      //   variant: 'Black',
      //   list: 'Search Results',
      //   position: 2
      // }]
    }
  }
}

export const browseProductDetail = (products = []) => {
  return {
    event: 'viewProductDetail',
    ecommerce: {
      detail: {
        // 'actionField': {'list': 'Apparel Gallery'},    // 'detail' actions have an optional list property.
        products
        // 'products': [{
        //   'name': 'Triblend Android T-Shirt',         // Name or ID is required.
        //   'id': '12345',
        //   'price': '15.25',
        //   'brand': 'Google',
        //   'category': 'Apparel',
        //   'variant': 'Gray'
        // }]
      }
    }
  }
}

export const productClickEvent = (productObj = {}) => {
  return {
    'event': 'productClick',
    'ecommerce': {
      'click': {
        'actionField': {'list': 'Search Results'},      // Optional list property.
        'products': [{
          'name': productObj.name,                      // Name or ID is required.
          'id': productObj.id,
          'price': productObj.price
        }]
      }
    }
  }
}

export const addToCartEvent = (products = []) => {
  return {
    event: 'addToCart',
    ecommerce: {
      currencyCode: 'TWD',
      add: {                                // 'add' actionFieldObject measures.
        products
        // products: [{                        //  adding a product to a shopping cart.
        //   name: 'Triblend Android T-Shirt',
        //   id: '12345',
        //   price: '15.25',
        //   brand: 'Google',
        //   category: 'Apparel',
        //   variant: 'Gray',
        //   quantity: 1
        // }]
      }
    }
  }
}
export const removeFromCartEvent = (products = []) => {
  return {
    event: 'removeFromCart',
    ecommerce: {
      remove: {                               // 'remove' actionFieldObject measures.
        products
        // products: [{                          //  removing a product to a shopping cart.
        //     name: 'Triblend Android T-Shirt',
        //     id: '12345',
        //     price: '15.25',
        //     brand: 'Google',
        //     category: 'Apparel',
        //     variant: 'Gray',
        //     quantity: 1
        // }]
      }
    }
  }
}
export const purchase = (actionField, products) => {
  return {
    event: 'purchase',
    ecommerce: {
      purchase: {
        actionField,
        products
        // actionField: {
        //   id: 'T12345',                         // Transaction ID. Required for purchases and refunds.
        //   affiliation: 'Online Store',
        //   revenue: '35.43',                     // Total transaction value (incl. tax and shipping)
        //   tax:'4.90',
        //   shipping: '5.99',
        //   coupon: 'SUMMER_SALE'
        // },
        // products: [{                            // List of productFieldObjects.
        //   name: 'Triblend Android T-Shirt',     // Name or ID is required.
        //   id: '12345',
        //   price: '15.25',
        //   brand: 'Google',
        //   category: 'Apparel',
        //   variant: 'Gray',
        //   quantity: 1,
        //   coupon: ''                            // Optional fields may be omitted or set to empty string.
        // },
        // {
        //   name: 'Donut Friday Scented T-Shirt',
        //   id: '67890',
        //   price: '33.75',
        //   brand: 'Google',
        //   category: 'Apparel',
        //   variant: 'Black',
        //   quantity: 1
        // }]
      }
    }
  }
}
