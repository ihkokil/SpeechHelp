
import React from 'react';

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      tension?: number;
      fill?: boolean;
    }[];
  };
}

// Placeholder Bar Chart component (in a real app, you'd use a library like recharts)
export const BarChart: React.FC<ChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data)) * 1.1;
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end">
        {data.labels.map((label, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div className="w-full px-1 flex justify-center">
              {data.datasets.map((dataset, dataIdx) => (
                <div 
                  key={dataIdx} 
                  className="w-full max-w-[30px] mx-1 rounded-t-md"
                  style={{ 
                    height: `${(dataset.data[idx] / maxValue) * 100}%`,
                    backgroundColor: Array.isArray(dataset.backgroundColor) 
                      ? dataset.backgroundColor[idx] 
                      : dataset.backgroundColor,
                  }}
                ></div>
              ))}
            </div>
            <div className="text-xs mt-1 text-gray-600">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {data.datasets.map((dataset, idx) => (
          <div key={idx} className="flex items-center mx-2">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ 
                backgroundColor: Array.isArray(dataset.backgroundColor) 
                  ? dataset.backgroundColor[0] 
                  : dataset.backgroundColor 
              }}
            ></div>
            <span className="text-xs">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Placeholder Line Chart component
export const LineChart: React.FC<ChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data)) * 1.1;
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end relative">
        <div className="absolute inset-0 border-b border-l border-gray-200"></div>
        {data.datasets.map((dataset, datasetIdx) => (
          <div 
            key={datasetIdx}
            className="absolute inset-0 flex items-end"
            style={{ opacity: 0.7 }}
          >
            <div 
              className="absolute inset-0 bottom-0"
              style={{ 
                background: `linear-gradient(to top, ${dataset.backgroundColor}, transparent)`,
                opacity: 0.3,
                clipPath: `polygon(
                  0% 100%, 
                  ${data.labels.map((_, i) => `${(i / (data.labels.length - 1)) * 100}% ${100 - (dataset.data[i] / maxValue) * 100}%`).join(', ')},
                  100% 100%
                )`
              }}
            ></div>
            
            <svg className="absolute inset-0" viewBox={`0 0 ${data.labels.length - 1} 1`}>
              <polyline
                fill="none"
                stroke={Array.isArray(dataset.borderColor) ? dataset.borderColor[0] : dataset.borderColor}
                strokeWidth="0.02"
                points={data.labels.map((_, i) => `${i / (data.labels.length - 1)} ${1 - dataset.data[i] / maxValue}`).join(' ')}
              />
            </svg>
          </div>
        ))}
        
        {data.labels.map((label, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center relative">
            <div className="h-full w-full"></div>
            <div className="text-xs mt-1 text-gray-600 absolute bottom-0 transform translate-y-full">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {data.datasets.map((dataset, idx) => (
          <div key={idx} className="flex items-center mx-2">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: Array.isArray(dataset.borderColor) ? dataset.borderColor[0] : dataset.borderColor }}
            ></div>
            <span className="text-xs">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Placeholder Pie Chart component
export const PieChart: React.FC<ChartProps> = ({ data }) => {
  const dataset = data.datasets[0];
  const total = dataset.data.reduce((acc, curr) => acc + curr, 0);
  
  let cumulativeAngle = 0;
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex justify-center items-center">
        <div className="relative" style={{ width: '80%', aspectRatio: '1/1' }}>
          <svg viewBox="0 0 100 100">
            {dataset.data.map((value, idx) => {
              const startAngle = cumulativeAngle;
              const angleSize = (value / total) * 360;
              cumulativeAngle += angleSize;
              
              const startRadians = (startAngle - 90) * Math.PI / 180;
              const endRadians = (startAngle + angleSize - 90) * Math.PI / 180;
              
              const x1 = 50 + 40 * Math.cos(startRadians);
              const y1 = 50 + 40 * Math.sin(startRadians);
              const x2 = 50 + 40 * Math.cos(endRadians);
              const y2 = 50 + 40 * Math.sin(endRadians);
              
              const largeArcFlag = angleSize > 180 ? 1 : 0;
              
              const backgroundColor = Array.isArray(dataset.backgroundColor) 
                ? dataset.backgroundColor[idx] 
                : dataset.backgroundColor;
              
              return (
                <path 
                  key={idx}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={backgroundColor}
                  stroke="#fff"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.labels.map((label, idx) => (
          <div key={idx} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ 
                backgroundColor: Array.isArray(dataset.backgroundColor) 
                  ? dataset.backgroundColor[idx] 
                  : dataset.backgroundColor 
              }}
            ></div>
            <span className="text-xs truncate">{label}</span>
            <span className="text-xs ml-1 text-gray-500">
              ({Math.round((dataset.data[idx] / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
