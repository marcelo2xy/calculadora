// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./resultados.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Cria a tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS resultados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    diferenca REAL,
    porcentagem REAL,
    timestamp TEXT
)`);

// Endpoint para adicionar um resultado
app.post('/api/resultados', (req, res) => {
    const { nome, diferenca, porcentagem, timestamp } = req.body;
    const sql = `INSERT INTO resultados (nome, diferenca, porcentagem, timestamp) VALUES (?, ?, ?, ?)`;
    db.run(sql, [nome, diferenca, porcentagem, timestamp], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Endpoint para obter todos os resultados
app.get('/api/resultados', (req, res) => {
    const sql = `SELECT * FROM resultados ORDER BY id DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
