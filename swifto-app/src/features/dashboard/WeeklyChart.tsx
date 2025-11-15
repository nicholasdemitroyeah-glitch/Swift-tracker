"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type WeeklyChartProps = {
  data: {
    label: string;
    total: number;
    mileagePay: number;
    loadPay: number;
    stopPay: number;
  }[];
};

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  return (
    <Card className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Week
          </p>
          <h3 className="font-display text-xl">Earnings trend</h3>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff7a00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              stroke="#ffffff44"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke="#ffffff22"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              formatter={(value: number) => [
                formatCurrency(value as number),
                "Total",
              ]}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#ff7a00"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
