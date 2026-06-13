export default async function handler(req, res) {
  // Stel headers in zodat de browser de data accepteert en niet hergebruikt uit een cache
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Content-Type', 'application/xml');

  try {
    // Haal de feed direct live op bij de NOS vanaf de Vercel-server
    const response = await fetch('https://feeds.nos.nl/nosnieuwsalgemeen', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) KustwachtDashboard/1.0',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`NOS gaf statuscode ${response.status} terug`);
    }

    const xmlData = await response.text();
    return res.status(200).send(xmlData);
  } catch (error) {
    console.error(error);
    return res.status(500).send('<error>Kon de NOS feed niet live ophalen</error>');
  }
}
