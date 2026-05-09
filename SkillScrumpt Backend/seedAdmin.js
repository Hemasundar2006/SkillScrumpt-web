const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://teluguinfostudent_db_user:Qwertyuiop%40123@skillscrumpt-shard-00-00.pi1vnue.mongodb.net:27017,skillscrumpt-shard-00-01.pi1vnue.mongodb.net:27017,skillscrumpt-shard-00-02.pi1vnue.mongodb.net:27017/skillscrumpt?ssl=true&replicaSet=atlas-13z7v9-shard-0&authSource=admin';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    
    const adminEmail = 'marotinani06@gmail.com';
    const adminPass = '9666180813';

    let admin = await User.findOne({ email: adminEmail });
    
    if (admin) {
      admin.password = adminPass;
      admin.role = 'admin';
      await admin.save();
      console.log('Admin user updated successfully!');
    } else {
      admin = new User({
        firstName: 'Maroti',
        lastName: 'Nani',
        email: adminEmail,
        password: adminPass,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created successfully!');
    }
    
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

createAdmin();
