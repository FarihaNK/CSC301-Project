<<<<<<< HEAD
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
=======
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     const existingUser = await User.findOne({ email });

//     if (existingUser) return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword, role });
//     await user.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign(
//       { id: user._id, role: user.role }, 
//       process.env.JWT_SECRET, 
//       { expiresIn: process.env.JWT_EXPIRATION }
//     );
    
//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// exports.getUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// exports.getDoctors = async (req, res) => {
//   try {
//     const doctors = await User.find({ role: "doctor" }).select("_id name");
//     res.json(doctors);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// }









const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
>>>>>>> attempted-AI-integration

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

<<<<<<< HEAD
=======
    // Create a folder for patient sample data if the user is a patient
    if (role === 'patient') {
      // Resolve the absolute path to the "ai-service/sampledata" folder,
      // assuming your project structure is:
      // CSC301-Project/
      // ├── ai-service/
      // │   └── sampledata/
      // └── user-auth-service/
      const basePath = path.resolve(__dirname, '..', '..', 'ai-service', 'sampledata');
      const userFolderPath = path.join(basePath, user._id.toString());
      
      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath, { recursive: true });
        console.log(`✅ Created folder: ${userFolderPath}`);
      } else {
        console.log(`📁 Folder already exists: ${userFolderPath}`);
      }
    }

>>>>>>> attempted-AI-integration
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
<<<<<<< HEAD
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    
=======
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

>>>>>>> attempted-AI-integration
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("_id name");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
<<<<<<< HEAD
}
=======
};
>>>>>>> attempted-AI-integration
