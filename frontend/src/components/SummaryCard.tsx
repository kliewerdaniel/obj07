import React from 'react';
import { Clock, ExternalLink, Globe2, ArrowUpRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Article {
  title: string;
  source: string;
  summary: string;
  url: string;
  published: string;
}

interface SummaryCardProps {
  article: Article;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ article }) => {
  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(article.published);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    } catch {
      return article.published;
    }
  }, [article.published]);

  const fullFormattedDate = React.useMemo(() => {
    try {
      return new Date(article.published).toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return article.published;
    }
  }, [article.published]);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="card shadow-soft hover:shadow-soft-lg group relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100/60 dark:border-gray-700/40 rounded-xl max-w-2xl mx-auto w-full"
    >
      {/* Background decorative elements - refined for more subtle effect */}
      <div className="absolute right-0 top-0 h-24 w-24 transform translate-x-8 -translate-y-8 rotate-12 rounded-full bg-primary-500/5 dark:bg-primary-500/10 blur-2xl pointer-events-none"></div>
      <div className="absolute left-0 bottom-0 h-24 w-24 transform -translate-x-8 translate-y-8 -rotate-12 rounded-full bg-secondary-500/5 dark:bg-secondary-500/10 blur-xl pointer-events-none"></div>
      
      {/* Hover effect highlight - more refined gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Top accent border - more visible on hover */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform origin-left transition-all duration-300 group-hover:scale-x-100 scale-x-0"></div>
      
      <div className="p-8 sm:p-9 relative">
        
        {/* Article Title - Enhanced typography */}
        <motion.h2 
          className="text-lg sm:text-xl font-display font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {article.title}
        </motion.h2>

        {/* Summary Section - Full text always displayed */}
        <div className="relative mb-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50/50 dark:bg-gray-800/30 rounded-lg p-3"
          >
            <motion.p 
              className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              {article.summary}
            </motion.p>
          </motion.div>
        </div>

        {/* Source & Date - Improved layout and spacing */}
        <div className="flex flex-wrap items-center justify-between text-xs mb-4 text-gray-500 dark:text-gray-400">
          <motion.div 
            className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/80 px-2 py-1 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Globe2 className="h-3 w-3" />
            <span className="font-medium">{article.source}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/80 px-2 py-1 rounded-md" 
            title={fullFormattedDate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Calendar className="h-3 w-3" />
            <time dateTime={article.published} className="tabular-nums">
              {formattedDate}
            </time>
          </motion.div>
        </div>


        {/* Call to Action - Improved layout and button styling */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 dark:border-gray-700/50">
          {/* Time indicator */}
          <motion.div 
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Clock className="h-3 w-3" />
            <span className="tabular-nums">{fullFormattedDate?.split(',')[1] || ''}</span>
          </motion.div>
          
          <div className="flex items-center gap-2">
            <motion.a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white dark:bg-white dark:text-black py-1.5 px-3 text-xs font-medium group/btn shadow-sm rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <span>Read article</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default React.memo(SummaryCard);
