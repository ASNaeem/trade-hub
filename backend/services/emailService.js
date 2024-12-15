const emailjs = require("emailjs-com");
const { serviceID, templateID, userID } = require("../config/email"); // Import EmailJS config

const sendOTP = async (email, otp) => {
  try {
    const templateParams = {
      to_email: email, // Email recipient
      otp: otp, // OTP value
    };

    // Send the OTP via EmailJS
    const response = await emailjs.send(serviceID, templateID, templateParams, userID);
    console.log("OTP sent successfully:", response);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

module.exports = { sendOTP };
