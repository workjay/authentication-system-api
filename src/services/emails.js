const { transporter } = require("../config/email");
const ejs = require("ejs");
const path = require("path");

/**
 * This function send account verification email to user
 * @param {Object} user
 * @param {String} token
 * @returns boolean value
 */
exports.sendAccountVerificationEmail = async (user, token) => {
  try {
    let html = await ejs.renderFile(
      path.join(__dirname, "../templates/account-verification-email.ejs"),
      {
        verificationURL: `${process.env.APP_BASE_URL}/account-verification?token=${token}`,
        user,
      }
    );
    let res = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user?.email,
      subject: `Account Verification Email`,
      html,
    });
    if (res.messageId) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(`sendAccountVerificationEmail => `, error);
    return false;
  }
};
