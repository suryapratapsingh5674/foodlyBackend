const dotenv = require('dotenv');

dotenv.config();

const app = require('./src/app.js');
const dbConnection = require('./src/db/db.js');
dbConnection();

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, ()=>{
//     console.log(`your server is running on ${PORT}`)
// })

module.exports = app;