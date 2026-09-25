import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB) || 0,
});

const insuranceLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

const limiter = new RateLimiterRedis({
  points: 100,
  duration: 60,
  storeClient: redis,

  keyPrefix: 'rl:gateway',
  insuranceLimiter: insuranceLimiter,
  rejectIfRedisNotReady: true,
  inMemoryBlockOnConsumed: 100,
});

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip;

  if (!key) {
    return res.status(400).json({
      error: 'Bad Request',
      code: 'BAD_REQUEST',
      message: 'IP address is required.',
    });
  }

  try {
    const result = await limiter.consume(key);

    console.log(result);
    return next();
  } catch (err) {
    console.error(err);

    return res.status(429).json({
      error: 'Too many requests',
      code: 'TOO_MANY_REQUESTS',
      message: 'You have exceeded the request limit. Please try again later.',
    });
  }
};
