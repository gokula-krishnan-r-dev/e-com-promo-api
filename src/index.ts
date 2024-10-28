import express from 'express';
import 'dotenv/config';
import routes from './routes/v1';
import connectDB from './config/db';
const port = process.env.PORT;
import cors from 'cors';
import updateExpiredCouponsMiddleware from './utils/midddleware';

const app = express();
app.use(express.json());
connectDB();

app.use(
  cors({
    origin: '*', // Allow all origins (consider limiting this in production) --
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(updateExpiredCouponsMiddleware);
app.use('/api/v1', routes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
