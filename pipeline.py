# Apply feedparser patch BEFORE importing anything else
import feedparser_patch  # Add this at the very top

from modules.scraping import fetch_articles
from modules.translation import translate_article
from modules.summarization import summarize
from create_db import create_database, run_after_pipeline
import json
import os
from datetime import datetime

def run_pipeline():
    print("🚀 Starting news pipeline...")
    
    # Step 1: Scrape
    print("📰 Scraping articles...")
    articles = fetch_articles(max_articles=10) # Increase max_articles to fetch more stories
    
    # Step 2: Process each article
    results = []
    for article in articles:
        print(f"🔍 Processing: {article['title']}")
        
        # Translate if needed
        article['translated_text'] = translate_article(article)
        
        # Summarize
        article['summary'] = summarize(article['translated_text'])
        
        results.append({
            'title': article['title'],
            'source': article['source'],
            'summary': article['summary'],
            'url': article['url'],
            'published': article['published']
        })
    
    # Step 3: Output
    timestamp = datetime.now().strftime("%Y-%m-%d")
    output_file = f"output/news_digest_{timestamp}.json"
    
    # Ensure output directory exists
    os.makedirs("output", exist_ok=True)
    
    print("📝 Final results before saving:") # Add logging
    print(json.dumps(results, indent=2)) # Print the results

    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"✅ Pipeline complete! Output saved to {output_file}")
    print(f"📊 Processed {len(results)} articles")
    
    # Step 4: Create/update database
    print("🗄️ Creating database tables if needed...")
    create_database()
    
    # Step 5: Update database with new articles
    run_after_pipeline()

if __name__ == "__main__":
    run_pipeline()
