import React, { useState, useEffect } from 'react';
import { ExclamationIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const TeamLeaderDashboard: React.FC = () => {
  const [teamData, setTeamData] = useState({
    totalAgents: 15,
    agentsGreen: 10,
    agentsYellow: 3,
    agentsRed: 2,
    averageBurnout: 42.3,
    escalations: 2
  });

  const agents = [
    { id: 'agent_42', name: 'Zeynep', burnout: 89, level: 'red', status: '🔴 ACİL', calls: 28, aht: '4:20' },
    { id: 'agent_15', name: 'Mert', burnout: 67, level: 'yellow', status: '🟡 İZLE', calls: 25, aht: '4:10' },
    { id: 'agent_08', name: 'Ayşe', burnout: 32, level: 'green', status: '🟢 İYİ', calls: 22, aht: '3:45' },
    { id: 'agent_33', name: 'Can', burnout: 28, level: 'green', status: '🟢 İYİ', calls: 20, aht: '3:30' },
  ];

  const alerts = [
    { id: 1, agent: 'Zeynep', time: '19:45', reason: 'Fatura İhtilafı', priority: 'high' },
    { id: 2, agent: 'Mert', time: '20:12', reason: 'Şikayetvar Tehdidi', priority: 'high' },
  ];

  return (
    <div className="flex-1 bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Takım Liderlik Paneli</h1>
          <p className="text-gray-400 mt-2">Vardiya 14:00-22:00 | Gerçek Zamanlı Takım Durumu</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Toplam Ajanlar"
            value={teamData.totalAgents}
            icon="👥"
            color="blue"
          />
          <KPICard
            title="Sağlıklı (🟢)"
            value={teamData.agentsGreen}
            icon="✅"
            color="green"
          />
          <KPICard
            title="Dikkat Gerek (🟡)"
            value={teamData.agentsYellow}
            icon="⚠️"
            color="yellow"
          />
          <KPICard
            title="ACİL (🔴)"
            value={teamData.agentsRed}
            icon="🚨"
            color="red"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Agent Table */}
          <div className="col-span-2">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">📊 Tükenmişlik Haritası</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700 text-gray-100 text-sm">
                      <th className="px-6 py-3 text-left">Ajan</th>
                      <th className="px-6 py-3 text-left">Skor</th>
                      <th className="px-6 py-3 text-left">Durum</th>
                      <th className="px-6 py-3 text-left">Çağrı</th>
                      <th className="px-6 py-3 text-left">AHT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="px-6 py-3 font-semibold text-white">{agent.name}</td>
                        <td className="px-6 py-3">
                          <div className="w-32 bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-full rounded-full ${
                                agent.level === 'red'
                                  ? 'bg-red-500'
                                  : agent.level === 'yellow'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${agent.burnout}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{agent.burnout}/100</p>
                        </td>
                        <td className="px-6 py-3 font-bold">{agent.status}</td>
                        <td className="px-6 py-3 text-gray-300">{agent.calls}</td>
                        <td className="px-6 py-3 text-gray-300">{agent.aht}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Alerts & Actions */}
          <div className="space-y-6">
            {/* Burnout Alerts */}
            <div className="bg-red-950 rounded-lg p-6 border border-red-800">
              <h3 className="text-lg font-bold text-red-200 mb-4">🚨 ACİL UYARILAR</h3>
              <div className="space-y-3">
                {teamData.agentsRed > 0 ? (
                  <>
                    <div className="bg-red-900 rounded p-3 border border-red-700">
                      <p className="text-red-100 font-semibold">Zeynep (Agent-42)</p>
                      <p className="text-red-200 text-sm mt-1">10 dakikalık zorunlu mola verin</p>
                      <button className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded font-semibold">
                        Mola Gönder
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-green-300">Tüm ajanlar sağlıkta</p>
                )}
              </div>
            </div>

            {/* Recent Escalations */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">📞 Son Eskalasyonlar</h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-gray-700 rounded p-3 border border-gray-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold">{alert.agent}</p>
                        <p className="text-gray-400 text-sm">{alert.reason}</p>
                      </div>
                      <p className="text-gray-400 text-xs">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-900 border-blue-700',
    green: 'bg-green-900 border-green-700',
    yellow: 'bg-yellow-900 border-yellow-700',
    red: 'bg-red-900 border-red-700'
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-6 border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;
