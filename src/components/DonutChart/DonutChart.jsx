/* eslint-disable react/prop-types */
import React from 'react';
import * as d3 from 'd3';
import './DonutChart.styles.css';

const DonutChart = ({ data, config }) => {
  React.useEffect(() => {
    drawChart();
    return () => {
      d3.select('#donutChart').selectAll('*').remove();
    };
  }, [data, config]);

  const drawChart = () => {
    // Clear existing chart
    d3.select('#donutChart').selectAll('*').remove();

    // Set dimensions
    const margin = config.dimensions.margin;
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // Create SVG
    const svg = d3.select('#donutChart')
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

    // Create arc generator with inner radius for donut
    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius * 0.6); // This creates the donut hole

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

    // Add total value in center
    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    
    g.append('text')
      .attr('class', 'total-label')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '16px')
      .style('fill', '#333')
      .text('Total');

    g.append('text')
      .attr('class', 'total-value')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(`${totalValue}%`);

    // Add labels
    const labelArc = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    arcs.append('text')
      .attr('transform', d => {
        // Position labels outside the donut
        const pos = labelArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('dy', '.35em')
      .style('text-anchor', d => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      })
      .style('fill', '#333')
      .text(d => `${d.data.value}%`);

    // Add connecting lines to labels
    arcs.append('polyline')
      .attr('points', d => {
        const pos = labelArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        const pos2 = labelArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        pos2[0] = radius * 0.85 * (midAngle < Math.PI ? 1 : -1);
        return [arc.centroid(d), pos2, pos];
      })
      .style('fill', 'none')
      .style('stroke', '#999')
      .style('stroke-width', 1);

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
      <div id="donutChart"></div>
    </div>
  );
};

export default DonutChart;