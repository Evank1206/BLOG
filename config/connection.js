// const express = require("express");
const mysql = require ('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
    database: "blog"
});

db.connect();

module.exports = db;