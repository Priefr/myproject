const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON bodies

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kirui', // your MySQL password
  database: 'mealsDb'
});

// Connect to MySQL
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});
const path = require('path');


// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve your index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Firebase Admin SDK setup
var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://recipefinder-4bf74-default-rtdb.firebaseio.com"
});

// Route to get meals from the database
app.get('/meals', (req, res) => {
  const query = 'SELECT * FROM meals'; // Fetch all meals from the meals table
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results); // Send the results as JSON
  });
});

// Route to handle user signup
app.post('/signup', (req, res) => {
  const { email, password, username } = req.body;

  // Create user in Firebase Authentication
  admin.auth().createUser({
    email: email,
    password: password,
    displayName: username
  })
  .then(userRecord => {
    // User created successfully
    console.log('Successfully created new user:', userRecord.uid);

    // Optionally, store user info in your MySQL database
    const query = 'INSERT INTO users (uid, username, email) VALUES (?, ?, ?)';
    connection.query(query, [userRecord.uid, username, email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving user data to database' });
      }
      res.status(201).json({ uid: userRecord.uid, username, email });
    });
  })
  .catch(error => {
    console.error('Error creating new user:', error);
    res.status(400).json({ error: error.message });
  });
});

// Route to handle user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Firebase Authentication login
  admin.auth().getUserByEmail(email)
  .then(userRecord => {
    // Here you would normally compare the password with a hashed password stored in your database.
    // Since Firebase does not expose passwords, you will need to implement password verification on the client-side.
    
    // For demonstration, we'll assume the password is valid.
    res.json({ uid: userRecord.uid, email: userRecord.email, username: userRecord.displayName });
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
    res.status(404).json({ error: 'User not found or incorrect credentials' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
