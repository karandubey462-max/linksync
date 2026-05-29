import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Check, User, Mail, Lock, Loader2, UserPlus, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { checkUsernameAvailability } from '../utils/usernameAvailability';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const normalized = username.trim().toLowerCase();
    if (!normalized) {
      setUsernameStatus({ checking: false, available: null, message: '' });
      return;
    }

    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(normalized)) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: 'Use 3-20 letters, numbers, or underscores.',
      });
      return;
    }

    setUsernameStatus({ checking: true, available: null, message: 'Checking username...' });
    const timeoutId = setTimeout(async () => {
      try {
        const response = await checkUsernameAvailability(normalized);
        setUsernameStatus({
          checking: false,
          available: response.available,
          message: response.message,
        });
      } catch {
        setUsernameStatus({
          checking: false,
          available: false,
          message: 'Could not check username right now.',
        });
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field check
    if (!name || !username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Username format check
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError('Username must be 3-20 characters and contain only letters, numbers, or underscores.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const availability = await checkUsernameAvailability(username.trim().toLowerCase());
    if (!availability.valid || !availability.available) {
      setError(availability.message || 'Username is not available.');
      return;
    }

    setLoading(true);
    const result = await signup(name, username.trim(), email.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        {/* Logo/Brand Icon */}
        <div className="mb-8 text-center">
          <Link to="/" className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
            <Sparkles className="h-7 w-7" />
          </Link>
          <Link to="/" className="mt-4 block font-display text-lg font-bold text-slate-200">
            LinkSync
          </Link>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Create your profile and save your links
          </p>
        </div>

        {/* Card Frame */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-500/10 p-4 border border-rose-500/20 text-rose-200 text-sm"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Full Name
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300"
                  placeholder="John Doe"
                  required
                />
              </div>
              {usernameStatus.message && (
                <p className={`mt-1.5 flex items-center gap-1.5 text-xs font-semibold ${
                  usernameStatus.available ? 'text-emerald-300' : usernameStatus.checking ? 'text-slate-300' : 'text-rose-300'
                }`}>
                  {usernameStatus.checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : usernameStatus.available ? <Check className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                  {usernameStatus.message}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Claim Username
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-cyan-300 font-semibold text-sm">
                  linksync.bio/
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-[96px] pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300"
                  placeholder="yourname"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300"
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 font-semibold text-slate-950 transition-all hover:bg-slate-100 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-6 text-center text-sm text-slate-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-semibold text-cyan-300 hover:text-cyan-200 hover:underline"
            >
              <span>Log in here</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
