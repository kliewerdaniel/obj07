import React, { useEffect, useState, useRef } from 'react';
import { AlertCircle, RefreshCw, XCircle, FileText, Clock, CheckCircle, Info } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

interface LogViewerProps {
  isVisible: boolean;
  onClose?: () => void;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  maxLogs?: number;
}

const LogViewer: React.FC<LogViewerProps> = ({
  isVisible,
  onClose,
  autoRefresh = true,
  refreshInterval = 1000,
  maxLogs = 100
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [pollingActive, setPollingActive] = useState(autoRefresh);

  // Function to fetch logs from the API
  const fetchLogs = async () => {
    if (!isVisible) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/logs/logs?limit=${maxLogs}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLogs(data.logs || []);
      setError(null);
    } catch (err: any) {
      setError(`Failed to fetch logs: ${err.message}`);
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle auto-scrolling
  useEffect(() => {
    if (autoScrollEnabled && logContainerRef.current && logs.length > 0) {
      const container = logContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [logs, autoScrollEnabled]);

  // Setup polling for logs
  useEffect(() => {
    if (!isVisible || !pollingActive) return;
    
    // Initial fetch
    fetchLogs();
    
    // Setup interval for polling
    const intervalId = setInterval(fetchLogs, refreshInterval);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [isVisible, pollingActive, refreshInterval]);

  // Format timestamp to a more readable format
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (e) {
      return timestamp;
    }
  };

  // Get icon based on log level
  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'debug':
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get color class based on log level
  const getLevelColorClass = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-100 dark:border-yellow-900/50';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50';
      default:
        return 'bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800';
    }
  };

  // Clear all logs
  const handleClearLogs = async () => {
    try {
      const response = await fetch('/api/logs/clear', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setLogs([]);
    } catch (err: any) {
      setError(`Failed to clear logs: ${err.message}`);
    }
  };

  // If not visible, don't render
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Scraping Progress Logs
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Real-time updates for article fetching
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPollingActive(!pollingActive)}
              className={`p-2 rounded-full ${
                pollingActive 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
              title={pollingActive ? "Pause auto-refresh" : "Resume auto-refresh"}
            >
              <RefreshCw 
                className={`w-5 h-5 ${pollingActive ? 'animate-spin' : ''}`} 
                style={{ animationDuration: '3s' }} 
              />
            </button>
            <button
              onClick={handleClearLogs}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
              title="Clear logs"
            >
              <XCircle className="w-5 h-5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                title="Close log viewer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Log Container */}
        <div 
          ref={logContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 font-mono"
        >
          {loading && logs.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin mr-2">
                <RefreshCw className="w-5 h-5 text-blue-500" />
              </div>
              <p>Loading logs...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800/50 rounded-lg p-3 text-red-700 dark:text-red-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {logs.length === 0 && !loading && !error && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No logs available.</p>
              <p className="text-sm mt-1">Run the pipeline to see scraping progress.</p>
            </div>
          )}
          
          {logs.map((log, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-3 text-sm overflow-hidden ${getLevelColorClass(log.level)}`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-1 flex-shrink-0">
                  {getLevelIcon(log.level)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
                    {log.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoScrollEnabled}
                onChange={() => setAutoScrollEnabled(!autoScrollEnabled)}
                className="sr-only"
              />
              <div className={`w-9 h-5 rounded-full ${autoScrollEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'} flex items-center transition-all duration-300 ${autoScrollEnabled ? 'justify-end' : 'justify-start'}`}>
                <div className="w-4 h-4 rounded-full bg-white mx-0.5"></div>
              </div>
              <span className="text-xs ml-2 text-gray-600 dark:text-gray-400">
                Auto-scroll
              </span>
            </label>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {pollingActive ? (
              <div className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Auto-refresh {refreshInterval/1000}s</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
