import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

const API_URL = "http://127.0.0.1:5000/stats";
fetch(API_URL)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

const LineGraph = () => {
  const chartRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [showThresholdLine, setShowThresholdLine] = useState(true); // State to toggle the line
  const [thresholdValue, setThresholdValue] = useState(11000); // State to store threshold value

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5000/stats');
      const data = await response.json();
      setStats(data);
    };

    fetchData();

    const ctx = chartRef.current.getContext('2d');
    
    const labels = Array.from({ length: 30 }, (_, i) => i + 1);

    const juneData = [
      9985.29, 9521.7, 10609.85, 10722.44, 11088.73, 11040.78, 10769.13, 9836.28, 9748.68, 10692.76,
      11106.9, 11477.61, 11367.07, 10921.37, 9892.04, 9730.07, 10540.26, 11047.02, 11579.19, 11121.86,
      10579.89, 9616.22, 9431.63, 10173.91, 10353.77, 10372.18, 10433.04, 10108.24, 8982.05, 8907.47
    ];

    const julyData = [
      10125.33, 10414.75, 10171.08, 8868.59, 9608.99, 8923.4, 8846.87, 1856.47, 1311.32, 9300.11,
      10386.06, 9720.78, 9031.83, 9058.24, 10225.96, 10276.91, 10683.81, 10844.33, 10395.79, 9062.87,
      8833.78, 10069.03, 10537.97, 10665.36, 10967.56, 10521.47, 9196.81, 9144.67, 9997.58, 10688.94,
      11317.71
    ];

    const differences = juneData.map((juneValue, index) => Math.abs(juneValue - julyData[index]));
    const maxDifferenceIndex = differences.indexOf(Math.max(...differences));
    const minDifferenceIndex = differences.indexOf(Math.min(...differences));

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'June Data',
            data: juneData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'July Data',
            data: julyData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true, 
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Daily Data Comparison for June and July',
          },
          annotation: {
            annotations: {
              maxDiffLine: {
                type: 'line',
                yMin: 0,
                yMax: Math.max(...juneData, ...julyData),
                xMin: maxDifferenceIndex + 0.5,
                xMax: maxDifferenceIndex + 0.5,
                borderColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 2,
                label: {
                  content: 'Max Difference',
                  enabled: true,
                  position: 'start',
                },
              },
              minDiffLine: {
                type: 'line',
                yMin: 0,
                yMax: Math.max(...juneData, ...julyData),
                xMin: minDifferenceIndex + 0.5,
                xMax: minDifferenceIndex + 0.5,
                borderColor: 'rgba(0, 0, 255, 1)',
                borderWidth: 2,
                label: {
                  content: 'Min Difference',
                  enabled: true,
                  position: 'start',
                },
              },
              thresholdLine: showThresholdLine ? { // Toggle threshold line visibility
                type: 'line',
                yMin: thresholdValue,
                yMax: thresholdValue,
                borderColor: 'rgba(255, 99, 0, 1)',
                borderWidth: 2,
                borderDash: [5, 5], // Dashing effect
                label: {
                  content: 'Threshold',
                  enabled: true,
                  position: 'start',
                },
              } : null,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Day of the Month'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            }
          }
        }
      },
    });

    return () => {
      chart.destroy();
    };
  }, [showThresholdLine, thresholdValue]); // Dependency array to re-render when thresholdValue changes

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '20px' }}>
      <canvas ref={chartRef} style={{ flex: 1, marginRight: '20px' }}></canvas>
      {stats && (
        <div
          style={{
            width: '700px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>Statistics</h3>
            <p><strong>June:</strong></p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div>Average Usage: {stats.june.average_usage.toFixed(2)}</div>
              <div>Total Cost: {stats.june.total_cost.toFixed(2)}</div>
              <div>Max Daily Usage: {stats.june.max_usage.toFixed(2)}</div>
              <div>Min Daily Usage: {stats.june.min_usage.toFixed(2)}</div>
              <div>Average Daily Usage: {stats.june.avg_daily_usage.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <p><strong>July:</strong></p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div>Average Usage: {stats.july.average_usage.toFixed(2)}</div>
              <div>Total Cost: {stats.july.total_cost.toFixed(2)}</div>
              <div>Max Daily Usage: {stats.july.max_usage.toFixed(2)}</div>
              <div>Min Daily Usage: {stats.july.min_usage.toFixed(2)}</div>
              <div>Average Daily Usage: {stats.july.avg_daily_usage.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setShowThresholdLine(prev => !prev)} style={{ marginTop: '20px' }}>
        {showThresholdLine ? 'Hide Threshold Line' : 'Show Threshold Line'}
      </button>
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="thresholdValue">Set Threshold Value: </label>
        <input 
          id="thresholdValue"
          type="number"
          value={thresholdValue}
          onChange={(e) => setThresholdValue(Number(e.target.value))}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>
    </div>
  );
};

export default LineGraph;
