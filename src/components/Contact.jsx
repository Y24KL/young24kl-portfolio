import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowUpRight, Check, Loader2, Send } from 'lucide-react';
import { Magnetic } from './Tilt';
import { EASE, inView, reveal, stagger } from '../lib/motion';
import { FORMSPREE_ENDPOINT, INSTAGRAM_URL } from '../data/content';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Please tell us your name.';
  if (!email.trim()) errors.email = 'We need an email address to reply to.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'That email address doesn’t look right.';
  if (message.trim().length < 10) errors.message = 'A few words about your project help us prepare (10+ characters).';
  return errors;
}

const Field = ({ id, label, error, as = 'input', ...props }) => {
  const Comp = as;
  return (
    <div className="relative">
      <Comp
        id={id}
        name={id}
        placeholder=" "
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field peer ${as === 'textarea' ? 'min-h-40 resize-y pt-7' : ''}`}
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-dim transition-all duration-200 peer-placeholder-shown:top-[1.05rem] peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-gold-pale"
      >
        {label}
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-[#f3a698]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
};

const Contact = () => {
  const formRef = useRef(null);
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState('');

  const update = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (touched[e.target.name]) setErrors(validate(next));
  };
  const blur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(values));
  };
  const shown = (key) => (touched[key] ? errors[key] : undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(found).length) {
      formRef.current.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setStatus('submitting');
    setServerError('');
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(formRef.current),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        setStatus('success');
        setValues({ name: '', email: '', message: '' });
        setTouched({});
        return;
      }
      const body = await response.json().catch(() => ({}));
      setServerError(body?.errors?.map((x) => x.message).join(' ') || 'There was a problem submitting your message. Please try again.');
      setStatus('error');
    } catch {
      setServerError('We couldn’t reach the server. Check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[36rem] w-[36rem] rounded-full bg-gold/[0.07] blur-[140px]" />
      <div className="container-x relative grid gap-16 lg:grid-cols-12">
        <motion.div variants={stagger(0.1)} {...inView} className="lg:col-span-5">
          <motion.p variants={reveal} className="eyebrow mb-6">Book a session</motion.p>
          <motion.h2
            variants={reveal}
            id="contact-title"
            className="font-display text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-bone"
          >
            Let’s create <em className="font-medium italic text-gold-light">together.</em>
          </motion.h2>
          <motion.p variants={reveal} className="mt-8 max-w-md text-lg leading-relaxed text-mist">
            Ready to start your next masterpiece? Tell us about your event, shoot or project and
            we’ll get back to you within 24 hours.
          </motion.p>
          <motion.a
            variants={reveal}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-3 border-b border-white/15 pb-2 text-bone transition-colors hover:border-gold-pale hover:text-gold-light"
          >
            Prefer DMs? @24klvisuals on Instagram
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1, ease: EASE }}
          className="lg:col-span-6 lg:col-start-7"
        >
          <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-6 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] backdrop-blur-xl md:p-10" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[26rem] flex-col items-center justify-center text-center"
                >
                  <span className="mb-8 grid h-16 w-16 place-items-center rounded-full bg-gold-light text-ink">
                    <Check className="h-7 w-7" strokeWidth={2.5} />
                  </span>
                  <h3 className="font-display text-3xl font-semibold text-bone">Message received</h3>
                  <p className="mt-4 max-w-sm text-mist">
                    Thank you for reaching out. Our team will get back to you within the next 24 hours.
                  </p>
                  <button type="button" onClick={() => setStatus('idle')} className="btn btn-ghost mt-10">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field id="name" label="Your name" type="text" autoComplete="name" value={values.name} onChange={update} onBlur={blur} error={shown('name')} required />
                    <Field id="email" label="Your email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={update} onBlur={blur} error={shown('email')} required />
                  </div>
                  <Field id="message" as="textarea" label="Tell us about your project" rows={6} value={values.message} onChange={update} onBlur={blur} error={shown('message')} required />

                  {status === 'error' && (
                    <p role="alert" className="flex items-start gap-2 rounded-xl border border-[#f08b7a]/30 bg-[#f08b7a]/[0.08] p-4 text-sm text-[#f3a698]">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {serverError}
                    </p>
                  )}

                  <Magnetic className="w-full" strength={0.12}>
                    <button type="submit" disabled={status === 'submitting'} className="btn btn-gold w-full !min-h-14">
                      {status === 'submitting' ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                      ) : (
                        <>Send message <Send className="h-4 w-4" /></>
                      )}
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
