import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { useMemo } from 'react';

interface PerformanceMetricsProps {
  speechData?: Record<string, number>; 
}

const PerformanceMetrics = ({ speechData = {} }: PerformanceMetricsProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Generate chart data from speech type distribution
  const chartData = useMemo(() => {
    // If we have real data, process it
    if (Object.keys(speechData).length > 0) {
      return Object.entries(speechData).map(([type, count]) => ({
        name: type.slice(0, 3).toUpperCase(), // Use first 3 letters as label
        fullName: type,
        score: count * 10, // Scale the count for better visualization
        count: count
      }));
    }
    
    // Otherwise use mock data
    return [
      { name: 'Jan', score: 65, fullName: 'January' },
      { name: 'Feb', score: 59, fullName: 'February' },
      { name: 'Mar', score: 80, fullName: 'March' },
      { name: 'Apr', score: 81, fullName: 'April' },
      { name: 'May', score: 76, fullName: 'May' },
      { name: 'Jun', score: 85, fullName: 'June' },
    ];
  }, [speechData]);

  // Calculate improvement percentage by comparing the last two months
  const latestScore = chartData.length > 0 ? chartData[chartData.length - 1].score : 0;
  const previousScore = chartData.length > 1 ? chartData[chartData.length - 2].score : 0;
  const improvementPercent = previousScore > 0 
    ? ((latestScore - previousScore) / previousScore) * 100 
    : 0;
  const isImprovement = improvementPercent > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.performanceMetrics', currentLanguage.code)}</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">{t('dashboard.currentScore', currentLanguage.code)}</p>
            <p className="text-2xl font-bold text-gray-900">{latestScore || 0}/100</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">{t('dashboard.monthlyChange', currentLanguage.code)}</p>
            <div className="flex items-center">
              <p className={`text-2xl font-bold ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                {improvementPercent.toFixed(1)}%
              </p>
              {isImprovement ? (
                <ArrowUpIcon className="ml-1 h-5 w-5 text-green-600" />
              ) : (
                <ArrowDownIcon className="ml-1 h-5 w-5 text-red-600" />
              )}
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip labelFormatter={(value) => chartData.find(item => item.name === value)?.fullName || value} />
              <Bar dataKey="score" fill="#8884d8" name="Performance Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>{t('dashboard.basedOn', currentLanguage.code)}</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
