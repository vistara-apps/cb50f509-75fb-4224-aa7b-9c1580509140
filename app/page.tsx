import BitcoinPiCycle from './components/BitcoinPiCycle';

interface PriceData {
  date: string;
  price: number;
  sma111: number | null;
  sma350: number | null;
  piLine: number | null;
  signal: boolean;
}

export default async function Page() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily');
    const result = await response.json();
    const prices = result.prices.map((p: [number, number]) => ({
      date: new Date(p[0]).toISOString().split('T')[0],
      price: p[1],
    }));

    const processedData: PriceData[] = [];
    const signalsList: { date: string; price: number }[] = [];

    for (let i = 0; i < prices.length; i++) {
      const sma111 = i >= 110 ? prices.slice(i - 110, i + 1).reduce((sum, d) => sum + d.price, 0) / 111 : null;
      const sma350 = i >= 349 ? prices.slice(i - 349, i + 1).reduce((sum, d) => sum + d.price, 0) / 350 : null;
      const piLine = sma350 ? 2 * sma350 : null;
      const prevSma111 = i > 0 && processedData[i - 1].sma111;
      const prevPiLine = i > 0 && processedData[i - 1].piLine;
      const signal = sma111 && piLine && sma111 >= piLine && (!prevSma111 || !prevPiLine || prevSma111 < prevPiLine);

      processedData.push({
        date: prices[i].date,
        price: prices[i].price,
        sma111,
        sma350,
        piLine,
        signal: !!signal,
      });

      if (signal) {
        signalsList.push({ date: prices[i].date, price: prices[i].price });
      }
    }

    return <BitcoinPiCycle data={processedData} signals={signalsList} />;
  } catch (error) {
    console.error('Error fetching data:', error);
    return <div>Error loading data</div>;
  }
}