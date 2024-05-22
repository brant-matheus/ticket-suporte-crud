// mais frio para o mais quente

// lavanda (#D8BFD8)- azul(#0000FF) - ciano(#00FFFF)- verde - amarelo - laranja(#FFA500) - vermelho(#FF0000)

//categories
// error do sistema, feedback e melhorias, conta, problemas de permissão. create: nova feature (random hex color)

//status
//pendente - em análise - em aberto -concluido ()

// priorities
//não urgente #D8BFD8 - media #00FFFF - urgente #FFA500- imediata #FF0000
export const TicketCategoryFactory = [
  {
    name: 'error do sistema',
    color: '#FF0000',
    responsible_id: 1,
  },
  { name: 'feedback e melhorias', color: '#D8BFD8', responsible_id: 1 },
  { name: 'conta', color: '#00FFFF', responsible_id: 1 },
  { name: 'problemas de permissão', color: '#FFA500', responsible_id: 1 },
]

export const TicketPrioriesFactory = [
  { name: 'não urgente', color: '#D8BFD8', responsible_id: 1 },
  { name: 'media', color: '#00FFFF', responsible_id: 1 },
  { name: 'urgente', color: '#FFA500', responsible_id: 1 },
  { name: 'imediata', color: '#FF0000', responsible_id: 1 },
]

export const TicketStatusesFactory = [
  { name: 'pendente', color: '#CCCCCC', responsible_id: 1 },
  { name: 'em análise', color: '#4169E1', responsible_id: 1 },
  { name: 'em aberto', color: '#32CD32', responsible_id: 1 },
  { name: 'concluído', color: '#008000', responsible_id: 1 },
]
