const express = require('express');
const cors = require('cors'); // Import cors
const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'helloWorld.html')); //Open helloWorld.html intitially
  });

//start app at localhost:3001
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('Server started at http://localhost:3001');
});