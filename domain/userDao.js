const mysql = require ('mysql');
const util = require( 'util' );
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "blog"
});
const query = util.promisify(conn.query).bind(conn);
conn.connect();

module.exports = {
    createUser: (user) => {
        return query(`INSERT INTO users (userName, email, password) VALUES ('${user.userName}', '${user.email}', '${user.password}')`);
    },
    getUserById: (id) => {
        return query(`SELECT * FROM users where id = '${id}'`);
    },
    getUserByUsername: (userName) => {
        return query(`SELECT * FROM users where userName = '${userName}'`);
    },
    getAllUsers: (id) => {
        return query(`SELECT * FROM users`);
    },
    existsByUsernameOrEmail: async (userName, email) => {
        const result = await query(`SELECT * FROM users where userName = '${userName}' or email = '${email}'`);
        return result.length > 0;
    }
};