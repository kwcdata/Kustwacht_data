import feedparser
import json
from datetime import datetime
import pytz

def fetch_nos_news():
    # De RSS feed van de NOS (Algemeen nieuws)
    url = "https://feeds.nos.nl/nosnieuwsalgemeen"
    feed = feedparser.parse(url)
    
    # Tijdzone instellen op Nederland (voor de juiste tijd in het dashboard)
    local_tz = pytz.timezone('Europe/Amsterdam')
    
    news_items = []
    
    # We pakken de laatste 15 berichten
    for entry in feed.entries[:15]:
        # Verkrijg de tijd uit de feed (meestal UTC) en zet om naar datetime object
        dt_utc = datetime(*(entry.published_parsed[:6]), tzinfo=pytz.utc)
        
        # Omzetten naar Nederlandse tijd (rekening houdend met zomer/wintertijd)
        dt_local = dt_utc.astimezone(local_tz)
        formatted_date = dt_local.strftime("%H:%M")
        
        item = {
            "title": entry.title,
            "link": entry.link,
            "pubDate": formatted_date,
            "description": entry.summary
        }
        news_items.append(item)
    
    # Schrijf naar news.json
    with open('news.json', 'w', encoding='utf-8') as f:
        json.dump(news_items, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    fetch_nos_news()
