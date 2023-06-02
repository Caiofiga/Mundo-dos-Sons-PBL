import React from "react";
import { Bar } from "react-chartjs-2";
import { LinearProgress } from "@mui/material";

interface BarChartProps {
  data: boolean[]; // Array of boolean values
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const trueCount = data.filter((value) => value).length; // Count the number of true values
  const totalCount = data.length; // Total number of values
  const truePercentage = (trueCount / totalCount) * 100; // Calculate the percentage

  const chartData = {
    labels: ["Percentage of True"],
    datasets: [
      {
        data: [truePercentage],
        backgroundColor: ["rgba(63, 81, 181, 0.5)"], // Customize the bar color
      },
    ],
  };

  return (
    <div>
      <Bar data={chartData} options={{ maintainAspectRatio: false }} />
      <LinearProgress variant="determinate" value={truePercentage} />
    </div>
  );
};

export default BarChart;
