const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
  try {
    const response = await fetch('https://server-5bck57zvr-tamar-ils-projects.vercel.app/proxy', { // URL של Tactiq
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // אפשר להוסיף פה Authorization אם צריך
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from VRCLE', details: err.message });
  }
});

app.listen(3000, () => console.log('Proxy server running on http://localhost:3000'));
