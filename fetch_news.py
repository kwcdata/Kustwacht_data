import feedparser
import json
import datetime

def fetch_nos_news():
    # De RSS feed van de NOS (Algemeen nieuws)
    url = "https://feeds.nos.nl/nosnieuwsalgemeen"
    feed = feedparser.parse(url)
    
    news_items = []
    
    # We pakken de laatste 15 berichten
    for entry in feed.entries[:15]:
        # Formatteer de datum naar HH:MM
        dt = datetime.datetime(*(entry.published_parsed[:6]))
        formatted_date = dt.strftime("%H:%M")
        
        item = {
            "title": entry.title,
            "link": entry.link,
            "pubDate": formatted_date,
            "description": entry.summary # Dit zijn de 'paar regels' tekst
        }
        news_items.append(item)
    
    # Schrijf naar news.json
    with open('news.json', 'w', encoding='utf-8') as f:
        json.dump(news_items, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    fetch_nos_news() 
