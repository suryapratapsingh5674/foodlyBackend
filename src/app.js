const cookieParser = require('cookie-parser');
const express = require('express');
const authRouter = require('./routes/auth.routes.js')
const foodRouter = require('./routes/food.routes.js')
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    // origin:"http://localhost:5174",
    origin:"https://foodly-frontend-brown.vercel.app",
    credentials: true
}))

app.get('/', (req, res)=>{
    res.send("hello");
})

app.use('/api/auth', authRouter);
app.use('/api/food', foodRouter);

module.exports = app;