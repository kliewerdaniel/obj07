# Objective Newsfeed

## 🧭 Mission

Objective Newsfeed is an open-source platform designed to aggregate, analyze, and present news from diverse global sources. By bringing together content from across the political spectrum and around the world, it helps users escape filter bubbles and gain a more balanced understanding of current events.

## ✨ Features

- **Multi-Source News Aggregation**: Collects news from 30+ international sources spanning different regions, political perspectives, and media types
- **Automated Translation**: Translates non-English content into English using neural machine translation models
- **AI-Powered Summarization**: Creates concise summaries of news articles using natural language processing
- **Text-to-Speech**: Generates audio broadcasts of news summaries for accessibility and convenience
- **Diversity Scoring**: Quantifies the diversity of sources using a proprietary scoring system
- **Real-time Processing**: Runs the news pipeline on-demand with live progress logging
- **Interactive Management**: Web interface for managing news sources, viewing logs, and exploring content
- **API Access**: FastAPI-based endpoints for programmatic access to all functionality

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/kliewerdaniel/obj07.git
cd obj07
```

2. **Create and Activate a Virtual Environment** (Optional but Recommended)

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Backend Dependencies**

```bash
pip install -r requirements.txt
```

4. **Download Required NLP Models**

```bash
python -m spacy download en_core_web_sm
```

5. **Set Up the Frontend**

```bash
cd frontend
npm install
```

### Running the Application

1. **Start the Backend Server**

```bash
# From the project root
uvicorn main:app --reload
```

2. **Start the Frontend Development Server**

```bash
# In a separate terminal, from the frontend directory
npm run dev
```

3. **Access the Application**
   - Backend API: http://127.0.0.1:8000
   - Frontend Interface: http://localhost:5173

## 📁 Project Structure

- `api/` - FastAPI route definitions and database models
  - `broadcast.py` - News broadcast API endpoints
  - `crud.py` - Database CRUD operations
  - `database.py` - Database connection and session management
  - `graph.py` - Graph visualization endpoints
  - `logs.py` - Logging API and utilities
  - `models.py` - SQLAlchemy database models
  - `schemas.py` - Pydantic schemas for API validation

- `configs/` - Configuration files
  - `feeds.yaml` - News source definitions with metadata

- `frontend/` - React/TypeScript frontend application
  - `src/components/` - Reusable UI components
  - `src/pages/` - Page components for different views

- `modules/` - Core functionality modules
  - `scraping.py` - News feed fetching and article extraction
  - `translation.py` - Neural machine translation
  - `summarization.py` - AI-powered article summarization
  - `tts.py` - Text-to-speech processing

- `nlp/` - Natural Language Processing utilities
  - `entity_extractor.py` - Named entity recognition

- `output/` - Generated summaries and processed data
  
- `static/` - Static files including visualization pages
  - `audio/` - Generated audio broadcasts
  - `graph.html` - Interactive news source visualization

- `main.py` - Application entry point
- `pipeline.py` - News processing pipeline
- `feedparser_patch.py` - Custom patches for the feedparser library
- `create_db.py` - Database creation and maintenance

## 🛠️ Customization

### Adding News Sources

News sources are defined in `configs/feeds.yaml`. Each source includes:

- `name`: Unique identifier for the source
- `type`: Feed type (usually "rss")
- `url`: URL of the feed
- `lang`: Language code (e.g., "en" for English)
- `diversity_score`: Rating from 1-10 indicating perspective diversity
- `perspective`: Description of political/editorial slant
- `region`: Geographic region of the source

You can add, edit, or remove sources through the web interface or by directly modifying the YAML file.

### Running the Pipeline

The news processing pipeline can be triggered:
1. Through the web interface using the "Run Pipeline" button
2. Via API by calling `GET /api/run_pipeline`
3. Programmatically by importing and running the pipeline components

## 📊 News Source Diversity

The application currently includes sources from:

- **North America**: NPR, ABC News, VOA News, CBC, Mexico News Daily
- **Europe**: BBC, The Guardian, Euronews
- **Middle East**: Al Jazeera, Press TV, Jerusalem Post
- **Asia**: China Daily, The Hindu, Times of India, Channel NewsAsia
- **Africa**: AllAfrica, Mail & Guardian, Egypt Independent
- **Latin America**: Brazil Reports, Colombia Reports
- **Oceania**: Sydney Morning Herald, Australian Broadcasting Corporation
- **International Organizations**: UN News, Global Voices


## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
