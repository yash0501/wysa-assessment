const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
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

const sleepSchema = new mongoose.Schema({
  sleepWellGoals: {
    type: Array,
    required: true,
  },
  strugglePeriod: {
    type: Number,
    required: true,
  },
  goingBedTime: {
    type: Number,
    required: true,
  },
  wakeUpTime: {
    type: Number,
    required: true,
  },
  sleepHours: {
    type: Number,
    required: true,
  },
  sleepWellGoalsScore: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Sleep = mongoose.model("Sleep", sleepSchema);

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

  async addSleepData(req, res) {
    const {
      sleepWellGoals,
      strugglePeriod,
      goingBedTime,
      wakeUpTime,
      sleepHours,
      userName,
    } = req.body;
    try {
      let score = 0;
      if (
        !sleepWellGoals ||
        !strugglePeriod ||
        !goingBedTime ||
        !wakeUpTime ||
        !sleepHours
      ) {
        return res.status(400).json({ msg: "Please fill in all fields" });
      }
      if (sleepWellGoals.length == 1) {
        score += 1;
      } else if (sleepWellGoals.length == 2) {
        score += 2;
      } else if (sleepWellGoals.length == 3) {
        score += 3;
      }
      if (strugglePeriod == 1) {
        score += 3;
      } else if (strugglePeriod == 2) {
        score += 2;
      } else if (strugglePeriod == 3) {
        score += 1;
      }

      if (sleepHours < 6) {
        score += 1;
      } else if (sleepHours >= 6 && sleepHours <= 8) {
        score += 2;
      } else if (sleepHours > 8) {
        score += 1;
      }

      let sleepWellGoalsScore = 0;

      if (score >= 5) {
        sleepWellGoalsScore = 100;
      } else if (score >= 4) {
        sleepWellGoalsScore = 80;
      } else if (score >= 3) {
        sleepWellGoalsScore = 60;
      } else if (score >= 2) {
        sleepWellGoalsScore = 40;
      } else if (score >= 1) {
        sleepWellGoalsScore = 20;
      } else {
        sleepWellGoalsScore = 0;
      }

      const sleep = await Sleep.create({
        sleepWellGoals,
        strugglePeriod,
        goingBedTime,
        wakeUpTime,
        sleepHours,
        sleepWellGoalsScore,
        user: userName,
      });
      console.log(sleep);
      res.status(201).json({ msg: "Sleep data added", sleep });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err.message });
    }
  },

  async getSleepData(req, res) {
    const { userName } = req.body;
    try {
      const sleep = await Sleep.find({ user: userName });
      res.status(201).json({ msg: "Sleep data fetched", sleep });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userController;
