const Notification = require('../models/Notification');

/**
 * Send a notification to a user
 * @param {string} userId - ID of the user to notify
 * @param {string} title - Title of the notification
 * @param {string} message - Message body
 * @param {string} type - Notification type (order_status, quote_update, message_reply, system)
 * @param {string} link - Optional link to redirect the user
 */
const sendNotification = async (userId, title, message, type = 'system', link = '') => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type,
      link,
    });
  } catch (err) {
    console.error('Failed to send notification:', err);
  }
};

module.exports = { sendNotification };
