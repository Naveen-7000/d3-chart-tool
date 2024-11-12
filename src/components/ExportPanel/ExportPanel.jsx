/* eslint-disable react/prop-types */
import { generateBarChartHTML } from '../../utils/exportUtils';
import './ExportPanel.styles.css';

const ExportPanel = ({ chartType, data, config }) => {
  const handleExport = () => {
    let htmlContent;
    
    switch (chartType) {
      case 'bar':
        htmlContent = generateBarChartHTML(data, config);
        break;
      // Add cases for other chart types
      default:
        console.warn('Export not implemented for this chart type');
        return;
    }

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chartType}-chart.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="export-panel">
      <button onClick={handleExport} className="export-button">
        Export as HTML
      </button>
      <div className="export-info">
        <p>Exports a self-contained HTML file with:</p>
        <ul>
          <li>D3.js v4 integration</li>
          <li>Complete styling</li>
          <li>Data and configuration</li>
          <li>Implementation guide</li>
          <li>Interactive features</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportPanel;