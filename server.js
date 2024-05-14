const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment-timezone');


const app = express();


app.use(cors());
app.use(bodyParser.json());  //it is require for get data from request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/favicon.ico', (req, res, next) => {
  res.status(204).end(); // No content for favicon requests
});



const connectToDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://saksha:1234@cluster0.xnvkwgq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
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
  date: { type: String, required: true },
  name: String,
  phoneNumber: Number,
  email: String,
  service: String,
  message:String
  // Add other fields as needed
});

const BookServices = mongoose.model('BookServices', bookserviceSchema, 'bookservices');

app.get('/getBookedServicesData', async (req, res) => {
  try {
    const data = await BookServices.find().sort({ date: -1 });
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

const LoginModel = mongoose.model('login', loginSchema, 'adminlogin');

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await LoginModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Authentication successful
    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const serviceSchema = new mongoose.Schema({
  service: String
});
const ServiceModel = mongoose.model('service', serviceSchema, 'service');

app.get('/api/service', async (req, res) => {
  try {
    const data = await ServiceModel.find();
    res.json(data);
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