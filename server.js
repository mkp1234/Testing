const express = require('express');
const connectDB = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(200).json(`Server running on port ${port}`)
})

// const port = 3000;


connectDB().then(() => {
    app.listen(port, () => {
        console.log(`server is running on port ${port}`)
    })
})