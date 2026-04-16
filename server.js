require('dotenv').config();
const app = require('./app');
const { testQuery } = require('./db');

const port = process.env.PORT || 5001;

testQuery();

app.listen(port, async () => {
    console.log(`A szerver fut az ${port} porton!`);
});
