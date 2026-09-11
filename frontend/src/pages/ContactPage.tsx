import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactApi } from '../services/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitContactApi(formData);
      setStatus('success');
      setFeedback('Your message has been received! Our support team in Peshawar will contact you within 24 hours.');
      setFormData({ fullName: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
      setFeedback('Unable to send message right now. Please call us directly at 03351950058.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
    >
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
          Contact <span className="text-cyan-neon">Sarhad Electrics</span>
        </h1>
        <p className="text-sm sm:text-base text-textMuted">
          Have an inquiry regarding bulk industrial orders, component compatibility, or warranty claims?
          Reach out directly or visit our physical showroom in Peshawar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info & Showroom Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-surface/40 border border-surface-border space-y-6">
            <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
              Store & Showroom Headquarters
            </h3>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Physical Location</h4>
                  <p className="text-textMuted mt-0.5 leading-relaxed">
                    Shop No. 57 Raheem Plaza, Board Bazar, University Road, Peshawar, Khyber Pakhtunkhwa, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Direct Phone / WhatsApp</h4>
                  <a
                    href="tel:03351950058"
                    className="text-cyan-neon font-mono font-semibold hover:underline block mt-0.5"
                  >
                    03351950058
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Official Email</h4>
                  <a
                    href="mailto:info@sarhadelectrics.com"
                    className="text-cyan-neon hover:underline block mt-0.5"
                  >
                    info@sarhadelectrics.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Operating Hours</h4>
                  <p className="text-textMuted mt-0.5">
                    Monday - Saturday: 9:00 AM – 9:00 PM (PKT)
                    <br />
                    Sunday: Closed / Online inquiries processed Monday
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-surface-card border border-surface-border shadow-glass">
            <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">
              Send Us A Message
            </h3>
            <p className="text-xs text-textMuted mb-6">
              Complete the fields below and our engineering team will get back to you promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-textMuted block mb-1.5 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/50 focus:outline-hidden focus:border-cyan-neon transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-textMuted block mb-1.5 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tariq@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/50 focus:outline-hidden focus:border-cyan-neon transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-textMuted block mb-1.5 font-medium">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Inquiry regarding Cordless Drill Warranty / Bulk Smart Lighting"
                  className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/50 focus:outline-hidden focus:border-cyan-neon transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-textMuted block mb-1.5 font-medium">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your technical requirement or inquiry in detail..."
                  className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/50 focus:outline-hidden focus:border-cyan-neon transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Message</span>
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

