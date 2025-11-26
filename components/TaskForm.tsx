import React, { useState, ChangeEvent } from 'react';
import { Prioridade, Status, ManutencaoItem } from '../types';
import { X, Upload, Plus, RotateCcw, FileText } from 'lucide-react';

interface TaskFormProps {
  availableSectors: string[];
  onClose: () => void;
  onSave: (task: Omit<ManutencaoItem, 'id' | 'dataCriacao'>, newSector?: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ availableSectors, onClose, onSave }) => {
  const [numeroOS, setNumeroOS] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [setor, setSetor] = useState<string>(availableSectors[0] || 'Geral');
  const [maquina, setMaquina] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [prazoEstimado, setPrazoEstimado] = useState('');
  const [prioridade, setPrioridade] = useState<Prioridade>(Prioridade.MEDIA);
  const [status, setStatus] = useState<Status>(Status.PENDENTE);
  const [imagemUrl, setImagemUrl] = useState<string | undefined>(undefined);
  
  // State for adding new sector
  const [isAddingSector, setIsAddingSector] = useState(false);
  const [newSectorName, setNewSectorName] = useState('');

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit size to avoid localStorage quotas (e.g., 500kb)
      if (file.size > 500000) {
        alert("A imagem é muito grande. Por favor escolha uma imagem menor que 500kb.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalSector = isAddingSector && newSectorName.trim() ? newSectorName.trim() : setor;

    onSave({
      numeroOS,
      titulo,
      descricao,
      setor: finalSector,
      maquina,
      responsavel,
      prazoEstimado,
      prioridade,
      status,
      imagemUrl
    }, isAddingSector ? finalSector : undefined);
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Nova Pendência</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Campo Ordem de Serviço */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nº Ordem de Serviço (O.S.)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    value={numeroOS}
                    onChange={(e) => setNumeroOS(e.target.value)}
                    placeholder="Ex: OS-2023-001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Vazamento de óleo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Máquina / Equipamento</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={maquina}
                  onChange={(e) => setMaquina(e.target.value)}
                  placeholder="Ex: Torno CNC 02, Bomba D'água"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                  Setor
                  {!isAddingSector && (
                     <button 
                       type="button" 
                       onClick={() => setIsAddingSector(true)}
                       className="text-blue-600 text-xs hover:underline flex items-center gap-1"
                     >
                       <Plus size={12} /> Novo
                     </button>
                  )}
                  {isAddingSector && (
                    <button 
                       type="button" 
                       onClick={() => setIsAddingSector(false)}
                       className="text-slate-500 text-xs hover:underline flex items-center gap-1"
                     >
                       <RotateCcw size={12} /> Cancelar
                     </button>
                  )}
                </label>
                
                {isAddingSector ? (
                  <input
                    required
                    type="text"
                    autoFocus
                    className="w-full px-4 py-2 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newSectorName}
                    onChange={(e) => setNewSectorName(e.target.value)}
                    placeholder="Digite o nome do novo setor..."
                  />
                ) : (
                  <select
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={setor}
                    onChange={(e) => setSetor(e.target.value)}
                  >
                    {availableSectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
            </div>

            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value as Prioridade)}
                >
                  {Object.values(Prioridade).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Inicial</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                >
                  {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Responsável</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  placeholder="Nome do técnico"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prazo Estimado</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={prazoEstimado}
                  onChange={(e) => setPrazoEstimado(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Detalhada</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes sobre o problema, materiais necessários, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Foto do Local (Opcional)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {imagemUrl ? (
                <div className="relative w-full h-32">
                   <img src={imagemUrl} alt="Preview" className="w-full h-full object-contain" />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 hover:opacity-100 transition">Alterar Imagem</div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm">Clique para carregar foto</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition transform active:scale-95"
            >
              Salvar Pendência
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;