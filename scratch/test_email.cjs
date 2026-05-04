require('dotenv').config({ path: '../server/.env' });
const sendEmail = require('../server/utils/email');

async function test() {
  console.log('Attempting to send test email to shahzebfaisal5649@gmail.com...');
  try {
    await sendEmail({
      email: 'shahzebfaisal5649@gmail.com',
      subject: 'Test Email from Design Custom Box',
      message: 'If you receive this, your email configuration is working!',
      html: '<h1>Success!</h1><p>Your email configuration is working perfectly.</p>'
    });
    console.log('✅ Test email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

test();
