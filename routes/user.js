const express = require("express");
const router = express.Router();

const User = require("../models/User");

const uid2 = require("uid2"); // package qui sert à générer des string aléatoires

const SHA256 = require("crypto-js/sha256"); // ce qui sert à encrypter une string

const encBase64 = require("crypto-js/enc-Base64"); // sert à transformer l'encryptage en string

router.post("/user/signup", async (req, res) => {
  try {
    const salt = uid2(16);

    const hash = SHA256(req.body.password + salt).toString(encBase64);

    const token = uid2(64);

    const users = await User.findOne({ email: req.body.email });

    if (users) {
      return res
        .status(400)
        .json({ message: "Cette adresse email est déjà utilisée" });
    }

    if (!req.body.username) {
      return res.status(400).json({
        message:
          "Un nom d'utilisateur est nécessaire à la création de votre compte",
      });
    }

    const newUser = await new User({
      email: req.body.email,
      account: {
        username: req.body.username,
      },
      token: token,
      hash: hash,
      salt: salt,
      newsletter: req.body.newsletter,
    });
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      token: newUser.token,
      account: {
        username: newUser.account.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const users = await User.findOne({ email: req.body.email });

    if (users === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const hash2 = SHA256(req.body.password + users.salt).toString(encBase64);

    if (hash2 !== users.hash) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({
      _id: users._id,
      token: users.token,
      account: {
        username: users.account.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
