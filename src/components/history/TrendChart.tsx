"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HistoryEntry } from "@/types/analysis";

interface Props {
  history: HistoryEntry[];
}

export default function TrendChart({ history }: Props) {
  const [filterCrop, setFilterCrop] = useState<string>("all");

  const data = useMemo(() => {
    // Sort oldest to newest for the chart (left to right)
    const reversed = [...history].reverse();
    
    return reversed
      .filter((entry) => filterCrop === "all" || entry.result.crop === filterCrop)
      .map((entry, i) => {
        const date = new Date(entry.result.analysedAt);
        return {
          scan: i + 1,
          date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          time: date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
          confidence: Math.round(entry.result.confidence * 100),
          condition: entry.result.conditionDisplay,
          crop: entry.result.cropDisplay || "Unknown",
        };
      });
  }, [history, filterCrop]);

  if (history.length < 2) {
    return (
      <div className="card" style={{ padding: "32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Not enough data yet. Complete at least 2 scans to see trend analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "24px", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Confidence Trends
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Model confidence across recent scans
          </p>
        </div>
        
        <select
          value={filterCrop}
          onChange={(e) => setFilterCrop(e.target.value)}
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-subtle)",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="all">All Crops</option>
          <option value="rice">Rice / Paddy</option>
          <option value="tomato">Tomato</option>
          <option value="potato">Potato</option>
        </select>
      </div>

      <div style={{ width: "100%", height: "260px", marginLeft: "-16px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(13,20,32,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                backdropFilter: "blur(8px)",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              }}
              itemStyle={{ color: "#10b981", fontWeight: 600 }}
              labelStyle={{ color: "var(--text-secondary)", marginBottom: "4px" }}
              formatter={(value, name, props) => {
                return [`${value}%`, props.payload.condition];
              }}
              labelFormatter={(label, props) => {
                if (props.length === 0) return label;
                return `${props[0].payload.crop} • ${label} at ${props[0].payload.time}`;
              }}
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#0d1420", stroke: "#10b981", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#10b981", stroke: "#0d1420", strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
