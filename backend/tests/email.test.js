const { sendOTP } = require("../services/emailService");

describe("Email Service Tests", () => {
  it("should send OTP email successfully", async () => {
    const testEmail = "saleh.naeem.cse@ulab.edu.bd"; // Use your email for testing
    const testOTP = "1234";

    const result = await sendOTP(testEmail, testOTP);
    expect(result).toBe(true);
  }, 10000); // Increased timeout for email sending

  it("should handle invalid email addresses", async () => {
    const invalidEmail = "invalid.email@nonexistent";
    const testOTP = "1234";

    const result = await sendOTP(invalidEmail, testOTP);
    expect(result).toBe(false);
  });
});
