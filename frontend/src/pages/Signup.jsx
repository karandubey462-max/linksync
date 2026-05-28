import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      {/* Decorative Blur Spheres */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-pink-600 opacity-20 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-600 opacity-20 blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        {/* Logo/Brand Icon */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Create your profile and save your links
          </p>
        </div>

        {/* Card Frame */}
        <div className="glass-dark rounded-3xl p-8 shadow-2xl">
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
                  className="w-full rounded-2xl bg-slate-900/50 border border-slate-800 py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Claim Username
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-indigo-400 font-semibold text-sm">
                  linksync.bio/
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  className="w-full rounded-2xl bg-slate-900/50 border border-slate-800 py-3 pl-[96px] pr-4 text-white placeholder-slate-550 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
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
                  className="w-full rounded-2xl bg-slate-900/50 border border-slate-800 py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
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
                  className="w-full rounded-2xl bg-slate-900/50 border border-slate-800 py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
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
          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
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
