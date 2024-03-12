const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

const corsOptions = {
  origin: 'https://gilded-dasik-3233a1.netlify.app', // Replace 'your-frontend-domain' with the actual domain of your frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));
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
  Date:String,
  Name: String,
  Phno: Number,
  EmailId: String,
  service: String,
  message:String
  // Add other fields as needed
});

const BookServices = mongoose.model('BookServices', bookserviceSchema, 'bookservices');

app.get('/getBookedServicesData', async (req, res) => {
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


// Add a route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

const port = 2000;
app.listen(port, () => {
  console.log("server is started successfully");
});