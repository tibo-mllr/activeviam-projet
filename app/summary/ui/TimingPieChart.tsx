import { PiePartData } from "@/lib/types";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface TimingPieChartProps {
  data: PiePartData[];
}

const TimingPieChart: React.FC<TimingPieChartProps> = ({ data }) => {
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
};

export default TimingPieChart;
