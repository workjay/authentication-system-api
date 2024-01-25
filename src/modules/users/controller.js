const { generateToken } = require("../../helpers");
const { sendAccountVerificationEmail } = require("../../services/emails");
const Users = require("./model");

exports.signup = async (req, res, next) => {
  try {
    let user = await Users.create(req.body);
    if (!user) {
      return res.status(422).json({
        status: "0",
        message: `Something went wrong! Please try after sometime.`,
      });
    }
    user = user?.toJSON();
    let token = generateToken({ id: user?.id });
    let sendMail = await sendAccountVerificationEmail(user, token);
    if (!sendMail) {
      return res.status(201).json({
        status: "1",
        message: "Your account has been created successfully.",
      });
    }
    res.status(201).json({
      status: "1",
      message:
        "Your account has been created successfully. Please check your mail box for account verification.",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    let user = await Users.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(422).json({
        status: "0",
        message: "Invalid email or password!",
      });
    }
    if (user?.getDataValue("role") !== role) {
      return res.status(400).json({
        status: "0",
        message: "You are not allowed to login from here.",
      });
    }
    if (!user.isValidPassword(password)) {
      return res.status(422).json({
        status: "0",
        message: "Invalid email or password!",
      });
    }
    user = user.toJSON();
    let token = generateToken({ id: user?.id });
    if (!user.is_verified) {
      let sendMail = await sendAccountVerificationEmail(user, token);
      if (sendMail) {
        return res.status(400).json({
          status: "0",
          message:
            "Account is not verified. Please check your mail box for email verification.",
        });
      }
      return res.status(400).json({
        status: "0",
        message:
          "Account is not verified. We are not able to send account verification email. Please try after sometime.",
      });
    }
    res.status(200).json({
      status: "1",
      message: "Login successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyAccount = async (req, res, next) => {
  try {
    let user = await Users.findByPk(req.user_id);
    if (!user) {
      return res.status(400).json({
        status: "0",
        message: "Unauthorized link.",
      });
    }
    user = user?.toJSON();
    let isUpdate = await Users.update(
      { is_verified: true },
      {
        where: {
          id: user?.id,
        },
      }
    );
    if (isUpdate[0]) {
      return res.status(200).json({
        status: "1",
        message: "Your account verified successfully.",
      });
    }
    res.status(200).json({
      status: "0",
      message:
        "Something went wrong! Your account not verified. Please try after sometime.",
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let user = await Users.findByPk(req.user_id, {
      attributes: ["id", "first_name", "last_name", "email", "is_verified"],
    });
    if (!user) {
      return res.status(404).json({
        status: "0",
        message: "User not found!",
      });
    }
    res.status(200).json({
      status: "1",
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
