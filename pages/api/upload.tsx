import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // Untuk memberikan nama unik untuk gambar

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Direktori penyimpanan gambar
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4();
    const extension = file.originalname.split('.').pop();
    cb(null, `${uniqueName}.${extension}`); // Nama file yang disimpan dengan UUID unik
  },
});

const upload = multer({ storage });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name } = req.body;
    const imagePath = (req.file as Express.Multer.File).path;

    // Simpan 'name' ke dalam database MySQL dan imagePath ke sistem file

    // Tanggapi permintaan dengan sukses
    res.status(200).json({ message: 'Upload berhasil.' });
  } catch (error) {
    console.error('Gagal menyimpan data:', error);
    res.status(500).json({ message: 'Gagal menyimpan data.' });
  }
}
