const express = require('express');
const connectDB = require('./db');

const app = express();


app.get("/", (req, res) => {
    res.status(200).json("Server running.")
})

// const port = 3000;
const port = process.env.PORT || 3000;

connectDB().then(()=>{
    app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
})