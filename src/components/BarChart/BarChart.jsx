/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
import * as d3 from "d3";
import "./BarChart.styles.css";
import { addBars, addGrid, addLabels, addLegend, addMetadata, addTooltips, addXAxis, addYAxis, adjustMarginsForLegend, calculateLegendSpace, createScales } from "./BarChart.utils";

const BarChart = ({ data }) => {
  const config = useSelector((state) => state.barChart);

  React.useEffect(() => {
    drawChart();
    return () => {
      d3.select("#barChart").selectAll("*").remove();
    };
  }, [data, config]);

  const drawChart = () => {
    // Clear previous chart
    d3.select("#barChart").selectAll("*").remove();

    // Base dimensions
    const baseWidth = config.dimensions.width === 'auto' ? 800 : config.dimensions.width;
    const baseHeight = config.dimensions.height === 'auto' ?
      baseWidth / config.dimensions.aspectRatio : config.dimensions.height;

    // Calculate margins with legend space
    const margin = { ...config.dimensions.margin };
    const legendSpace = calculateLegendSpace(data, baseWidth, baseHeight);
    adjustMarginsForLegend(margin, legendSpace, config.legend);

    // Calculate actual chart dimensions
    const width = baseWidth - margin.left - margin.right;
    const height = baseHeight - margin.top - margin.bottom;

    // Create SVG with defined viewBox for responsiveness
    const svg = d3.select("#barChart")
      .append("svg")
      .attr("width", baseWidth)
      .attr("height", baseHeight)
      .attr("viewBox", `0 0 ${baseWidth} ${baseHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Create chart area group
    const g = svg.append("g")
      .attr("class", "chart-area")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add clip path for chart area
    g.append("clipPath")
      .attr("id", "chart-area-clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    // Create scales based on orientation
    const scales = createScales(config, data, width, height);

        // Add metadata (titles, source, etc.)
        addMetadata(svg, config, margin, width, height);
    
    // Add axes
    if (config.axes.xAxis.show) addXAxis(g, scales, config, height);
    if (config.axes.yAxis.show) addYAxis(g, scales, config, height);
    if (config.grid.show) addGrid(g, scales, config, width, height);

    // Add bars with animation
    const barsGroup = addBars(g, data, scales, config);
    
    // Add labels if enabled
    if (config.labels.show) addLabels(g, data, scales, config);
    
    // Add legend if enabled
    if (config.legend.show) addLegend(svg, data, config, margin, width, height);
    
    // Add tooltips if enabled
    if (config.tooltip.show) addTooltips(barsGroup, config);
    

  };

  return (
    <div>
      <div id="barChart"></div>
    </div>
  );
};

export default BarChart;