const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigrations() {
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'akutansi2'
});

const migrationFiles = fs.readdirSync(path.resolve(__dirname, './'));

for (const file of migrationFiles) {
  if (file.endsWith('.sql')) {
    const migrationScript = fs.readFileSync(path.resolve(__dirname, file), 'utf-8');
    await connection.query(migrationScript);
    console.log(`Migration ${file} executed successfully.`);
  }
}

connection.end();
}

runMigrations().catch(error => {
console.error('Error executing migrations:', error);
});