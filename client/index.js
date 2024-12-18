import { v4 as uuidv4 } from './node_modules/uuid/dist/esm-browser/index.js';
import api from './apiClient.js'
const USER_ID = 1001

const notIdempotentForm = document.getElementById('notIdempotentForm')
const statusNotIdempotent = document.getElementById(
    'statusNotIdempotent'
)
notIdempotentForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(notIdempotentForm))
    const reqBody = { order: formData.order }
    const response = await api.newOrder('new-order', reqBody)
    if (response.status == 200 | response.status == 201) {
        const message = await response.json()
        statusNotIdempotent.innerText = message
    } else {
        statusNotIdempotent.innerText = 'Error'
    }
})
const orderWithErrorNotIdempotentBtn = document.getElementById(
    'orderWithErrorNotIdempotentBtn'
)
orderWithErrorNotIdempotentBtn.addEventListener('click', async () => {
    const formData = Object.fromEntries(new FormData(notIdempotentForm))
    const reqBody = { order: formData.order }
    const response = await api.newOrder('new-order', reqBody, true)
    statusNotIdempotent.innerText = 'Error'
})

const idempotentForm = document.getElementById('idempotentForm')
const statusIdempotent = document.getElementById('statusIdempotent')
idempotentForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(idempotentForm))
    let orderId = localStorage.getItem('orderId')
    if (!orderId) {
        localStorage.setItem('orderId', `newOrder-${USER_ID}-${uuidv4()}`)
        orderId = localStorage.getItem('orderId')
    }
    const reqBody = { order: formData.order, orderId: orderId }
    const newOrderResponse = await api.newOrder('new-order-idempotent', reqBody)
    if (newOrderResponse.status == 200 | newOrderResponse.status == 201) {
        const message = await newOrderResponse.json()
        localStorage.setItem('orderId', `newOrder-${USER_ID}-${uuidv4()}`)
        statusIdempotent.innerText = message.message
    } else {
        statusIdempotent.innerText = 'Error'
    }
})
const orderWithErrorIdempotentBtn = document.getElementById(
    'orderWithErrorIdempotentBtn'
)
orderWithErrorIdempotentBtn.addEventListener('click', async () => {
    const formData = Object.fromEntries(new FormData(idempotentForm))
    let orderId = localStorage.getItem('orderId')
    if (!orderId) {
        localStorage.setItem('orderId', `newOrder-${USER_ID}-${uuidv4()}`)
        orderId = localStorage.getItem('orderId')
    }
    const reqBody = { order: formData.order, orderId: orderId }
    const response = await api.newOrder('new-order-idempotent', reqBody, true)
    statusIdempotent.innerText = 'Error'
})