import express from 'express';
import routes from './routes/index';


const app = express();
const port = process.env.PORT || 5000;


// Middleware for parsing JSON bodies
app.use(express.json());


// Use defined routes
app.use('/', routes);


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
