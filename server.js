const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3001;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Multer middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve HTML files from the public folder
app.get('/:page', (req, res) => {
    const page = req.params.page || 'index.html';
    res.sendFile(page, { root: path.join(__dirname, 'public') });
});

// Handle form submissions
app.post('/submit-form', upload.single('attachment'), async (req, res) => {
    try {
        // Collect form data
        const formData = req.body;

        // Optional: Handle file attachment
        const attachment = req.file || null;

        // Optional: Add attachment logic if available
        if (attachment) {
            formData.attachment = {
                filename: attachment.originalname,
                content: attachment.buffer.toString('base64')
            };
        }

        // Replace with your Mailjet API key and secret
        const mailjetApiKey = '28cf1ac30b6d42974bc4d597fdd8f02e';
        const mailjetApiSecret = 'e094725a2a26adbf0a8bd77ce7f39ca0';

        // Mailjet configuration
        const mailjetConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username: mailjetApiKey,
                password: mailjetApiSecret,
            },
        };

        // Mailjet API endpoint
        const mailjetEndpoint = 'https://api.mailjet.com/v3.1/send';

        // Mail content
        const mailContent = {
            Messages: [
                {
                    From: {
                        Email: '13rms@curant24.com',
                        Name: '13 RMS',
                    },
                    To: [
                        {
                            Email: 'sahadewlall@outlook.com',
                            Name: 'Recipient Name',
                        },
                    ],
                    Subject: 'New Form Submission',
                    TextPart: 'You have a new form submission.',
                    HTMLPart: `
                        <h3>New Form Submission</h3>
                        <p>Email: ${formData.email}</p>
                        <p>Subject: ${formData.subject}</p>
                        <p>Message: ${formData.message}</p>
                    `,
                    // Optional: Add attachment to the email
                    Attachments: attachment
                        ? [
                              {
                                  ContentType: attachment.mimetype,
                                  Filename: attachment.originalname,
                                  Base64Content: attachment.buffer.toString('base64'),
                              },
                          ]
                        : [],
                },
            ],
        };

        // Send email using Mailjet API
        const response = await axios.post(mailjetEndpoint, mailContent, mailjetConfig);

        console.log('Mailjet API Response:', response.data);

        // Reset the file upload field
        if (attachment) {
            console.log('Attachment reset:', attachment.originalname);
        }

        res.status(200).json({ message: 'Form submitted successfully!', resetAttachment: true });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
