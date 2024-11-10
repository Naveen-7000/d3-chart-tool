// src/hooks/useD3.js
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const useD3 = (renderChartFn, dependencies = []) => {
  const ref = useRef();

  useEffect(() => {
    // Clear any existing SVG content
    d3.select(ref.current).selectAll('*').remove();
    
    // Create new SVG
    renderChartFn(d3.select(ref.current));
    
    return () => {
      // Cleanup function
      if (ref.current) {
        d3.select(ref.current).selectAll('*').remove();
      }
    };
  }, dependencies);

  return ref;
};

export default useD3;