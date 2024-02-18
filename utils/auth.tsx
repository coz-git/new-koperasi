// utils/auth.ts (atau lokasi yang sesuai dalam proyek Anda)

import bcrypt from 'bcryptjs';

// Fungsi ini akan menghash password dan mengembalikan hash-nya
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Jumlah putaran salt, semakin tinggi semakin aman tetapi memakan waktu lebih lama
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
