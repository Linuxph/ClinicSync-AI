import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  FileText,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import Lenis from 'lenis';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: 'easeOut' },
  },
};

const popIn: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

const scrollViewport = { once: false, amount: 0.28, margin: '-8% 0px -8% 0px' };

const steps = [
  {
    icon: FileText,
    step: '01',
    title: 'Paste Raw Notes',
    desc: 'Just type or dictate the visit summary exactly as the dentist said it. No formatting required.',
  },
  {
    icon: Sparkles,
    step: '02',
    title: 'AI Extraction',
    desc: 'Our engine instantly structures the data into Subjective, Objective, Assessment, and Plan.',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Export & Bill',
    desc: 'Copy your perfect notes and accurate ADA codes directly into your EHR system.',
  },
];

const trustItems = [
  {
    icon: Lock,
    title: 'Zero Data Retention',
    desc: 'Patient notes are processed in memory and immediately discarded. We never store, log, or retain any PHI on our servers.',
    highlight: true,
  },
  {
    icon: ShieldCheck,
    title: 'HIPAA-Friendly Architecture',
    desc: 'Our infrastructure is designed with HIPAA best practices. All data in transit is encrypted with TLS 1.3.',
    highlight: true,
  },
  {
    icon: Sparkles,
    title: 'Never Trained on Your Data',
    desc: 'Your patient notes are never used to train or fine-tune AI models. What goes in, stays private.',
    highlight: false,
  },
  {
    icon: Zap,
    title: 'Sub-5 Second Processing',
    desc: 'From paste to perfect SOAP note in under 5 seconds. Designed for the fast pace of a busy dental office.',
    highlight: false,
  },
  {
    icon: FileText,
    title: 'ADA Code Accuracy',
    desc: 'Trained on the full ADA CDT code library. Extracts procedure codes with clinical precision.',
    highlight: false,
  },
  {
    icon: ChevronRight,
    title: 'EHR Compatible',
    desc: 'Copy-paste ready output works with Dentrix, Eaglesoft, Open Dental, and any other EHR system.',
    highlight: false,
  },
];

const stats = [
  { value: '< 5s', label: 'Avg. processing time' },
  { value: '4,000+', label: 'ADA CDT codes covered' },
  { value: '100%', label: 'PHI never stored' },
  { value: 'HIPAA', label: 'Friendly architecture' },
];

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailBottom, setEmailBottom] = useState('');
  const [submittedBottom, setSubmittedBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingBottom, setLoadingBottom] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroGlowY = useTransform(scrollYProgress, [0, 0.3], [0, 120]);
  const heroPreviewY = useTransform(scrollYProgress, [0, 0.35], [0, -70]);
  const heroPreviewScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.96]);

  // Get Google Apps Script URL from environment variables
  const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL
    ?.trim()
    .replace(/^"(.*)"$/, '$1')
    .replace(/^'(.*)'$/, '$1');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let animationFrame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };

    animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  const sendToGoogleSheet = async (emailValue: string) => {
    if (!GOOGLE_SHEET_URL) {
      console.error('Missing VITE_GOOGLE_SHEET_URL environment variable');
      return false;
    }

    try {
      const timestamp = new Date().toISOString();
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          email: emailValue,
          timestamp: timestamp,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => 'Unable to read response body');
        console.error('Google Sheet request failed:', response.status, response.statusText, text);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving to sheet:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      await sendToGoogleSheet(email);
      setSubmitted(true);
      setEmail('');
      setLoading(false);
    }
  };

  const handleSubmitBottom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailBottom) {
      setLoadingBottom(true);
      await sendToGoogleSheet(emailBottom);
      setSubmittedBottom(true);
      setEmailBottom('');
      setLoadingBottom(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans antialiased">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00B4FF] flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-white tracking-tight text-lg">ClinicSync AI</span>
          </motion.div>
          {/* <motion.a
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            href="#beta"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block"
          >
            Join Beta
          </motion.a> */}
        </div>
      </motion.nav>

      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <motion.div
          style={{ y: heroGlowY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#00B4FF]/10 blur-[120px] pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [0, 18, -10, 0], y: [0, -16, 8, 0] }}
          transition={{ opacity: { duration: 1.5, delay: 0.2 }, x: { duration: 11, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 11, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute top-20 left-1/3 w-[400px] h-[400px] rounded-full bg-[#0066FF]/8 blur-[100px] pointer-events-none"
        />

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative max-w-4xl mx-auto text-center">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 border border-[#00B4FF]/30 bg-[#00B4FF]/5 text-[#00B4FF] text-xs font-medium px-4 py-1.5 rounded-full mb-8">
            <Zap className="w-3 h-3" />
            HIPAA-Friendly · Built for Dental Offices
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white mb-6">
            Stop Wasting Hours on <span className="text-[#00B4FF]">ADA Claims.</span>
            <br />
            Get AI-Generated SOAP Notes in Seconds.
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Paste your raw, messy patient notes. Our HIPAA-compliant AI instantly formats them into
            perfect SOAP charts and extracts the exact ADA billing codes you need.
          </motion.p>

          <motion.form variants={fadeInUp} id="beta" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            {submitted ? (
              <div className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#00B4FF]/10 border border-[#00B4FF]/30 text-[#00B4FF] font-medium">
                <CheckCircle className="w-5 h-5" />
                You're on the list! We'll be in touch.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@dentaloffice.com"
                  className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00B4FF]/60 focus:bg-white/8 transition-all text-sm"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00B4FF] hover:bg-[#00C8FF] text-white font-semibold text-sm transition-all shadow-lg shadow-[#00B4FF]/25 hover:shadow-[#00B4FF]/40 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Join the Exclusive Beta'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </motion.form>
          <motion.p variants={fadeInUp} className="text-xs text-white/30 mt-4">
            No credit card required. Limited spots available.
          </motion.p>
        </motion.div>

        <motion.div style={{ y: heroPreviewY, scale: heroPreviewScale }} className="relative max-w-3xl mx-auto mt-20">
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#030712] z-10 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-2xl border border-white/10 bg-[#0A0F1E] overflow-hidden shadow-2xl shadow-black/60"
          >
            <div className="border-b border-white/5 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="ml-3 text-xs text-white/20 font-mono">clinicsync.ai / generate</span>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Raw Input</p>
                <div className="rounded-xl bg-black/40 border border-white/5 p-4 text-xs text-white/50 leading-relaxed font-mono">
                  pt came in complaining about upper left molar pain 3 days. sensitive to cold. xray shows
                  small cavity on #14 mesial. cleaning done, discussed filling options...
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#00B4FF]/80 uppercase tracking-widest">SOAP Output</p>
                <div className="rounded-xl bg-[#00B4FF]/5 border border-[#00B4FF]/15 p-4 text-xs leading-relaxed space-y-2">
                  {[
                    ['S:', 'Patient reports 3-day upper left molar pain, cold sensitivity.'],
                    ['O:', 'Radiograph reveals mesial caries on tooth #14.'],
                    ['A:', 'Dental caries, tooth #14. ADA Code: D2140'],
                    ['P:', 'Schedule amalgam restoration, patient counseled.'],
                  ].map(([label, text], index) => (
                    <motion.p
                      key={label}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 1 + index * 0.16 }}
                    >
                      <span className="text-[#00B4FF] font-semibold">{label}</span>{' '}
                      <span className="text-white/70">
                        {label === 'A:' ? (
                          <>
                            Dental caries, tooth #14. ADA Code:{' '}
                            <span className="text-[#00FF94] font-mono">D2140</span>
                          </>
                        ) : (
                          text
                        )}
                      </span>
                    </motion.p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={scrollViewport} className="py-24 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer} className="max-w-5xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest text-[#00B4FF] uppercase mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Three steps. Zero friction.</h2>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={scrollViewport}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="hidden md:block origin-center absolute top-10 left-[calc(16.66%+16px)] right-[calc(16.66%+16px)] h-px bg-gradient-to-r from-transparent via-[#00B4FF]/30 to-transparent"
            />

            {steps.map(({ icon: Icon, step, title, desc }) => (
              <motion.div
                key={step}
                variants={popIn}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#00B4FF]/20 p-6 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#00B4FF]/10 border border-[#00B4FF]/20 flex items-center justify-center group-hover:bg-[#00B4FF]/15 transition-colors">
                    <Icon className="w-5 h-5 text-[#00B4FF]" />
                  </div>
                  <span className="text-4xl font-bold text-white/5 font-mono">{step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={scrollViewport} className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00B4FF]/3 to-transparent pointer-events-none" />
        <motion.div initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer} className="max-w-5xl mx-auto relative">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest text-[#00B4FF] uppercase mb-3">Why ClinicSync AI</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Built for trust. Engineered for compliance.</h2>
            <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
              We know you're responsible for your patients' most sensitive data. We built ClinicSync AI
              from the ground up with that responsibility in mind.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trustItems.map(({ icon: Icon, title, desc, highlight }) => (
              <motion.div
                key={title}
                variants={popIn}
                whileHover={{ y: -7, scale: 1.02 }}
                className={`rounded-2xl border p-6 transition-all duration-300 ${
                  highlight
                    ? 'border-[#00B4FF]/25 bg-[#00B4FF]/5 hover:bg-[#00B4FF]/8'
                    : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${highlight ? 'bg-[#00B4FF]/15' : 'bg-white/5'}`}>
                  <Icon className={`w-5 h-5 ${highlight ? 'text-[#00B4FF]' : 'text-white/50'}`} />
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={scrollViewport} className="py-16 px-6 border-y border-white/5">
        <motion.div initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <motion.div key={label} variants={popIn} whileHover={{ y: -4, scale: 1.05 }}>
                <div className="text-2xl sm:text-3xl font-bold text-[#00B4FF] mb-1">{value}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={scrollViewport} className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            animate={{ x: [0, -14, 10, 0], y: [0, 12, -10, 0] }}
            viewport={scrollViewport}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#00B4FF]/8 blur-[100px]"
          />
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer} className="relative max-w-2xl mx-auto text-center">
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to reclaim your time?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white/50 mb-10 text-base leading-relaxed">
            Join dental office managers already on the beta waitlist. Be first to experience
            AI-powered SOAP notes and ADA billing code extraction.
          </motion.p>
          <motion.form variants={fadeInUp} onSubmit={handleSubmitBottom} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            {submitted ? (
              <div className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#00B4FF]/10 border border-[#00B4FF]/30 text-[#00B4FF] font-medium text-sm">
                <CheckCircle className="w-4 h-4" />
                You're on the list!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={emailBottom}
                  onChange={(e) => setEmailBottom(e.target.value)}
                  placeholder="your@dentaloffice.com"
                  className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00B4FF]/60 transition-all text-sm"
                  disabled={loadingBottom}
                />
                <button
                  type="submit"
                  disabled={loadingBottom}
                  className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00B4FF] hover:bg-[#00C8FF] text-white font-semibold text-sm transition-all shadow-lg shadow-[#00B4FF]/25 hover:shadow-[#00B4FF]/40 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingBottom ? 'Saving...' : 'Request Demo'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </motion.form>
        </motion.div>
      </motion.section>

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#00B4FF]/20 flex items-center justify-center">
              <Activity className="w-3 h-3 text-[#00B4FF]" strokeWidth={2.5} />
            </div>
            <span>ClinicSync AI &copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-white/20 text-center sm:text-right max-w-xs">
            ClinicSync AI is a productivity tool. It does not constitute medical or legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
