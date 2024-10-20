const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();
dotenv.config();



//connect to DB

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (error) =>{
  	if (error) throw error;
  	console.log("Connected to DataBase..!!")
  }
);

//middleware
app.use(express.json());
app.use(cors());

//route middlewares
app.use('/user', authRoute);
app.use('/posts', postRoute);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log('Server is Running..'));
