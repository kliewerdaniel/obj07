import React, { useState, useEffect } from 'react';
import './navigation-fix.css'; // Import a custom CSS file for navigation fixes
import './nav-styles.css'; // Import the new navigation styles
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Settings, Radio, Moon, Sun, ChevronRight, BarChart2 } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/summaries', label: 'News', icon: Newspaper },
  { path: '/manage-feeds', label: 'Sources', icon: Settings },
  { path: '/news-broadcast', label: 'Broadcast', icon: Radio },
];

export default function Layout() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches || 
        document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 pattern-bg">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/30 backdrop-blur-lg shadow-soft-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col">
            {/* Logo Section */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="relative">

                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 0.4, 0.7]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="absolute -inset-1.5 bg-primary-500/20 rounded-xl blur-md -z-10"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 animate-gradient-shift">Objective</span> Newsfeed
                    </h1>
                  </div>
                </motion.div>
                
                
              </div>
            </div>

            {/* Navigation Bar */}
            <nav className="objective-nav">
              <div className="px-4 py-3 flex justify-center">
                <div className="nav-links-container">
                  {NAV_ITEMS.map(({ path, label, icon: Icon }, index) => {
                    const isActive = location.pathname === path;
                    return (
                      <Link
                        key={path}
                        to={path}
                        className={isActive ? 'active-nav-link' : ''}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon />
                        <span>{label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="active-indicator"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="animate-fade-in"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
     
    </div>
  );
}
