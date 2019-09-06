import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import userRepository from '../../data/repositories/user.repository';

dotenv.config();

export const sendEmail = (to, subject, text) => new Promise((resolve) => {
    // Using https://ethereal.email testing service recommended by nodemailer, which generates accounts
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error('there was an error: ', err);
        } else {
            resolve('OK');
        }
    });
});

export const sendPasswordResetEmail = email => new Promise((resolve) => {
    userRepository.getByEmail(email).then((user) => {
        if (!user) {
            resolve('USER NOT FOUND');
        } else {
            const token = crypto.randomBytes(20).toString('hex');
            user.update({
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 360000
            });

            const text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
                + `http://localhost:3001/reset/${token}\n\n`
                + 'If you did not request this, please ignore this email and your password will remain unchanged.\n';

            sendEmail(user.email, 'Link To Reset Password', text).then(result => resolve(result));
        }
    });
});

export const sendNotificationEmail = (email, reactedUsername, postId) => {
    const text = `Your post (http://localhost:3001/share/${postId}) was recently liked by ${reactedUsername}!`;
    return sendEmail(email, 'Your Post Was Liked', text);
};

export const sharePostByEmail = (recipient, postId, sender) => userRepository.getByEmail(recipient).then((user) => {
    if (user) {
        const text = `User ${sender} shared the post with you!\n\nCheck it out: http://localhost:3001/share/${postId}`;
        sendEmail(recipient, 'A Post Was Shared With You', text);
        return 'OK';
    }

    return 'USER NOT FOUND';
});
