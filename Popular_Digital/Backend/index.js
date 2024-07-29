require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db')
const routes = require('./Routes/routes')
const authRoutes = require('./Routes/authRoutes')
const middleware = require('./Middleware/middleware')

connection()
//middleware
app.use(express.json());
app.use(cors());
app.use('/',routes)
app.use('/api',middleware);
app.use('/api',authRoutes);
const port = process.env.PORT||8080;
app.listen(port,()=>console.log(`listening on port ${port}`))