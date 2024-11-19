// src/App.js
import React, { useState } from "react";
import AreaChart from "./components/AreaChart/AreaChart";
import BarChart from "./components/BarChart/BarChart";
import DonutChart from "./components/DonutChart/DonutChart";
import GroupedBarChart from "./components/GroupedChart/GroupedBarChart";
import LineChart from "./components/LineChart/LineChart";
import MultilineChart from "./components/MultilineChart/MultilineChart";
import PieChart from "./components/PieChart/PieChart";
import StackedBarChart from "./components/StackedChart/StackedBarChart";
import ExportPanel from "./components/ExportPanel/ExportPanel";
import {
  areaChartConfig,
  barChartConfig,
  donutChartConfig,
  groupedBarConfig,
  lineChartConfig,
  multilineChartConfig,
  pieChartConfig,
  stackedBarConfig,
} from "./data/sampleConfig";
import {
  areaChartData,
  barChartData,
  donutChartData,
  groupedBarData,
  lineChartData,
  multilineChartData,
  pieChartData,
  stackedBarData,
} from "./data/sampleData";
import "./App.css";
import BarChartCustomizer from "./components/Customization/BarChartCustomizer";

const chartComponents = [
  {
    id: "bar",
    name: "Bar Chart",
    component: BarChart,
    data: barChartData,
    config: barChartConfig,
    icon: "📊",
  },
  {
    id: "line",
    name: "Line Chart",
    component: LineChart,
    data: lineChartData,
    config: lineChartConfig,
    icon: "📈",
  },
  {
    id: "pie",
    name: "Pie Chart",
    component: PieChart,
    data: pieChartData,
    config: pieChartConfig,
    icon: "🥧",
  },
  {
    id: "donut",
    name: "Donut Chart",
    component: DonutChart,
    data: donutChartData,
    config: donutChartConfig,
    icon: "🍩",
  },
  {
    id: "multiline",
    name: "Multiline Chart",
    component: MultilineChart,
    data: multilineChartData,
    config: multilineChartConfig,
    icon: "📊",
  },
  {
    id: "stacked",
    name: "Stacked Bar Chart",
    component: StackedBarChart,
    data: stackedBarData,
    config: stackedBarConfig,
    icon: "📊",
  },
  {
    id: "grouped",
    name: "Grouped Bar Chart",
    component: GroupedBarChart,
    data: groupedBarData,
    config: groupedBarConfig,
    icon: "📊",
  },
  {
    id: "area",
    name: "Area Chart",
    component: AreaChart,
    data: areaChartData,
    config: areaChartConfig,
    icon: "📈",
  },
];

const App = () => {
  const [selectedChart, setSelectedChart] = useState(chartComponents[0]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
       <div className="customization-sidebar">
         <BarChartCustomizer />
      </div>
        {/* <div className="sidebar-header">
          <h2>Chart Types</h2>
        </div>
        <div className="chart-grid">
          {chartComponents.map((chart) => (
            <div
              key={chart.id}
              className={`chart-card ${
                selectedChart.id === chart.id ? "active" : ""
              }`}
              onClick={() => setSelectedChart(chart)}
            >
              <span className="chart-icon">{chart.icon}</span>
              <h3>{chart.name}</h3>
            </div>
          ))}
        </div> */}
        {/* Export */}
        <ExportPanel
          chartType={selectedChart.id}
          data={selectedChart.data}
          config={selectedChart.config}
        />
     
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="chart-container">
          {React.createElement(selectedChart.component, {
            data: selectedChart.data,
            config: selectedChart.config,
          })}
        </div>
      </main>
    </div>
  );
};

export default App;
