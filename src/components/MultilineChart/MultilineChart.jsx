/* eslint-disable react/prop-types */
import React from 'react';
import * as d3 from 'd3';
import './MultilineChart.styles.css';

const MultilineChart = ({ data, config }) => {
  React.useEffect(() => {
    drawChart();
    return () => {
      d3.select('#multilineChart').selectAll('*').remove();
    };
  }, [data, config]);

  const drawChart = () => {
    // Clear existing chart
    d3.select('#multilineChart').selectAll('*').remove();

    // Set dimensions
    const margin = config.dimensions.margin;
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#multilineChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    // Add title elements
    svg.append('text')
      .attr('class', 'fig-num')
      .attr('x', margin.left)
      .attr('y', 25)
      .text(config.figNum);

    svg.append('text')
      .attr('class', 'chart-heading')
      .attr('x', margin.left)
      .attr('y', 50)
      .text(config.heading);

    svg.append('text')
      .attr('class', 'chart-subheading')
      .attr('x', margin.left)
      .attr('y', 70)
      .text(config.subHeading);

    // Create main group element
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Get all dates and values for scales
    const allDates = data[0].values.map(d => new Date(d.date));
    const allValues = data.reduce((acc, line) => 
      acc.concat(line.values.map(v => v.value)), []);

    // Create scales
    const x = d3.scaleTime()
      .rangeRound([0, width])
      .domain(d3.extent(allDates));

    const y = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(allValues) * 1.1]); // Add 10% padding to top

    // Create line generator
    const line = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.value));

    // Add X axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d3.timeFormat('%b %Y')));

    // Add Y axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => `${d}%`));

    // Add gridlines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(''));

    // Add lines
    const lines = g.selectAll('.line-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'line-group');

    lines.append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.values))
      .style('fill', 'none')
      .style('stroke', (d, i) => config.color[i % config.color.length])
      .style('stroke-width', 2);

    // Add dots for each data point
    data.forEach((series, seriesIndex) => {
      g.selectAll(`.dot-group-${seriesIndex}`)
        .data(series.values)
        .enter()
        .append('circle')
        .attr('class', `dot-group-${seriesIndex} dot`)
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d.value))
        .attr('r', 4)
        .style('fill', config.color[seriesIndex % config.color.length]);
    });

    // Add legend
    if (config.legendVisibility) {
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 100}, ${margin.top + 20})`);

      const legendItems = legend.selectAll('.legend-item')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

      legendItems.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 5)
        .attr('y2', 5)
        .style('stroke', (d, i) => config.color[i % config.color.length])
        .style('stroke-width', 2);

      legendItems.append('text')
        .attr('x', 30)
        .attr('y', 9)
        .style('font-size', '12px')
        .text(d => d.name);
    }

    // Add tooltips
    if (config.toolTipVisibility) {
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0)
          .style('position', 'absolute')
          .style('background-color', 'white')
          .style('padding', '8px')
          .style('border', '1px solid #ccc')
          .style('border-radius', '4px')
          .style('pointer-events', 'none');
  
        // Add tooltip behavior to dots
        g.selectAll('.dot')
          .on('mouseover', function(d) {
            // In D3 v4, 'this' refers to the DOM element
            const dotClass = this.getAttribute('class');
            const seriesIndex = parseInt(dotClass.split('-')[2]);
            const seriesName = data[seriesIndex].name;
            
            tooltip
              .style('opacity', 0.9)
              .style('color', '#333')
              .html(`
                <div style="font-weight: bold;">${seriesName}</div>
                <div>${d3.timeFormat('%b %Y')(new Date(d.date))}</div>
                <div>${d.value}%</div>
              `)
              .style('left', (d3.event.pageX + 10) + 'px')
              .style('top', (d3.event.pageY - 28) + 'px');
  
            // Highlight the current dot
            d3.select(this)
              .attr('r', 6)
              .style('stroke', '#fff')
              .style('stroke-width', 2);
  
            // Highlight the corresponding line
            g.selectAll('.line')
              .filter((lineData, i) => i === seriesIndex)
              .style('stroke-width', 3);
          })
          .on('mouseout', function(d) {
            tooltip.style('opacity', 0);
  
            // Reset dot size
            d3.select(this)
              .attr('r', 4)
              .style('stroke', 'none');
  
            // Reset line width
            g.selectAll('.line')
              .style('stroke-width', 2);
          });
      }
  

    // Add source text
    if (config.isFooterNote) {
      svg.append('text')
        .attr('class', 'source-text')
        .attr('x', margin.left)
        .attr('y', height + margin.top + margin.bottom - 5)
        .text(config.sourceText);
    }
  };

  return (
    <div className="chart-container">
      <div id="multilineChart"></div>
    </div>
  );
};

export default MultilineChart;