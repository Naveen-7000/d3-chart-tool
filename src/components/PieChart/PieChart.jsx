/* eslint-disable react/prop-types */
import React from 'react';
import * as d3 from 'd3';
import './PieChart.styles.css';

const PieChart = ({ data, config }) => {
  React.useEffect(() => {
    drawChart();
    return () => {
      d3.select('#pieChart').selectAll('*').remove();
    };
  }, [data, config]);

  const drawChart = () => {
    // Clear existing chart
    d3.select('#pieChart').selectAll('*').remove();

    // Set dimensions
    const margin = config.dimensions.margin;
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // Create SVG
    const svg = d3.select('#pieChart')
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

    // Create main group element and move it to center
    const g = svg.append('g')
      .attr('transform', `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    // Create pie layout
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    // Create arcs
    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Add paths
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => config.color[i % config.color.length]);

    // Add labels
    const labelArc = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('fill', '#fff')
      .text(d => `${d.data.value}%`);

    // Add legends if enabled
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

      legendItems.append('rect')
        .attr('x', 0)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', (d, i) => config.color[i % config.color.length]);

      legendItems.append('text')
        .attr('x', 20)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('font-size', '12px')
        .text(d => d.category);
    }

    // Add tooltips
    if (config.toolTipVisibility) {
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      arcs.on('mouseover', function(d) {
          const e = d3.event;
          tooltip
            .style('opacity', 0.9)
            .style('color',"black")
            .html(`${d.data.category}<br/>${d.data.value}%`)
            .style('left', (e.pageX) + 'px')
            .style('top', (e.pageY - 28) + 'px');
          
          d3.select(this)
            .style('opacity', 1);
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
      <div id="pieChart"></div>
    </div>
  );
};

export default PieChart;