const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());  //it is require for get data from request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/favicon.ico', (req, res, next) => {
  res.status(204).end(); // No content for favicon requests
});



const connectToDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://saksha:1234@cluster0.xnvkwgq.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true

    });
    console.log("connected to MongoDb");

  } catch (error) {
    console.log(error);
    process.exit(1);

  }
}
connectToDB();


const bookserviceSchema = new mongoose.Schema({
  Date:String,
  Name: String,
  Phno: Number,
  EmailId: String,
  service: String,
  message:String
  // Add other fields as needed
});

const BookServices = mongoose.model('BookServices', bookserviceSchema, 'bookservices');

app.get('/getbookedservice/data', async (req, res) => {
  try {
    const data = await BookServices.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const loginSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const LoginModel = mongoose.model('login', loginSchema, 'login');

app.get('/api/login', async (req, res) => {
  try {
    const data = await LoginModel.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a POST route for login
app.post('/api/login', async (req, res) => {
  try {
    // Handle the login logic here
    // Example: Check the provided credentials and respond accordingly
    const { email, password } = req.body;
    const user = await LoginModel.findOne({ email, password });

    if (user) {
      // Successful login
      res.json({ message: 'Login successful', user });
    } else {
      // Failed login
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

const port = 2000;
app.listen(port, () => {
  console.log("server is started successfully");
});