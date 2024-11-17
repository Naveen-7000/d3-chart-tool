// src/components/CustomizationPanel/BarChartCustomizer.js
import { useDispatch, useSelector } from "react-redux";
import {
  updateLayout,
  updateLabels,
  updateLegend,
  toggleLegend,
  updateGrid,
  toggleGrid,
  toggleTooltip,
  updateStyle,
  updateAnimation,
  toggleAnimation,
  resetConfig,
  resetSection,
  toggleXAxis,
  toggleYAxis,
} from "../../store/slices/barChartSlice";
import "./BarChartCustomizer.styles.css";

const BarChartCustomizer = () => {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.barChart);

  return (
    <div className="customizer-container">
      <h3>Chart Customization</h3>

      {/* Layout Section */}
      <section className="customizer-section">
        <h4>Layout</h4>
        <div className="control-group">
          <label>Orientation</label>
          <select
            value={config.layout.orientation}
            onChange={(e) =>
              dispatch(updateLayout({ orientation: e.target.value }))
            }
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>

        <div className="control-group">
          <label>Bar Padding</label>
          <input
            type="range"
            min="0"
            max="0.9"
            step="0.1"
            value={config.layout.barPadding}
            onChange={(e) =>
              dispatch(updateLayout({ barPadding: parseFloat(e.target.value) }))
            }
          />
        </div>
      </section>
      {/* tooltip */}
      <section className="customizer-section">
        <h4>Tooltip</h4>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={config.tooltip.show}
              onChange={() =>
                dispatch(toggleTooltip({ show: !config.tooltip.show }))
              }
            />
            Show Tooltip
          </label>
        </div>
      </section>

      {/* Labels Section */}
      <section className="customizer-section">
        <h4>Labels</h4>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={config.labels.show}
              onChange={() =>
                dispatch(updateLabels({ show: !config.labels.show }))
              }
            />
            Show Labels
          </label>
        </div>

        {config.labels.show && (
          <>
            <div className="control-group">
              <label>Position</label>
              <select
                value={config.labels.position}
                onChange={(e) =>
                  dispatch(updateLabels({ position: e.target.value }))
                }
              >
                <option value="outside">Outside</option>
                <option value="inside">Inside</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div className="control-group">
              <label>Font Size</label>
              <input
                type="number"
                value={config.labels.fontSize}
                onChange={(e) =>
                  dispatch(updateLabels({ fontSize: parseInt(e.target.value) }))
                }
                min="8"
                max="24"
              />
            </div>

            <div className="control-group">
              <label>Rotation</label>
              <input
                type="range"
                min="-90"
                max="90"
                value={config.labels.rotation}
                onChange={(e) =>
                  dispatch(updateLabels({ rotation: parseInt(e.target.value) }))
                }
              />
            </div>

            <div className="control-group">
              <label>Format</label>
              <select
                value={config.labels.format}
                onChange={(e) =>
                  dispatch(updateLabels({ format: e.target.value }))
                }
              >
                <option value="percentage">Percentage</option>
                <option value="value">Value</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </>
        )}
      </section>

      {/* Legend Section */}
      <section className="customizer-section">
        <h4>Legend</h4>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={config.legend.show}
              onChange={() => dispatch(toggleLegend())}
            />
            Show Legend
          </label>
        </div>

        {config.legend.show && (
          <>
            <div className="control-group">
              <label>Position</label>
              <select
                value={config.legend.position}
                onChange={(e) =>
                  dispatch(updateLegend({ position: e.target.value }))
                }
              >
                <option value="top">Top</option>
                <option value="right">Right</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
              </select>
            </div>

            <div className="control-group">
              <label>Layout</label>
              <select
                value={config.legend.layout}
                onChange={(e) =>
                  dispatch(updateLegend({ layout: e.target.value }))
                }
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>

            <div className="control-group">
              <label>Alignment</label>
              <select
                value={config.legend.alignment}
                onChange={(e) =>
                  dispatch(updateLegend({ alignment: e.target.value }))
                }
              >
                <option value="start">Start</option>
                <option value="middle">Middle</option>
                <option value="end">End</option>
              </select>
            </div>

            <div className="control-group">
              <label>Symbol Shape</label>
              <select
                value={config.legend.symbolShape}
                onChange={(e) =>
                  dispatch(updateLegend({ symbolShape: e.target.value }))
                }
              >
                <option value="rect">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="line">Line</option>
              </select>
            </div>
          </>
        )}
      </section>

      {/* axes */}
      <section className="customizer-section">
        <h4>Axis</h4>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={config.axes.xAxis.show}
              onChange={() => dispatch(toggleXAxis())}
            />
            Show x-Axis
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={config.axes.yAxis.show}
              onChange={() => dispatch(toggleYAxis())}
            />
            Show y-Axis
          </label>
        </div>
      </section>

      {/* Grid Section */}
      <section className="customizer-section">
        <h4>Grid</h4>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={config.grid.show}
              onChange={() => dispatch(toggleGrid())}
            />
            Show Grid
          </label>
        </div>

        {config.grid.show && (
          <>
            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={config.grid.horizontal}
                  onChange={(e) =>
                    dispatch(updateGrid({ horizontal: e.target.checked }))
                  }
                />
                Horizontal Lines
              </label>
            </div>

            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={config.grid.vertical}
                  onChange={(e) =>
                    dispatch(updateGrid({ vertical: e.target.checked }))
                  }
                />
                Vertical Lines
              </label>
            </div>
          </>
        )}
      </section>

      {/* Styling Section */}
      <section className="customizer-section">
        <h4>Styling</h4>
        <div className="control-group">
          <label>Corner Radius</label>
          <input
            type="range"
            min="0"
            max="10"
            value={config.style.cornerRadius}
            onChange={(e) =>
              dispatch(updateStyle({ cornerRadius: parseInt(e.target.value) }))
            }
          />
        </div>

        <div className="control-group">
          <label>Bar Opacity</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={config.style.barOpacity}
            onChange={(e) =>
              dispatch(updateStyle({ barOpacity: parseFloat(e.target.value) }))
            }
          />
        </div>
      </section>

      {/* Animation Section */}
      <section className="customizer-section">
        <h4>Animation</h4>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={config.animation.enabled}
              onChange={() => dispatch(toggleAnimation())}
            />
            Enable Animation
          </label>
        </div>

        {config.animation.enabled && (
          <>
            <div className="control-group">
              <label>Duration (ms)</label>
              <input
                type="number"
                min="0"
                max="2000"
                step="50"
                value={config.animation.duration}
                onChange={(e) =>
                  dispatch(
                    updateAnimation({ duration: parseInt(e.target.value) })
                  )
                }
              />
            </div>

            <div className="control-group">
              <label>Easing</label>
              <select
                value={config.animation.easing}
                onChange={(e) =>
                  dispatch(updateAnimation({ easing: e.target.value }))
                }
              >
                <option value="linear">Linear</option>
                <option value="easeExpOut">Exponential</option>
                <option value="easeElastic">Elastic</option>
                <option value="easeBounce">Bounce</option>
              </select>
            </div>
          </>
        )}
      </section>

      {/* Reset Section */}
      <section className="customizer-section">
        <h4>Reset Options</h4>
        <div className="control-group">
          <button onClick={() => dispatch(resetConfig())}>Reset All</button>
        </div>
        <div className="control-group">
          <select
            onChange={(e) =>
              e.target.value && dispatch(resetSection(e.target.value))
            }
            value=""
          >
            <option value="">Reset specific section...</option>
            <option value="layout">Layout</option>
            <option value="labels">Labels</option>
            <option value="legend">Legend</option>
            <option value="grid">Grid</option>
            <option value="style">Style</option>
            <option value="animation">Animation</option>
          </select>
        </div>
      </section>
    </div>
  );
};

export default BarChartCustomizer;
