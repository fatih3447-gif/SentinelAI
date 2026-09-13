import React from 'react';

const AnalyticsPortal: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">📊 Analytics Portal</h1>
          <p className="text-gray-400 text-lg">
            Detaylı analiz ve geçmiş veriler yükleniyor...
          </p>
          <div className="mt-8">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
          <p className="text-gray-500 mt-8">V1.1'de gelecek: Tarihsel veriler, raporlar ve trendler</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPortal;
