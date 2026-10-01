import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashboardChart() {

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun"
    ],
    datasets: [
      {
        label: "Employees Joined",
        data: [5, 8, 12, 10, 15, 20],
        backgroundColor: "#3b82f6"
      }
    ]
  };

  return <Bar data={data} />;
}

export default DashboardChart;