/**
 * Catálogo de serviços.
 *
 * Os slugs das sete primeiras entradas vieram do site anterior e não devem
 * mudar: são URLs já indexadas. As novas entram como slugs adicionais.
 *
 * `accent` codifica a natureza térmica/elétrica do serviço na cor — frio em
 * azul glacial, calor em âmbar, elétrica em amarelo, higiene em verde. A
 * paleta inteira sai do símbolo da marca (engrenagem + floco de neve).
 */

export const categories = [
  { id: 'fabricacao', label: 'Projeto e fabricação', note: 'Do levantamento à peça instalada.' },
  { id: 'ar', label: 'Ar, exaustão e segurança', note: 'Captação, condução e tratamento do ar.' },
  { id: 'sistemas', label: 'Sistemas térmicos e elétricos', note: 'Frio, calor, gás e comando.' },
  { id: 'continuidade', label: 'Manutenção e continuidade', note: 'Manter a operação de pé.' },
]

export const services = [
  // ── Projeto e fabricação ────────────────────────────────────────────────
  {
    slug: 'cozinhas-industriais',
    category: 'fabricacao',
    accent: 'steel',
    title: 'Cozinhas industriais em aço inox',
    navTitle: 'Cozinhas industriais',
    short: 'Projeto aplicado, fabricação, instalação e integração para operações profissionais.',
    meta: 'Projeto, fabricação e instalação de cozinhas industriais completas em aço inox para restaurantes, hospitais, redes e alimentação coletiva.',
    lead: 'Uma cozinha industrial não é uma lista de equipamentos. É um fluxo — recebimento, armazenagem, pré-preparo, cocção, distribuição e higienização — que precisa caber no espaço real e sobreviver ao uso diário.',
    photo: 'industrial-kitchen',
    gallery: ['kitchen', 'modern-kitchen', 'equipment'],
    when: [
      'operação nova sendo implantada do zero',
      'mudança de ponto que exige refazer o layout',
      'ampliação de capacidade sem aumento de área',
      'adequação de fluxo para exigência sanitária',
    ],
    deliverables: [
      'leitura do espaço, do fluxo e da capacidade pretendida',
      'definição de layout e das áreas funcionais',
      'fabricação sob medida das estruturas e bancadas em inox',
      'integração com exaustão, refrigeração, aquecimento e elétrica',
      'instalação, montagem e testes das interfaces previstas',
      'orientação de uso e limpeza na entrega',
    ],
    decisions: [
      'Volume de produção e picos de operação',
      'Área disponível, pé-direito e acessos',
      'Infraestrutura existente de água, gás, elétrica e esgoto',
    ],
    faq: [
      {
        q: 'Vocês fazem o projeto ou só executam um projeto pronto?',
        a: 'Os dois. Podemos desenvolver o projeto aplicado a partir do espaço e da operação, ou executar a fabricação e a instalação sobre um projeto de arquitetura já definido, apontando incompatibilidades quando existirem.',
      },
      {
        q: 'A cozinha precisa parar durante a obra?',
        a: 'Depende do escopo. Em reformas com operação ativa é possível planejar etapas e janelas de intervenção, mas isso precisa ser definido antes, porque muda prazo e sequência de montagem.',
      },
    ],
    related: ['equipamentos-em-inox', 'coifas-ventilacao-e-exaustao', 'sistemas-integrados-em-inox'],
  },
  {
    slug: 'equipamentos-em-inox',
    category: 'fabricacao',
    accent: 'steel',
    title: 'Equipamentos e mobiliário em inox',
    navTitle: 'Equipamentos sob medida',
    short: 'Peças dimensionadas para o espaço, o fluxo e o uso profissional.',
    meta: 'Fabricação sob medida de bancadas, mesas, pias, cubas, estantes, coifas e mobiliário em aço inox para operações profissionais.',
    lead: 'Equipamento de catálogo resolve o caso médio. Quando o espaço tem uma coluna no lugar errado, um desnível ou uma medida que não fecha, a peça precisa ser feita para aquele lugar.',
    photo: 'equipment',
    gallery: ['kitchen', 'workshop'],
    when: [
      'medida que nenhum equipamento de linha atende',
      'substituição de peça danificada ou improvisada',
      'padronização de mobiliário entre unidades de uma rede',
      'necessidade de carga, altura ou acabamento específicos',
    ],
    deliverables: [
      'levantamento de medidas e interferências no local',
      'definição de bitola, liga e acabamento do inox',
      'fabricação de bancadas, pias, cubas, mesas, estantes e armários',
      'reforços estruturais dimensionados para a carga informada',
      'entrega e instalação no ponto previsto',
    ],
    decisions: [
      'Carga real que a peça vai sustentar',
      'Exigência de higienização e frequência de limpeza',
      'Acessos, portas e caminho até o ponto de instalação',
    ],
    faq: [
      {
        q: 'Qual liga de inox vocês usam?',
        a: 'Depende da aplicação. Ambientes com contato alimentar direto, umidade constante ou agentes de limpeza agressivos pedem especificação diferente. A liga e a bitola entram descritas na proposta.',
      },
      {
        q: 'Vocês fabricam peça única ou só em lote?',
        a: 'Peça única também. Muitas demandas começam com um único item que não existe pronto no mercado.',
      },
    ],
    related: ['projeto-tecnico-e-fabricacao-cnc', 'cozinhas-industriais', 'reformas-e-modernizacoes'],
  },
  {
    slug: 'projeto-tecnico-e-fabricacao-cnc',
    category: 'fabricacao',
    accent: 'teal',
    title: 'Projeto técnico e corte a plasma CNC',
    navTitle: 'Projeto e corte CNC',
    short: 'Do arquivo à peça: detalhamento, corte, conformação e acabamento.',
    meta: 'Detalhamento técnico, corte a plasma CNC, dobra, solda e acabamento de chapas em aço inox e carbono.',
    lead: 'Corte CNC transforma um desenho em geometria repetível. O valor não está na máquina — está no detalhamento que antecede o corte e evita retrabalho na bancada.',
    photo: 'plasma',
    gallery: ['workshop', 'welding'],
    when: [
      'peça com geometria que exige repetibilidade',
      'lote com várias unidades idênticas',
      'projeto de terceiro que precisa virar arquivo de corte',
      'substituição de componente descontinuado',
    ],
    deliverables: [
      'detalhamento técnico e preparação do arquivo de corte',
      'corte a plasma CNC em chapa',
      'dobra e conformação conforme o desenho',
      'solda, esmerilhamento e acabamento da superfície',
      'conferência dimensional antes da entrega',
    ],
    decisions: [
      'Espessura da chapa e tolerância aceitável',
      'Quantidade de peças e necessidade de repetição',
      'Acabamento final exigido pelo uso',
    ],
    faq: [
      {
        q: 'Posso enviar meu próprio arquivo?',
        a: 'Sim. Formatos vetoriais de desenho técnico são o ponto de partida ideal. Se o arquivo tiver geometria aberta ou cotas inconsistentes, informamos o que precisa ser ajustado antes do corte.',
      },
      {
        q: 'Vocês cortam outros materiais além do inox?',
        a: 'O corte a plasma atende chapas metálicas condutivas, incluindo aço carbono. A especificação entra na avaliação.',
      },
    ],
    related: ['equipamentos-em-inox', 'reformas-e-modernizacoes', 'cozinhas-industriais'],
  },
  {
    slug: 'reformas-e-modernizacoes',
    category: 'fabricacao',
    accent: 'steel',
    title: 'Reformas e modernizações em inox',
    navTitle: 'Reformas',
    short: 'Recuperação, ampliação e reconfiguração depois de avaliar o que já existe.',
    meta: 'Reforma, recuperação e modernização de cozinhas industriais, estruturas e equipamentos em aço inox.',
    lead: 'Reformar é mais difícil que construir do zero, porque metade das decisões já foi tomada por outra pessoa. O trabalho começa entendendo o que vale manter.',
    photo: 'workshop',
    gallery: ['welding', 'kitchen'],
    when: [
      'estrutura desgastada mas com base aproveitável',
      'mudança de cardápio ou de volume que o layout não acompanha',
      'adequação a exigência sanitária ou de segurança',
      'troca de equipamentos que muda pontos de utilidade',
    ],
    deliverables: [
      'avaliação do que existe e do que é reaproveitável',
      'definição de prioridades e do que fica para uma etapa seguinte',
      'recuperação, substituição ou refabricação das partes definidas',
      'reconfiguração de layout e das interfaces afetadas',
      'planejamento de etapas para reduzir tempo de parada',
    ],
    decisions: [
      'Condição real das estruturas sob a superfície',
      'Tempo de parada que a operação suporta',
      'O que é obrigatório agora e o que pode esperar',
    ],
    faq: [
      {
        q: 'Vale a pena reformar ou é melhor trocar?',
        a: 'A avaliação inicial existe justamente para responder isso com base na condição encontrada. Em alguns casos a recuperação custa mais que a peça nova — quando for esse o cenário, informamos.',
      },
    ],
    related: ['manutencao', 'cozinhas-industriais', 'equipamentos-em-inox'],
  },

  // ── Ar, exaustão e segurança ────────────────────────────────────────────
  {
    slug: 'coifas-ventilacao-e-exaustao',
    category: 'ar',
    accent: 'ice',
    title: 'Coifas, ventilação e exaustão industrial',
    navTitle: 'Coifas e exaustão',
    short: 'Captação, condução, filtragem e renovação de ar pensadas como sistema.',
    meta: 'Projeto, fabricação e instalação de coifas, dutos, exaustores e sistemas de ventilação e renovação de ar industrial.',
    lead: 'Coifa não é chapéu de fogão. Captação, dutos, exaustor e reposição de ar formam um sistema — se um elemento está subdimensionado, o conjunto inteiro deixa de funcionar.',
    photo: 'hood',
    gallery: ['modern-kitchen', 'kitchen'],
    when: [
      'calor, fumaça ou odor não estão sendo removidos',
      'ambiente com pressão negativa puxando ar de áreas indevidas',
      'exigência de adequação em vistoria',
      'instalação nova ou ampliação da linha de cocção',
    ],
    deliverables: [
      'avaliação da carga térmica e do tipo de cocção',
      'fabricação de coifas em inox dimensionadas para a linha',
      'rede de dutos, curvas e conexões',
      'seleção e instalação de exaustores e sistema de reposição de ar',
      'filtragem e pontos de inspeção para limpeza',
      'testes de vazão e balanceamento do conjunto',
    ],
    decisions: [
      'Tipo de cocção e carga térmica gerada',
      'Caminho possível para os dutos e ponto de descarga',
      'Reposição de ar disponível no ambiente',
    ],
    faq: [
      {
        q: 'Por que a cozinha continua quente mesmo com coifa nova?',
        a: 'Exaustão sem reposição de ar não funciona. Se não houver entrada de ar equivalente, o exaustor não consegue puxar o volume projetado. A avaliação verifica os dois lados do sistema.',
      },
      {
        q: 'Com que frequência a exaustão precisa de limpeza?',
        a: 'Depende do volume de gordura gerado. Linhas de fritura e churrasco acumulam muito mais rápido. A frequência entra definida no plano de manutenção.',
      },
    ],
    related: ['saponificacao-em-exaustao', 'cozinhas-industriais', 'manutencao'],
  },
  {
    slug: 'saponificacao-em-exaustao',
    category: 'ar',
    accent: 'mint',
    title: 'Sistema saponificante para exaustão industrial',
    navTitle: 'Sistema saponificante',
    short: 'Tratamento químico da gordura dentro do duto, reduzindo acúmulo e risco de incêndio.',
    meta: 'Instalação e manutenção de sistema saponificante em coifas e dutos de exaustão industrial: dosagem, bicos, controle e redução de risco de incêndio.',
    lead: 'Gordura acumulada em duto de exaustão é combustível esperando ignição. O sistema saponificante ataca o problema na origem: dosa solução alcalina na captação e converte a gordura em composto solúvel, antes que ela endureça no duto.',
    illustration: 'saponification',
    gallery: ['hood', 'modern-kitchen'],
    when: [
      'linha de fritura, grelha ou churrasco com alta geração de gordura',
      'duto com histórico de acúmulo rápido entre limpezas',
      'exigência de redução de risco de incêndio na exaustão',
      'operação com difícil acesso ao duto para limpeza mecânica',
    ],
    deliverables: [
      'avaliação da linha de cocção e do perfil de gordura gerado',
      'instalação da central de dosagem e do reservatório de solução',
      'distribuição de bicos aspersores na captação da coifa',
      'painel de comando e intertravamento com a operação do exaustor',
      'ajuste de dosagem, ciclo e tempo de aspersão',
      'orientação de reposição do produto e plano de verificação',
    ],
    decisions: [
      'Perfil e volume de gordura gerado pela cocção',
      'Geometria da coifa e pontos possíveis de aspersão',
      'Rotina de operação e janela para os ciclos de limpeza',
    ],
    faq: [
      {
        q: 'O sistema saponificante substitui a limpeza do duto?',
        a: 'Não. Ele reduz e retarda o acúmulo, o que espaça a necessidade e facilita a remoção, mas a limpeza periódica continua fazendo parte do plano de manutenção.',
      },
      {
        q: 'Dá para instalar em coifa que já existe?',
        a: 'Na maioria dos casos sim, desde que a coifa tenha geometria e acesso que permitam posicionar os bicos corretamente. Isso é verificado no levantamento.',
      },
    ],
    related: ['coifas-ventilacao-e-exaustao', 'manutencao', 'cozinhas-industriais'],
  },

  // ── Sistemas térmicos e elétricos ───────────────────────────────────────
  {
    slug: 'refrigeracao-industrial',
    category: 'sistemas',
    accent: 'ice',
    title: 'Sistemas de refrigeração industrial',
    navTitle: 'Refrigeração',
    short: 'Câmaras, balcões e conservação sob temperatura controlada.',
    meta: 'Instalação e manutenção de sistemas de refrigeração industrial: câmaras frigoríficas, balcões refrigerados, ilhas e conservação de alimentos.',
    lead: 'Refrigeração é onde a operação perde dinheiro em silêncio. Uma câmara que trabalha dois graus acima do ponto não para a cozinha — só encurta a validade de tudo que está dentro dela.',
    illustration: 'refrigeration',
    gallery: ['food-factory', 'equipment'],
    when: [
      'câmara ou balcão que não segura a temperatura de projeto',
      'implantação de área de conservação nova',
      'consumo de energia acima do esperado para o volume refrigerado',
      'formação anormal de gelo, condensação ou ruído',
    ],
    deliverables: [
      'levantamento da carga térmica e do volume a refrigerar',
      'instalação de câmaras, balcões, ilhas e sistemas de conservação',
      'montagem de painéis isotérmicos e estruturas de apoio em inox',
      'linhas frigorígenas, drenos e pontos elétricos',
      'carga, ajuste de controlador e teste de estabilização',
      'manutenção preventiva e corretiva do conjunto',
    ],
    decisions: [
      'Faixa de temperatura exigida por produto',
      'Frequência de abertura e movimentação de carga',
      'Capacidade elétrica disponível no local',
    ],
    faq: [
      {
        q: 'Vocês atendem câmara fria de outra marca?',
        a: 'A manutenção pode atender equipamentos de terceiros, dependendo do modelo, do acesso a peças e da condição encontrada. Informe marca e modelo na avaliação.',
      },
      {
        q: 'A refrigeração pode ser integrada às estruturas em inox?',
        a: 'Sim, e é o cenário mais comum: balcões, bancadas refrigeradas e passagens são fabricados em inox já com o sistema previsto.',
      },
    ],
    related: ['aquecimento-industrial', 'sistemas-integrados-em-inox', 'manutencao'],
  },
  {
    slug: 'aquecimento-industrial',
    category: 'sistemas',
    accent: 'ember',
    title: 'Sistemas de aquecimento industrial',
    navTitle: 'Aquecimento',
    short: 'Cocção, banho-maria, estufas e manutenção de temperatura.',
    meta: 'Instalação e manutenção de sistemas de aquecimento industrial: banho-maria, estufas, pass-through aquecido e linhas de cocção.',
    lead: 'Manter quente é tão técnico quanto manter frio. Distribuição irregular de calor em uma linha de distribuição produz o mesmo resultado de uma falha: alimento fora da faixa segura.',
    illustration: 'heating',
    gallery: ['buffet', 'industrial-kitchen'],
    when: [
      'linha de distribuição que não sustenta a temperatura',
      'implantação de buffet, self-service ou pass-through',
      'estufa ou banho-maria com aquecimento desigual',
      'necessidade de integrar aquecimento a bancada em inox',
    ],
    deliverables: [
      'dimensionamento do sistema conforme a linha de serviço',
      'fabricação de cubas, banho-maria e estruturas aquecidas em inox',
      'instalação de resistências, termostatos e controles',
      'pontos elétricos e proteção do circuito',
      'testes de estabilização e uniformidade de temperatura',
      'manutenção preventiva e corretiva',
    ],
    decisions: [
      'Tempo que o alimento permanece em exposição',
      'Faixa de temperatura exigida pelo tipo de preparo',
      'Disponibilidade elétrica e proteção do circuito',
    ],
    faq: [
      {
        q: 'Aquecimento seco ou banho-maria?',
        a: 'Depende do preparo. Banho-maria mantém umidade e distribui melhor; aquecimento seco é mais simples e responde mais rápido. A escolha entra descrita na proposta.',
      },
    ],
    related: ['refrigeracao-industrial', 'automacao-eletrica', 'cozinhas-industriais'],
  },
  {
    slug: 'sistemas-de-co2',
    category: 'sistemas',
    accent: 'ice',
    title: 'Instalação e manutenção de sistemas de CO₂',
    navTitle: 'Sistemas de CO₂',
    short: 'Linhas de gás carbônico para bebidas, chope e carbonatação.',
    meta: 'Instalação, adequação e manutenção de sistemas de CO₂ para chopeiras, post-mix, refrigerantes e carbonatação em operações profissionais.',
    lead: 'CO₂ é gás sob pressão em ambiente com pessoas. A linha precisa de regulagem correta, componentes compatíveis e ventilação no ponto de armazenagem — não é uma mangueira ligada a um cilindro.',
    illustration: 'co2',
    gallery: ['buffet', 'kitchen'],
    when: [
      'instalação de chopeira, post-mix ou linha de refrigerante',
      'perda de pressão, gás acabando rápido demais ou vazamento suspeito',
      'centralização de cilindros para vários pontos de consumo',
      'adequação da armazenagem e da ventilação do ambiente',
    ],
    deliverables: [
      'avaliação dos pontos de consumo e da pressão exigida',
      'instalação da central de cilindros e do ponto de armazenagem',
      'reguladores primários e secundários por ramal',
      'tubulação, conexões e identificação da linha',
      'teste de estanqueidade e ajuste de pressão por equipamento',
      'manutenção preventiva e substituição de componentes',
    ],
    decisions: [
      'Número de pontos de consumo e pressão de cada um',
      'Local de armazenagem dos cilindros e ventilação disponível',
      'Distância entre a central e os pontos servidos',
    ],
    faq: [
      {
        q: 'O cilindro pode ficar dentro da cozinha?',
        a: 'A armazenagem precisa de local ventilado e protegido, com o cilindro fixado e longe de fonte de calor. O ponto adequado é definido no levantamento, junto com a operação.',
      },
      {
        q: 'Por que o gás acaba mais rápido que o esperado?',
        a: 'Normalmente é vazamento em conexão, regulagem de pressão acima do necessário ou componente com vedação vencida. O teste de estanqueidade localiza a causa.',
      },
    ],
    related: ['refrigeracao-industrial', 'manutencao', 'sistemas-integrados-em-inox'],
  },
  {
    slug: 'automacao-eletrica',
    category: 'sistemas',
    accent: 'volt',
    title: 'Automação elétrica e painéis de comando',
    navTitle: 'Automação elétrica',
    short: 'Quadros, comandos, sensores e intertravamento de equipamentos.',
    meta: 'Automação elétrica industrial: painéis de comando, quadros, sensores, intertravamento e acionamento de equipamentos e sistemas de exaustão.',
    lead: 'Automação bem feita é a que ninguém percebe: o exaustor liga junto com a linha de cocção, o alarme dispara antes da perda de carga, e o operador não precisa lembrar de nada.',
    illustration: 'automation',
    gallery: ['food-factory', 'workshop'],
    when: [
      'equipamentos acionados manualmente que deveriam ser intertravados',
      'necessidade de alarme para temperatura, pressão ou falha',
      'quadro elétrico improvisado, sem proteção ou identificação',
      'automação de exaustão, reposição de ar ou dosagem',
    ],
    deliverables: [
      'levantamento das cargas e da lógica de acionamento desejada',
      'montagem de painel de comando identificado e protegido',
      'instalação de sensores de temperatura, pressão e presença',
      'intertravamento entre cocção, exaustão e reposição de ar',
      'alarmes visuais e sonoros para condições fora da faixa',
      'testes funcionais e treinamento do operador',
    ],
    decisions: [
      'Cargas envolvidas e capacidade elétrica disponível',
      'Lógica de operação e o que deve ser automático',
      'Nível de alarme e quem precisa ser avisado',
    ],
    faq: [
      {
        q: 'Vocês fazem apenas o painel ou também a instalação elétrica?',
        a: 'O escopo pode incluir a montagem do painel, os sensores e o cabeamento até os equipamentos atendidos. Intervenções na entrada de energia da edificação são avaliadas à parte.',
      },
      {
        q: 'Dá para automatizar equipamentos que já existem?',
        a: 'Em geral sim, desde que o equipamento aceite comando externo. Isso é verificado por modelo no levantamento.',
      },
    ],
    related: ['sistemas-integrados-em-inox', 'coifas-ventilacao-e-exaustao', 'aquecimento-industrial'],
  },
  {
    slug: 'sistemas-integrados-em-inox',
    category: 'sistemas',
    accent: 'teal',
    title: 'Sistemas integrados ao inox',
    navTitle: 'Sistemas integrados',
    short: 'Refrigeração, aquecimento, sensores e comandos incorporados ao equipamento.',
    meta: 'Integração de refrigeração, aquecimento, automação e comandos dentro de estruturas e equipamentos fabricados em aço inox.',
    lead: 'O equipamento em inox costuma ser tratado como casca e o sistema como acessório. Quando os dois são pensados juntos, some a gambiarra: dreno com caimento certo, painel acessível, manutenção sem desmontar a bancada.',
    illustration: 'integration',
    gallery: ['equipment', 'food-factory'],
    hub: ['refrigeracao-industrial', 'aquecimento-industrial', 'automacao-eletrica', 'sistemas-de-co2'],
    when: [
      'bancada ou balcão que precisa de frio ou calor embutido',
      'equipamento cujo sistema ficou inacessível para manutenção',
      'necessidade de comando e sensores dentro da estrutura',
      'projeto novo em que estrutura e sistema devem nascer juntos',
    ],
    deliverables: [
      'compatibilização entre estrutura em inox e sistema previsto',
      'fabricação já com alojamento, acesso e passagem de instalação',
      'integração de refrigeração, aquecimento, dosagem ou comando',
      'previsão de dreno, ventilação e acesso para manutenção',
      'testes do conjunto montado antes da entrega',
    ],
    decisions: [
      'Qual sistema entra e qual o espaço que ele exige',
      'Como a manutenção vai acessar o componente depois',
      'Cargas térmicas e elétricas somadas na mesma estrutura',
    ],
    faq: [
      {
        q: 'Qual a vantagem de integrar em vez de comprar separado?',
        a: 'Evita adaptação. Estrutura e sistema projetados juntos eliminam improviso em dreno, ventilação, acesso e acabamento — que são exatamente os pontos que dão problema depois.',
      },
    ],
    related: ['refrigeracao-industrial', 'automacao-eletrica', 'equipamentos-em-inox'],
  },

  // ── Manutenção e continuidade ───────────────────────────────────────────
  {
    slug: 'manutencao',
    category: 'continuidade',
    accent: 'ember',
    title: 'Manutenção de cozinhas industriais e equipamentos',
    seoTitle: 'Manutenção de cozinhas industriais',
    navTitle: 'Manutenção industrial',
    short: 'Atendimento preventivo, corretivo e contratos conforme criticidade.',
    meta: 'Manutenção preventiva e corretiva de cozinhas industriais, equipamentos em inox, exaustão, refrigeração e aquecimento.',
    lead: 'Manutenção corretiva é a mais cara que existe — você paga o conserto e a parada junto. O plano preventivo existe para transferir a intervenção para o horário que a operação escolhe.',
    photo: 'welding',
    gallery: ['workshop', 'kitchen'],
    when: [
      'falha observada em equipamento ou estrutura',
      'rotina preventiva planejada por criticidade',
      'contrato para múltiplas unidades ou vários ativos',
      'operação parada precisando de atendimento',
    ],
    deliverables: [
      'triagem e levantamento inicial da condição',
      'diagnóstico dentro das condições acessíveis',
      'reparo corretivo, substituição ou refabricação de peça',
      'plano preventivo com frequência definida por ativo',
      'contrato de manutenção para redes e múltiplas unidades',
      'registro do serviço executado quando contratado',
    ],
    decisions: [
      'Sintoma observado e criticidade da parada',
      'Acesso ao equipamento e condição aparente',
      'Histórico e frequência de manutenção anterior',
    ],
    faq: [
      {
        q: 'Vocês atendem contrato para rede com várias unidades?',
        a: 'Sim. O formato depende da quantidade de ativos, da dispersão das unidades, da criticidade e da frequência definida na proposta.',
      },
      {
        q: 'Como informar uma operação parada?',
        a: 'Sinalize logo no início da mensagem que a operação está parada e descreva o sintoma observado. Não opere o equipamento fora das condições seguras.',
      },
    ],
    related: ['equipamentos-hospitalares', 'reformas-e-modernizacoes', 'coifas-ventilacao-e-exaustao'],
  },
  {
    slug: 'equipamentos-hospitalares',
    category: 'continuidade',
    accent: 'mint',
    title: 'Manutenção de equipamentos hospitalares em inox',
    navTitle: 'Equipamentos hospitalares',
    short: 'Estruturas, mobiliário e equipamentos de apoio em ambiente de saúde.',
    meta: 'Manutenção e fabricação de equipamentos, mobiliário e estruturas em aço inox para hospitais, clínicas e ambientes de saúde.',
    lead: 'Ambiente hospitalar não tolera improviso nem parada longa. Superfície que não pode reter resíduo, acesso restrito, horário de intervenção limitado — a manutenção precisa se adaptar ao protocolo da unidade, não o contrário.',
    illustration: 'hospital',
    gallery: ['equipment', 'kitchen'],
    when: [
      'mobiliário ou estrutura em inox com desgaste ou dano',
      'nutrição e copa hospitalar precisando de adequação',
      'necessidade de peça sob medida para setor específico',
      'plano preventivo para o parque de equipamentos em inox',
    ],
    deliverables: [
      'avaliação da condição e do nível de exigência sanitária do setor',
      'reparo, recuperação ou refabricação de estruturas em inox',
      'fabricação sob medida de mobiliário e apoio hospitalar',
      'manutenção de cozinha, copa e nutrição da unidade',
      'planejamento de intervenção dentro da janela autorizada',
      'registro do serviço executado quando contratado',
    ],
    decisions: [
      'Setor atendido e o protocolo sanitário aplicável',
      'Janela de intervenção permitida pela unidade',
      'Restrições de acesso, circulação e ruído',
    ],
    faq: [
      {
        q: 'Vocês atendem dentro do horário da unidade?',
        a: 'O planejamento considera a janela autorizada pela unidade. Em setores críticos a intervenção costuma ser programada fora do pico, e isso é definido antes da execução.',
      },
      {
        q: 'O escopo cobre equipamento médico?',
        a: 'O foco é estrutura, mobiliário e equipamentos de apoio em aço inox — incluindo cozinha, copa e nutrição. Equipamento médico-assistencial regulado tem cadeia própria de assistência técnica.',
      },
    ],
    related: ['manutencao', 'equipamentos-em-inox', 'cozinhas-industriais'],
  },
]

export const serviceBySlug = Object.fromEntries(services.map(service => [service.slug, service]))

export const servicesByCategory = categories.map(category => ({
  ...category,
  services: services.filter(service => service.category === category.id),
}))
