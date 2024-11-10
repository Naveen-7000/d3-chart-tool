/* eslint-disable react/prop-types */
import React from 'react';
import * as d3 from 'd3';
import './AreaChart.styles.css';

const AreaChart = ({ data, config }) => {
  React.useEffect(() => {
    drawChart();
    return () => {
      d3.select('#areaChart').selectAll('*').remove();
    };
  }, [data, config]);

  const drawChart = () => {
    // Clear existing chart
    d3.select('#areaChart').selectAll('*').remove();

    // Set dimensions
    const margin = config.dimensions.margin;
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#areaChart')
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

    // Create scales
    const x = d3.scaleTime()
      .rangeRound([0, width])
      .domain(d3.extent(data, d => new Date(d.date)));

    const y = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(data, d => d.value) * 1.1]); // Add 10% padding

    // Create area generator
    const area = d3.area()
      .x(d => x(new Date(d.date)))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Create line generator for the top edge
    const line = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

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

    // Add the area path
    g.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('d', area)
      .style('fill', config.color[0])
      .style('opacity', 0.6);

    // Add the line path
    g.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', config.color[0])
      .style('stroke-width', 2);

    // Add dots for data points
    const dots = g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.value))
      .attr('r', 4)
      .style('fill', config.color[0]);

    // Add tooltips
    if (config.toolTipVisibility) {
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      dots.on('mouseover', function(d) {
          const e = d3.event;
          tooltip
            .style('opacity', 0.9)
            .style('color',"black")
            .html(`${d3.timeFormat('%b %Y')(new Date(d.date))}<br/>${d.value}%`)
            .style('left', (e.pageX) + 'px')
            .style('top', (e.pageY - 28) + 'px');
          
          d3.select(this)
            .attr('r', 6)
            .style('fill-opacity', 1);
        })
        .on('mouseout', function() {
          tooltip
            .style('opacity', 0);
          
          d3.select(this)
            .attr('r', 4)
            .style('fill-opacity', 0.8);
        });
    }

    // Add value labels if enabled
    if (config.valueLabels) {
      g.selectAll('.value-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'value-label')
        .attr('x', d => x(new Date(d.date)))
        .attr('y', d => y(d.value) - 10)
        .attr('text-anchor', 'middle')
        .text(d => `${d.value}%`);
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
      <div id="areaChart"></div>
    </div>
  );
};

export default AreaChart;