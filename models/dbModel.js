const Pool = require('pg').Pool
const pool = new Pool({
  user: 'jakopf',
  host: 'localhost',
  database: 'wiezienie',
  password: '123',
  port: 5432,
});

const getQuery = (command) => {
    return new Promise(function(resolve, reject) {
        pool.query(command, (error, results) => {
            if (error) {
                reject(error.message)
            } else {
                resolve(results.rows);
            }
        })
    }) 
}

module.exports = {
    getQuery,
}