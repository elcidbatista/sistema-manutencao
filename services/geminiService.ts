import { GoogleGenAI } from "@google/genai";
import { ManutencaoItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const gerarAnaliseTecnica = async (tarefas: ManutencaoItem[]): Promise<string> => {
  if (!apiKey) {
    return "API Key não configurada. Não é possível gerar análise inteligente.";
  }

  if (tarefas.length === 0) {
    return "Nenhuma tarefa registrada para análise.";
  }

  // Filter tasks to send a concise context
  const tarefasContexto = tarefas.map(t => ({
    titulo: t.titulo,
    maquina: t.maquina,
    setor: t.setor,
    status: t.status,
    prioridade: t.prioridade,
    responsavel: t.responsavel,
    prazo: t.prazoEstimado
  }));

  const prompt = `
    Atue como um Engenheiro Sênior de Planejamento e Manutenção.
    Analise a seguinte lista de tarefas de manutenção (em formato JSON) e forneça um relatório executivo breve (máximo 2 parágrafos) e 3 recomendações de ação direta.
    
    Considere o tipo de MÁQUINA envolvida e o SETOR para sugerir priorizações.
    Foque em gargalos, riscos de atraso baseados na prioridade e distribuição de carga.

    Dados: ${JSON.stringify(tarefasContexto)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Erro ao processar a análise com IA. Verifique a console para detalhes.";
  }
};