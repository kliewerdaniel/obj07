import React from 'react';
import { Clock, ExternalLink, Globe2, ChevronDown, ArrowUpRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isExpanded, setIsExpanded] = React.useState(false);

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
      className="card shadow-soft hover:shadow-soft-lg group relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100/60 dark:border-gray-700/40"
    >
      {/* Background decorative elements */}
      <div className="absolute right-0 top-0 h-20 w-20 transform translate-x-8 -translate-y-8 rotate-12 rounded-full bg-primary-500/10 dark:bg-primary-500/20 blur-2xl pointer-events-none"></div>
      <div className="absolute left-0 bottom-0 h-20 w-20 transform -translate-x-8 translate-y-8 -rotate-12 rounded-full bg-secondary-500/10 dark:bg-secondary-500/20 blur-xl pointer-events-none"></div>
      
      {/* Hover effect highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Left accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-secondary-500 transform origin-left transition-all duration-300 group-hover:scale-y-100 scale-y-0"></div>
      
      <div className="p-6 sm:p-8 relative">
        

        {/* Article Title */}
        <motion.h2 
          className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {article.title}
        </motion.h2>

        {/* Summary Section */}
        <div className="relative mb-6">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={isExpanded ? 'expanded' : 'collapsed'}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p 
                className={`text-base text-gray-600 dark:text-gray-300 leading-relaxed ${!isExpanded && 'line-clamp-3'}`}
              >
                {article.summary}
              </motion.p>
            </motion.div>
          </AnimatePresence>
          
        </div>

        {/* Source & Date */}
        <div className="flex flex-wrap items-center justify-between text-sm mb-3 text-gray-500 dark:text-gray-400">
          <motion.div 
            className="flex items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Globe2 className="h-4 w-4" />
            <span className="font-medium">{article.source}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-1.5" 
            title={fullFormattedDate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Calendar className="h-4 w-4" />
            <time dateTime={article.published}>
              {formattedDate}
            </time>
          </motion.div>
        </div>


        {/* Call to Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
          {/* Time indicator */}
          <motion.div 
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Clock className="h-4 w-4" />
              <span>{fullFormattedDate?.split(',')[1] || ''}</span>
          </motion.div>
          
          <motion.a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-2 text-sm group/btn"
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <span>Read article</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
};

export default React.memo(SummaryCard);
