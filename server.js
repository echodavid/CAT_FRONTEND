const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint para servir el archivo HTML con la variable de entorno inyectada
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  let indexHTML = fs.readFileSync(indexPath, 'utf8');
  indexHTML = indexHTML.replace(
    '<script id="env"></script>',
    `<script>const API_URL = "${process.env.API_URL}";</script>`
  );
  res.send(indexHTML);
});

// Servir otros archivos estáticos
app.use(express.static(path.join(__dirname)));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});