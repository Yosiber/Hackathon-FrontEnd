import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DataItem {
  label: string;
  value: number;
}

interface Props {
  data: DataItem[];
  colors: string[];
}

const DoughnutChart = ({ data, colors }: Props) => {
  const charData: ChartData<"doughnut"> = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: colors,
      }]
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    }
  };

  return (
    <div className="w-full h-full">
      <Doughnut
        data={charData}
        options={options}
      />
    </div>
  )
}

export default DoughnutChart
