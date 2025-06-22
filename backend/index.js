const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')
const fundRoutes = require('./routes/fundRoutes');

connectToMongo();


const app = express()
const port = 5000

app.use(cors())

app.use(express.json())
app.use('/api/funds', fundRoutes);

app.use('/api/auth', require('./routes/auth'))

app.listen(port, ()=> {
    console.log(`Assignment1 Backend listening at http://localhost:${port}`);
})
