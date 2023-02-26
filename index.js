import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import invoiceRoutes from './routes/invoice.js'
import clientRoutes from './routes/client.js'
import productRoutes from './routes/product.js'
import userRoutes from './routes/user.js'
import corsOptions from './config/corsOptions.js'

dotenv.config()

const app=express()


app.use((express.json({ limit: "30mb", extended: true})))
app.use((express.urlencoded({ limit: "30mb", extended: true})))
app.use((cors(corsOptions)))
app.use(cookieParser())

app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});  

app.use('/invoices', invoiceRoutes)
app.use('/clients', clientRoutes)
app.use('/products', productRoutes)
app.use('/user', userRoutes)

mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true}).then((res)=>{app.listen(process.env.PORT,()=>{console.log('server calisti...')})})

mongoose.set('strictQuery', false);