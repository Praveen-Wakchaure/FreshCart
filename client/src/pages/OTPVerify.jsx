import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { verifyOTP, sendOTP } from '../redux/slices/authSlice.js';
import { pageTransition } from '../animations/variants.js';

const OTPVerify = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, mobileNumber } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!mobileNumber) {
      navigate('/login');
    }
  }, [mobileNumber, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    const result = await dispatch(verifyOTP({ mobileNumber, otp: otpString }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Login successful!');
      if (!result.payload.isProfileComplete) {
        navigate('/complete-profile');
      } else {
        navigate('/');
      }
    } else {
      toast.error(result.payload || 'OTP verification failed');
    }
  };

  const handleResend = async () => {
    const result = await dispatch(sendOTP(mobileNumber));
    if (result.meta.requestStatus === 'fulfilled') {
      if (result.payload.devOTP) {
        toast(`OTP resent! Dev OTP: ${result.payload.devOTP}`, {
          icon: '🔑',
          duration: 10000,
          style: { background: '#333', color: '#fff' },
        });
      } else {
        toast.success('OTP resent!');
      }
      setOtp(['', '', '', '', '', '']);
    }
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-mango-50 to-leaf-50">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🔐</span>
          <h1 className="font-poppins text-2xl font-bold mt-4 text-gray-800">Verify OTP</h1>
          <p className="text-gray-500 mt-2">
            Enter the 6-digit code sent to +91 {mobileNumber}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:border-mango-500 focus:ring-2 focus:ring-mango-500/20 outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={otp.some((d) => !d) || loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={handleResend} className="text-sm text-mango-600 hover:underline">
            Resend OTP
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OTPVerify;
