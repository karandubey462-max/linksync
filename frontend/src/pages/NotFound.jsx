import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Decorative Spheres */}
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-indigo-600 opacity-20 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-pink-600 opacity-20 blur-[100px]" />

      <div className="z-10 text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Glowing 404 text */}
          <h1 className="font-display text-9xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.3)]">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="font-display text-2xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            The profile username you clicked on or URL path you requested doesn't exist, is inactive, or has been changed.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98] transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-3.5 font-semibold text-slate-300 hover:bg-slate-900/60 hover:text-white transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
