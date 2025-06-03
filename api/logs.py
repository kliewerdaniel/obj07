import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
import queue
import threading

router = APIRouter()

# Create a thread-safe queue to store logs
log_queue = queue.Queue(maxsize=1000)  # Limit to 1000 messages
lock = threading.Lock()

class LogRecord(BaseModel):
    timestamp: str
    level: str
    message: str

class LogResponse(BaseModel):
    logs: List[Dict[str, Any]]
    has_more: bool

# Custom handler that will store logs in our queue
class QueueHandler(logging.Handler):
    def emit(self, record):
        try:
            # Format the log message
            log_entry = {
                "timestamp": datetime.now().isoformat(),
                "level": record.levelname,
                "message": self.format(record)
            }
            
            # Add to queue, remove oldest if full
            if log_queue.full():
                try:
                    log_queue.get_nowait()
                except queue.Empty:
                    pass
            
            log_queue.put(log_entry)
        except Exception:
            self.handleError(record)

# Configure the root logger to use our handler
def setup_queue_handler():
    handler = QueueHandler()
    handler.setFormatter(logging.Formatter('%(message)s'))
    handler.setLevel(logging.INFO)
    
    # Get the root logger
    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    
    # Also add our handler to the scraping module logger
    scraping_logger = logging.getLogger('modules.scraping')
    scraping_logger.addHandler(handler)
    
    return handler

# Initialize the handler when this module is imported
queue_handler = setup_queue_handler()

@router.get("/logs", response_model=LogResponse)
async def get_logs(limit: int = 100, clear: bool = False):
    """
    Retrieve logged messages from the queue.
    
    - limit: Maximum number of logs to return
    - clear: Whether to clear the log queue after retrieval
    """
    logs = []
    count = 0
    has_more = False
    
    with lock:
        # Get a copy of all logs
        temp_queue = queue.Queue()
        while not log_queue.empty() and count < limit:
            try:
                log = log_queue.get_nowait()
                logs.append(log)
                temp_queue.put(log)
                count += 1
            except queue.Empty:
                break
        
        # Check if there are more logs than the limit
        has_more = not log_queue.empty()
        
        # If clear is not requested, put the logs back
        if not clear:
            while not temp_queue.empty():
                try:
                    log_queue.put(temp_queue.get_nowait())
                except queue.Full:
                    break
        
    return {"logs": logs, "has_more": has_more}

@router.post("/logs/clear")
async def clear_logs():
    """Clear all logs from the queue."""
    with lock:
        while not log_queue.empty():
            try:
                log_queue.get_nowait()
            except queue.Empty:
                break
    
    return {"status": "success", "message": "Logs cleared"}
