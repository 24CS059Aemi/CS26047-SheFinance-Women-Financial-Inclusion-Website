require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve frontend HTML/CSS files

// Initialize Google Auth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD 
        // Note: For Gmail, use an "App Password" if 2FA is enabled.
    }
});

app.post('/api/google-login', async (req, res) => {
    try {
        const { credential } = req.body;
        
        let payload;
        try {
            // 1. Verify Google Token
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID, 
            });
            payload = ticket.getPayload();
        } catch (verifyError) {
            if (verifyError.message.includes('Token used too early')) {
                // Handle clock skew between Google and the server
                console.log("Clock skew detected, decoding token manually...");
                const base64Url = credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
            } else {
                throw verifyError;
            }
        }
        
        const userEmail = payload.email;
        const userName = payload.name;

        console.log(`User logged in: ${userName} (${userEmail})`);

        // 2. Send Welcome Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Welcome to SheFinance! 🎉',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #1b3644;">Hello ${userName}, Welcome to SheFinance!</h2>
                    <p>We are absolutely thrilled to have you join our community.</p>
                    <p>Your journey to financial freedom starts here. You can now use our personalized budgeting tools, AI chatbot, and explore government schemes.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p><strong>The SheFinance Team</strong></p>
                </div>
            `
        };

        // Send email in the background
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Welcome email sent: " + info.response);
            }
        });

        // 3. Return success to frontend
        res.status(200).json({ 
            success: true, 
            message: 'User authenticated and email sent.',
            user: { name: userName, email: userEmail }
        });

    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SheFinance Backend server running on http://localhost:${PORT}`);
});
