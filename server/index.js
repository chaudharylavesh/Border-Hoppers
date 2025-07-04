const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Border Hoppers server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});