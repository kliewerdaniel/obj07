import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  AlertCircle, 
  Newspaper, 
  Loader2, 
  SparkleIcon, 
  FilterIcon, 
  SlidersHorizontal,
  CalendarIcon,
  ListFilter,
  TrendingUp,
  ArrowDownAZ
} from 'lucide-react';
import SummaryCard, { type Article } from '../components/SummaryCard';

const LoadingState = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center min-h-[400px] text-gray-600 dark:text-gray-400"
  >
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Loader2 className="w-12 h-12 text-primary-500" />
      </motion.div>
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-xl -z-10"
      />
    </div>
    <div className="mt-6 text-center">
      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Gathering insights</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preparing your personalized news feed...</p>
    </div>
  </motion.div>
);

const ErrorState = ({ message }: { message: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="card bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 flex flex-col items-center justify-center max-w-xl mx-auto shadow-soft"
  >
    <div className="relative">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-xl -z-10"
      />
    </div>
    <h2 className="text-xl font-bold mt-6 mb-2 text-gray-900 dark:text-white">Unable to Load Data</h2>
    <p role="alert" className="text-center text-gray-600 dark:text-gray-300 max-w-md">{message}</p>
    <div className="mt-6">
      <button className="btn-outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        <span>Try Again</span>
      </button>
    </div>
  </motion.div>
);

const NoDataState = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="card bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-10 flex flex-col items-center justify-center max-w-xl mx-auto"
  >
    <div className="relative">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <Newspaper className="w-10 h-10 text-gray-500 dark:text-gray-400" />
      </div>
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute inset-0 bg-gray-500/10 dark:bg-gray-500/20 rounded-full blur-xl -z-10"
      />
    </div>
    <h2 className="text-xl font-bold mt-6 mb-2 text-gray-900 dark:text-white">No Stories Yet</h2>
    <p className="text-center text-gray-600 dark:text-gray-300 max-w-md">
      Your news feed is empty. Click the "Refresh Stories" button to gather the latest news and insights.
    </p>
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const Summaries = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'source'>('newest');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique categories from articles
  const categories = React.useMemo(() => {
    const topics = ['Technology', 'Business', 'Politics', 'Health', 'Science', 'Entertainment'];
    return topics.sort();
  }, []);

  // Filtered and sorted articles
  const displayedArticles = React.useMemo(() => {
    let result = [...articles];
    
    // Apply category filtering
    if (filterCategory) {
      result = result.filter(article => {
        // Simple hash function to deterministically assign a category for demo
        const hash = article.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const category = categories[hash % categories.length];
        return category === filterCategory;
      });
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.published).getTime() - new Date(b.published).getTime());
    } else if (sortBy === 'source') {
      result.sort((a, b) => a.source.localeCompare(b.source));
    }
    
    return result;
  }, [articles, sortBy, filterCategory, categories]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/graph/');
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      setArticles(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  const runPipeline = useCallback(async () => {
    setPipelineRunning(true);
    setPipelineStatus(null);
    try {
      const res = await fetch('/api/run_pipeline');
      if (!res.ok) throw new Error('Pipeline failed to run');
      const data = await res.json();

      if (data.status === 'success') {
        setPipelineStatus('Pipeline executed successfully.');
        await fetchArticles();
      } else {
        setPipelineStatus(`Pipeline failed: ${data.message || data.stderr}`);
      }
    } catch (err: any) {
      setPipelineStatus(`Error running pipeline: ${err.message}`);
    } finally {
      setPipelineRunning(false);
    }
  }, [fetchArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-screen-2xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={runPipeline}
              disabled={pipelineRunning}
              className="btn-primary relative overflow-hidden group"
              whileHover={{ scale: pipelineRunning ? 1 : 1.03 }}
              whileTap={{ scale: pipelineRunning ? 1 : 0.97 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: pipelineRunning ? 360 : 0 }}
                  transition={{ duration: 1.5, repeat: pipelineRunning ? Infinity : 0, ease: "linear" }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.div>
                <span>{pipelineRunning ? 'Updating...' : 'Refresh Stories'}</span>
              </span>
              
              {/* Animated gradient border */}
              {pipelineRunning && (
                <motion.span 
                  className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                />
              )}
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 -top-2 -bottom-2 z-0"
                initial={{ x: '-100%' }}
                animate={{ x: pipelineRunning ? '200%' : '-100%' }}
                transition={{ 
                  duration: 1.5, 
                  repeat: pipelineRunning ? Infinity : 0,
                  ease: "linear" 
                }}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </motion.div>
            </motion.button>
            
        
          </div>
        </div>

        {/* Pipeline Status */}
        <AnimatePresence>
          {pipelineStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                px-4 py-3 rounded-lg text-sm font-medium mt-4 glass
                ${pipelineStatus.includes('failed') || pipelineStatus.includes('Error') 
                  ? 'bg-red-100/80 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-800/50' 
                  : 'bg-green-100/80 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/50'
                }
              `}
            >
              <div className="flex items-center gap-2">
                {pipelineStatus.includes('failed') || pipelineStatus.includes('Error') ? (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <SparkleIcon className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{pipelineStatus}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Filter and Sort Controls */}
        {!loading && !error && articles.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-secondary py-2 flex items-center gap-1.5 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <FilterIcon className="h-4 w-4" />
                  <span>Filters</span>
                  {filterCategory && <span className="ml-1 w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>}
                </button>
                
                <div className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="px-2">|</span>
                  <span>{displayedArticles.length} stories</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500 dark:text-gray-400 mr-1 whitespace-nowrap">Sort by:</div>
                <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`px-3 py-1.5 text-sm flex items-center gap-1 ${
                      sortBy === 'newest' 
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Newest</span>
                  </button>
                  <button
                    onClick={() => setSortBy('oldest')}
                    className={`px-3 py-1.5 text-sm flex items-center gap-1 ${
                      sortBy === 'oldest' 
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span>Oldest</span>
                  </button>
                  <button
                    onClick={() => setSortBy('source')}
                    className={`px-3 py-1.5 text-sm flex items-center gap-1 ${
                      sortBy === 'source' 
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <ArrowDownAZ className="h-3.5 w-3.5" />
                    <span>Source</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Category filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm mt-3 p-4 rounded-xl shadow-soft border border-gray-100/80 dark:border-gray-700/50">
                    <div className="flex items-center mb-3">
                      <ListFilter className="h-4 w-4 text-primary-500 mr-2" />
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilterCategory(null)}
                        className={`px-3 py-1.5 text-xs rounded-full flex items-center ${
                          filterCategory === null
                            ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium'
                            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        All
                      </button>
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setFilterCategory(category)}
                          className={`px-3 py-1.5 text-xs rounded-full flex items-center ${
                            filterCategory === category
                              ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium'
                              : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {loading && <LoadingState key="loading" />}
        {error && <ErrorState key="error" message={error} />}
        {!loading && !error && !articles.length && <NoDataState key="no-data" />}
        
        {!loading && !error && articles.length > 0 && (
          <div className="mt-8">
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 auto-rows-fr"
            >
              {displayedArticles.length > 0 ? (
                displayedArticles.map((article, index) => (
                  <motion.div 
                    key={article.url || index} 
                    variants={itemVariants}
                    className="h-full flex" // Added to ensure equal height cards
                  >
                    <SummaryCard article={article} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                    <FilterIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No matching articles</h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    No articles match your current filter criteria. Try adjusting your filters to see more results.
                  </p>
                  <button 
                    onClick={() => setFilterCategory(null)} 
                    className="mt-4 btn-primary py-2"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </motion.div>
            
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 py-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center text-sm text-gray-500 dark:text-gray-400 flex justify-center"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-500/60 animate-pulse-slow"></div>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Summaries;
