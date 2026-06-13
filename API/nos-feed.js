export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Content-Type', 'application/xml');

  try {
    // We zetten een harde deadline van 3000ms (3 seconden) op het verzoek
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('https://feeds.nos.nl/nosnieuwsalgemeen', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) KustwachtDashboard/2.0',
        'Accept': 'application/xml, text/xml, */*',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NOS status ${response.status}`);
    }

    const xmlData = await response.text();
    return res.status(200).send(xmlData);
  } catch (error) {
    console.error("Proxy fout of timeout:", error.message);
    // We sturen een nette 504 status zodat je HTML weet dat hij de back-up moet gebruiken
    return res.status(504).send('<error>Timeout of blokkade</error>');
  }
}
