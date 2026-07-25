import type { PublicFaq } from '@/modules/content/public/types'

const faq = (id: string, question: string, answer: string): PublicFaq => ({ id, question, answer })

/** FAQs globais exibidas na home. Cópia aprovada na especificação. */
export const globalFaqs: readonly PublicFaq[] = [
  faq(
    'faq-global-1',
    'A Designer Inox trabalha apenas com fabricação?',
    'Não. O escopo pode reunir projeto técnico aplicado, fabricação, instalação e integração, conforme a necessidade apresentada e a proposta aprovada.',
  ),
  faq(
    'faq-global-2',
    'É possível solicitar uma solução completa para uma operação nova?',
    'Sim. O atendimento inicial organiza espaço, uso, equipamentos e sistemas envolvidos para definir quais etapas devem fazer parte do escopo.',
  ),
  faq(
    'faq-global-3',
    'Vocês trabalham com refrigeração, aquecimento e automação?',
    'Esses sistemas podem ser integrados a estruturas e equipamentos em inox quando fizerem parte da solução contratada.',
  ),
  faq(
    'faq-global-4',
    'A Designer Inox realiza reformas e manutenção?',
    'Sim. Reformas, modernizações e manutenção preventiva ou corretiva começam por uma avaliação da estrutura, do equipamento e da continuidade necessária.',
  ),
  faq(
    'faq-global-5',
    'Posso enviar desenho, medidas ou fotos?',
    'Sim. Esse material ajuda na avaliação inicial. O canal disponível informa quais formatos podem ser recebidos em cada etapa.',
  ),
  faq(
    'faq-global-6',
    'Como começa um orçamento?',
    'Começa pela necessidade, cidade, tipo de operação e condições conhecidas. Depois são definidos levantamento, entregáveis e limites da proposta.',
  ),
]

/** FAQs contextuais de cada serviço. */
export const serviceFaqs: Record<string, readonly PublicFaq[]> = {
  'cozinhas-industriais': [
    faq(
      'faq-cozinhas-1',
      'O projeto pode reunir equipamentos e exaustão?',
      'Sim. A solução pode coordenar estruturas, equipamentos, ventilação, exaustão e sistemas integrados quando esses itens fizerem parte do escopo aprovado.',
    ),
    faq(
      'faq-cozinhas-2',
      'É necessário fazer levantamento no local?',
      'A necessidade de visita e levantamento depende das medidas, interferências e informações disponíveis na avaliação inicial.',
    ),
  ],
  'equipamentos-em-inox': [
    faq(
      'faq-equipamentos-1',
      'Os equipamentos podem ser feitos sob medida?',
      'Sim. Dimensões, uso, carga, temperatura e integração informados orientam o detalhamento da proposta.',
    ),
    faq(
      'faq-equipamentos-2',
      'É possível fabricar a partir de um desenho do cliente?',
      'O desenho pode ser analisado como referência e conferido antes da fabricação contratada.',
    ),
  ],
  'coifas-ventilacao-e-exaustao': [
    faq(
      'faq-exaustao-1',
      'O atendimento inclui dutos e renovação de ar?',
      'Pode incluir coifas, dutos, filtragem, insuflamento e renovação de ar conforme a avaliação e o escopo aprovado.',
    ),
    faq(
      'faq-exaustao-2',
      'Vocês avaliam sistemas já instalados?',
      'Sim. Condição aparente, acesso, equipamentos atendidos e problema observado são levantados antes da proposta.',
    ),
  ],
  'sistemas-integrados-em-inox': [
    faq(
      'faq-sistemas-1',
      'Quais sistemas podem ser integrados?',
      'Refrigeração, aquecimento, sensores, comandos e automação podem integrar a solução quando tecnicamente aplicáveis ao escopo.',
    ),
    faq(
      'faq-sistemas-2',
      'A automação é entregue separadamente?',
      'A página trata da automação associada à estrutura ou ao equipamento em inox contratado, com interfaces definidas na proposta.',
    ),
  ],
  'projeto-tecnico-e-fabricacao-cnc': [
    faq(
      'faq-cnc-1',
      'Quais arquivos ajudam na avaliação?',
      'Desenhos, plantas, medidas, quantidade e material pretendido ajudam a verificar o caminho de detalhamento e fabricação.',
    ),
    faq(
      'faq-cnc-2',
      'O corte CNC inclui acabamento e montagem?',
      'Corte, acabamento, dobra, solda e montagem são itens separados e só entram quando descritos na proposta.',
    ),
  ],
  'reformas-e-modernizacoes': [
    faq(
      'faq-reformas-1',
      'É possível reformar sem interromper toda a operação?',
      'A necessidade de continuidade deve ser informada para que etapas, acessos e limites possam ser avaliados.',
    ),
    faq(
      'faq-reformas-2',
      'Todo equipamento existente pode ser recuperado?',
      'Não é possível afirmar antes da avaliação. Estado, material, acesso e objetivo definem se a recuperação é adequada.',
    ),
  ],
  manutencao: [
    faq(
      'faq-manutencao-1',
      'Vocês oferecem manutenção preventiva e corretiva?',
      'Sim. O formato depende da quantidade de ativos, condição informada, criticidade e frequência definida na proposta.',
    ),
    faq(
      'faq-manutencao-2',
      'Como informar uma operação parada?',
      'Selecione a urgência correspondente e descreva o sintoma sem desmontar ou operar o equipamento fora das condições seguras.',
    ),
  ],
}

/** As duas perguntas comuns a todos os segmentos. */
export const segmentFaqs = (slug: string): readonly PublicFaq[] => [
  faq(
    `faq-${slug}-1`,
    'Quais informações ajudam na avaliação deste segmento?',
    'Tipo de operação, espaço, fluxo, equipamentos, horários e problema ou objetivo ajudam a organizar o escopo inicial.',
  ),
  faq(
    `faq-${slug}-2`,
    'Os serviços podem ser combinados?',
    'Sim. Somente os serviços relacionados à necessidade e aprovados na proposta são coordenados na entrega.',
  ),
]
