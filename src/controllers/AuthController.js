const moment = require("moment");
const {
  checkPassword,
  encryptPassword,
  generateString,
} = require("../helpers/main");
const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const expiresIn = "1y";
const secretKey = process.env.APPTOKEN;
const path = require("path");
const { sendMail } = require("../helpers/sendMail");

const registerUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      city,
      state,
      address,
      zipCode,
      userType,
    } = req.body;

    let profilePhoto = null;
    const randomInRange = Math.floor(Math.random() * 10) + 1;
    if (req?.files?.photo) {
      profilePhoto = req.files.photo;
      const imagePath = path.join(
        __dirname,
        "../uploads/profileImage/",
        `${randomInRange}_profile_photo.jpg`
      );
      await profilePhoto.mv(imagePath);
    }

    const currentDateTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")

    if (email != "" || phone != "") {
      const findEmail = await User.findOne({
        where: { email: email },
      });

      const findPhoneNumber = await User.findOne({
        where: { phone: phone },
      });

      if (findEmail) {
        return res
          .status(200)
          .json({ status: 409, msg: "Email is already present!" });
      }

      if (findPhoneNumber) {
        return res.status(200).json({
          status: 409,
          msg: "Phone Number is already present!",
        });
      }
    }

    const passwrd = await encryptPassword(password);

    const newData = {
      name,
      email,
      password: passwrd,
      phone,
      city,
      state,
      address,
      zipCode,
      photo: profilePhoto ? `${randomInRange}_profile_photo.jpg` : null,
      userType: userType,
      createdAt: currentDateTime,
    };

    await User.create(newData)
      .then(async (userDetails) => {
        if (userDetails) {
          const {
            id,
            name,
            email,
            phone,
            photo,
            city,
            state,
            address,
            zipCode,
            userType,
          } = userDetails;

          const userInfo = {
            id,
            name,
            email,
            phone,
            photo: photo ? photo : null,
            city,
            state,
            address,
            zipCode,
            userType,
          };

          const mailData = {
            respMail: email,
            subject: "Welcome",
            text: `Hi, ${name}. Welcome to Business Social Platform.`,
          };
          await sendMail(mailData);

          return res.status(201).json({
            status: 200,
            data: userInfo,
            message:
              userType === 3
                ? "Customer registered successfully!"
                : userType === 2
                ? "Business User registered successfully!"
                : "Created Success",
          });
        } else {
          return res
            .status(200)
            .json({ status: 400, message: "User not created!" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(200)
          .json({ status: 400, message: "An Error Occured!" });
      });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(200).json({
        status: 401,
        message: "Please Provide Username and Password!",
      });
    }

    const user = await User.findOne({ where: { email: username } });

    // Check if User is available with the Username
    if (!user) {
      return res
        .status(200)
        .json({ status: 401, message: "Invalid Username, Please Try Again!" });
    }

    // Check the User Password with Given Password
    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        status: 401,
        message: "Incorrect Password, Please Try Again!",
      });
    }

    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      secretKey,
      { expiresIn: expiresIn }
    );

    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      photo: user.photo,
      address: user.address,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      guiId: user.guiId,
    };

    res.status(200).json({
      status: 200,
      token: token,
      userdata: data,
      message: "User Login Successfully",
    });
  } catch (error) {
    return res.status(200).json({ status: 500, message: error.message });
  }
};

const forgetPass = async (req, res) => {
  try {
    const { email } = req.body;

    const userDetails = await User.findOne({
      where: { email: email },
    });
    if (!userDetails) {
      return res.status(200).json({ status: 404, message: "No user found" });
    }

    const token = generateString(20);
    await User.update({ fpToken: token }, { where: { email: email } });

    const mailData = {
      respMail: email,
      subject: "Forget Password",
      text: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="styles.css" />
      <title>Static Template</title>
    </head>
    <body>
      <h3>Click this link for changing Password</h3>
      <p>${process.env.FRN_HOST}/resetpass/${token}</p>
    </body>
  </html>
  `,
    };
    await sendMail(mailData);

    return res.status(200).json({
      status: 200,
      token: token,
      message: "Check your email for reset link",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(200)
      .json({ status: 500, message: "Something went wrong" });
  }
};

const fpUpdatePass = async (req, res) => {
  try {
    let reqBody = req.body;

    const { token } = req.body;

    const updatePass = {};

    const userInfo = await User.findOne({ where: { fpToken: token } });
    if (!userInfo)
      return res
        .status(200)
        .json({ status: 400, message: "Wrong link or link expired!" });

    if (reqBody.password) {
      updatePass.password = await encryptPassword(reqBody.password);
    }

    const response = await User.update(updatePass, {
      where: { fpToken: token },
    });

    return res.status(201).json({
      status: response[0] === 0 ? 203 : 200,
      data: response,
      message:
        response[0] === 0
          ? "No Changes made"
          : "User Password changed successfully!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(200)
      .json({ status: 500, message: "Something went wrong" });
  }
};

module.exports = { loginUser, registerUser, forgetPass, fpUpdatePass };
