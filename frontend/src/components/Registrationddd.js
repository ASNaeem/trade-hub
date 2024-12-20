// import React, { useState } from 'react';
// import emailjs from 'emailjs-com';

// const Registration = () => {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [generatedOtp, setGeneratedOtp] = useState(null);
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);

//   // Function to generate a random 6-digit OTP
//   const generateOTP = () => {
//     const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
//     setGeneratedOtp(otp);  // Save generated OTP
//     return otp;
//   };

//   // Function to send OTP to the user's email using EmailJS
//   const sendOTPEmail = (userEmail, otp) => {
//     const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
//     const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
//     const userId = process.env.REACT_APP_EMAILJS_USER_ID;
//     console.log(serviceId);
//     console.log(templateId);
//     console.log(userId);
//     emailjs.send(serviceId, templateId, {
//       to_email: userEmail,
//       otp: otp,  // OTP to be sent in the email
//     }, userId)
//       .then(response => {
//         console.log('OTP sent successfully', response);
//         setIsOtpSent(true);  // OTP has been sent
//       })
//       .catch(err => {
//         console.error('Error sending OTP', err);
//       });
//   };

//   // Handle form submission for registration
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const generatedOtp = generateOTP();  // Generate OTP
//     sendOTPEmail(email, generatedOtp);  // Send OTP email
//   };

//   // Handle OTP verification
//   const handleOtpVerification = (e) => {
//     e.preventDefault();
//     if (parseInt(otp) === generatedOtp) {
//       setOtpVerified(true);  // OTP matched
//       alert('OTP verified successfully!');
//     } else {
//       alert('Invalid OTP, please try again.');
//     }
//   };

//   return (
//     <div className="registration-form">
//       {/* Registration Form */}
//       {!isOtpSent && !otpVerified ? (
//         <form onSubmit={handleSubmit}>
//           <h2>Register for Trade-Hub</h2>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             required
//           />
//           <button type="submit">Send OTP</button>
//         </form>
//       ) : null}

//       {/* OTP Verification Form */}
//       {isOtpSent && !otpVerified ? (
//         <form onSubmit={handleOtpVerification}>
//           <h2>Enter OTP</h2>
//           <input
//             type="number"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             placeholder="Enter OTP"
//             required
//           />
//           <button type="submit">Verify OTP</button>
//         </form>
//       ) : null}

//       {/* OTP Verified */}
//       {otpVerified ? (
//         <div>
//           <h2>Registration Successful!</h2>
//           <p>Welcome to Trade-Hub!</p>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default Registration;
