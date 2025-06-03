import sys
import types

# Create a dummy module for lxml.html.clean
clean_module = types.ModuleType('lxml.html.clean')
sys.modules['lxml.html.clean'] = clean_module

# Now import the actual cleaner from the new package
from lxml_html_clean import Cleaner

# Patch the dummy module
clean_module.Cleaner = Cleaner

import atoma
import requests
from newspaper import Article
import yaml
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)



def load_feeds(config_path="configs/feeds.yaml"):
    with open(config_path, 'r') as f:
        return yaml.safe_load(f)['sources']

def fetch_articles(max_articles=1):
    start_time = time.time()
    sources = load_feeds()
    articles = []
    
    logger.info(f"Starting to fetch articles from {len(sources)} sources, max {max_articles} per source")
    
    for idx, source in enumerate(sources, 1):
        source_start_time = time.time()
        logger.info(f"[{idx}/{len(sources)}] Processing source: {source['name']} ({source['url']})")
        
        try:
            # Fetch and parse RSS feed
            logger.info(f"  Fetching RSS feed from {source['name']}...")
            response = requests.get(source['url'], timeout=10)
            logger.info(f"  RSS feed fetched successfully ({len(response.content)} bytes)")
            
            feed = atoma.parse_rss_bytes(response.content)
            feed_item_count = len(feed.items[:max_articles])
            logger.info(f"  Found {len(feed.items)} articles, processing up to {feed_item_count}")
            
            for entry_idx, entry in enumerate(feed.items[:max_articles], 1):
                article_start_time = time.time()
                logger.info(f"    [{entry_idx}/{feed_item_count}] Fetching article: {entry.link}")
                
                article = Article(entry.link)
                logger.info(f"    Downloading article content...")
                article.download()
                logger.info(f"    Parsing article content...")
                article.parse()
                
                # Log article details
                article_title = article.title if article.title else "Untitled"
                article_text_length = len(article.text)
                logger.info(f"    Article processed: '{article_title}' ({article_text_length} chars)")
                
                articles.append({
                    'title': article.title,
                    'text': article.text,
                    'source': source['name'],
                    'url': entry.link,
                    'language': source['lang'],
                    'published': entry.pub_date.isoformat() if entry.pub_date else ""
                })
                
                article_time = time.time() - article_start_time
                logger.info(f"    Article completed in {article_time:.2f} seconds")
                
        except Exception as e:
            logger.error(f"Error processing {source['name']}: {str(e)}", exc_info=True)
        
        source_time = time.time() - source_start_time
        logger.info(f"[{idx}/{len(sources)}] Completed source: {source['name']} in {source_time:.2f} seconds")
    
    total_time = time.time() - start_time
    logger.info(f"Article fetching complete. Processed {len(articles)} articles from {len(sources)} sources in {total_time:.2f} seconds")
    
    return articles
