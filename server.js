
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');




const dotenv = require('dotenv');
dotenv.config();
if (!process.env.MAGIC_NUM) {
  console.error('MAGIC_NUM is not set in the environment variables. Something is wrong with .env!');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;


// -------------------------------------------------------------------------------------------------------
// Middlwares

// Configure CORS for local development
const corsOptions = {
  origin: 'http://localhost:3001', // Only allow requests from your React app's dev server
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
};

app.use(cors(corsOptions));

const bearerToken = require('./models/BearerToken');

// Middleware to handle bearer token authentication
// this is a simple example, in production i would prolly verify the token properly
app.use(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).send('Missing Authorization header');

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Malformed Authorization header');

  req.token = token;

  const tokenDoc = await bearerToken.findOne({ id: token });
  if (!tokenDoc) return res.status(401).send('Invalid token');
  req.tokenDoc = tokenDoc;

  next();
});

// Middleware to parse JSON bodies
app.use(express.json({ limit : '100mb' }));



// -------------------------------------------------------------------------------------------------------




// -------------------------------------------------------------------------------------------------------
// Routes
app.get('/', (req, res) => {
    //do nothing for now
    res.send();
});

app.get('/test', (req, res) => {
    res.send('Test route is working!');
});

// all routes
const routes = require('./routes');
app.use('/api', routes);

// -------------------------------------------------------------------------------------------------------



// Start the server
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected!");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

