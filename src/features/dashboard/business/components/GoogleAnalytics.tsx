import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme } from "@mui/material";
import { useState } from "react";

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const sample = {
  month: [10, 40, 20, 60, 45, 70],
  week: [5, 20, 10, 30, 25, 35],
  day: [3, 4, 2, 6, 5, 8],
};

export default function GoogleAnalyticsCard() {
  const theme = useTheme();
  const [range, setRange] = useState<"month" | "week" | "day">("month");

  const chartData =
    range === "month"
      ? sample.month
      : range === "week"
        ? sample.week
        : sample.day;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-[465px]">
      <div className="mb-4">
        <div>
          <p className="text-xs text-red-500">
            *fitur masih dalam tahap pengembangan
          </p>
          <div className="text-lg font-semibold text-gray-800">
            Laporan Google Analytic
          </div>
          <div className="text-sm text-gray-400">Average</div>
        </div>

        <div className="mt-4">
          <div
            role="tablist"
            aria-label="timeframe"
            className="bg-gray-50 rounded-lg flex overflow-hidden text-sm border border-gray-100"
          >
            <button
              onClick={() => setRange("month")}
              aria-selected={range === "month"}
              className={`flex-1 text-center px-4 py-2 ${range === "month" ? "bg-primary/10 text-primary" : "text-gray-600"}`}
            >
              Month
            </button>
            <button
              onClick={() => setRange("week")}
              aria-selected={range === "week"}
              className={`flex-1 text-center px-4 py-2 ${range === "week" ? "bg-primary/10 text-primary" : "text-gray-600"}`}
            >
              Week
            </button>
            <button
              onClick={() => setRange("day")}
              aria-selected={range === "day"}
              className={`flex-1 text-center px-4 py-2 ${range === "day" ? "bg-primary/10 text-primary" : "text-gray-600"}`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-b-lg mb-4 min-h-[120px]">
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              position: "none",
              data: monthLabels,
              tickLabelStyle: {
                fill: "#94A3B8",
              },
              disableLine: true,
              disableTicks: true,
            },
          ]}
          yAxis={[{ position: "none" }]}
          series={[
            {
              data: chartData,
              color: theme.palette.primary.main,
              area: true,
              showMark: false,
              curve: "natural",
            },
          ]}
          height={120}
          margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
          sx={{
            "& .MuiAreaElement-root": {
              fill: "url(#gradient)",
            },
            "& .MuiLineElement-root": {
              strokeWidth: 2,
            },
          }}
          grid={{ horizontal: false, vertical: false }}
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={`rgba(var(--color-primary-rgb), 0.12)`}
              />
              <stop
                offset="100%"
                stopColor={`rgba(var(--color-primary-rgb), 0.02)`}
              />
            </linearGradient>
          </defs>
        </LineChart>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">👤</div>
            <div>
              <div className="font-semibold text-gray-800">User Baru</div>
            </div>
          </div>
          <div className="text-sm text-primary">+68</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-md">👥</div>
            <div>
              <div className="font-semibold text-gray-800">Total User</div>
            </div>
          </div>
          <div className="text-sm text-green-500">+68</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-md">👥</div>
            <div>
              <div className="font-semibold text-gray-800">Views</div>
            </div>
          </div>
          <div className="text-sm text-green-500">+68</div>
        </div>
      </div>
    </div>
  );
}
