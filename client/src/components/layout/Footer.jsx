import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🥭</span>
              <span className="font-poppins font-bold text-xl text-white">
                Fresh<span className="text-mango-500">Cart</span>
              </span>
            </Link>
            <p className="text-sm mb-4">
              Premium Indian mangoes delivered fresh to your doorstep. From farm to table, we ensure the best quality mangoes for you and your family.
            </p>
            <div className="flex space-x-3">
              {[FaFacebook, FaInstagram, FaTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mango-500 transition-colors"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop', path: '/shop' },
                { name: 'Reviews', path: '/reviews' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-mango-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Varieties */}
          <div>
            <h3 className="font-poppins font-semibold text-white mb-4">Our Mangoes</h3>
            <ul className="space-y-2 text-sm">
              {['Alphonso', 'Kesar', 'Dasheri', 'Langra', 'Totapuri', 'Hapus', 'Chausa', 'Badami'].map(
                (v) => (
                  <li key={v}>
                    <Link to="/shop" className="hover:text-mango-500 transition-colors">
                      {v}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-poppins font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 123 Mango Lane, Mumbai, Maharashtra 400001</li>
              <li>📞 +91 98765 43210</li>
              <li>✉️ hello@freshcart.com</li>
              <li>🕐 Mon - Sat: 9 AM - 7 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} FreshCart. All rights reserved. Made with 🥭</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
