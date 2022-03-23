// 從 gtm.js 引入資源
import {
  addToCartEvent,
  checkout,
  browseProductList,
  removeFromCartEvent,
  purchase,
  browseProductDetail
} from './gtm.js'

// IIFE + 主程式碼區塊
(function() {
  // 商品清單
  const shoppingList = [
    {
      id: 0,
      name: '餐椅,紅色',
      price: 38,
      imgUrl: 'img/sampleshop/chair.jpg'
    },
    {
      id: 1,
      name: '吊燈罩,黑色',
      price: 1420,
      imgUrl: 'img/sampleshop/chandelier.jpg'
    },
    {
      id: 2,
      name: '電競椅,米色',
      price: 75,
      imgUrl: 'img/sampleshop/gamechair.jpg'
    },
    {
      id: 3,
      name: '邊桌,原木色',
      price: 1087,
      imgUrl: 'img/sampleshop/Sidetable.jpg'
    },
    {
      id: 4,
      name: '方枕,圓形 彩色',
      price: 76.4,
      imgUrl: 'img/sampleshop/squarepillow.jpg'
    },
    {
      id: 5,
      name: '桌燈,米色/黑色',
      price: 27,
      imgUrl: 'img/sampleshop/tablelamp.jpg'
    },
    {
      id: 6,
      name: '水瓶,不鏽鋼/黃色',
      price: 329,
      imgUrl: 'img/sampleshop/Waterbottle.jpg'
    },
  ]
  // 購物車清單
  const cartList = []
  // 訂單資訊
  const orderInfo = {
    firstName: '',
    LastName: '',
    email: '',
    address: ''
  }
  // 訂單收入
  let revenue = 0

  // 選取 index.html 內的 html tag 並轉為 DOM 物件
  const cartbody = document.querySelector('#shoppingCartTbody')
  const clearCartBtn = document.querySelector('#clearCartBtn')
  const subTotalInCart = document.querySelector('#subTotalInCart')
  const subTotalInOrder = document.querySelector('#subTotalInOrder')
  const totalInOrder = document.querySelector('#totalInOrder')
  const checkoutBtn = document.querySelector('#checkoutBtn')
  const continueBtn = document.querySelector('#continueBtn')
  const orderIdSpan = document.querySelector('#orderId')
  
  // 監聽 加入購物車按鈕， 觸發時 執行 addToCart()
  function initAddToCartBinding () {
    const addToCartBtnList = document.querySelectorAll('button[data-shopping-id]')
    addToCartBtnList.forEach((el, idx) => {
      el.addEventListener('click', () => addToCart(el))
    })
  }

  // 監聽 明細按鈕, 觸發時 執行 
  function initViewOfDetailBinding () {
    const viewOfDetailBtnList = document.querySelectorAll('button.detail')
    viewOfDetailBtnList.forEach((el, idx) => {
      el.addEventListener('click', () => viewOfDetail(el))
    })
  }

  // 監聽 清除購物車按鈕， 觸發時 執行 clearCart()
  function initClearCartBinding () {
    clearCartBtn.addEventListener('click', () => clearCart())
  }

  // 加入購物車
  function addToCart (el) {
    const shoppingId = parseInt(el.dataset.shoppingId)
    const product = shoppingList[shoppingId]
    const isCartListContainProduct = cartList.some(x => x.id === shoppingId)

    if(isCartListContainProduct) {
      const cartItem = cartList.find(x => x.id === shoppingId)
      cartItem.quantity ++ 
      countSubTotal()
      removeCartItem(shoppingId, false)
      addToCartDOM(cartItem)
      cartList.push(cartItem)

      // 1. 按照 GTM 文件提供的範例
      dataLayer.push({
        'event': 'addToCart',
        'ecommerce': {
          'currencyCode': 'TWD',
          'add': {                                // 'add' actionFieldObject measures.
            'products': [{                        //  adding a product to a shopping cart.
              name: cartItem.name,
              id: cartItem.id,
              price: cartItem.price,
              quantity: cartItem.quantity
            }]
          }
        }
      })
      // 2. 使用封裝後的 addToCartEvent
      // pushToDataLayer(addToCartEvent([{
      //   name: cartItem.name,
      //   id: cartItem.id,
      //   price: cartItem.price,
      //   quantity: cartItem.quantity
      // }]))

    } else {
      const newCartItem = {...product,quantity: 1}
      cartList.push(newCartItem)
      countSubTotal()
      addToCartDOM(newCartItem)

      pushToDataLayer(addToCartEvent([{
        name: newCartItem.name,
        id: newCartItem.id,
        price: newCartItem.price,
        quantity: 1
      }]))
    }
  }

  function viewOfDetail (el) {
  // 檢視明細
  const detailId = parseInt(el.dataset.detailId)

  const { name, id, price } = shoppingList.find(x => x.id == detailId)

  pushToDataLayer(browseProductDetail([{
    name, id, price
  }]))
  }

  // 將 商品 渲染畫面在 購物車清單上
  function addToCartDOM ({ quantity, id, name, price, imgUrl }) {
    const amount = (quantity * price).toLocaleString('en-US')
    const tr = document.createElement('tr')
    tr.id = `cartItem_${id}`
    const template = `
    <td>
    <div class="product-item"><a class="product-thumb" href="#"><img src="${ imgUrl }"
    alt="Product"></a>
    <div class="product-info">
    <h4 class="product-title"><a href="#">${ name }</a></h4>
    </div>
    </div>
      </td>
      <td class="text-center text-lg text-medium">$${ amount }</td>
      <td class="text-center"><a class="remove-from-cart" data-toggle="tooltip" title="Remove item"><i
      class="material-icons icon_close"></i></a></td>
      `
    tr.innerHTML = template
    tr.querySelector('.remove-from-cart').addEventListener('click', () => {
      removeCartItem(id)
    })
    cartbody.appendChild(tr)

  }

  // 購物車內商品移除功能
  function removeCartItem (id, call = true) {

    const cartItemDom = cartbody.querySelector(`#cartItem_${id}`)
    cartItemDom.remove()
    
    const cartItem = cartList.find(x => x.id == id)
    
    pushToDataLayer(
      removeFromCartEvent({
        name: cartItem.name,
        id: cartItem.id,
        price: cartItem.price
      })
    )
    
    cartList.splice(cartList.findIndex(x => x.id === id), 1)
    
    if (!call) return
    countSubTotal()
  }

  // 購物車清除功能
  function clearCart () {
    cartList.splice(0, cartList.length)
    cartbody.innerHTML = ''
    countSubTotal()
  }

  // 建立訂單
  function createOrder () {
    const orderId = Date.now()
    orderIdSpan.innerText = orderId
    
    const actionField = {
      id: orderId,
      affiliation: 'Build School Lab Store',
      revenue,
      tax: 0,
      shipping: 20
    }
    
    const products = [ ...cartList ]
    
    pushToDataLayer(purchase(
      actionField,
      products
    ))
  }

  // 金額計算功能
  function countSubTotal () {
    const subTotal = cartList.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0)

    subTotalInCart.innerHTML = `$${subTotal.toLocaleString('en-US')}`
    subTotalInOrder.innerHTML = `$${subTotal.toLocaleString('en-US')}`
    totalInOrder.innerHTML = `$${(subTotal + 20).toLocaleString('en-US')}`
    revenue = subTotal
  }

  // 推送至 GTM 的 dataLayer
  function pushToDataLayer (obj) {
    dataLayer.push({ ecommerce: null })
    dataLayer.push(obj)
  }

  // window 載入後執行
  window.addEventListener('load', () => {
    // 初始化加入購物車按鈕行為
    initAddToCartBinding()
    // 初始化清除購物車按鈕行為
    initClearCartBinding()

    initViewOfDetailBinding()

    // 推送 (GA商品瀏覽事件) 至 dataLayer
    pushToDataLayer(browseProductList(shoppingList.map(({ imgUrl, ...el }) => ({ ...el }))))
    
    // 監聽 確認結帳按鈕，觸發時 推送 (衡量結帳事件) 至 dataLayer
    checkoutBtn.addEventListener('click', () => {
      pushToDataLayer(checkout({ step: 1 }, cartList))
    })
    
    // 監聽 繼續結帳按鈕，觸發時 推送 (衡量結帳事件) 至 dataLayer
    continueBtn.addEventListener('click', () => {
      pushToDataLayer(checkout({ step: 2 }))
      // 2 秒後，推送 (衡量結帳事件)、(交易事件) 至 dataLayer
      setTimeout(() => {
        pushToDataLayer(checkout({ step: 3 }))
        createOrder()
      }, 2000)
    })
  })
}())