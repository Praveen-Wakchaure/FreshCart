export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (mobileNumber, otp) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV] OTP for +91${mobileNumber}: ${otp}`);
    return;
  }

  // Production: send via Twilio
  try {
    const twilio = await import('twilio');
    const client = twilio.default(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.messages.create({
      body: `Your FreshCart OTP is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobileNumber}`,
    });
  } catch (error) {
    console.error('Twilio SMS error:', error.message);
    throw new Error('Failed to send OTP');
  }
};
