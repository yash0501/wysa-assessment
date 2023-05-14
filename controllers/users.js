const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

const userController = {
  async register(req, res) {
    const { username, password } = req.body;
    try {
      const exists = await User.find({ username });
      if (exists.length) {
        return res.status(400).json({ msg: "Username already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({ username, password: hashedPassword });
      const token = jwt.sign({ user }, JWT_SECRET);
      res.status(201).json({ msg: "User created", token });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};
