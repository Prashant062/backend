const connectToMongo = require('./db');
const express = require('express')



connectToMongo();
const app = express()
const port = 5000

//Using Middleware
app.use(express.json());

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


app.get('/', (req, res) => {
  res.send('Hello Mr.Stark...!')
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
