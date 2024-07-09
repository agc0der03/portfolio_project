const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3232;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve portfolio.html by default for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'portfolio.html'));
});

// Handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Check if EMAIL_PASSWORD is set in environment variables
    if (!process.env.EMAIL_PASSWORD) {
        console.error('EMAIL_PASSWORD is not set in environment variables.');
        return res.status(500).send('Internal server error');
    }

    // Create transporter for sending emails
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'send2adit@gmail.com',
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    // Email options
    let mailOptions = {
        from: 'send2adit@gmail.com',
        to: 'send2adit@gmail.com',
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.redirect('/#contact-section');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
