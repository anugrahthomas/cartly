import express, { Express, Request, Response } from 'express';
// import dotenv from 'dotenv';
// dotenv.config({ path: '.env' });
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import { rateLimiter } from './middlewares/rate-limiter';

const app: Express = express();
const port = Number(process.env.PORT) || 8000;
const authService = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';

// middlewares
app.use(
  cors({
    origin: [],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
    preflightContinue: false,
  }),
);

app.use(helmet());

app.use(morgan('dev'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());
app.set('trust proxy', 1);

// rate limiter
app.use(rateLimiter);


// routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to api-gateway!' });
});

// proxy routes
app.use('/v1/auth', proxy(authService));

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Auth Service is running at ${authService}`);
});

server.on('error', console.error);