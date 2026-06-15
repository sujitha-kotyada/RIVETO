import React from 'react';
import Footer from '../components/Footer';
import {
  FaShieldHalved,
  FaDatabase,
  FaLock,
  FaCookieBite,
  FaUsers,
  FaFileContract,
  FaEnvelope,
} from 'react-icons/fa6';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <FaDatabase />,
      title: 'Information We Collect',
      description:
        'We collect information you provide directly, such as your name, email address, phone number, shipping address, and account details.',
    },
    {
      icon: <FaLock />,
      title: 'How We Protect Your Data',
      description:
        'We use industry-standard security measures to safeguard your personal information against unauthorized access, disclosure, or misuse.',
    },
    {
      icon: <FaCookieBite />,
      title: 'Cookies & Tracking',
      description:
        'Cookies help improve your browsing experience, remember preferences, and provide analytics that help us improve our services.',
    },
    {
      icon: <FaUsers />,
      title: 'Third-Party Services',
      description:
        'We may share necessary information with trusted partners such as payment gateways, delivery providers, and analytics services.',
    },
    {
      icon: <FaFileContract />,
      title: 'Your Rights',
      description:
        'You may request access, correction, or deletion of your personal data by contacting us through our support channels.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-cyan-500 p-4 rounded-2xl">
              <FaShieldHalved className="text-4xl text-white" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Last updated: June 2026
              </p>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Your privacy matters to us. This Privacy Policy explains how we
            collect, use, store, and protect your information while using our
            platform.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-cyan-500 text-2xl">
                  {section.icon}
                </div>

                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {section.title}
                </h2>
              </div>

              <p className="text-slate-600 dark:text-slate-300">
                {section.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 bg-cyan-500 text-white rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <FaEnvelope className="text-2xl" />
            <h2 className="text-2xl font-bold">Contact Us</h2>
          </div>

          <p className="mb-4">
            If you have questions about this Privacy Policy, feel free to
            contact us.
          </p>

          <a
            href="mailto:support@yourstore.com"
            className="inline-block bg-white text-cyan-600 font-semibold px-5 py-3 rounded-xl"
          >
            support@yourstore.com
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;