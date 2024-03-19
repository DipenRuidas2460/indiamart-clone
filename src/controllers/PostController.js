const moment = require("moment");
const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    if (req.person.userType !== 3) {
      const { title, contentDetails, businessId } = req.body;

      const currentDateTime = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");

      const newData = {
        title,
        contentDetails,
        businessId,
        createdAt: currentDateTime,
      };

      await Post.create(newData)
        .then(async (data) => {
          return res.status(201).json({
            status: 200,
            data: data,
            message: "Post Created Successfully!",
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

const getAllPost = async (req, res) => {
  try {
    const { page, pageSize, filterInput } = req.body;
    const filter = {};
    if (filterInput) {
      filter.title = {
        [Op.like]: `%${filterInput}%`,
      };
    }

    await Post.findAndCountAll({
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

const getPostByBusinessId = async (req, res) => {
  try {
    const { page, pageSize, businessId } = req.body;

    await Post.findAndCountAll({
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

const updatePost = async (req, res) => {
  try {
    if (req.person.userType === 2 || req.person.userType === 1) {
      let reqBody = req.body;
      const postData = await Post.findOne({
        where: { id: reqBody.postId },
      });
      const updateData = {};
      if (!postData) {
        return res.status(200).json({ status: 404, msg: "Data not Present!" });
      }

      if (reqBody.title) {
        updateData.title = reqBody.title;
      }

      if (reqBody.contentDetails) {
        updateData.contentDetails = reqBody.contentDetails;
      }

      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = moment()
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss");
      }

      await Post.update(updateData, {
        where: { id: reqBody.postId },
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

const deletePost = async (req, res) => {
  try {
    if (req.person.userType === 1 || req.person.userType === 2) {
      await Post.findOne({ where: { id: req.params.postId } })
        .then(async (info) => {
          if (info) {
            await Post.destroy({
              where: { id: req.params.postId },
            });

            return res.status(200).json({
              status: 200,
              message: "Data deleted successfully!",
            });
          } else {
            return res
              .status(200)
              .json({ status: 404, message: "Post data not found!" });
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
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getPostByBusinessId,
};
