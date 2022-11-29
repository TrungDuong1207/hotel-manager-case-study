const connection = require("../src/model/ConnectDB")
class HandlerSQL {
    static querySQL(sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, (err, results) => {
                if (err) reject(err.message);
                resolve(results);
            })
        })
    }
}

module.exports = HandlerSQL;