import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';

declare module 'next' {
  interface NextApiRequest {
    user?: { email: string };
  }
}

const JWT_SECRET_KEY = 'your-secret-key';

const authMiddleware = (handler: any) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = verify(token, JWT_SECRET_KEY) as { email: string };
    req.user = decodedToken;
    return handler(req, res); // Call the handler function with req and res
  } catch (error) {
    
    // return res.status(401).json({ message: 'Unauthorized' });
    return res.redirect('/auth/login'); 
  }
};

export default authMiddleware;
