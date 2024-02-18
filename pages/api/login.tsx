import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mysql, { RowDataPacket } from 'mysql2/promise';
const bcrypt = require('bcrypt');

// Simpan secret key JWT Anda (harus rahasia dan aman)
const JWT_SECRET_KEY = '23becdfc83442ece1c45a863391bd7c7ad408d758f87388dd030aac486c12bca';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'akutansi2'
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log(email);
    const query = `SELECT * FROM users WHERE email = ?`;
    const [results] = await connection.execute<RowDataPacket[]>(query, [email]);
  
    if (results.length > 0) {
      const user = results[0];
      const hashedPassword = user.password_hash; // Ambil hash password dari hasil kueri
  
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
  
      if (passwordMatch) {
        // Password cocok, lakukan tindakan yang sesuai (misalnya, berikan token JWT)
        const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ token, email:user.email,role:user.role,status:user.status,name:user.name,id:user.id});
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    connection.end();
  }
};

export default handler;
