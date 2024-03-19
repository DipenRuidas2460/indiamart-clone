const moment = require("moment");
const Business = require("../models/Business");

const createBusiness = async (req, res) => {
  try {
    if (req.person.userType !== 3) {
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
        .then((data) => {
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
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
};

const getBusinessByToken = async (req, res) => {
  try {
    const response = await Business.findOne({
      where: { userId: req.person.id },
    });

    return res.status(200).json({
      status: 200,
      data: response,
      message: response ? "Successfully fetch data" : "Data not found!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
};

const getAllBusinesses = async (req, res) => {
  try {
    if (req.person.userType === 1) {
      const { page, pageSize, filterInput } = req.body;
      const filter = {};
      if (filterInput) {
        filter.businessName = {
          [Op.like]: `%${filterInput}%`,
        };
      }

      await Business.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: Number(pageSize),
        where: filter,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
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
    }
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({
      status: 500,
      message: "Internal Server Error!",
      messageInfo: error,
    });
  }
};

const updateBusiness = async (req, res) => {
  try {
    if (req.person.userType === 2 || req.person.userType === 1) {
      let reqBody = req.body;
      const businessData = await Business.findOne({
        where: { id: reqBody.businessId },
      });
      const updateData = {};
      if (!businessData) {
        return res.status(200).json({ status: 404, msg: "Data not Present!" });
      }

      if (reqBody.businessName) {
        updateData.businessName = reqBody.businessName;
      }

      if (reqBody.businessDetails) {
        updateData.businessDetails = reqBody.businessDetails;
      }

      if (reqBody.pan) {
        updateData.pan = reqBody.pan;
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

      if (reqBody.phoneNo) {
        updateData.phoneNo = reqBody.phoneNo;
      }

      if (reqBody.state) {
        updateData.state = reqBody.state;
      }

      if (reqBody.email) {
        updateData.email = reqBody.email;
      }

      if (reqBody.status) {
        updateData.status = reqBody.status;
      }

      if (reqBody.gstIn) {
        updateData.gstIn = reqBody.gstIn;
      }

      if (reqBody.website) {
        updateData.website = reqBody.website;
      }

      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = moment()
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss");
      }

      await Business.update(updateData, {
        where: { id: reqBody.businessId },
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
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
};

const deleteBusiness = async (req, res) => {
  try {
    if (req.person.userType !== 3) {
      await Business.findOne({ where: { id: req.params.businessId } })
        .then(async (info) => {
          if (info) {
            await Business.destroy({
              where: { id: req.params.businessId },
            });

            return res.status(200).json({
              status: 200,
              message: "Data deleted successfully!",
            });
          } else {
            return res
              .status(200)
              .json({ status: 404, message: "Business data not found!" });
          }
        })

        .catch((err) => {
          console.log(err);
          return res
            .status(200)
            .json({ status: 400, message: "An Error Occured!" });
        });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = {
  createBusiness,
  getAllBusinesses,
  updateBusiness,
  getBusinessByToken,
  deleteBusiness,
};
