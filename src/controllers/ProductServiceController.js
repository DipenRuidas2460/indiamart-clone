const moment = require("moment");
const ProductServices = require("../models/ProductServices");

const addProductOrService = async (req, res) => {
  try {
    if (req.person.userType !== 3) {
      const { name, description, businessId, type } = req.body;

      const currentDateTime = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");

      const newData = {
        name,
        description,
        businessId,
        type,
        createdAt: currentDateTime,
      };

      await ProductServices.create(newData)
        .then(async (data) => {
          return res.status(201).json({
            status: 200,
            data: data,
            message:
              type === 1
                ? "Product Created successfully!"
                : type === 2
                ? "Service Created Successfully!"
                : "crested success!",
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

const getAllProductService = async (req, res) => {
  try {
    const { page, pageSize, filterInput } = req.body;
    const filter = {};
    if (filterInput) {
      filter.name = {
        [Op.like]: `%${filterInput}%`,
      };
    }

    await ProductServices.findAndCountAll({
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
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({
      status: 500,
      message: "Internal Server Error!",
      messageInfo: error,
    });
  }
};

const getProductServiceByBusinessId = async (req, res) => {
  try {
    const { page, pageSize, businessId } = req.body;

    await ProductServices.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
      where: { businessId: businessId },
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
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({
      status: 500,
      message: "Internal Server Error!",
      messageInfo: error,
    });
  }
};

const updateProductOrService = async (req, res) => {
  try {
    if (req.person.userType === 2 || req.person.userType === 1) {
      let reqBody = req.body;
      const productServiceData = await ProductServices.findOne({
        where: { id: reqBody.proSerId },
      });
      const updateData = {};
      if (!productServiceData) {
        return res.status(200).json({ status: 404, msg: "Data not Present!" });
      }

      if (reqBody.name) {
        updateData.name = reqBody.name;
      }

      if (reqBody.description) {
        updateData.description = reqBody.description;
      }

      if (reqBody.type) {
        updateData.type = reqBody.type;
      }

      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = moment()
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss");
      }

      await ProductServices.update(updateData, {
        where: { id: reqBody.proSerId },
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

const deleteProductOrService = async (req, res) => {
  try {
    if (req.person.userType === 1 || req.person.userType === 2) {
      await ProductServices.findOne({ where: { id: req.params.proSerId } })
        .then(async (info) => {
          if (info) {
            await ProductServices.destroy({
              where: { id: req.params.proSerId },
            });

            return res.status(200).json({
              status: 200,
              message: "Data deleted successfully!",
            });
          } else {
            return res.status(200).json({
              status: 404,
              message: "Product or Service data not found!",
            });
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
  addProductOrService,
  updateProductOrService,
  getAllProductService,
  deleteProductOrService,
  getProductServiceByBusinessId,
};
