
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

const mockData = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 59 },
  { name: 'Mar', score: 80 },
  { name: 'Apr', score: 81 },
  { name: 'May', score: 76 },
  { name: 'Jun', score: 85 },
];

const PerformanceMetrics = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Calculate improvement percentage by comparing the last two months
  const latestScore = mockData[mockData.length - 1].score;
  const previousScore = mockData[mockData.length - 2].score;
  const improvementPercent = ((latestScore - previousScore) / previousScore) * 100;
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
            <p className="text-2xl font-bold text-gray-900">{latestScore}/100</p>
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
              data={mockData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
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
