const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    const mongoURI = 'mongodb://teluguinfostudent_db_user:Qwertyuiop%40123@skillscrumpt-shard-00-00.pi1vnue.mongodb.net:27017,skillscrumpt-shard-00-01.pi1vnue.mongodb.net:27017,skillscrumpt-shard-00-02.pi1vnue.mongodb.net:27017/skillscrumpt?ssl=true&replicaSet=atlas-13z7v9-shard-0&authSource=admin';
    await mongoose.connect(mongoURI);
    
    let existingAdmin = await User.findOne({ email: 'marotinani06@gmail.com' });
    if (existingAdmin) {
      existingAdmin.password = '9666180813';
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Admin user updated successfully!');
      process.exit();
    }

    const newAdmin = new User({
      firstName: 'Maroti',
      lastName: 'Nani',
      email: 'marotinani06@gmail.com',
      password: '9666180813',
      role: 'admin'
    });

    await newAdmin.save();
    console.log('Admin user created successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

createAdmin();
