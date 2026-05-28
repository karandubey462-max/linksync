import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { ExternalLink, Sparkles, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import SiteLogo from '../components/SiteLogo';

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const response = await API.get(`/profile/public/${username}`);
        if (response.data.success) {
          setProfile(response.data.profile);
          setLinks(response.data.links);
        }
      } catch (err) {
        console.error('Error fetching public profile:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

  // Click tracking and redirection
  const handleLinkClick = (linkId, targetUrl) => {
    // Fire-and-forget PATCH request in background
    API.patch(`/links/${linkId}/click`).catch((err) =>
      console.error('Failed to log click analytics:', err)
    );

    // Format url to add http prefix if missing (safety check)
    let formattedUrl = targetUrl;
    if (!/^https?:\/\//i.test(targetUrl)) {
      formattedUrl = `https://${targetUrl}`;
    }

    // Open target website in new tab
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-500">Loading profile page...</p>
      </div>
    );
  }

  // Redirect to 404 if profile not found
  if (error || !profile) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
        {/* Decorative Spheres */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-indigo-600 opacity-20 blur-[80px]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-pink-600 opacity-20 blur-[80px]" />

        <div className="z-10 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <AlertCircle className="h-16 w-16 text-rose-500 mb-4" />
            <h2 className="font-display text-2xl font-bold text-white">Profile Not Found</h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              The LinkSync profile for <span className="font-semibold text-indigo-400">@{username}</span> does not exist or is currently inactive.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go to LinkSync Home</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Dynamic css selection matching selectedTheme
  const getThemeWrapperClass = () => {
    switch (profile.selectedTheme) {
      case 'dark':
        return 'theme-dark min-h-screen overflow-x-hidden flex flex-col justify-between py-10 px-3 sm:py-12 sm:px-4';
      case 'neon':
        return 'theme-neon min-h-screen overflow-x-hidden flex flex-col justify-between py-10 px-3 sm:py-12 sm:px-4';
      case 'minimal':
      default:
        return 'theme-minimal min-h-screen overflow-x-hidden flex flex-col justify-between py-10 px-3 sm:py-12 sm:px-4';
    }
  };

  // Button styles overriding defaults using custom accentColor
  const getButtonStyle = (theme) => {
    if (theme === 'minimal') {
      return {
        borderColor: profile.accentColor || '#e2e8f0',
        color: profile.accentColor || '#0f172a',
      };
    }
    if (theme === 'dark') {
      const color = profile.accentColor || '#6366f1';
      return {
        borderColor: `${color}30`,
        boxShadow: `0 0 12px ${color}10`,
      };
    }
    if (theme === 'neon') {
      return {
        borderColor: profile.accentColor || '#d946ef',
        color: profile.accentColor || '#38bdf8',
        boxShadow: `0 0 10px ${profile.accentColor}25`,
      };
    }
    return {};
  };

  return (
    <div className={getThemeWrapperClass()}>
      {/* Centered Mobile Card Layout */}
      <div className="safe-panel w-full max-w-md mx-auto flex-1 flex flex-col items-center mt-6 sm:mt-8">
        
        {/* Avatar Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-4"
        >
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover border-4 shadow-lg"
              style={{ borderColor: profile.accentColor }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg"
              style={{ backgroundColor: profile.accentColor || '#6366f1' }}
            >
              {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="h-10 w-10" />}
            </div>
          )}
        </motion.div>

        {/* User Profile Info */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="break-words text-center font-display text-xl font-bold tracking-tight"
        >
          {profile.name}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-xs opacity-60 font-semibold mt-0.5 tracking-wide uppercase"
        >
          @{profile.username}
        </motion.p>

        {profile.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-sm text-center opacity-85 mt-3 max-w-sm px-4 leading-relaxed"
          >
            {profile.bio}
          </motion.p>
        )}

        {/* Active Animated Link Buttons */}
        <div className="w-full space-y-3.5 mt-8 px-4">
          {links.length > 0 ? (
            links.map((link, index) => (
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3, duration: 0.4 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.99 }}
                key={link._id}
                onClick={() => handleLinkClick(link._id, link.url)}
                style={getButtonStyle(profile.selectedTheme)}
                className="profile-button flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 text-left text-sm font-bold transition-all focus:outline-none"
              >
                <SiteLogo url={link.url} size="sm" />
                <span className="min-w-0 flex-1 truncate">{link.title}</span>
                <ExternalLink className="h-4 w-4 shrink-0 opacity-50" />
              </motion.button>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 px-6 border border-dashed border-slate-300/20 rounded-3xl opacity-50 text-sm"
            >
              No links available at the moment.
            </motion.div>
          )}
        </div>
      </div>

      {/* Powered by Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider uppercase"
      >
        <Sparkles className="h-3 w-3" />
        <span>Powered by LinkSync</span>
      </motion.div>
    </div>
  );
};

export default PublicProfile;
