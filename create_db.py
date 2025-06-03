import json
import os
import glob
from datetime import datetime
from sqlalchemy.orm import Session
from api.database import Base, engine, SessionLocal
from api import crud

def find_latest_json_file(directory="output"):
    """Find the most recent news_digest JSON file in the output directory"""
    if not os.path.exists(directory):
        os.makedirs(directory)
        return None
    
    # Look for any JSON files starting with news_digest
    pattern = os.path.join(directory, "news_digest_*.json")
    json_files = glob.glob(pattern)
    
    if not json_files:
        return None
    
    # Return the most recently modified file
    latest_file = max(json_files, key=os.path.getmtime)
    return latest_file

def create_database():
    """Create database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")

def update_database_from_json(json_file_path=None):
    """Update database with articles from JSON file"""
    if json_file_path is None:
        json_file_path = find_latest_json_file()
    
    if json_file_path is None:
        print("No news digest JSON file found in output directory.")
        return False
    
    print(f"Reading articles from: {json_file_path}")
    
    db: Session = SessionLocal()
    try:
        with open(json_file_path, "r") as f:
            articles = json.load(f)
            
        added_count = 0
        for article in articles:
            summary_text = article.get("summary")
            if summary_text:
                # Check if summary already exists to avoid duplicates
                existing = crud.get_article_summary_by_text(db, summary_text)
                if not existing:
                    crud.create_article_summary(db=db, summary=summary_text)
                    added_count += 1
                    
        print(f"Added {added_count} new article summaries to database.")
        return True
        
    except FileNotFoundError:
        print(f"Error: {json_file_path} not found.")
        return False
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {json_file_path}")
        return False
    except Exception as e:
        print(f"Error updating database: {str(e)}")
        return False
    finally:
        db.close()

def run_after_pipeline():
    """Run database update after pipeline completion"""
    print("🗄️ Updating database with new articles...")
    success = update_database_from_json()
    if success:
        print("✅ Database updated successfully!")
    else:
        print("❌ Failed to update database.")
    return success

if __name__ == "__main__":
    create_database()
