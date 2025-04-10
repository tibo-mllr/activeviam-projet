import { PiePartData } from "@/lib/types";
import { ReactElement } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type TimingPieChartProps = {
  data: PiePartData[];
};

export function TimingPieChart({ data }: TimingPieChartProps): ReactElement {
  return (
    <ResponsiveContainer width={250} height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
