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

// Define user schema and model
const userSchema = new mongoose.Schema({
  Name: String,
  Usertype: String,
  MobileNumber: String,
  EmailAddress: String,
  Password: String 
});

const User = mongoose.model('User', userSchema);

// API endpoint to save user data
app.post('/api/users', async (req, res) => {
  try {
    const { Name, Usertype, MobileNumber, EmailAddress, Password } = req.body;

    // Validate request body
    // if (!Name || !Usertype || !MobileNumber || !EmailAddress || !Password) {
    //   return res.status(400).json({ error: 'All fields are required' });
    // }

    // Create a new user instance
    const newUser = new User({
      Name,
      Usertype,
      MobileNumber,
      EmailAddress,
      Password
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT endpoint to update user data
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { Name, Usertype, MobileNumber, EmailAddress, Password } = req.body;
    if (!Name || !Usertype || !MobileNumber || !EmailAddress || !Password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete a contact
app.delete('/api/Users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(204).end(); // No content, successful deletion
  } catch (error) {
    res.status(500).json({ error: error.message });
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