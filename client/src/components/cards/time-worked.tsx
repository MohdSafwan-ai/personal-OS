import { Clock } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { CountUp } from "@/components/ui/count-up";
import { DashCard } from "@/components/ui/dash-card";
import { useFocusWeek } from "@/lib/queries";
import { formatDuration, toDayKey } from "@/lib/utils";

function lastSevenDays(): { key: string; label: string }[] {
  const days: { key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: toDayKey(d),
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
    });
  }
  return days;
}

export function TimeWorkedCard() {
  const { data: byDay = {} } = useFocusWeek();
  const today = toDayKey();

  const data = lastSevenDays().map((d) => ({
    ...d,
    minutes: Math.round((byDay[d.key] ?? 0) / 60),
  }));
  const todaySeconds = byDay[today] ?? 0;
  const weekTotal = data.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <DashCard title="Time Worked" icon={<Clock className="h-4 w-4" />}>
      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-bold tabular-nums tracking-tight">
          <CountUp value={todaySeconds} format={(v) => formatDuration(v)} />
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDuration(weekTotal * 60)} this week
        </span>
      </div>
      <div className="mt-3 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barCategoryGap="28%">
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              dy={4}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent))", radius: 6 }}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-md">
                    <span className="font-semibold tabular-nums">
                      {formatDuration((payload[0].value as number) * 60)}
                    </span>
                  </div>
                ) : null
              }
            />
            <Bar
              dataKey="minutes"
              radius={[5, 5, 5, 5]}
              minPointSize={2}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((d) => (
                <Cell
                  key={d.key}
                  fill={d.key === today ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.25)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashCard>
  );
}
