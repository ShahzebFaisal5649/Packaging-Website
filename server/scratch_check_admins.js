require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

async function checkAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      role: String
    }));

    const admins = await User.find({ role: { $in: ['admin', 'super_admin'] } });
    console.log('--- ADMIN LIST ---');
    admins.forEach(a => {
      console.log(`- ${a.name} (${a.email}) | Role: ${a.role}`);
    });
    console.log('------------------');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkAdmins();
