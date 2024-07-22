// import  the packages to be used in the project.
const bcrypt = require('bcryptjs');
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const session = require('express-session');
const { table } = require('console');
const { isTypedArray } = require('util/types');
const { rmSync } = require('fs');


// initialize the application.
const app = express();

// configure the required middlewares (acts as an intermediary between different interfaces.)

app.use(session({
    secret: "jfoefe890483riopio=u-73u",
    resave: false,
    saveUninitialized: false
}));

// middleware to set up incoming requests.
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.user(express.static(__dirname));

// connect to the database server.
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'web_database',
    port: 3300
});

// connect to the database server
db.connect((error) => {
    if (error) {
        console.log("Error connecting to the database server: " + error.stack);
    } else {
        console.log("Connection to the database successful.")
    }
})

// define the routes.
app.get('/api/user/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// configure how to register a user.
const user = {
    tableName: 'users', // table name as per the database.
    createUser: function (newUser, callback) {
        db.query('INSERT INTO ' + this.tableName + ' SET ?', newUser, callback); // insert the new user into the database.
    },
    getUser: function (email, username, callback) {
        db.query('SELECT * FROM ' + this.tableName + ' WHERE email = ? OR username = ?', [email, username], callback); // get the user from the database.
    }
};

app.post('api/register', [
    // validation
    check('email').isEmail(),
    check('username').isAlpha().withMessage('Username should only contain letters.'),

    check([email, username]).custom(async (email, username) => {
        const exist = await user.getUser(email, username);
        if (exist) {
            throw new Error('Email or username already exists.');
        }
    })
], async (req, res) => {
    // check for validation errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // hash the password.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // proceed to create a new user.
    const newUser = {
        full_name: req.body.fullName,
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
       
    }

    // define the user object.
    user.createUser(newUser, (error) => {
        if(error){
            console.log("Error creating a new user: " + error.message);
            res.status(500).json({error: error.message})
        } else {
            console.log("New user created successfully.");
            res.status(201).json(newUser);
        }
    });

});

// start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

