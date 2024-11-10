/* eslint-disable react/prop-types */
import React from 'react';
import * as d3 from 'd3';
import './StackedBarChart.styles.css';

const StackedBarChart = ({ data, config }) => {
  React.useEffect(() => {
    drawChart();
    return () => {
      d3.select('#stackedBarChart').selectAll('*').remove();
    };
  }, [data, config]);

  const drawChart = () => {
    // Clear existing chart
    d3.select('#stackedBarChart').selectAll('*').remove();

    // Set dimensions
    const margin = config.dimensions.margin;
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#stackedBarChart')
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

    // Get keys for stacking (excluding the 'month' property)
    const keys = Object.keys(data[0]).filter(key => key !== 'month');

    // Stack the data
    const stack = d3.stack()
      .keys(keys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedData = stack(data);

    // Create scales
    const x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.3)
      .domain(data.map(d => d.month));

    const y = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]);

    // Add X axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

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

    // Create and add the bar groups
    const barGroups = g.selectAll('.bar-group')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .style('fill', (d, i) => config.color[i]);

    // Add the bars
    barGroups.selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.data.month))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());

    // Add legend
    if (config.legendVisibility) {
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 100}, ${margin.top + 20})`);

      const legendItems = legend.selectAll('.legend-item')
        .data(keys)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

      legendItems.append('rect')
        .attr('x', 0)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', (d, i) => config.color[i]);

      legendItems.append('text')
        .attr('x', 20)
        .attr('y', 9)
        .style('font-size', '12px')
        .text(d => d);
    }

    // Add tooltips
    if (config.toolTipVisibility) {
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      barGroups.selectAll('rect')
        .on('mouseover', function(d) {
          const e = d3.event;
          const key = d3.select(this.parentNode).datum().key;
          const value = d[1] - d[0];
          
          tooltip
            .style('opacity', 0.9)
            .style('color',"black")
            .html(`${d.data.month}<br/>${key}: ${value}%`)
            .style('left', (e.pageX) + 'px')
            .style('top', (e.pageY - 28) + 'px');
          
          d3.select(this)
            .style('opacity', 0.8);
        })
        .on('mouseout', function() {
          tooltip
            .style('opacity', 0);
          
          d3.select(this)
            .style('opacity', 1);
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
      <div id="stackedBarChart"></div>
    </div>
  );
};

export default StackedBarChart;