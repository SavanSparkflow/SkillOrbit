import jwt from 'jsonwebtoken';

export const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'skillorbit_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

  // Set HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};
