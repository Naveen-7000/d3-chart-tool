export const pieChartConfig = {
    id: "renderChart",
    class: "drawPie",
    wrapper: "getChartWidth",
    figNum: "FIGURE 3",
    heading: "Distribution by Category",
    subHeading: "Percentage breakdown across different categories",
    toolTipVisibility: true,
    legendVisibility: true,
    color: ["#9dd4cf", "#6fc2b4", "#00abab", "#0097a9", "#007680"],
    isFooterNote: true,
    sourceText: "Source: UI component library charts",
    dimensions: {
      margin: {
        top: 80,
        right: 120, // Extra space for legend
        bottom: 50,
        left: 60
      }
    }
  };

export  const lineChartConfig = {
    id: "renderChart",
    class: "drawLine",
    wrapper: "getChartWidth",
    figNum: "FIGURE 2",
    heading: "Monthly Performance Trends",
    subHeading: "Performance metrics over the past 7 months",
    isAverageLine: false,
    toolTipVisibility: true,
    legendVisibility: true,
    color: ["#00abab"],
    isFooterNote: true,
    sourceText: "Source: UI component library charts",
    dimensions: {
      margin: {
        top: 80,
        right: 30,
        bottom: 50,
        left: 60
      }
    }
  };

export  const barChartConfig = {
    id: "renderChart",
    class: "drawBar",
    wrapper: "getChartWidth",
    figNum: "FIGURE 1",
    heading: "Economics and sustainability dominate top resource management drivers",
    subHeading: "Below is the percentage of respondents who selected each statement as one of the top drivers of their resource management programs",
    isAverageLine: false,
    toolTipVisibility: true,
    legendVisibility: true,
    averageStrokeColor: "#BBCBCB",
    color: ["#9dd4cf", "#6fc2b4", "#00abab", "#0097a9", "#007680"],
    isFooterNote: true,
    sourceText: "Source: UI component library charts",
    dimensions: {
      margin: {
        top: 80,
        right: 30,
        bottom: 100,
        left: 60
      }
    }
  };

  export const donutChartConfig = {
    id: "renderChart",
    class: "drawDonut",
    wrapper: "getChartWidth",
    figNum: "FIGURE 4",
    heading: "Distribution by Category",
    subHeading: "Percentage breakdown across different categories",
    toolTipVisibility: true,
    legendVisibility: true,
    color: ["#9dd4cf", "#6fc2b4", "#00abab", "#0097a9", "#007680"],
    isFooterNote: true,
    sourceText: "Source: UI component library charts",
    dimensions: {
      margin: {
        top: 80,
        right: 120, // Extra space for legend
        bottom: 50,
        left: 60
      }
    }
  };

  export const multilineChartConfig = {
    id: "renderChart",
    class: "drawMultiline",
    wrapper: "getChartWidth",
    figNum: "FIGURE 5",
    heading: "Performance Comparison",
    subHeading: "Tracking multiple metrics over time",
    toolTipVisibility: true,
    legendVisibility: true,
    color: ["#00abab", "#0097a9", "#007680"],
    isFooterNote: true,
    sourceText: "Source: UI component library charts",
    dimensions: {
      margin: {
        top: 80,
        right: 120,
        bottom: 50,
        left: 60
      }
    }
  };

  export const groupedBarConfig = {
    id: "renderChart",
    class: "drawGroupedBar",
    wrapper: "getChartWidth",
    figNum: "FIGURE 7",
    heading: "Product Performance Comparison",
    subHeading: "Monthly performance comparison by product",
    toolTipVisibility: true,
    legendVisibility: true,
    valueLabels: true,
    color: ["#9dd4cf", "#6fc2b4", "#00abab"],
    isFooterNote: true,
    sourceText: "Source: UI component library charts",
    dimensions: {
      margin: {
        top: 80,
        right: 120,
        bottom: 70,
        left: 60
      }
    }
  };
  
  export const stackedBarConfig = {
    id: "renderChart",
    class: "drawStackedBar",
    wrapper: "getChartWidth",
    figNum: "FIGURE 6",
    heading: "Product Performance by Month",
    subHeading: "Monthly performance breakdown by product",
    toolTipVisibility: true,
    legendVisibility: true,
    color: ["#9dd4cf", "#6fc2b4", "#00abab"],
    isFooterNote: true,
    sourceText: "Source: UI component library charts",
    dimensions: {
      margin: {
        top: 80,
        right: 120,
        bottom: 70,
        left: 60
      }
    }
  };

  export const areaChartConfig = {
    id: "renderChart",
    class: "drawArea",
    wrapper: "getChartWidth",
    figNum: "FIGURE 8",
    heading: "Growth Trend Analysis",
    subHeading: "Monthly performance trends over time",
    toolTipVisibility: true,
    valueLabels: true,
    color: ["#00abab"],
    isFooterNote: true,
    sourceText: "Source: UI component library charts",
    dimensions: {
      margin: {
        top: 80,
        right: 30,
        bottom: 50,
        left: 60
      }
    }
  };