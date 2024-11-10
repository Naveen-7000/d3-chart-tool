// src/components/BarChart/BarChart.js
import React from 'react';
import * as d3 from 'd3';
import './BarChart.styles.css';

const BarChart = ({ data, config }) => {
  React.useEffect(() => {
    drawChart();
    // Cleanup function
    return () => {
      d3.select('#barChart').selectAll('*').remove();
    };
  }, [data, config]);

  const drawChart = () => {
    // Clear any existing SVG
    d3.select('#barChart').selectAll('*').remove();

    // Set dimensions
    const margin = config.dimensions.margin;
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#barChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    // Create main group element
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.3)
      .domain(data.map(d => d.category));

    const y = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain([0, 100]);

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
        .tickFormat(d => d + '%'));

    // Add gridlines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(''));

    // Create bars
    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.category))
      .attr('width', x.bandwidth())
      .style('fill', (d, i) => config.color[i]);

    // Simple CSS animation instead of JavaScript animation
    bars
      .attr('height', 0)
      .attr('y', height)
      .attr('data-height', d => height - y(d.value))
      .attr('data-y', d => y(d.value))
      .classed('animate-bar', true);

    // Trigger reflow to ensure animation works
    void document.body.offsetHeight;

    // Set final values
    bars
      .attr('height', d => height - y(d.value))
      .attr('y', d => y(d.value));

    // Add tooltips
    if (config.toolTipVisibility) {
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      bars
        .on('mouseover', function(d) {
          const e = d3.event;
          tooltip
            .style('opacity', 0.9)
            .style('color',"black")
            .html(`${d.category}<br/>${d.value}%`)
            .style('left', `${e.pageX}px`)
            .style('top', `${e.pageY - 28}px`);
          
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

    // Add text elements after bars
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
      <div id="barChart"></div>
    </div>
  );
};

export default BarChart;