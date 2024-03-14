const moment = require("moment");
const Business = require("../models/Business");

const createBusiness = async (req, res) => {
  try {
    const {
      businessName,
      businessDetails,
      email,
      phoneNo,
      pan,
      gstIn,
      website,
      address,
      city,
      state,
      zipCode,
      userId,
    } = req.body;

    const currentDateTime = moment()
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss");

    const newData = {
      businessName,
      businessDetails,
      email,
      phoneNo,
      pan,
      gstIn,
      website,
      address,
      city,
      state,
      zipCode,
      userId: req.person.userType === 1 ? userId : req.person.id,
      status: 1,
      createdAt: currentDateTime,
    };

    await Business.create(newData)
      .then(async (data) => {
        return res.status(201).json({
          status: 200,
          data: data,
          message: "Business Created successfully!",
        });
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

module.exports = { createBusiness };
