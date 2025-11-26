import { jsPDF } from "jspdf";
import { ManutencaoItem } from "../types";

export const generateAndSharePDF = async (task: ManutencaoItem) => {
  const doc = new jsPDF();

  // --- Configurações Visuais ---
  const primaryColor = [37, 99, 235]; // Blue 600
  const secondaryColor = [71, 85, 105]; // Slate 600
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // --- Header ---
  // Background Header
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Ordem de Serviço", 20, 20);
  
  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("ManutTrack Pro - Relatório Técnico", 20, 26);

  // OS Number and Date Box
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  const osText = `Nº: ${task.numeroOS || 'S/N'}`;
  const dateText = `Data: ${new Date(task.dataCriacao).toLocaleDateString('pt-BR')}`;
  
  doc.text(osText, pageWidth - 20, 18, { align: 'right' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(dateText, pageWidth - 20, 24, { align: 'right' });

  // Line Separator
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.line(20, 40, pageWidth - 20, 40);

  // --- Content ---
  let y = 55;
  const leftCol = 20;
  const rightCol = 110;

  // Helper function for labeled text
  const addField = (label: string, value: string, x: number, isLong = false) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(label.toUpperCase(), x, y);
      
      const valueY = y + 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      if (isLong) {
        const splitText = doc.splitTextToSize(value, pageWidth - 40);
        doc.text(splitText, x, valueY);
        return (splitText.length * 5) + 5;
      } else {
        doc.text(value, x, valueY);
        return 15; // default height increment
      }
  };

  // Row 1
  addField("Equipamento / Máquina", task.maquina || 'Não informado', leftCol);
  const h1 = addField("Setor", task.setor, rightCol);
  y += Math.max(h1, 15);

  // Row 2
  addField("Responsável Técnico", task.responsavel, leftCol);
  const h2 = addField("Prioridade", task.prioridade, rightCol);
  y += Math.max(h2, 15);

  // Row 3
  addField("Status Atual", task.status, leftCol);
  const h3 = addField("Prazo Estimado", new Date(task.prazoEstimado).toLocaleDateString('pt-BR'), rightCol);
  y += Math.max(h3, 15);

  y += 5; // Extra spacing

  // Description
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.roundedRect(20, y - 5, pageWidth - 40, 8, 1, 1, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("DESCRIÇÃO DO SERVIÇO / PROBLEMA", 22, y);
  y += 10;
  
  doc.setFont("helvetica", "normal");
  const splitDesc = doc.splitTextToSize(task.descricao, pageWidth - 40);
  doc.text(splitDesc, 20, y);
  y += (splitDesc.length * 6) + 10;

  // Items (Materiais)
  if (task.itensOS && task.itensOS.length > 0) {
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(20, y - 5, pageWidth - 40, 8, 1, 1, 'F');
      doc.setFont("helvetica", "bold");
      doc.text("MATERIAIS E SERVIÇOS APLICADOS", 22, y);
      y += 10;
      
      doc.setFont("helvetica", "normal");
      task.itensOS.forEach(item => {
          const itemText = `• ${item.quantidade} ${item.unidade} - ${item.descricao}`;
          doc.text(itemText, 25, y);
          y += 6;
      });
      y += 10;
  }

  // History (Last 3)
  if (task.historico && task.historico.length > 0) {
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, pageWidth - 20, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Últimos Andamentos:", 20, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    task.historico.slice(0, 3).forEach(hist => {
       const date = new Date(hist.data).toLocaleDateString('pt-BR');
       const text = `${date} - ${hist.mensagem} (${hist.usuario})`;
       const splitHist = doc.splitTextToSize(text, pageWidth - 40);
       doc.text(splitHist, 20, y);
       y += (splitHist.length * 5) + 2;
    });
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Documento gerado eletronicamente pelo sistema ManutTrack Pro.", 20, footerY);
  doc.text(new Date().toLocaleString(), pageWidth - 20, footerY, { align: 'right' });

  // --- Output & Sharing Logic ---
  const fileName = `OS_${(task.numeroOS || task.id).replace(/[^a-z0-9]/gi, '_')}.pdf`;

  // 1. Tentar Web Share API (Mobile / Suportados)
  // Nota: Isso envia o ARQUIVO direto para o app do WhatsApp no celular.
  if (navigator.share && navigator.canShare) {
    const blob = doc.output('blob');
    const file = new File([blob], fileName, { type: 'application/pdf' });
    
    if (navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                title: `Ordem de Serviço ${task.numeroOS || ''}`,
                text: `Segue em anexo relatório da manutenção: ${task.titulo}`,
                files: [file]
            });
            return; // Sucesso
        } catch (error) {
            console.warn("Compartilhamento cancelado ou falhou", error);
        }
    }
  }

  // 2. Fallback: Download + WhatsApp Web Link
  // Isso baixa o PDF e abre a conversa.
  doc.save(fileName);
  
  const mensagem = `Olá! 

Estou enviando o relatório da *Ordem de Serviço ${task.numeroOS || ''}*.
*Título:* ${task.titulo}
*Status:* ${task.status}

⚠️ *O arquivo PDF foi baixado no seu dispositivo.* Por favor, anexe-o a esta conversa.`;

  // Se tiver telefone cadastrado, usa ele. Senão, abre a lista de contatos.
  let whatsappUrl;
  if (task.telefone) {
      const cleanPhone = task.telefone.replace(/\D/g, ''); // Remove tudo que não é número
      whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(mensagem)}`;
  } else {
      whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  }
  
  window.open(whatsappUrl, '_blank');
};