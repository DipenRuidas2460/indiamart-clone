const { checkPassword } = require("../helpers/main");
const User = require("../models/User");
const path = require("path");
const moment = require("moment");

const updateUser = async (req, res) => {
  try {
    let reqBody = req.body;
    const userData = await User.findOne({ where: { id: reqBody.id } });
    const updateData = {};
    if (!userData) {
      return res.status(200).json({ status: 404, msg: "Data not Present!" });
    }

    let updatedImage = null;
    const randomInRange = Math.floor(Math.random() * 10) + 1;
    const updatedPhotoName = `${randomInRange}_profile_photo.jpg`;
    if (req?.files?.photo) {
      updatedImage = req.files.photo;
      const imagePath = path.join(
        __dirname,
        "../uploads/profileImage/",
        `${userData.photo ? userData.photo : updatedPhotoName}`
      );
      await updatedImage.mv(imagePath);
    }

    if (reqBody.name) {
      updateData.name = reqBody.name;
    }

    if (reqBody.email) {
      updateData.email = reqBody.email;
    }

    if (reqBody.state) {
      updateData.state = reqBody.state;
    }

    if (reqBody.address) {
      updateData.address = reqBody.address;
    }

    if (reqBody.city) {
      updateData.city = reqBody.city;
    }

    if (reqBody.zipCode) {
      updateData.zipCode = reqBody.zipCode;
    }

    if (reqBody.phone) {
      updateData.phone = reqBody.phone;
    }

    if (reqBody.password) {
      updateData.password = await encryptPassword(reqBody.password);
    }

    if (updatedImage) {
      updateData.photo = userData.photo ? userData.photo : updatedPhotoName;
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");
    }

    await User.update(updateData, {
      where: { id: reqBody.id },
    })
      .then((response) => {
        return res.status(200).json({
          status: response[0] === 0 ? 203 : 200,
          message:
            response[0] === 0 ? "No Changes made!" : "Successfully Updated!",
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

const getUserByToken = async (req, res) => {
  try {
    const response = await User.findOne({
      where: { id: req.person.id },
      attributes: [
        "id",
        "name",
        "address",
        "email",
        "phone",
        "userType",
        "photo",
        "city",
        "state",
        "zipCode",
      ],
    });

    return res.status(200).json({
      status: 200,
      data: response,
      profileImage: `/assets/image/${response?.photo}`,
      message: response ? "Successfully fetch data" : "User Not Present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(200)
      .json({ status: 500, message: "Something went wrong" });
  }
};

const getAllUsersByQuery = async (req, res) => {
  try {
    const { page, pageSize } = req.body;
    const keyword = req.query.search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${req.query.search}%` } },
            { email: { [Op.like]: `%${req.query.search}%` } },
          ],
        }
      : {};

    await User.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
      where: {
        ...keyword,
        id: { [Op.not]: req.person.id },
      },
      attributes: [
        "id",
        "name",
        "address",
        "email",
        "phone",
        "userType",
        "photo",
        "city",
        "state",
        "zipCode",
      ],
    })
      .then(({ count, rows }) => {
        return res.status(200).json({
          status: 200,
          data: rows,
          pagination: {
            totalItems: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize: pageSize,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(200)
          .json({ status: 400, message: "An Error Occured!" });
      });
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({
      status: 500,
      message: "Internal Server Error!",
      messageInfo: error,
    });
  }
};

const updateSelfPassword = async (req, res) => {
  try {
    const response = await User.findOne({ where: { id: req.person.id } });

    const { oldPassword, password } = req.body;

    if (!response) {
      return res.status(200).json({
        status: 404,
        message: "User not Found, Please Register first!",
      });
    }

    if (!oldPassword || !password) {
      return res
        .status(200)
        .json({ status: 400, message: "Please add Old and new password!" });
    }

    const isPassMatch = await checkPassword(
      oldPassword.trim(),
      response.password
    );

    if (response && isPassMatch) {
      response.password = password;
      await response.save();
      return res.status(200).send({
        status: 200,
        data: response,
        message: "password changed successfully!",
      });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "oldPassword is incorrect!!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findOne({ where: { id: req.params.id } })
      .then(async (userData) => {
        if (userData) {
          await User.destroy({
            where: { id: req.params.id },
          });

          return res.status(200).json({
            status: 200,
            message: "Data deleted successfully!",
          });
        } else {
          return res
            .status(200)
            .json({ status: 404, message: "User data not found!" });
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
      .json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getUserByToken,
  updateSelfPassword,
  getAllUsersByQuery,
};
