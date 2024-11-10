/* eslint-disable react/prop-types */
import React from 'react';
import * as d3 from 'd3';
import './GroupedBarChart.styles.css';

const GroupedBarChart = ({ data, config }) => {
  React.useEffect(() => {
    drawChart();
    return () => {
      d3.select('#groupedBarChart').selectAll('*').remove();
    };
  }, [data, config]);

  const drawChart = () => {
    // Clear existing chart
    d3.select('#groupedBarChart').selectAll('*').remove();

    // Set dimensions
    const margin = config.dimensions.margin;
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#groupedBarChart')
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

    // Get keys for grouping (excluding the 'month' property)
    const keys = Object.keys(data[0]).filter(key => key !== 'month');

    // Create scales
    const x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingOuter(0.2)
      .domain(data.map(d => d.month));

    const x1 = d3.scaleBand()
      .padding(0.05)
      .domain(keys)
      .rangeRound([0, x0.bandwidth()]);

    const y = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice();

    // Add X axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))
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
    const barGroups = g.selectAll('.month')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'month')
      .attr('transform', d => `translate(${x0(d.month)},0)`);

    // Add the bars for each group
    barGroups.selectAll('.bar')
      .data(d => keys.map(key => ({ key, value: d[key] })))
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x1(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', d => config.color[keys.indexOf(d.key)]);

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

      barGroups.selectAll('.bar')
        .on('mouseover', function(d) {
          const e = d3.event;
          const monthGroup = d3.select(this.parentNode);
          const monthData = monthGroup.datum();
          
          tooltip
            .style('opacity', 0.9)
            .style('color',"black")
            .html(`${monthData.month}<br/>${d.key}: ${d.value}%`)
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

    // Add value labels on bars
    if (config.valueLabels) {
      barGroups.selectAll('.value-label')
        .data(d => keys.map(key => ({ key, value: d[key] })))
        .enter()
        .append('text')
        .attr('class', 'value-label')
        .attr('x', d => x1(d.key) + x1.bandwidth() / 2)
        .attr('y', d => y(d.value) - 5)
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
      <div id="groupedBarChart"></div>
    </div>
  );
};

export default GroupedBarChart;