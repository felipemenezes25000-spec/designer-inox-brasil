/**
 * Segmentos de atuação.
 *
 * Os três primeiros slugs vieram do site anterior e ficam preservados. O quarto
 * entra porque a carteira de clientes tem quatro hospitais e uma rede de saúde —
 * um contexto com exigência própria que não cabia em nenhum dos outros três.
 */

import type { Segment } from './types'

export const segments: Segment[] = [
  {
    slug: 'restaurantes-e-cozinhas-profissionais',
    accent: 'ember',
    title: 'Restaurantes e cozinhas profissionais',
    navTitle: 'Restaurantes',
    short: 'Operações que coordenam preparo, cocção, higienização, circulação e atendimento no mesmo espaço.',
    meta: 'Cozinhas industriais, equipamentos em inox, exaustão e manutenção para restaurantes e cozinhas profissionais.',
    lead: 'O restaurante é o ambiente onde tudo acontece ao mesmo tempo e no mesmo metro quadrado. Pico de salão, cozinha em carga máxima e higienização competindo pelo mesmo espaço e pela mesma equipe.',
    photo: 'real-cozinha-industrial',
    pressures: [
      { label: 'Pico concentrado', note: 'A operação inteira se define em duas ou três horas por turno.' },
      { label: 'Espaço disputado', note: 'Cada metro cedido à circulação sai da produção.' },
      { label: 'Calor e gordura', note: 'A linha de cocção define a carga de exaustão de todo o ambiente.' },
      { label: 'Higienização diária', note: 'Superfície e acabamento precisam suportar limpeza pesada e frequente.' },
    ],
    priorities: [
      'layout que separe fluxo sujo e limpo sem alongar o percurso',
      'exaustão dimensionada para a linha de cocção real',
      'bancadas e estruturas que aguentem o ritmo do turno',
      'manutenção que caiba na janela entre serviços',
    ],
    services: ['cozinhas-industriais', 'coifas-ventilacao-e-exaustao', 'equipamentos-em-inox', 'manutencao'],
  },
  {
    slug: 'hotelaria-e-alimentacao-coletiva',
    accent: 'steel',
    title: 'Hotelaria e alimentação coletiva',
    navTitle: 'Hotelaria e coletiva',
    short: 'Produção recorrente, múltiplos pontos de serviço e necessidade de padronizar a operação.',
    meta: 'Soluções em inox para hotéis, buffets, refeitórios e operações de alimentação coletiva com produção recorrente.',
    lead: 'Aqui o desafio não é o pico, é a constância. Produção previsível todos os dias, vários pontos de distribuição e um padrão que precisa se repetir independentemente de quem está no turno.',
    photo: 'buffet',
    pressures: [
      { label: 'Volume previsível', note: 'A produção é planejada, o que permite dimensionar com precisão.' },
      { label: 'Vários pontos de serviço', note: 'Distribuição em locais distintos exige manter temperatura fora da cozinha.' },
      { label: 'Padronização', note: 'O resultado não pode depender do operador do dia.' },
      { label: 'Janela de intervenção curta', note: 'A operação raramente para por completo.' },
    ],
    priorities: [
      'linha de distribuição que sustente temperatura do início ao fim do serviço',
      'equipamentos padronizados e reproduzíveis entre unidades',
      'refrigeração e aquecimento dimensionados para produção contínua',
      'plano preventivo alinhado à agenda da operação',
    ],
    services: ['aquecimento-industrial', 'refrigeracao-industrial', 'cozinhas-industriais', 'manutencao'],
  },
  {
    slug: 'producao-e-varejo-de-alimentos',
    accent: 'ice',
    title: 'Produção e varejo de alimentos',
    navTitle: 'Produção e varejo',
    short: 'Operações que combinam fabricação, armazenamento, exposição e atendimento.',
    meta: 'Estruturas em inox, refrigeração, CO₂ e manutenção para supermercados, redes de varejo e produção de alimentos.',
    lead: 'No varejo alimentar o produto fica exposto e o cliente vê tudo. Câmara, balcão, ilha e área de manipulação precisam funcionar de forma contínua — e qualquer falha de temperatura vira perda direta de estoque.',
    photo: 'real-varejo-ilha',
    pressures: [
      { label: 'Cadeia de frio contínua', note: 'Perda de temperatura vira perda de mercadoria no mesmo dia.' },
      { label: 'Produto exposto', note: 'O equipamento faz parte da experiência de compra.' },
      { label: 'Operação sem parada', note: 'A intervenção precisa acontecer com a loja funcionando.' },
      { label: 'Múltiplas unidades', note: 'O que é definido em uma loja tende a virar padrão de rede.' },
    ],
    priorities: [
      'refrigeração estável em câmaras, balcões e ilhas',
      'estruturas em inox que resistam à limpeza e à exposição',
      'sistemas de CO₂ e bebidas instalados com segurança',
      'contrato de manutenção que cubra todas as unidades da rede',
    ],
    services: ['refrigeracao-industrial', 'sistemas-de-co2', 'equipamentos-em-inox', 'manutencao'],
  },
  {
    slug: 'saude-e-ambientes-hospitalares',
    accent: 'mint',
    title: 'Saúde e ambientes hospitalares',
    navTitle: 'Saúde e hospitais',
    short: 'Exigência sanitária alta, acesso restrito e continuidade que não admite improviso.',
    meta: 'Manutenção e fabricação em aço inox para hospitais e clínicas: nutrição, copa, mobiliário e estruturas de apoio.',
    lead: 'Hospital combina duas exigências que raramente andam juntas: rigor sanitário absoluto e impossibilidade de parar. A intervenção precisa caber no protocolo da unidade e no horário que ela autoriza.',
    photo: 'real-hospital-prateleiras',
    pressures: [
      { label: 'Protocolo sanitário', note: 'Superfície e acabamento não podem reter resíduo.' },
      { label: 'Acesso controlado', note: 'Circulação, ruído e horário seguem a regra da unidade.' },
      { label: 'Continuidade crítica', note: 'A nutrição hospitalar não pode interromper o atendimento.' },
      { label: 'Rastreabilidade', note: 'O serviço executado precisa ficar registrado.' },
    ],
    priorities: [
      'intervenção planejada dentro da janela autorizada',
      'estruturas em inox adequadas ao nível sanitário do setor',
      'manutenção de cozinha, copa e nutrição sem parar o atendimento',
      'registro do que foi executado em cada visita',
    ],
    services: ['equipamentos-hospitalares', 'manutencao', 'equipamentos-em-inox', 'refrigeracao-industrial'],
  },
]

export const segmentBySlug = new Map(segments.map((s) => [s.slug, s]))
export const segmentSlugs = segments.map((s) => s.slug)
