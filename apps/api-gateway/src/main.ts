import express, { Express, Request, Response } from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';
import cookieParser from 'cookie-parser';

// import * as path from 'path';

const app: Express = express();

// app.use('/assets', express.static(path.join(__dirname, 'assets')));
// middlewares
app.use(cors({
  or
}))
app.get('/api', (req: Request, res: Response) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
