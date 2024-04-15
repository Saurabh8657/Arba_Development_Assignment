const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { connection } = require('./Config/db')
const { userRouter } = require('./route/user.route')
const { productRouter } = require('./route/product.route')
const { categoryRouter } = require('./route/category.route')

const app = express();


app.use(express.json())
app.use(cors('*'))


app.use('/user', userRouter)
app.use('/product',productRouter)
app.use('/category',categoryRouter)


app.get('/', (req,res) => {
    res.send({msg:'Welcome to backend'})
})



app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log('Connected to DB')
        console.log(`listening to port ${process.env.PORT}`)
    } catch (error) {
        console.log(error)
    }
})