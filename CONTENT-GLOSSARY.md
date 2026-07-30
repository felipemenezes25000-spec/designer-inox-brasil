# Glossário canônico de conteúdo — Designer Inox Brasil

Única fonte de verdade para rótulos, números e taxonomia usados no site.
Qualquer divergência entre o HTML e este arquivo é bug.

## Grupos de serviço (4)

| ID            | Nome canônico (usado em H2, cards, /servicos/) | Nota de apoio                                             |
|---------------|-----------------------------------------------|----------------------------------------------------------|
| fabricacao    | Implantar e fabricar                           | Projeto técnico, fabricação e instalação.                |
| ar            | Controlar ar e exaustão                        | Captação, condução, filtragem e segurança contra incêndio. |
| sistemas      | Integrar frio, calor e comando                 | Refrigeração, aquecimento, CO₂ e automação elétrica.     |
| continuidade  | Reformar e manter                              | Manutenção preventiva, corretiva e modernizações.        |

## Serviços (13) — nome canônico · rótulo curto · slug

| # | Nome canônico (H1, title, JSON-LD, option)         | Rótulo curto (card, breadcrumb, nav) | Slug                            |
|---|---------------------------------------------------|--------------------------------------|---------------------------------|
| 1 | Cozinhas industriais em aço inox                   | Cozinhas industriais                 | cozinhas-industriais            |
| 2 | Equipamentos e mobiliário em inox                  | Equipamentos sob medida              | equipamentos-em-inox            |
| 3 | Projeto técnico e corte a plasma CNC               | Projeto e corte CNC                  | projeto-tecnico-e-fabricacao-cnc|
| 4 | Reformas e modernizações em inox                   | Reformas                             | reformas-e-modernizacoes        |
| 5 | Coifas, ventilação e exaustão industrial           | Coifas e exaustão                    | coifas-ventilacao-e-exaustao    |
| 6 | Sistema saponificante para exaustão industrial     | Sistema saponificante                | saponificacao-em-exaustao       |
| 7 | Sistemas de refrigeração industrial                | Refrigeração                         | refrigeracao-industrial         |
| 8 | Sistemas de aquecimento industrial                 | Aquecimento                          | aquecimento-industrial          |
| 9 | Instalação e manutenção de sistemas de CO₂         | Sistemas de CO₂                      | sistemas-de-co2                 |
|10 | Automação elétrica e painéis de comando            | Automação elétrica                   | automacao-eletrica              |
|11 | Sistemas integrados em inox                        | Sistemas integrados                  | sistemas-integrados-em-inox     |
|12 | Manutenção de cozinhas industriais e equipamentos  | Manutenção industrial                | manutencao                      |
|13 | Manutenção de equipamentos hospitalares em inox    | Equipamentos hospitalares            | equipamentos-hospitalares       |

## Números — um rótulo por número

| Número | Rótulo canônico    | Onde aparece                            |
|--------|--------------------|-----------------------------------------|
| 13     | serviços           | home, /servicos/, /empresa/             |
| 23     | clientes listados  | home, /clientes/, /empresa/             |
| 4      | segmentos          | home, /segmentos/, /empresa/            |

## Acentos — regra semântica por domínio

A cor de acento codifica a natureza do serviço, não é decorativa.

| Acento  | Domínio                          | Serviços                                    |
|---------|----------------------------------|---------------------------------------------|
| steel   | Fabricação / metal neutro        | Cozinhas, Equipamentos, Reformas            |
| teal    | Projeto técnico / integração     | Projeto CNC, Sistemas integrados            |
| ice     | Frio / ar / gás                  | Coifas, Refrigeração, CO₂                   |
| ember   | Calor / urgência corretiva       | Aquecimento, Manutenção                     |
| volt    | Elétrica / automação             | Automação elétrica                          |
| mint    | Higiene / segurança              | Saponificação, Equipamentos hospitalares    |

Regra: ao criar um serviço novo, escolher o acento pelo domínio acima.
Nunca repetir o acento de outro serviço da mesma categoria sem razão semântica.

## Taxonomia: 4 segmentos vs 6 grupos de clientes

Os **4 segmentos** (Restaurantes, Hotelaria, Produção/varejo, Saúde) organizam as
soluções por contexto de operação.

Os **6 grupos de clientes** (Saúde, Institucional, Redes/varejo, Restaurantes,
Hotelaria/coletiva, Engenharia/construção) organizam os 23 nomes por tipo de cliente.

São cortes diferentes e coexistem. A página /clientes/ explicita a distinção.
