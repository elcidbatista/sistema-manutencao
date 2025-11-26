export enum Status {
  PENDENTE = 'Pendente',
  EM_ANDAMENTO = 'Em Andamento',
  AGUARDANDO_PECAS = 'Aguardando Peças',
  CONCLUIDO = 'Concluído',
  BLOQUEADO = 'Bloqueado'
}

export enum Prioridade {
  BAIXA = 'Baixa',
  MEDIA = 'Média',
  ALTA = 'Alta',
  CRITICA = 'Crítica'
}

// Setores Padrão (para inicialização)
export const SetoresPadrao = [
  'Elétrica',
  'Hidráulica',
  'Alvenaria',
  'TI',
  'Climatização',
  'Mecânica',
  'Geral'
];

export interface ManutencaoItem {
  id: string;
  numeroOS?: string; // Novo campo para Ordem de Serviço
  titulo: string;
  descricao: string;
  setor: string;
  maquina: string;
  responsavel: string;
  dataCriacao: string;
  prazoEstimado: string;
  status: Status;
  prioridade: Prioridade;
  imagemUrl?: string;
}

export interface DashboardStats {
  total: number;
  pendentes: number;
  emAndamento: number;
  concluidos: number;
  criticos: number;
}