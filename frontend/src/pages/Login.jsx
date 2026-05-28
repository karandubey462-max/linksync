import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
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
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-indigo-600 opacity-20 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-pink-600 opacity-20 blur-[80px]" />

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
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Log in to manage your LinkSync profile
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-slate-900/50 border border-slate-800 py-3.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
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
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-slate-900/50 border border-slate-800 py-3.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 py-4 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Log In to Dashboard</span>
                  <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              <span>Create one free</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
