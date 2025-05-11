const express = require('express');
const router = express.Router();
const { sendPushNotification } = require('../services/fcmService');

router.post('/send', async (req, res) => {
    const { token, title, body } = req.body;

    try {
        const response = await sendPushNotification(token, title, body);
        res.status(200).send(`Message sent: ${response}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(`Error sending message: ${error.message}`);
    }
});

module.exports = router;
