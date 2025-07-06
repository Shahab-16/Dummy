const express = require('express')
const expressProxy = require('express-http-proxy')

const app = express()


app.use('/user', expressProxy('http://localhost:5001'))
app.use('/admin',expressProxy('http://localhost:5002'))
app.use('/products', expressProxy('http://localhost:5003'))
app.use('/order', expressProxy('http://localhost:5004'))
app.use('/payment', expressProxy('http://localhost:5005'))



app.listen(3000, () => {
    console.log('Gateway server listening on port 3000')
})