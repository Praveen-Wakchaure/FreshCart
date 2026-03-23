import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { pageTransition } from '../animations/variants.js';
import api from '../redux/api.js';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message');
    }
    setLoading(false);
  };

  const infoCards = [
    { icon: FiMapPin, title: 'Visit Us', desc: '123 Mango Lane, Mumbai, Maharashtra 400001' },
    { icon: FiPhone, title: 'Call Us', desc: '+91 98765 43210' },
    { icon: FiMail, title: 'Email Us', desc: 'hello@freshcart.com' },
  ];

  return (
    <motion.div {...pageTransition} className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-poppins text-3xl md:text-4xl font-bold text-gray-900">
            Get in <span className="text-mango-600">Touch</span>
          </h1>
          <p className="text-gray-500 mt-3">We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-field h-32 resize-none"
                placeholder="How can we help?"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* Info */}
          <div className="space-y-6">
            {infoCards.map((card, i) => (
              <div key={i} className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-mango-50 rounded-xl flex items-center justify-center">
                  <card.icon className="text-xl text-mango-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.desc}</p>
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="card overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d6481ce!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1703236546354!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="FreshCart Location"
              />
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 flex items-center gap-4 hover:bg-green-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaWhatsapp className="text-xl text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Chat on WhatsApp</h3>
                <p className="text-sm text-gray-500">Quick response guaranteed</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
