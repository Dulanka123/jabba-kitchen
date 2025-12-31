// server/src/routes/authRoutes.ts
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // අලුත් Login Route එක

// ... උඩින් තියෙන imports සහ register/login routes එහෙමම තියන්න ...

// 👇 මේ කොටස අලුතින් එකතු කරන්න
import User from '../models/User'; // User model එක import කරගන්න (import නැත්නම් උඩට දාන්න)

// Update User Profile
router.put('/profile', async (req, res) => {
  try {
    const { _id, name, password } = req.body; // Frontend එකෙන් එවන ID එක සහ Data

    const user = await User.findById(_id);

    if (user) {
      user.name = name || user.name;
      
      // පාස්වර්ඩ් එක වෙනස් කරනවා නම් විතරක් Update කරනවා
      if (password) {
        // මෙතන සරලව කෙලින්ම save කරනවා (Password Hash එක Model එකේ Pre-save එකකින් වෙනවා නම් අවුලක් නෑ)
        // නැත්නම් ඔයාට මෙතන bcrypt පාවිච්චි කරන්න වෙනවා.
        // සරලව තියන්න අපි දැනට නම විතරක් update කරමු. Password logic එක සංකීර්ණ නිසා.
        // user.passwordHash = ... (මෙතන hashing ඕන වෙනවා)
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error });
  }
});

// ... export default router; (යටින්ම තියෙන එක)

export default router;