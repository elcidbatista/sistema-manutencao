import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip
} from 'recharts';
import { ManutencaoItem, Status } from '../types';

interface StatsChartsProps {
  tarefas: ManutencaoItem[];
}

const COLORS = {
  [Status.PENDENTE]: '#f59e0b', // Amber 500
  [Status.EM_ANDAMENTO]: '#3b82f6', // Blue 500
  [Status.AGUARDANDO_PECAS]: '#8b5cf6', // Violet 500
  [Status.CONCLUIDO]: '#10b981', // Emerald 500
  [Status.BLOQUEADO]: '#ef4444', // Red 500
};

const StatsCharts: React.FC<StatsChartsProps> = ({ tarefas }) => {
  
  // Prepare Data for Pie Chart (Status)
  const statusData = Object.values(Status).map(status => ({
    name: status,
    value: tarefas.filter(t => t.status === status).length
  })).filter(item => item.value > 0);

  // Prepare Data for Bar Chart (Setor - Dinâmico)
  // Extract unique sectors from existing tasks
  const uniqueSectors = Array.from(new Set(tarefas.map(t => t.setor)));
  
  const setorData = uniqueSectors.map(setor => ({
    name: setor,
    tarefas: tarefas.filter(t => t.setor === setor).length
  })).sort((a, b) => b.tarefas - a.tarefas); // Sort by highest count

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Status Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribuição por Status</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as Status]} />
                ))}
              </Pie>
              <PieTooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Tarefas por Setor</h3>
        <div className="h-64 w-full">
          {setorData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={setorData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <BarTooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="tarefas" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Sem dados de setor
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;