// src/store/slices/barChartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Basic Chart Configuration
  id: "renderChart",
  class: "drawBar",
  wrapper: "getChartWidth",

  // Chart Metadata
  metadata: {
    figNum: "FIGURE 1",
    heading: "Economics and sustainability dominate top resource management drivers",
    subHeading: "Below is the percentage of respondents who selected each statement as one of the top drivers of their resource management programs",
    sourceText: "Source: UI component library charts",
    showFigNum: true,
    showHeading: true,
    showSubHeading: true,
    isFooterNote: true
  },

  // Layout Configuration
  layout: {
    orientation: "vertical", // 'vertical' or 'horizontal'
    barAlignment: "center", // 'start', 'center', 'end'
    barPadding: 0.3,
    groupPadding: 0.2,
    minBarWidth: 2,
    maxBarWidth: 50
  },

  // Labels Configuration
  labels: {
    show: true,
    position: "outside", // 'outside', 'inside', 'top', 'right', 'bottom', 'left', 'none'
    rotation: 0,
    offset: 5,
    format: "percentage", // 'percentage', 'value', 'custom'
    customFormat: null,
    fontSize: 12,
    fontFamily: "Arial",
    fontWeight: "normal",
    color: "#666666"
  },

  // Legend Configuration
  legend: {
    show: true,
    position: "top", // 'top', 'right', 'bottom', 'left'
    layout: "horizontal", // 'horizontal', 'vertical'
    alignment: "start", // 'start', 'middle', 'end'
    itemWidth: 100,
    itemHeight: 20,
    itemSpacing: 10,
    symbolSize: 15,
    symbolShape: "rect", // 'rect', 'circle', 'line'
    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    title: {
      show: false,
      text: "Legend",
      fontSize: 14,
      fontWeight: "bold"
    },
    labels: {
      fontSize: 12,
      fontFamily: "Arial",
      color: "#333333"
    }
  },

  // Axes Configuration
  axes: {
    xAxis: {
      show: true,
      title: {
        show: false,
        text: "",
        fontSize: 12,
        fontWeight: "normal",
        padding: 10
      },
      tickRotation: -45,
      tickPadding: 5,
      tickFormat: "default", // 'default', 'percentage', 'custom'
      tickCount: 5,
      fontSize: 12,
      fontFamily: "Arial",
      color: "#666666"
    },
    yAxis: {
      show: true,
      title: {
        show: false,
        text: "",
        fontSize: 12,
        fontWeight: "normal",
        padding: 10
      },
      tickFormat: "percentage", // 'default', 'percentage', 'custom'
      tickCount: 5,
      fontSize: 12,
      fontFamily: "Arial",
      color: "#666666"
    }
  },

  // Grid Configuration
  grid: {
    show: true,
    horizontal: true,
    vertical: false,
    color: "#e0e0e0",
    opacity: 0.7,
    dasharray: "",
    width: 1
  },

  // Tooltip Configuration
  tooltip: {
    show: true,
    format: "default", // 'default', 'percentage', 'custom'
    customFormat: null,
    background: "#ffffff",
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    fontSize: 12,
    fontFamily: "Arial",
    color: "#333333",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowBlur: 2,
    shadowOffsetX: 2,
    shadowOffsetY: 2
  },

  // Style Configuration
  style: {
    colors: ["#9dd4cf", "#6fc2b4", "#00abab", "#0097a9", "#007680"],
    barOpacity: 1,
    cornerRadius: 0,
    strokeWidth: 0,
    strokeColor: "none",
    hoverEffect: {
      enabled: false,
      opacity: 0.8,
      highlightColor: null,
      shadowColor: "rgba(0,0,0,0.1)",
      shadowBlur: 4
    }
  },

  // Dimensions and Margins
  dimensions: {
    width: "auto", // 'auto' or number
    height: "auto", // 'auto' or number
    aspectRatio: 2, // Used when width or height is 'auto'
    margin: {
      top: 80,
      right: 30,
      bottom: 100,
      left: 100
    },
    responsive: true
  },

  // Animation Configuration
  animation: {
    enabled: true,
    duration: 750,
    easing: "easeExpOut", // 'linear', 'easeExpOut', 'easeElastic'
    delay: 0,
    stagger: 0
  }
};

const barChartSlice = createSlice({
  name: "barChart",
  initialState,
  reducers: {
    // Metadata updates
    updateMetadata: (state, action) => {
      state.metadata = { ...state.metadata, ...action.payload };
    },

    // Layout updates
    updateLayout: (state, action) => {
      state.layout = { ...state.layout, ...action.payload };
    },

    // Labels updates
    updateLabels: (state, action) => {
      state.labels = { ...state.labels, ...action.payload };
    },

    // Legend updates
    updateLegend: (state, action) => {
      state.legend = { ...state.legend, ...action.payload };
    },
    toggleLegend: (state) => {
      state.legend.show = !state.legend.show;
    },

    // Axes updates
    updateXAxis: (state, action) => {
      state.axes.xAxis = { ...state.axes.xAxis, ...action.payload };
    },
    updateYAxis: (state, action) => {
      state.axes.yAxis = { ...state.axes.yAxis, ...action.payload };
    },
    toggleXAxis: (state) => {
      state.axes.xAxis.show = !state.axes.xAxis.show;
    },
    toggleYAxis: (state) => {
      state.axes.yAxis.show = !state.axes.yAxis.show;
    },

    // Grid updates
    updateGrid: (state, action) => {
      state.grid = { ...state.grid, ...action.payload };
    },
    toggleGrid: (state) => {
      state.grid.show = !state.grid.show;
    },

    // Tooltip updates
    updateTooltip: (state, action) => {
      state.tooltip = { ...state.tooltip, ...action.payload };
    },
    toggleTooltip: (state) => {
      state.tooltip.show = !state.tooltip.show;
    },

    // Style updates
    updateStyle: (state, action) => {
      state.style = { ...state.style, ...action.payload };
    },
    updateColors: (state, action) => {
      state.style.colors = action.payload;
    },

    // Dimensions updates
    updateDimensions: (state, action) => {
      state.dimensions = {
        ...state.dimensions,
        ...action.payload,
        margin: {
          ...state.dimensions.margin,
          ...(action.payload.margin || {})
        }
      };
    },

    // Animation updates
    updateAnimation: (state, action) => {
      state.animation = { ...state.animation, ...action.payload };
    },
    toggleAnimation: (state) => {
      state.animation.enabled = !state.animation.enabled;
    },

    // Reset all or specific configurations
    resetConfig: () => initialState,
    resetSection: (state, action) => {
      const section = action.payload;
      if (initialState[section]) {
        state[section] = initialState[section];
      }
    }
  }
});

export const {
  updateMetadata,
  updateLayout,
  updateLabels,
  updateLegend,
  toggleLegend,
  updateXAxis,
  updateYAxis,
  toggleXAxis,
  toggleYAxis,
  updateGrid,
  toggleGrid,
  updateTooltip,
  toggleTooltip,
  updateStyle,
  updateColors,
  updateDimensions,
  updateAnimation,
  toggleAnimation,
  resetConfig,
  resetSection
} = barChartSlice.actions;

export default barChartSlice.reducer;