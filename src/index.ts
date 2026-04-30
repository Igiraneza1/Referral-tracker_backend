import express = require('express');
const app = express();
const PORT = 3000;
// Middleware to parse JSON request bodies
app.use(express.json());
app.post('/data', (req, res) => {
   console.log(req.body); // Parsed JSON object
   res.send({ received: true, data: req.body });
});
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});