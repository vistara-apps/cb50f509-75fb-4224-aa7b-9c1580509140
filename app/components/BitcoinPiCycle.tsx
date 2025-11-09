'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';

interface PriceData {
  date: string;
  price: number;
  sma111: number | null;
  sma350: number | null;
  piLine: number | null;
  signal: boolean;
}

interface Props {
  data: PriceData[];
  signals: { date: string; price: number }[];
}

interface CustomDotProps {
  cx: number;
  cy: number;
  payload: PriceData;
}

interface TooltipPayload {
  dataKey: string;
  value: number;
  payload: PriceData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const BitcoinPiCycle: React.FC<Props> = ({ data, signals }) => {
  const CustomDot = (props: CustomDotProps) => {
    const { cx, cy, payload } = props;
    if (payload.signal) {
      return <Dot cx={cx} cy={cy} r={4} fill="red" />;
    }
    return null;
  };

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p>{`Date: ${label}`}</p>
          <p>{`Price: $${data.price.toFixed(2)}`}</p>
          <p>{`SMA 111: ${data.sma111 ? data.sma111.toFixed(2) : 'N/A'}`}</p>
          <p>{`SMA 350: ${data.sma350 ? data.sma350.toFixed(2) : 'N/A'}`}</p>
          <p>{`Pi Line: ${data.piLine ? data.piLine.toFixed(2) : 'N/A'}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bitcoin Pi Cycle Top Indicator</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis scale="log" domain={['dataMin', 'dataMax']} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} connectNulls={false} />
          <Line type="monotone" dataKey="sma111" stroke="#82ca9d" dot={false} connectNulls={false} />
          <Line type="monotone" dataKey="sma350" stroke="#ff7300" dot={false} connectNulls={false} />
          <Line type="monotone" dataKey="piLine" stroke="#ffc658" dot={false} connectNulls={false} />
          <Line type="monotone" dataKey="price" stroke="transparent" dot={<CustomDot />} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
      <h2 className="text-xl font-semibold mt-6 mb-2">Signal Dates</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Price</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((signal, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{signal.date}</td>
              <td className="py-2 px-4 border">${signal.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BitcoinPiCycle;