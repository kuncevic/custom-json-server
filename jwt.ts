import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
const secretKey = 'Ijei2Dd3YY';

import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const checkJwt = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  // Verify token with secret key
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Add decoded user object to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const options = {
  payload: { userId: 'rR123' },
  secretKey,
  tokenExpiration: '365d',
};

export const generateToken = (
  payload: string | object | Buffer,
  secretKey: jwt.Secret,
  expiresIn: string
) => {
  const options = { expiresIn };
  return jwt.sign(payload, secretKey, options);
};

const generateRandomString = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// console.log(generateRandomString(10));
