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
  numeroOS?: string;
  titulo: string;
  descricao: string;
  setor: string;
  maquina: string;
  responsavel: string;
  telefone?: string; // Novo campo para WhatsApp
  dataCriacao: string;
  prazoEstimado: string;
  status: Status;
  prioridade: Prioridade;
  imagemUrl?: string;
  itensOS?: {
    quantidade: number;
    unidade: string;
    descricao: string;
  }[];
  historico?: {
    data: string;
    mensagem: string;
    usuario: string;
  }[];
}

export interface DashboardStats {
  total: number;
  pendentes: number;
  emAndamento: number;
  concluidos: number;
  criticos: number;
}