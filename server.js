const express = require('express');
const bodyParser = require('body-parser');
const { createConnection } = require('mysql2');

const app = express();
app.use(bodyParser.json());

// Konfigurasi koneksi database
const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'akutansi2',
});

// Routing untuk update status user

app.put('/api/updateuserstatus/:id', async (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;

  try {
    await db.promise().execute('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
    res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
