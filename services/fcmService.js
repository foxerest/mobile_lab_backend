const admin = require('firebase-admin');

const sendPushNotification = async (token, title, body) => {
    const message = {
        notification: { title, body },
        token,
        android: {
            priority: 'high',
            notification: {
                channelId: 'default-channel-id',
                sound: 'default',
            }
        }
    };

    return await admin.messaging().send(message);
};

module.exports = { sendPushNotification };
