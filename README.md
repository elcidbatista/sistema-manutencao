# ManutTrack Pro 🛠️

Sistema profissional de gestão de manutenção industrial e predial com integração de Inteligência Artificial para análise técnica.

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Tailwind%20%7C%20Gemini%20AI-green)

## 📋 Funcionalidades

- **Gestão de Tarefas**: Cadastro completo com Título, Descrição, Prioridade, Responsável e Prazo.
- **Organização Inteligente**:
  - **Setores Dinâmicos**: Adicione novos setores conforme a necessidade da planta.
  - **Máquinas/Equipamentos**: Rastreamento específico de qual ativo precisa de manutenção.
- **Análise Técnica via IA (Gemini)**: Gera relatórios executivos e recomendações de prioridade baseadas nos dados cadastrados.
- **Dashboard Visual**:
  - Gráfico de Pizza para status das tarefas.
  - Gráfico de Barras para volume de trabalho por setor.
- **Documentação Visual**: Upload de fotos dos problemas encontrados.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript
- **Estilização**: Tailwind CSS
- **IA Generativa**: Google Gemini API (`@google/genai`)
- **Visualização de Dados**: Recharts
- **Ícones**: Lucide React

## 📦 Como usar

Este projeto utiliza módulos ES6 modernos e importmap, não necessitando de um processo de build complexo para visualização rápida em ambientes compatíveis.

Para rodar localmente com Node.js (exemplo):

1. Clone este repositório.
2. Crie um arquivo `.env` com sua chave da API do Google:
   ```
   API_KEY=AIzaSyD2klZLziUfwJkjru6CxbaoINLq3z49dnA
   ```
3. Instale as dependências e inicie o servidor de desenvolvimento.

## 🤝 Contribuição

Sinta-se à vontade para abrir issues ou enviar Pull Requests para melhorias no sistema de manutenção.

---
Desenvolvido com foco em eficiência operacional.
