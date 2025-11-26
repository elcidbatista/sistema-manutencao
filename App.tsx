import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, Search, Calendar, User, 
  MoreVertical, AlertTriangle, CheckCircle2, Clock, Ban,
  Sparkles, Filter, Trash2, Image as ImageIcon, Wrench, Package, FileText
} from 'lucide-react';
import { ManutencaoItem, Status, Prioridade, SetoresPadrao } from './types';
import TaskForm from './components/TaskForm';
import StatsCharts from './components/StatsCharts';
import { gerarAnaliseTecnica } from './services/geminiService';

// Initial Mock Data to populate first view
const MOCK_DATA: ManutencaoItem[] = [
  {
    id: '1',
    numeroOS: 'OS-2023-1042',
    titulo: 'Reparo Ar Condicionado',
    descricao: 'Aparelho não está refrigerando corretamente. Verificar gás.',
    setor: 'Climatização',
    maquina: 'Split Samsung 18000 BTUs',
    responsavel: 'Carlos Silva',
    dataCriacao: new Date().toISOString().split('T')[0],
    prazoEstimado: '2023-11-20',
    status: Status.EM_ANDAMENTO,
    prioridade: Prioridade.ALTA,
    imagemUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: '2',
    titulo: 'Troca de Lâmpadas',
    descricao: '3 lâmpadas queimadas próximas ao elevador.',
    setor: 'Elétrica',
    maquina: 'Painel Geral Corredor B',
    responsavel: 'Ana Souza',
    dataCriacao: new Date().toISOString().split('T')[0],
    prazoEstimado: '2023-11-25',
    status: Status.PENDENTE,
    prioridade: Prioridade.BAIXA,
    imagemUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: '3',
    numeroOS: 'OS-2023-1030',
    titulo: 'Vazamento Torneira',
    descricao: 'Pingo constante, necessita troca de vedante.',
    setor: 'Hidráulica',
    maquina: 'Pia Copa Térreo',
    responsavel: 'Roberto Dias',
    dataCriacao: new Date().toISOString().split('T')[0],
    prazoEstimado: '2023-11-18',
    status: Status.CONCLUIDO,
    prioridade: Prioridade.MEDIA,
    imagemUrl: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: '4',
    numeroOS: 'OS-2023-1048',
    titulo: 'Substituição Rolamento',
    descricao: 'Rolamento principal com ruído excessivo. Peça solicitada ao fornecedor.',
    setor: 'Mecânica',
    maquina: 'Esteira Transportadora 01',
    responsavel: 'Marcos Oliveira',
    dataCriacao: new Date().toISOString().split('T')[0],
    prazoEstimado: '2023-11-30',
    status: Status.AGUARDANDO_PECAS,
    prioridade: Prioridade.CRITICA,
    imagemUrl: 'https://picsum.photos/400/300?random=4'
  }
];

function App() {
  const [tarefas, setTarefas] = useState<ManutencaoItem[]>(() => {
    const saved = localStorage.getItem('manutencao_tarefas');
    return saved ? JSON.parse(saved) : MOCK_DATA;
  });

  const [availableSectors, setAvailableSectors] = useState<string[]>(() => {
    const saved = localStorage.getItem('manutencao_setores');
    return saved ? JSON.parse(saved) : SetoresPadrao;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filterSetor, setFilterSetor] = useState<string>('Todos');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    localStorage.setItem('manutencao_tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  useEffect(() => {
    localStorage.setItem('manutencao_setores', JSON.stringify(availableSectors));
  }, [availableSectors]);

  const addTask = (newTaskData: Omit<ManutencaoItem, 'id' | 'dataCriacao'>, newSector?: string) => {
    if (newSector && !availableSectors.includes(newSector)) {
      setAvailableSectors(prev => [...prev, newSector].sort());
    }

    const newTask: ManutencaoItem = {
      ...newTaskData,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString().split('T')[0],
    };
    setTarefas(prev => [newTask, ...prev]);
  };

  const updateStatus = (id: string, newStatus: Status) => {
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir esta pendência?')) {
        setTarefas(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSmartAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    const result = await gerarAnaliseTecnica(tarefas);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.PENDENTE: return 'bg-amber-100 text-amber-700 border-amber-200';
      case Status.EM_ANDAMENTO: return 'bg-blue-100 text-blue-700 border-blue-200';
      case Status.AGUARDANDO_PECAS: return 'bg-purple-100 text-purple-700 border-purple-200';
      case Status.CONCLUIDO: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case Status.BLOQUEADO: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityBadge = (p: Prioridade) => {
    const colors = {
      [Prioridade.BAIXA]: 'bg-slate-100 text-slate-600',
      [Prioridade.MEDIA]: 'bg-blue-50 text-blue-600',
      [Prioridade.ALTA]: 'bg-orange-50 text-orange-600',
      [Prioridade.CRITICA]: 'bg-red-50 text-red-600 font-bold',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider ${colors[p]}`}>
        {p}
      </span>
    );
  };

  const filteredTasks = tarefas.filter(t => {
    const matchesText = t.titulo.toLowerCase().includes(filterText.toLowerCase()) || 
                        t.responsavel.toLowerCase().includes(filterText.toLowerCase()) ||
                        (t.maquina && t.maquina.toLowerCase().includes(filterText.toLowerCase())) ||
                        (t.numeroOS && t.numeroOS.toLowerCase().includes(filterText.toLowerCase()));
    const matchesSetor = filterSetor === 'Todos' || t.setor === filterSetor;
    return matchesText && matchesSetor;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <ClipboardList size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">ManutTrack</h1>
              <p className="text-xs text-slate-500">Gestão Profissional</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={handleSmartAnalysis}
              disabled={isAnalyzing}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition font-medium text-sm border border-purple-200 disabled:opacity-50"
            >
              <Sparkles size={16} />
              {isAnalyzing ? 'Analisando...' : 'Análise IA'}
            </button>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-md shadow-blue-500/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova Pendência</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* AI Analysis Result Panel */}
        {aiAnalysis && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-white p-6 rounded-xl border border-purple-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} />
             </div>
             <h3 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2">
                <Sparkles size={20} /> Relatório Inteligente
             </h3>
             <div className="prose prose-sm text-purple-800 max-w-none whitespace-pre-line">
                {aiAnalysis}
             </div>
             <button 
               onClick={() => setAiAnalysis(null)} 
               className="text-xs text-purple-400 hover:text-purple-600 mt-4 underline"
             >
               Fechar Relatório
             </button>
          </div>
        )}

        {/* Statistics Charts */}
        <StatsCharts tarefas={tarefas} />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 w-full md:w-auto">
             <h2 className="text-lg font-bold text-slate-800">Tarefas</h2>
             <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{filteredTasks.length}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por título, O.S. ou resp..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            
            <div className="relative">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <select 
                  className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  value={filterSetor}
                  onChange={(e) => setFilterSetor(e.target.value)}
               >
                  <option value="Todos">Todos os Setores</option>
                  {availableSectors.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-400">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                 <ClipboardList size={32} />
              </div>
              <p className="text-lg font-medium text-slate-500">Nenhuma pendência encontrada</p>
              <p className="text-sm">Tente alterar os filtros ou adicione uma nova tarefa.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
                
                {/* Card Image */}
                <div className="h-48 bg-slate-100 relative overflow-hidden group">
                  {task.imagemUrl ? (
                    <img src={task.imagemUrl} alt={task.titulo} className="w-full h-full object-cover transition transform group-hover:scale-105 duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  {/* OS Number Badge */}
                  {task.numeroOS && (
                     <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono font-bold text-slate-700 shadow-sm border border-slate-200 flex items-center gap-1">
                        <FileText size={10} />
                        {task.numeroOS}
                     </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">{task.setor}</span>
                    {getPriorityBadge(task.prioridade)}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{task.titulo}</h3>
                  {task.maquina && (
                     <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-3 bg-slate-50 p-1 rounded w-fit">
                        <Wrench size={12} />
                        {task.maquina}
                     </div>
                  )}
                  
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">{task.descricao}</p>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User size={16} className="text-slate-400" />
                      <span className="truncate">{task.responsavel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={16} className="text-slate-400" />
                      <span>Prazo: {new Date(task.prazoEstimado).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center">
                   <div className="flex gap-1">
                      {task.status !== Status.CONCLUIDO && (
                        <button 
                          onClick={() => updateStatus(task.id, Status.CONCLUIDO)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded transition" 
                          title="Concluir"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                      
                      {/* Botão rápido para status Aguardando Peças se não estiver concluído */}
                      {task.status !== Status.CONCLUIDO && task.status !== Status.AGUARDANDO_PECAS && (
                        <button 
                          onClick={() => updateStatus(task.id, Status.AGUARDANDO_PECAS)}
                          className="p-1.5 text-purple-600 hover:bg-purple-100 rounded transition" 
                          title="Aguardando Peças"
                        >
                          <Package size={18} />
                        </button>
                      )}

                      <button 
                         onClick={() => deleteTask(task.id)}
                         className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition" 
                         title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                   <div className="text-xs text-slate-400">
                      ID: #{task.id.slice(-4)}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {isFormOpen && (
        <TaskForm 
          availableSectors={availableSectors}
          onClose={() => setIsFormOpen(false)} 
          onSave={addTask} 
        />
      )}
    </div>
  );
}

export default App;