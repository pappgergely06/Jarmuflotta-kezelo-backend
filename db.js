const mariadb = require('mariadb');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env')});

if (!process.env.DB_USER){
    console.error("HIBA: Nincs beállítva adatbázis felhasználó!");
}

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 5
});

const testQuery = async () => {
    try{
        const conn = await pool.getConnection();
        const result = await conn.query("SELECT * FROM vehicles");
        
        conn.release();

    

        console.log(result); 
    } catch(err){
        console.error("Hiba a lekérdezés során!");
    }
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool,
    testQuery,
};