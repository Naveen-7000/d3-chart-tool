export const generateBarChartHTML = (data, config) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${config.heading}</title>
      
      <!-- D3.js v4 CDN -->
      <script src="https://d3js.org/d3.v4.min.js"></script>
      
      <style>
        /* Chart Container Styles */
        .chart-container {
          width: 100%;
          height: 100%;
          position: relative;
        }
  
        /* SVG Styles */
        .chart-svg {
          width: 100%;
          height: 100%;
          /* Preserve aspect ratio while scaling */
          preserveAspectRatio: xMinYMin;
        }
  
        /* Bar Styles */
        .bar {
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
  
        .bar:hover {
          opacity: 0.8;
        }
  
        /* Grid Styles */
        .grid line {
          stroke: #e0e0e0;
          stroke-opacity: 0.7;
          shape-rendering: crispEdges;
        }
  
        .grid path {
          stroke-width: 0;
        }
  
        /* Tooltip Styles */
        .tooltip {
          position: absolute;
          padding: 8px;
          font: 12px sans-serif;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          pointer-events: none;
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
  
        /* Text Styles */
        .fig-num {
          font-size: 14px;
          font-weight: bold;
          fill: #333;
        }
  
        .chart-heading {
          font-size: 16px;
          font-weight: bold;
          fill: #333;
        }
  
        .chart-subheading {
          font-size: 14px;
          fill: #666;
        }
  
        .source-text {
          font-size: 12px;
          fill: #999;
          font-style: italic;
        }
  
        .axis text {
          font-size: 12px;
          fill: #666;
        }
  
        /* Responsive Text Scaling */
        @media screen and (max-width: 600px) {
          .fig-num { font-size: 12px; }
          .chart-heading { font-size: 14px; }
          .chart-subheading { font-size: 12px; }
          .source-text { font-size: 10px; }
          .axis text { font-size: 10px; }
        }
      </style>
  </head>
  <body>
      <!-- Chart Container -->
      <div id="barChart" class="chart-container"></div>
  
      <script>
        // Chart Configuration
        const config = ${JSON.stringify(config, null, 2)};
  
        // Chart Data
        const data = ${JSON.stringify(data, null, 2)};
  
        // Responsive Chart Drawing Function
        function drawChart() {
          // Clear existing chart
          d3.select('#barChart').selectAll('*').remove();
  
          // Get parent container dimensions
          const container = document.getElementById('barChart');
          const containerRect = container.getBoundingClientRect();
          
          // Set dimensions based on container
          const width = containerRect.width;
          const height = containerRect.height || width * 0.6; // Default aspect ratio if height not set
          
          // Calculate margins proportionally
          const margin = {
            top: height * 0.15,
            right: width * 0.05,
            bottom: height * 0.15,
            left: width * 0.1
          };
  
          // Calculate inner dimensions
          const innerWidth = width - margin.left - margin.right;
          const innerHeight = height - margin.top - margin.bottom;
  
          // Create SVG with viewBox for better scaling
          const svg = d3.select('#barChart')
            .append('svg')
            .attr('class', 'chart-svg')
            .attr('viewBox', \`0 0 \${width} \${height}\`)
            .attr('preserveAspectRatio', 'xMinYMin meet');
  
          // Create main group element
          const g = svg.append('g')
            .attr('transform', \`translate(\${margin.left},\${margin.top})\`);
  
          // Create scales
          const x = d3.scaleBand()
            .rangeRound([0, innerWidth])
            .padding(0.3)
            .domain(data.map(d => d.category));
  
          const y = d3.scaleLinear()
            .rangeRound([innerHeight, 0])
            .domain([0, 100]);
  
          // Add X axis
          g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', \`translate(0,\${innerHeight})\`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .style('font-size', \`\${Math.max(8, width * 0.012)}px\`);
  
          // Add Y axis
          g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y)
              .ticks(5)
              .tickFormat(d => d + '%'))
            .selectAll('text')
            .style('font-size', \`\${Math.max(8, width * 0.012)}px\`);
  
          // Add gridlines
          g.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y)
              .ticks(5)
              .tickSize(-innerWidth)
              .tickFormat(''));
  
          // Calculate responsive font sizes
          const headerFontSize = Math.max(12, width * 0.02);
          const subHeaderFontSize = Math.max(10, width * 0.015);
          const sourceFontSize = Math.max(8, width * 0.01);
  
          // Add figure number
          svg.append('text')
            .attr('class', 'fig-num')
            .attr('x', margin.left)
            .attr('y', margin.top * 0.4)
            .style('font-size', \`\${headerFontSize}px\`)
            .text(config.figNum);
  
          // Add heading
          svg.append('text')
            .attr('class', 'chart-heading')
            .attr('x', margin.left)
            .attr('y', margin.top * 0.7)
            .style('font-size', \`\${headerFontSize}px\`)
            .text(config.heading);
  
          // Add subheading
          svg.append('text')
            .attr('class', 'chart-subheading')
            .attr('x', margin.left)
            .attr('y', margin.top * 0.9)
            .style('font-size', \`\${subHeaderFontSize}px\`)
            .text(config.subHeading);
  
          // Add bars
          const bars = g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.category))
            .attr('y', d => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', d => innerHeight - y(d.value))
            .style('fill', (d, i) => config.color[i % config.color.length]);
  
          // Add tooltips
          if (config.toolTipVisibility) {
            const tooltip = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);
  
            bars
              .on('mouseover', function(d) {
                const e = d3.event;
                const tooltipX = e.pageX + 10;
                const tooltipY = e.pageY - 28;
                
                tooltip
                  .style('opacity', 0.9)
                  .html(d.category + '<br/>' + d.value + '%')
                  .style('left', tooltipX + 'px')
                  .style('top', tooltipY + 'px')
                  .style('font-size', \`\${Math.max(10, width * 0.012)}px\`);
                
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
              .attr('y', height - margin.bottom * 0.3)
              .style('font-size', \`\${sourceFontSize}px\`)
              .text(config.sourceText);
          }
        }
  
        // Initialize chart
        document.addEventListener('DOMContentLoaded', drawChart);
  
        // Add responsive behavior
        window.addEventListener('resize', debounce(drawChart, 250));
  
        // Debounce function to limit resize calls
        function debounce(func, wait) {
          let timeout;
          return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              func.apply(context, args);
            }, wait);
          };
        }
      </script>
  
      <!-- Documentation -->
      <!--
      Responsive Bar Chart Implementation Guide:
      
      1. Dependencies:
         - D3.js v4 (loaded via CDN)
      
      2. Usage:
         - Place the chart in any container
         - Chart will automatically size to parent container
         - Maintains aspect ratio and readability
      
      3. Responsive Features:
         - Automatically scales to container size
         - Responsive font sizes and margins
         - Debounced resize handler
         - Mobile-friendly interactions
      
      4. Parent Container Requirements:
         - Must have a defined width
         - Height can be optional (will use aspect ratio)
         - Example:
           <div style="width: 100%; height: 400px;">
             [Chart Content]
           </div>
      
      5. Customization:
         - Modify SCSS variables for styling
         - Adjust aspect ratio in drawChart function
         - Configure responsive breakpoints
         - Update font size calculations
      
      6. Browser Support:
         - Modern browsers with ES6 support
         - SVG viewBox support required
         - Touch-enabled device support
      -->
  </body>
  </html>
  `;
};
