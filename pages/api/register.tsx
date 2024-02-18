import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import { IncomingForm } from "formidable";
import jwt from "jsonwebtoken";
import Joi from "joi";
const JWT_SECRET_KEY =
  "23becdfc83442ece1c45a863391bd7c7ad408d758f87388dd030aac486c12bca";

const registerSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  nik: Joi.string().required(),
  nip: Joi.string().required(),
  alamat: Joi.string().required(),
  status: Joi.string().valid("active", "inactive").required(),
  password: Joi.string().min(6).required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new IncomingForm();
    // form.parse(req, async (err, fields) => {
    // if (err) {
    //   return res.status(400).json({ message: 'Error parsing form data' });
    // }

    // const { error } = registerSchema.validate(fields);

    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }

    const { name, username, email, nik, nip, alamat, status, password, role } =
      req.body;
    console.log(req.body);
    console.log(name);
    try {
      // Hashing password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds

      // Simpan data ke database MySQL
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "akutansi2",
      });

      await connection.execute(
        "INSERT INTO users (name, username, email, nik, nip, alamat, status, password_hash,role) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
        [name, username, email, nik, nip, alamat, status, hashedPassword, role]
      );

      const token = jwt.sign({ email: email }, JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      return res
        .status(200)
        .json({ token, email: email, role: role, status: status, name: name });
    } catch (error) {
      console.error("Error saving data to database:", error);
      res.status(500).json({ message: "Error saving data to database" });
    }
    // });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
