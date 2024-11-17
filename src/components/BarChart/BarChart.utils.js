/* eslint-disable no-unused-vars */
import * as d3 from "d3";

// Calculate legend dimensions
export const calculateLegendSpace = (data, width, height) => {
  return {
    width: 0, // Will be calculated based on actual content
    height: 0, // Will be calculated based on actual content
  };
};

// Create scales based on orientation
export const createScales = (config, data, width, height) => {
  const { orientation } = config.layout;

  const x =
    orientation === "vertical"
      ? d3
          .scaleBand()
          .range([0, width])
          .padding(config.layout.barPadding)
          .domain(data.map((d) => d.category))
      : d3
          .scaleLinear()
          .range([0, width])
          .domain([0, d3.max(data, (d) => d.value) * 1.1]);

  const y =
    orientation === "vertical"
      ? d3
          .scaleLinear()
          .range([height, 0])
          .domain([0, d3.max(data, (d) => d.value) * 1.1])
      : d3
          .scaleBand()
          .range([0, height])
          .padding(config.layout.barPadding)
          .domain(data.map((d) => d.category));

  return { x, y };
};

// D3 v4 compatible animation function
export const animateBar = (bar, config, scales, height) => {
  const isVertical = config.layout.orientation === "vertical";
  const duration = config.animation.duration;
  const easing = config.animation.easing;

  // Store final values
  const finalAttrs = isVertical
    ? {
        y: (d) => scales.y(d.value),
        height: (d) => height - scales.y(d.value),
      }
    : {
        width: (d) => scales.x(d.value),
      };

  // Initial state
  if (isVertical) {
    bar.attr("y", height).attr("height", 0);
  } else {
    bar.attr("width", 0);
  }

  // Manually animate using D3 v4
  const startTime = Date.now();

  function update() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Apply easing
    const easedProgress =
      easing === "easeExpOut"
        ? 1 - Math.pow(1 - progress, 3)
        : easing === "easeElastic"
        ? progress === 1
          ? 1
          : -Math.pow(2, -10 * progress) *
              Math.sin(((progress * 10 - 0.75) * 2 * Math.PI) / 3) +
            1
        : progress; // linear

    // Update attributes
    if (isVertical) {
      bar
        .attr("y", (d) => height - (height - finalAttrs.y(d)) * easedProgress)
        .attr("height", (d) => finalAttrs.height(d) * easedProgress);
    } else {
      bar.attr("width", (d) => finalAttrs.width(d) * easedProgress);
    }

    // Continue animation if not complete
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  // Start animation
  requestAnimationFrame(update);
};

// Add axes with proper formatting
export const addXAxis = (g, scales, config, height) => {
  const xAxis = g
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`);

  // Add axis with proper formatting
  if (config.layout.orientation === "vertical") {
    xAxis
      .call(d3.axisBottom(scales.x))
      .selectAll("text")
      .attr("transform", `rotate(${config.axes.xAxis.tickRotation})`)
      .style("text-anchor", "end")
      .style("font-size", `${config.axes.xAxis.fontSize}px`)
      .style("font-family", config.axes.xAxis.fontFamily)
      .style("fill", config.axes.xAxis.color);
  } else {
    xAxis.call(
      d3
        .axisBottom(scales.x)
        .ticks(config.axes.xAxis.tickCount)
        .tickFormat((d) => `${d}%`)
    );
  }
};

// Helper functions

export const adjustMarginsForLegend = (margin, legendSpace, legendConfig) => {
  if (!legendConfig.show) return margin;

  switch (legendConfig.position) {
    case "right":
      margin.right += legendSpace.width + legendConfig.padding.right;
      break;
    case "left":
      margin.left += legendSpace.width + legendConfig.padding.left;
      break;
    case "top":
      margin.top += legendSpace.height + legendConfig.padding.top;
      break;
    case "bottom":
      margin.bottom += legendSpace.height + legendConfig.padding.bottom;
      break;
  }
  return margin;
};

export const addYAxis = (g, scales, config) => {
  const yAxis = g.append("g").attr("class", "y-axis");

  if (config.layout.orientation === "vertical") {
    yAxis.call(
      d3
        .axisLeft(scales.y)
        .ticks(config.axes.yAxis.tickCount)
        .tickFormat((d) =>
          config.axes.yAxis.tickFormat === "percentage" ? `${d}%` : d
        )
    );
  } else {
    yAxis.call(d3.axisLeft(scales.y));
  }

  yAxis
    .selectAll("text")
    .style("font-size", `${config.axes.yAxis.fontSize}px`)
    .style("font-family", config.axes.yAxis.fontFamily)
    .style("fill", config.axes.yAxis.color);

  // Add Y-axis title if configured
  if (config.axes.yAxis.title.show) {
    yAxis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -config.axes.yAxis.title.padding)
      .attr("x", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-size", `${config.axes.yAxis.title.fontSize}px`)
      .style("font-weight", config.axes.yAxis.title.fontWeight)
      .text(config.axes.yAxis.title.text);
  }
};

export const addGrid = (g, scales, config, width, height) => {
  if (config.grid.horizontal) {
    g.append("g")
      .attr("class", "grid horizontal-grid")
      .call(
        d3
          .axisLeft(scales.y)
          .ticks(config.axes.yAxis.tickCount)
          .tickSize(-width)
          .tickFormat("")
      )
      .style("stroke", config.grid.color)
      .style("stroke-opacity", config.grid.opacity)
      .style("stroke-dasharray", config.grid.dasharray)
      .style("stroke-width", config.grid.width);
  }

  if (config.grid.vertical) {
    g.append("g")
      .attr("class", "grid vertical-grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(scales.x).tickSize(-height).tickFormat(""))
      .style("stroke", config.grid.color)
      .style("stroke-opacity", config.grid.opacity)
      .style("stroke-dasharray", config.grid.dasharray)
      .style("stroke-width", config.grid.width);
  }
};

export const addBars = (g, data, scales, config) => {
  const { x, y } = scales;
  const isVertical = config.layout.orientation === "vertical";

  const barsGroup = g.append("g").attr("class", "bars");

  const bars = barsGroup
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .style(
      "fill",
      (d, i) => config.style.colors[i % config.style.colors.length]
    )
    .style("stroke", config.style.strokeColor)
    .style("stroke-width", config.style.strokeWidth)
    .style("opacity", config.style.barOpacity)
    .attr("rx", config.style.cornerRadius)
    .attr("ry", config.style.cornerRadius);

  if (isVertical) {
    bars.attr("x", (d) => x(d.category)).attr("width", x.bandwidth());
  } else {
    bars.attr("y", (d) => y(d.category)).attr("height", y.bandwidth());
  }

  if (config.animation.enabled) {
    animateBar(
      bars,
      config,
      scales,
      isVertical ? scales.y.range()[0] : scales.x.range()[1]
    );
  } else {
    if (isVertical) {
      bars
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => scales.y.range()[0] - y(d.value));
    } else {
      bars.attr("x", 0).attr("width", (d) => x(d.value));
    }
  }

  return bars;
};

export const addLabels = (g, data, scales, config) => {
  const isVertical = config.layout.orientation === "vertical";
  const { x, y } = scales;

  const labels = g
    .append("g")
    .attr("class", "bar-labels")
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .style("font-size", `${config.labels.fontSize}px`)
    .style("font-family", config.labels.fontFamily)
    .style("font-weight", config.labels.fontWeight)
    .style("fill", config.labels.color)
    .text((d) =>
      config.labels.format === "percentage" ? `${d.value}%` : d.value
    );

  if (isVertical) {
    labels
      .attr("x", (d) => x(d.category) + x.bandwidth() / 2)
      .attr("text-anchor", "middle");

    switch (config.labels.position) {
      case "inside":
        labels.attr(
          "y",
          (d) => y(d.value) + config.labels.offset + config.labels.fontSize
        );
        break;
      case "outside":
        labels.attr("y", (d) => y(d.value) - config.labels.offset);
        break;
      case "top":
        labels.attr("y", (d) => y(d.value) - config.labels.offset);
        break;
      case "bottom":
        labels.attr("y", (d) => y(0) - config.labels.offset);
        break;
    }
  } else {
    labels
      .attr("y", (d) => y(d.category) + y.bandwidth() / 2)
      .attr("dy", ".35em");

    switch (config.labels.position) {
      case "inside":
        labels
          .attr("x", (d) => x(d.value) - config.labels.offset)
          .attr("text-anchor", "end");
        break;
      case "outside":
        labels
          .attr("x", (d) => x(d.value) + config.labels.offset)
          .attr("text-anchor", "start");
        break;
      case "right":
        labels
          .attr("x", (d) => x(d.value) + config.labels.offset)
          .attr("text-anchor", "start");
        break;
      case "left":
        labels.attr("x", 0 - config.labels.offset).attr("text-anchor", "end");
        break;
    }
  }

  if (config.labels.rotation !== 0) {
    labels.attr("transform", (d) => {
      const x = isVertical
        ? scales.x(d.category) + scales.x.bandwidth() / 2
        : config.labels.position === "inside"
        ? scales.x(d.value) - config.labels.offset
        : scales.x(d.value) + config.labels.offset;
      const y = isVertical
        ? config.labels.position === "inside"
          ? scales.y(d.value) + config.labels.offset
          : scales.y(d.value) - config.labels.offset
        : scales.y(d.category) + scales.y.bandwidth() / 2;
      return `rotate(${config.labels.rotation},${x},${y})`;
    });
  }
};

export const addLegend = (svg, data, config, margin, width) => {
  const legend = svg.append("g").attr("class", "legend");

  const legendX = getLegendX(config.legend, width, margin);
  const legendY = getLegendY(config.legend, margin);

  legend.attr("transform", `translate(${legendX},${legendY})`);

  // Add legend title if configured
  if (config.legend.title.show) {
    legend
      .append("text")
      .attr("class", "legend-title")
      .attr("x", 0)
      .attr("y", 0)
      .style("font-size", `${config.legend.title.fontSize}px`)
      .style("font-weight", config.legend.title.fontWeight)
      .text(config.legend.title.text);
  }

  const legendItems = legend
    .selectAll(".legend-item")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => {
      const x =
        config.legend.layout === "horizontal"
          ? i * (config.legend.itemWidth + config.legend.itemSpacing)
          : 0;
      const y =
        config.legend.layout === "horizontal"
          ? 0
          : i * (config.legend.itemHeight + config.legend.itemSpacing);
      return `translate(${x},${y})`;
    });

  // Add symbols based on configuration
  switch (config.legend.symbolShape) {
    case "rect":
      legendItems
        .append("rect")
        .attr("width", config.legend.symbolSize)
        .attr("height", config.legend.symbolSize)
        .style(
          "fill",
          (d, i) => config.style.colors[i % config.style.colors.length]
        );
      break;
    case "circle":
      legendItems
        .append("circle")
        .attr("r", config.legend.symbolSize / 2)
        .attr("cx", config.legend.symbolSize / 2)
        .attr("cy", config.legend.symbolSize / 2)
        .style(
          "fill",
          (d, i) => config.style.colors[i % config.style.colors.length]
        );
      break;
    case "line":
      legendItems
        .append("line")
        .attr("x1", 0)
        .attr("x2", config.legend.symbolSize)
        .attr("y1", config.legend.symbolSize / 2)
        .attr("y2", config.legend.symbolSize / 2)
        .style(
          "stroke",
          (d, i) => config.style.colors[i % config.style.colors.length]
        )
        .style("stroke-width", 2);
      break;
  }

  // Add legend labels
  legendItems
    .append("text")
    .attr("x", config.legend.symbolSize + 5)
    .attr("y", config.legend.symbolSize / 2)
    .attr("dy", ".35em")
    .style("font-size", `${config.legend.labels.fontSize}px`)
    .style("font-family", config.legend.labels.fontFamily)
    .style("fill", config.legend.labels.color)
    .text((d) => d.category);
};

export const addTooltips = (bars, config) => {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background", config.tooltip.background)
    .style(
      "border",
      `${config.tooltip.borderWidth}px solid ${config.tooltip.borderColor}`
    )
    .style("border-radius", `${config.tooltip.borderRadius}px`)
    .style("padding", `${config.tooltip.padding}px`)
    .style("font-size", `${config.tooltip.fontSize}px`)
    .style("font-family", config.tooltip.fontFamily)
    .style("color", config.tooltip.color)
    .style(
      "box-shadow",
      `${config.tooltip.shadowOffsetX}px ${config.tooltip.shadowOffsetY}px ${config.tooltip.shadowBlur}px ${config.tooltip.shadowColor}`
    );

  bars
    .on("mouseover", function (d) {
      const e = d3.event;

      // Handle hover effect
      if (config.style.hoverEffect.enabled) {
        d3.select(this)
          .style("opacity", config.style.hoverEffect.opacity)
          .style(
            "fill",
            config.style.hoverEffect.highlightColor ||
              d3.select(this).style("fill")
          )
          .style(
            "filter",
            `drop-shadow(${config.style.hoverEffect.shadowBlur}px ${config.style.hoverEffect.shadowBlur}px ${config.style.hoverEffect.shadowBlur}px ${config.style.hoverEffect.shadowColor})`
          );
      }

      // Show tooltip
      tooltip
        .style("opacity", 1)
        .html(formatTooltipContent(d, config))
        .style("left", `${e.pageX}px`)
        .style("top", `${e.pageY - 28}px`);
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);

      if (config.style.hoverEffect.enabled) {
        d3.select(this)
          .style("opacity", config.style.barOpacity)
          .style("fill", null)
          .style("filter", null);
      }
    });
};

export const addMetadata = (svg, config, margin, width, height) => {
  if (config.metadata.showFigNum) {
    svg
      .append("text")
      .attr("class", "fig-num")
      .attr("x", margin.left)
      .attr("y", 25)
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "black")
      .text(config.metadata.figNum);
  }

  if (config.metadata.showHeading) {
    svg
      .append("text")
      .attr("class", "chart-heading")
      .attr("x", margin.left)
      .attr("y", 50)
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "black")
      .text(config.metadata.heading);
  }

  if (config.metadata.showSubHeading) {
    svg
      .append("text")
      .attr("class", "chart-subheading")
      .attr("x", margin.left)
      .attr("y", 70)
      .style("font-size", "14px")
      .style("fill", "black")
      .text(config.metadata.subHeading);
  }

  if (config.metadata.isFooterNote) {
    svg
      .append("text")
      .attr("class", "source-text")
      .attr("x", margin.left)
      .attr("y", height + margin.top + margin.bottom - 5)
      .style("font-size", "12px")
      .style("font-style", "italic")
      .style("fill", "black")
      .text(config.metadata.sourceText);
  }
};

export const getLegendX = (legendConfig, width, margin) => {
  switch (legendConfig.position) {
    case "right":
      return width + margin.left + legendConfig.padding.left;
    case "left":
      return legendConfig.padding.left;
    case "top":
    case "bottom":
      switch (legendConfig.alignment) {
        case "start":
          return margin.left;
        case "middle":
          return margin.left + width / 2;
        case "end":
          return margin.left + width - legendConfig.padding.right;
        default:
          return margin.left;
      }
    default:
      return margin.left;
  }
};

export const getLegendY = (legendConfig, margin) => {
  switch (legendConfig.position) {
    case "bottom":
      return margin.top + legendConfig.padding.top;
    case "top":
      return legendConfig.padding.top;
    default:
      return margin.top;
  }
};

export const formatTooltipContent = (d, config) => {
  switch (config.tooltip.format) {
    case "percentage":
      return `${d.category}<br/>${d.value}%`;
    case "custom":
      return config.tooltip.customFormat(d);
    default:
      return `${d.category}<br/>${d.value}`;
  }
};

export const calculateBarWidth = (config, bandwidth) => {
  const width = bandwidth;
  if (config.layout.minBarWidth && width < config.layout.minBarWidth) {
    return config.layout.minBarWidth;
  }
  if (config.layout.maxBarWidth && width > config.layout.maxBarWidth) {
    return config.layout.maxBarWidth;
  }
  return width;
};

export const applyBarStyles = (bar, config) => {
  return bar
    .style(
      "fill",
      (d, i) => config.style.colors[i % config.style.colors.length]
    )
    .style("stroke", config.style.strokeColor)
    .style("stroke-width", config.style.strokeWidth)
    .style("opacity", config.style.barOpacity)
    .attr("rx", config.style.cornerRadius)
    .attr("ry", config.style.cornerRadius);
};

export const handleBarInteractions = (bar, config) => {
  if (config.style.hoverEffect.enabled) {
    bar
      .on("mouseover", function () {
        d3.select(this)
          .style("opacity", config.style.hoverEffect.opacity)
          .style(
            "fill",
            config.style.hoverEffect.highlightColor ||
              d3.select(this).style("fill")
          )
          .style(
            "filter",
            `drop-shadow(${config.style.hoverEffect.shadowBlur}px ${config.style.hoverEffect.shadowBlur}px ${config.style.hoverEffect.shadowBlur}px ${config.style.hoverEffect.shadowColor})`
          );
      })
      .on("mouseout", function (d, i) {
        d3.select(this)
          .style("opacity", config.style.barOpacity)
          .style("fill", config.style.colors[i % config.style.colors.length])
          .style("filter", null);
      });
  }
};

export const getEasingFunction = (type) => {
  switch (type) {
    case "easeExpOut":
      return d3.easeExpOut;
    case "easeElastic":
      return d3.easeElastic;
    case "easeBounce":
      return d3.easeBounce;
    default:
      return d3.easeLinear;
  }
};

export const animateValue = (start, end, duration, callback) => {
  const startTime = Date.now();

  const update = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    callback(start + (end - start) * progress);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

export const createGradient = (svg, config) => {
  // Create gradients for bars if specified in config
  if (config.style.gradient) {
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", config.style.gradient.startColor);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", config.style.gradient.endColor);

    return "url(#bar-gradient)";
  }
  return null;
};

export const applyResponsiveness = (svg, config, width, height) => {
  if (config.dimensions.responsive) {
    const aspect = width / height;
    const container = d3.select("#barChart");

    const resize = () => {
      const targetWidth = container.node().getBoundingClientRect().width;
      svg.attr("width", targetWidth);
      svg.attr("height", targetWidth / aspect);
    };

    window.addEventListener("resize", resize);
    resize(); // Initial resize

    return () => window.removeEventListener("resize", resize);
  }
};

export const formatAxisTicks = (value, format) => {
  switch (format) {
    case "percentage":
      return `${value}%`;
    case "decimal":
      return d3.format(",.2f")(value);
    case "integer":
      return d3.format(",.0f")(value);
    case "shorthand":
      return d3.format(".2s")(value);
    default:
      return value;
  }
};

export const calculateLegendDimensions = (data, config) => {
  // Estimate text width (approximate calculation)
  const maxLabelLength = Math.max(...data.map((d) => d.category.length));
  const estimatedCharWidth = 8; // Approximate width per character
  const labelWidth = maxLabelLength * estimatedCharWidth;

  const itemWidth = config.legend.symbolSize + 5 + labelWidth;
  const itemHeight = Math.max(
    config.legend.symbolSize,
    config.legend.labels.fontSize
  );

  const totalItems = data.length;

  if (config.legend.layout === "horizontal") {
    return {
      width:
        (itemWidth + config.legend.itemSpacing) * totalItems -
        config.legend.itemSpacing,
      height:
        itemHeight + config.legend.padding.top + config.legend.padding.bottom,
    };
  } else {
    return {
      width:
        itemWidth + config.legend.padding.left + config.legend.padding.right,
      height:
        (itemHeight + config.legend.itemSpacing) * totalItems -
        config.legend.itemSpacing,
    };
  }
};
