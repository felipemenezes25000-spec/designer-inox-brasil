/**
 * Construtores de cada tipo de página.
 *
 * Cada função devolve o corpo do <main>; a casca (head, header, footer) vem de
 * layout.mjs. A separação existe para que uma mudança de navegação não exija
 * tocar em nenhum destes construtores.
 */

import { site, contact, whatsapp, clientGroups, clientCount, legalNotice } from '../content/site.mjs'
import { services, servicesByCategory, serviceBySlug } from '../content/services.mjs'
import { segments, segmentBySlug } from '../content/segments.mjs'
import { illustrations } from './illustrations.mjs'
import { esc, attr, picture, illustrativeNote } from './layout.mjs'

const WHATS = whatsapp()

const eyebrow = text => `<p class="eyebrow">${esc(text)}</p>`

const ctaBlock = (heading, copy) => `<section class="cta cta-conversion">
<div class="container cta-grid">
<div class="cta-lead">${eyebrow('Próximo passo')}<h2>${esc(heading)}</h2>
<div class="cta-facts" aria-label="Informações do atendimento"><span>${esc(site.region)}</span><span>${esc(contact.hours)}</span></div></div>
<div class="cta-actions">
<p>${esc(copy)}</p>
<a class="btn btn-light" data-cta="cta-final-whatsapp" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Pedir orçamento no WhatsApp <span class="arrow" aria-hidden="true">↗</span></a>
<a class="btn btn-ghost" data-cta="cta-final-formulario" href="/orcamento/">Organizar minha solicitação <span class="arrow" aria-hidden="true">→</span></a>
<small>Você revisa a mensagem antes de enviar.</small>
</div>
</div>
</section>`

const faqBlock = (items, heading = 'Perguntas frequentes') => {
  if (!items?.length) return ''
  return `<section class="section">
<div class="container">
<div class="section-head">
<div>${eyebrow('Dúvidas comuns')}</div>
<div><h2 class="section-title section-title-sm">${esc(heading)}</h2></div>
</div>
<div class="faq">
${items
  .map(
    item => `<details><summary>${esc(item.q)}</summary><div class="faq-body"><p>${esc(item.a)}</p></div></details>`,
  )
  .join('\n')}
</div>
</div>
</section>`
}

const relatedBlock = slugs => {
  if (!slugs?.length) return ''
  const cards = slugs
    .map(slug => serviceBySlug[slug])
    .filter(Boolean)
    .map(
      (service, index) => `<a class="related-card reveal accent-${attr(service.accent)}" href="/${attr(service.slug)}/">
<span class="num">${String(index + 1).padStart(2, '0')}</span>
<h3>${esc(service.title)}</h3>
<p>${esc(service.short)}</p>
<span class="linkline">Ver serviço <span class="arrow" aria-hidden="true">→</span></span>
</a>`,
    )
    .join('\n')
  return `<section class="section">
<div class="container">
<div class="section-head">
<div>${eyebrow('Serviços relacionados')}</div>
<div><h2 class="section-title section-title-sm">Escopos que costumam conversar.</h2></div>
</div>
<div class="related-grid">${cards}</div>
</div>
</section>`
}

const mediaFor = item =>
  item.photo
    ? `${picture(item.photo, { sizes: '(max-width:1000px) 100vw, 46vw', priority: true })}<span class="art-tag">Imagem ilustrativa</span>`
    : `<div class="art-svg">${illustrations[item.illustration]}</div><span class="art-tag">Esquema técnico</span>`

const galleryBlock = (keys, heading, copy) => {
  if (!keys?.length) return ''
  return `<section class="section section-void">
<div class="container">
<div class="section-head section-head-stack">
<div>${eyebrow('Referências visuais')}</div>
<div><h2 class="section-title section-title-sm">${esc(heading)}</h2><p class="section-copy">${esc(copy)}</p></div>
</div>
<div class="gallery-grid">
${keys.map(key => `<figure class="gallery-item reveal">${picture(key, { sizes: '(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw' })}</figure>`).join('\n')}
</div>
${illustrativeNote('Imagens ilustrativas de banco licenciado. Não representam obras executadas pela Designer Inox Brasil.')}
</div>
</section>`
}

// ── Home ──────────────────────────────────────────────────────────────────

export function homePage() {
  const categoryAccent = { fabricacao: 'steel', ar: 'ice', sistemas: 'volt', continuidade: 'mint' }
  const categoryRoute = {
    fabricacao: '/cozinhas-industriais/',
    ar: '/coifas-ventilacao-e-exaustao/',
    sistemas: '/sistemas-integrados-em-inox/',
    continuidade: '/manutencao/',
  }
  const categoryLabel = {
    fabricacao: 'Implantar e fabricar',
    ar: 'Controlar ar e exaustão',
    sistemas: 'Integrar frio, calor e comando',
    continuidade: 'Reformar e manter',
  }

  const serviceGroups = servicesByCategory
    .map(
      (category, index) => `<article class="solution-card reveal accent-${attr(categoryAccent[category.id] || 'steel')}">
<div class="solution-card-head"><span class="num">0${index + 1}</span><span class="solution-count">${category.services.length} ${category.services.length === 1 ? 'serviço' : 'serviços'}</span></div>
<h3>${esc(categoryLabel[category.id] || category.label)}</h3>
<p>${esc(category.note)}</p>
<ul>${category.services.map(service => `<li><a href="/${attr(service.slug)}/">${esc(service.navTitle || service.title)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul>
<a class="solution-main-link" href="${attr(categoryRoute[category.id] || '/servicos/')}">Começar por esta frente <span class="arrow" aria-hidden="true">→</span></a>
</article>`,
    )
    .join('\n')

  const proofNames = [
    'McDonald’s',
    'Hospital Anchieta',
    'Embaixada dos Estados Unidos',
    'Rede Santa Lúcia',
    'Via Engenharia',
    'Rede Big Box',
    'Bali Park',
    'JC Gontijo',
  ]
    .map(name => `<span>${esc(name)}</span>`)
    .join('')

  const segmentCards = segments
    .map(
      (segment, index) => `<a class="segment-card reveal accent-${attr(segment.accent)}" href="/segmentos/${attr(segment.slug)}/">
<span class="fine">Segmento ${String(index + 1).padStart(2, '0')}</span>
<h3>${esc(segment.title)}</h3>
<p>${esc(segment.short)}</p>
<span class="linkline">Ver soluções para este segmento <span class="arrow" aria-hidden="true">→</span></span>
</a>`,
    )
    .join('\n')

  const implantWhats = whatsapp('Olá, encontrei a Designer Inox Brasil pelo site. Quero implantar ou ampliar uma cozinha/operação. Cidade/UF:')
  const customWhats = whatsapp('Olá, encontrei a Designer Inox Brasil pelo site. Preciso fabricar um equipamento ou mobiliário em inox sob medida. Cidade/UF:')
  const maintenanceWhats = whatsapp('Olá, encontrei a Designer Inox Brasil pelo site. Preciso de manutenção, reforma ou correção de uma falha. A operação está:')
  const guidanceWhats = whatsapp('Olá, encontrei a Designer Inox Brasil pelo site. Ainda não sei qual serviço preciso e gostaria de orientação. Minha necessidade é:')

  return `<section class="hero hero-conversion">
<div class="hero-media" aria-hidden="true">${picture('industrial-kitchen', { sizes: '100vw', priority: true })}</div>
<div class="hero-overlay" aria-hidden="true"></div>
<div class="container hero-conversion-grid">
<div class="hero-copy hero-copy-conversion">
${eyebrow('Cozinhas industriais · equipamentos · sistemas')}
<h1 class="hero-title">Engenharia em inox para a operação <span class="metal">funcionar de verdade.</span></h1>
<p class="hero-lead">Projeto técnico, fabricação sob medida, instalação, exaustão, refrigeração, aquecimento, automação e manutenção em Brasília / DF e entorno.</p>
<div class="hero-actions">
<a class="btn btn-hero" data-cta="hero-whatsapp" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Pedir orçamento no WhatsApp <span class="arrow" aria-hidden="true">↗</span></a>
<a class="btn btn-hero-ghost" data-cta="hero-formulario" href="/orcamento/">Organizar minha solicitação <span class="arrow" aria-hidden="true">→</span></a>
</div>
<div class="hero-reassurance" aria-label="Diferenciais do atendimento">
<span>Sob medida para o espaço real</span><span>Do projeto à manutenção</span><span>Escopo definido antes da fabricação</span>
</div>
</div>
<aside class="hero-quote-card" aria-label="Atalhos para solicitar avaliação">
<p class="fine">Comece pela sua necessidade</p>
<h2>O que precisa ser resolvido agora?</h2>
<p>Escolha o cenário mais próximo. O WhatsApp já abre com a pergunta certa.</p>
<div class="hero-intents">
<a data-cta="hero-intencao-implantar" href="${attr(implantWhats)}" target="_blank" rel="noopener noreferrer"><span>01</span> Implantar ou ampliar uma operação <b aria-hidden="true">↗</b></a>
<a data-cta="hero-intencao-sob-medida" href="${attr(customWhats)}" target="_blank" rel="noopener noreferrer"><span>02</span> Fabricar algo sob medida <b aria-hidden="true">↗</b></a>
<a data-cta="hero-intencao-manutencao" href="${attr(maintenanceWhats)}" target="_blank" rel="noopener noreferrer"><span>03</span> Corrigir falha, reformar ou manter <b aria-hidden="true">↗</b></a>
<a data-cta="hero-intencao-orientacao" href="${attr(guidanceWhats)}" target="_blank" rel="noopener noreferrer"><span>04</span> Preciso de orientação <b aria-hidden="true">↗</b></a>
</div>
<p class="hero-quote-note">Envie cidade, fotos, medidas ou planta. Atendimento ${esc(contact.hours.toLowerCase())}.</p>
</aside>
</div>
<div class="hero-proof-strip">
<div class="container hero-proof-grid">
<div><strong>${services.length}</strong><span>frentes técnicas coordenáveis</span></div>
<div><strong>${segments.length}</strong><span>segmentos de operação</span></div>
<div><strong>${clientCount}</strong><span>organizações na lista de clientes</span></div>
<div><strong>DF</strong><span>Brasília e entorno</span></div>
</div>
</div>
</section>

<section class="trust-band" aria-label="Experiência em operações exigentes">
<div class="container trust-band-grid">
<p><span>Confiança construída</span> Experiência informada em saúde, diplomacia, varejo, alimentação e construção.</p>
<div class="trust-name-row">${proofNames}</div>
<a href="/clientes/">Ver clientes <span aria-hidden="true">→</span></a>
</div>
</section>

<section class="section solutions-section" id="servicos">
<div class="container">
<div class="section-head">
<div>${eyebrow('Soluções por objetivo')}</div>
<div><h2 class="section-title">Menos catálogo. Mais clareza sobre o que resolve.</h2><p class="section-copy">As ${services.length} frentes técnicas estão organizadas em quatro caminhos. Você pode contratar uma etapa isolada ou coordenar projeto, fabricação, sistemas e instalação.</p></div>
</div>
<div class="solution-grid">${serviceGroups}</div>
<div class="section-action-row"><a class="btn btn-outline" href="/servicos/">Explorar os ${services.length} serviços <span class="arrow" aria-hidden="true">→</span></a><a class="text-cta" data-cta="servicos-whatsapp" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Não sabe por onde começar? Fale com a equipe <span aria-hidden="true">↗</span></a></div>
</div>
</section>

<section class="conversion-panel-section">
<div class="container conversion-panel">
<div><span class="fine">Avaliação inicial</span><h2>Uma boa proposta começa com o problema bem explicado.</h2></div>
<div><p>Fotos, medidas e uma descrição curta ajudam a separar o que pode ser orçado à distância do que exige levantamento no local.</p><a class="btn" data-cta="painel-orcamento" href="/orcamento/">Preparar mensagem em poucos passos <span class="arrow" aria-hidden="true">→</span></a></div>
</div>
</section>

<section class="section technical-section">
<div class="container technical-grid">
<div class="technical-art reveal">${picture('plasma', { sizes: '(max-width:1000px) 100vw, 46vw' })}<span class="art-tag">Imagem ilustrativa</span><div class="technical-stamp"><strong>Projeto aplicado</strong><span>medida · carga · fluxo · interfaces</span></div></div>
<div class="technical-copy reveal">
${eyebrow('Precisão antes da fabricação')}
<h2>O inox é o resultado. A decisão começa antes.</h2>
<p>Temperatura, umidade, limpeza, carga, circulação e interfaces com outros sistemas mudam o projeto. Por isso orçamento sério começa pela operação — não por uma lista genérica de equipamentos.</p>
<div class="tech-points">
<div class="tech-point"><span>01 / LER</span><strong>Espaço e fluxo</strong></div>
<div class="tech-point"><span>02 / DEFINIR</span><strong>Materiais e interfaces</strong></div>
<div class="tech-point"><span>03 / PRODUZIR</span><strong>Corte, dobra e solda</strong></div>
<div class="tech-point"><span>04 / ENTREGAR</span><strong>Instalação e testes</strong></div>
</div>
<a class="linkline technical-link" href="/empresa/">Conhecer a forma de trabalho <span class="arrow" aria-hidden="true">→</span></a>
</div>
</div>
</section>

<section class="section section-void proof-section" id="clientes">
<div class="container proof-layout">
<div class="proof-copy">
${eyebrow('Confiança construída')}
<h2 class="section-title">Operações exigentes não compram só uma peça.</h2>
<p class="section-copy">Elas precisam de acesso coordenado, higiene, continuidade, instalação limpa e escopo explícito. A lista informada pela empresa reúne hospitais, embaixadas, redes, restaurantes e construtoras.</p>
<a class="btn btn-dark-outline" href="/clientes/">Ver os ${clientCount} clientes listados <span class="arrow" aria-hidden="true">→</span></a>
</div>
<div class="proof-categories">
${clientGroups.map(group => `<article class="proof-category reveal accent-${attr(group.accent)}"><span>${esc(group.sector)}</span><strong>${group.clients.length}</strong><p>${esc(group.note)}</p></article>`).join('')}
</div>
</div>
</section>

<section class="section process-section">
<div class="container">
<div class="section-head">
<div>${eyebrow('Método')}</div>
<div><h2 class="section-title section-title-sm">Seis movimentos. Um escopo claro.</h2><p class="section-copy">Cada etapa reduz incerteza e deixa explícito o que entra, o que depende de terceiros e o que precisa ser levantado.</p></div>
</div>
<div class="process">
<div class="process-step reveal"><span class="n">01</span><h3>Entender</h3><p>Operação, espaço e necessidade.</p></div>
<div class="process-step reveal"><span class="n">02</span><h3>Levantar</h3><p>Medidas, acesso e interferências.</p></div>
<div class="process-step reveal"><span class="n">03</span><h3>Definir</h3><p>Escopo, material e interfaces.</p></div>
<div class="process-step reveal"><span class="n">04</span><h3>Fabricar</h3><p>Corte, conformação e acabamento.</p></div>
<div class="process-step reveal"><span class="n">05</span><h3>Instalar</h3><p>Montagem e integração previstas.</p></div>
<div class="process-step reveal"><span class="n">06</span><h3>Acompanhar</h3><p>Testes e orientação pós-entrega.</p></div>
</div>
</div>
</section>

${galleryBlock(
  ['kitchen', 'welding', 'food-factory'],
  'Ambientes profissionais pedem soluções diferentes.',
  'Cozinha, fabricação e produção mudam carga, higiene, acabamento, ventilação e integração entre sistemas.',
)}

<section class="section segment-section">
<div class="container">
<div class="section-head">
<div>${eyebrow('Contextos de operação')}</div>
<div><h2 class="section-title">O mesmo aço. Exigências diferentes.</h2><p class="section-copy">Volume, fluxo, calor, higiene, carga e continuidade mudam conforme o segmento.</p></div>
</div>
<div class="segment-grid">${segmentCards}</div>
</div>
</section>

${faqBlock(
  [
    {
      q: 'A Designer Inox trabalha apenas com fabricação?',
      a: 'Não. O escopo pode reunir projeto técnico aplicado, fabricação, instalação, sistemas de refrigeração, aquecimento, exaustão, CO₂, automação elétrica e manutenção, conforme a necessidade e a proposta aprovada.',
    },
    {
      q: 'É possível solicitar uma solução completa para uma operação nova?',
      a: 'Sim. O atendimento inicial organiza espaço, uso, equipamentos e sistemas envolvidos para definir quais etapas devem entrar no escopo.',
    },
    {
      q: 'Vocês atendem contrato de manutenção para redes com várias unidades?',
      a: 'Sim. O formato depende da quantidade de ativos, da dispersão das unidades, da criticidade e da frequência definida na proposta.',
    },
    {
      q: 'O que devo enviar para receber uma avaliação melhor?',
      a: 'Cidade, tipo de operação, fotos gerais e dos pontos críticos, medidas disponíveis e uma descrição do que precisa mudar. Projetos complexos podem exigir levantamento técnico no local.',
    },
  ],
  'Dúvidas antes de pedir orçamento.',
)}

${ctaBlock(
  'Mostre a operação. A gente organiza o caminho.',
  'Envie cidade, tipo de operação, fotos, medidas ou plantas. A avaliação inicial serve para entender o escopo e os levantamentos necessários.',
)}`
}

// ── Índice de serviços ────────────────────────────────────────────────────

export function servicesIndexPage() {
  const groups = servicesByCategory
    .map(
      category => `<section class="catalog-group">
<div class="catalog-head">
<h2>${esc(category.label)}</h2>
<p>${esc(category.note)}</p>
</div>
<div class="catalog-grid">
${category.services
  .map(
    service => `<a class="catalog-card reveal accent-${attr(service.accent)}" href="/${attr(service.slug)}/">
<span class="catalog-dot" aria-hidden="true"></span>
<h3>${esc(service.title)}</h3>
<p>${esc(service.short)}</p>
<span class="linkline">Ver serviço <span class="arrow" aria-hidden="true">→</span></span>
</a>`,
  )
  .join('\n')}
</div>
</section>`,
    )
    .join('\n')

  return `<section class="page-hero">
<div class="container page-hero-grid">
<div>
${eyebrow('Catálogo completo')}
<h1>${services.length} serviços. Um só interlocutor.</h1>
<p class="page-lead">Projeto, fabricação, sistemas térmicos, elétrica, exaustão e manutenção. Quando o mesmo fornecedor responde por estrutura e sistema, some a discussão sobre de quem é a responsabilidade da interface.</p>
<div class="hero-actions">
<a class="btn" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Pedir orçamento <span class="arrow" aria-hidden="true">↗</span></a>
</div>
</div>
<div class="page-art">${picture('equipment', { sizes: '(max-width:1000px) 100vw, 40vw', priority: true })}<span class="art-tag">Imagem ilustrativa</span></div>
</div>
<div class="page-ribbon"></div>
</section>

<section class="section">
<div class="container catalog">${groups}</div>
</section>

${ctaBlock(
  'Não sabe em qual serviço a sua necessidade se encaixa?',
  'Descreva o problema em linguagem comum. A triagem inicial identifica quais frentes precisam entrar no escopo.',
)}`
}

// ── Página de serviço ─────────────────────────────────────────────────────

export function servicePage(service) {
  const hub = service.hub?.length
    ? `<section class="section section-dark">
<div class="container">
<div class="section-head">
<div>${eyebrow('Sistemas que integramos')}</div>
<div><h2 class="section-title">Cada sistema tem sua própria página.</h2><p class="section-copy">A integração é o ponto de encontro. O detalhe de cada disciplina está aqui.</p></div>
</div>
<div class="hub-grid">
${service.hub
  .map(slug => serviceBySlug[slug])
  .filter(Boolean)
  .map(
    child => `<a class="hub-card reveal accent-${attr(child.accent)}" href="/${attr(child.slug)}/">
<h3>${esc(child.navTitle)}</h3><p>${esc(child.short)}</p><span class="linkline">Abrir <span class="arrow" aria-hidden="true">→</span></span>
</a>`,
  )
  .join('\n')}
</div>
</div>
</section>`
    : ''

  return `<section class="page-hero">
<div class="container page-hero-grid">
<div>
${eyebrow(service.navTitle)}
<h1>${esc(service.title)}</h1>
<p class="page-lead">${esc(service.lead)}</p>
<div class="hero-actions">
<a class="btn" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Avaliar esta necessidade <span class="arrow" aria-hidden="true">↗</span></a>
<a class="btn btn-outline" href="/servicos/">Ver todos os serviços</a>
</div>
</div>
<div class="page-art">${mediaFor(service)}</div>
</div>
<div class="page-ribbon"></div>
</section>

<section class="section">
<div class="container scope-grid">
<div class="scope-title">
${eyebrow('Quando faz sentido')}
<h2>Situações que orientam a avaliação.</h2>
<p class="section-copy">O escopo final depende das condições reais, das informações disponíveis e dos itens aprovados na proposta.</p>
</div>
<div class="scope-list">
${service.when
  .map(
    (item, index) => `<div class="scope-item reveal"><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(item)}</strong></div>`,
  )
  .join('\n')}
</div>
</div>
</section>

<section class="section section-void">
<div class="container scope-grid">
<div class="scope-title">
${eyebrow('Entregáveis possíveis')}
<h2>O que pode entrar no escopo.</h2>
<p class="section-copy">Nada é presumido. Cada item precisa estar descrito e aprovado antes da fabricação ou da intervenção.</p>
</div>
<div class="scope-list scope-list-dark">
${service.deliverables
  .map(
    (item, index) => `<div class="scope-item reveal"><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(item)}</strong></div>`,
  )
  .join('\n')}
</div>
</div>
</section>

<section class="section section-dark">
<div class="container">
<div class="section-head">
<div>${eyebrow('Pontos de decisão')}</div>
<div><h2 class="section-title">O que muda o projeto.</h2><p class="section-copy">Condições que precisam ser entendidas para evitar improviso, retrabalho e incompatibilidades.</p></div>
</div>
<div class="decision-grid">
${service.decisions
  .map(
    (item, index) => `<div class="decision reveal"><span class="n">${String(index + 1).padStart(2, '0')}</span><h3>${esc(item)}</h3></div>`,
  )
  .join('\n')}
</div>
</div>
</section>

${hub}

${galleryBlock(service.gallery, 'Contextos de aplicação.', 'Ambientes e processos onde este escopo costuma aparecer.')}

${faqBlock(service.faq, 'Antes da proposta.')}

${relatedBlock(service.related)}

${ctaBlock(
  'Conte o que a operação precisa resolver.',
  'Inclua cidade, uso, dimensões conhecidas e o que já existe no local. Fotos e plantas ajudam na triagem.',
)}`
}

// ── Segmentos ─────────────────────────────────────────────────────────────

export function segmentsIndexPage() {
  const cards = segments
    .map(
      (segment, index) => `<a class="segment-card segment-card-lg reveal accent-${attr(segment.accent)}" href="/segmentos/${attr(segment.slug)}/">
<span class="fine">Segmento ${String(index + 1).padStart(2, '0')}</span>
<h3>${esc(segment.title)}</h3>
<p>${esc(segment.short)}</p>
<span class="linkline">Ver contexto <span class="arrow" aria-hidden="true">→</span></span>
</a>`,
    )
    .join('\n')

  return `<section class="page-hero">
<div class="container page-hero-grid">
<div>
${eyebrow('Contextos de operação')}
<h1>O mesmo aço. Exigências diferentes.</h1>
<p class="page-lead">Volume, fluxo, calor, higiene, carga e continuidade mudam conforme o segmento. O material é o mesmo; o que muda é tudo o que decide o projeto.</p>
<div class="hero-actions"><a class="btn" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Pedir orçamento <span class="arrow" aria-hidden="true">↗</span></a></div>
</div>
<div class="page-art">${picture('modern-kitchen', { sizes: '(max-width:1000px) 100vw, 40vw', priority: true })}<span class="art-tag">Imagem ilustrativa</span></div>
</div>
<div class="page-ribbon"></div>
</section>

<section class="section"><div class="container"><div class="segment-grid segment-grid-index">${cards}</div></div></section>

${ctaBlock('Sua operação tem exigência própria.', 'Descreva o contexto e o que precisa ser resolvido. A avaliação inicial organiza o escopo.')}`
}

export function segmentPage(segment) {
  const pressures = segment.pressures
    .map(
      (item, index) => `<div class="pressure reveal"><span class="n">${String(index + 1).padStart(2, '0')}</span><h3>${esc(item.label)}</h3><p>${esc(item.note)}</p></div>`,
    )
    .join('\n')

  const related = segment.services
    .map(slug => serviceBySlug[slug])
    .filter(Boolean)
    .map(
      (service, index) => `<a class="related-card reveal accent-${attr(service.accent)}" href="/${attr(service.slug)}/">
<span class="num">${String(index + 1).padStart(2, '0')}</span><h3>${esc(service.title)}</h3><p>${esc(service.short)}</p>
<span class="linkline">Ver serviço <span class="arrow" aria-hidden="true">→</span></span>
</a>`,
    )
    .join('\n')

  return `<section class="page-hero">
<div class="container page-hero-grid">
<div>
${eyebrow(segment.navTitle)}
<h1>${esc(segment.title)}</h1>
<p class="page-lead">${esc(segment.lead)}</p>
<div class="hero-actions"><a class="btn" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Avaliar minha operação <span class="arrow" aria-hidden="true">↗</span></a></div>
</div>
<div class="page-art">${picture(segment.photo, { sizes: '(max-width:1000px) 100vw, 40vw', priority: true })}<span class="art-tag">Imagem ilustrativa</span></div>
</div>
<div class="page-ribbon"></div>
</section>

<section class="section section-dark">
<div class="container">
<div class="section-head">
<div>${eyebrow('O que pressiona')}</div>
<div><h2 class="section-title">As forças deste contexto.</h2><p class="section-copy">São elas que definem material, dimensionamento e frequência de manutenção.</p></div>
</div>
<div class="pressure-grid">${pressures}</div>
</div>
</section>

<section class="section">
<div class="container scope-grid">
<div class="scope-title">${eyebrow('Prioridades')}<h2>O que costuma vir primeiro.</h2><p class="section-copy">Ordem sugerida a partir do que mais afeta a operação — sujeita ao que o levantamento encontrar.</p></div>
<div class="scope-list">
${segment.priorities
  .map(
    (item, index) => `<div class="scope-item reveal"><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(item)}</strong></div>`,
  )
  .join('\n')}
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="section-head"><div>${eyebrow('Serviços aplicáveis')}</div><div><h2 class="section-title">O que este contexto costuma exigir.</h2></div></div>
<div class="related-grid">${related}</div>
</div>
</section>

${ctaBlock('Descreva a sua operação.', 'Cidade, volume, área e o que já existe no local. A avaliação inicial define os levantamentos necessários.')}`
}

// ── Clientes ──────────────────────────────────────────────────────────────

export function clientsPage() {
  const groups = clientGroups
    .map(
      group => `<section class="client-block reveal accent-${attr(group.accent)}">
<div class="client-block-head">
<h2>${esc(group.sector)}</h2>
<p>${esc(group.note)}</p>
<span class="client-count">${group.clients.length}</span>
</div>
<ul class="client-list">${group.clients.map(name => `<li>${esc(name)}</li>`).join('')}</ul>
</section>`,
    )
    .join('\n')

  return `<section class="page-hero">
<div class="container page-hero-grid">
<div>
${eyebrow('Clientes')}
<h1>${clientCount} operações que já nos chamaram.</h1>
<p class="page-lead">Hospitais, embaixadas, redes de varejo, restaurantes, hotelaria e construtoras. Contextos diferentes com uma coisa em comum: não podem parar.</p>
<div class="hero-actions"><a class="btn" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Pedir orçamento <span class="arrow" aria-hidden="true">↗</span></a></div>
</div>
<div class="page-art">${picture('buffet', { sizes: '(max-width:1000px) 100vw, 40vw', priority: true })}<span class="art-tag">Imagem ilustrativa</span></div>
</div>
<div class="page-ribbon"></div>
</section>

<section class="section section-void"><div class="container client-blocks">${groups}</div></section>

<section class="section">
<div class="container">
<div class="section-head">
<div>${eyebrow('Sobre esta lista')}</div>
<div>
<h2 class="section-title">Nomes, não números.</h2>
<p class="section-copy">A relação acima traz organizações atendidas pela Designer Inox Brasil, informadas pela direção da empresa. Não publicamos faturamento, quantidade de obras, prazos médios nem depoimentos que não possam ser verificados — e não exibimos marcas de terceiros como endosso comercial.</p>
</div>
</div>
</div>
</section>

${ctaBlock('Sua operação pode ser a próxima.', 'Conte o contexto, o volume e o que precisa ser resolvido. A avaliação inicial organiza o escopo.')}`
}

// ── Empresa ───────────────────────────────────────────────────────────────

export function companyPage() {
  return `<section class="page-hero">
<div class="container page-hero-grid">
<div>
${eyebrow('Empresa')}
<h1>Engenharia aplicada ao aço inox.</h1>
<p class="page-lead">A Designer Inox Brasil projeta, fabrica, instala, integra sistemas e mantém estruturas e equipamentos em aço inox para operações profissionais em ${esc(site.region)}.</p>
<div class="hero-actions"><a class="btn" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Falar com a equipe <span class="arrow" aria-hidden="true">↗</span></a></div>
</div>
<div class="page-art">${picture('workshop', { sizes: '(max-width:1000px) 100vw, 40vw', priority: true })}<span class="art-tag">Imagem ilustrativa</span></div>
</div>
<div class="page-ribbon"></div>
</section>

<section class="manifesto">
<div class="container">
<blockquote>Antes de cortar a primeira chapa, é preciso entender <em>o que a operação precisa sustentar.</em></blockquote>
</div>
</section>

<section class="section">
<div class="container">
<div class="section-head"><div>${eyebrow('Como trabalhamos')}</div><div><h2 class="section-title">Três compromissos que não negociamos.</h2></div></div>
<div class="company-grid">
<div class="company-card reveal"><span>01</span><h3>Escopo explícito</h3><p>O que entra na proposta está descrito. O que depende de terceiros, de levantamento adicional ou de condição encontrada em obra é dito antes, não depois.</p></div>
<div class="company-card reveal"><span>02</span><h3>Estrutura e sistema juntos</h3><p>Fabricar em inox e integrar refrigeração, aquecimento, exaustão, CO₂ e automação sob o mesmo responsável elimina a discussão sobre de quem é a interface.</p></div>
<div class="company-card reveal"><span>03</span><h3>Continuidade depois da entrega</h3><p>A relação não termina na instalação. Manutenção preventiva e corretiva mantêm de pé o que foi entregue — inclusive em contrato para múltiplas unidades.</p></div>
</div>
</div>
</section>

<section class="section section-void">
<div class="container">
<div class="section-head"><div>${eyebrow('Alcance')}</div><div><h2 class="section-title">Onde atendemos.</h2><p class="section-copy">Base em ${esc(site.city)}/${esc(site.state)}, com atendimento no entorno e projetos executados em outras praças conforme o escopo.</p></div></div>
<div class="fact-grid">
<div class="fact reveal"><span>${clientCount}</span><strong>organizações atendidas</strong><p>Informadas pela direção da empresa.</p></div>
<div class="fact reveal"><span>${services.length}</span><strong>frentes de serviço</strong><p>De projeto técnico a contrato de manutenção.</p></div>
<div class="fact reveal"><span>${segments.length}</span><strong>segmentos mapeados</strong><p>Cada um com exigência própria.</p></div>
</div>
</div>
</section>

${faqBlock(
  [
    {
      q: 'Vocês atendem fora de Brasília?',
      a: `A base é ${site.city}/${site.state} e o atendimento cobre a região. Projetos em outras praças são avaliados caso a caso, considerando escopo, deslocamento e prazo.`,
    },
    {
      q: 'Como funciona o primeiro contato?',
      a: 'Você descreve a operação e a necessidade pelo WhatsApp, enviando fotos, medidas ou plantas se tiver. A triagem inicial define se o caso já permite proposta ou se exige levantamento no local.',
    },
    {
      q: 'Vocês emitem proposta formal?',
      a: 'Sim. O escopo aprovado fica descrito na proposta, incluindo o que está fora dela.',
    },
  ],
  'Sobre a empresa.',
)}

${ctaBlock('Comece pela operação.', 'Descreva o espaço, o uso e o que precisa ser resolvido. O resto é consequência.')}`
}

// ── Orçamento ─────────────────────────────────────────────────────────────

export function quotePage() {
  const options = services.map(service => `<option value="${attr(service.title)}">${esc(service.title)}</option>`).join('')

  return `<section class="section form-section quote-conversion-page">
<div class="container form-layout">
<div class="form-intro">
${eyebrow('Orçamento pelo WhatsApp')}
<h1>Conte o que precisa ser resolvido.</h1>
<p>O formulário organiza as informações e abre o WhatsApp com uma mensagem pronta. Você revisa tudo antes de enviar.</p>
<div class="form-benefits" aria-label="Como funciona">
<div><strong>01</strong><span>Você descreve a operação</span></div>
<div><strong>02</strong><span>A mensagem fica organizada</span></div>
<div><strong>03</strong><span>O WhatsApp abre para revisão</span></div>
</div>
<div class="checklist-mini">
<div>Informe cidade e tipo de ambiente</div>
<div>Explique o problema ou objetivo principal</div>
<div>Anexe fotos, medidas ou plantas na conversa</div>
<div>Se a operação estiver parada, marque como urgente</div>
</div>
<div class="form-direct">
<p class="fine">Prefere escrever livremente?</p>
<a class="btn btn-outline" data-cta="orcamento-direto-whatsapp" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Abrir WhatsApp direto <span class="arrow" aria-hidden="true">↗</span></a>
</div>
</div>
<form class="quote-form" data-quote-form novalidate>
<div class="quote-form-head"><span class="fine">Leva apenas as informações essenciais</span><h2>Prepare sua solicitação</h2><p>Nada é salvo neste site.</p></div>
<div class="field-grid">
<div class="field"><label for="nome">Seu nome</label><input id="nome" name="nome" type="text" autocomplete="name" placeholder="Como devemos chamar você"></div>
<div class="field"><label for="cidade">Cidade / UF <span class="req" aria-hidden="true">*</span></label><input id="cidade" name="cidade" type="text" required autocomplete="address-level2" placeholder="Brasília / DF"></div>
<div class="field field-full"><label for="operacao">Qual é a operação? <span class="req" aria-hidden="true">*</span></label><input id="operacao" name="operacao" type="text" required placeholder="Restaurante, hospital, supermercado, hotel, indústria…"></div>
<div class="field field-full"><label for="servico">Frente de interesse</label><select id="servico" name="servico"><option value="">Ainda não sei / preciso de orientação</option>${options}</select></div>
<div class="field field-full"><label for="necessidade">O que precisa ser resolvido? <span class="req" aria-hidden="true">*</span></label><textarea id="necessidade" name="necessidade" required rows="6" placeholder="Conte o que existe hoje, o problema percebido e o resultado esperado."></textarea></div>
<div class="field field-full"><label for="prioridade">Qual é a prioridade?</label><select id="prioridade" name="prioridade"><option value="">Não informada</option><option value="Operação parada — urgente">Operação parada — urgente</option><option value="Precisa resolver nas próximas semanas">Precisa resolver nas próximas semanas</option><option value="Planejamento / sem urgência">Planejamento / sem urgência</option></select></div>
</div>
<div class="form-assurance"><span>✓ Você revisa antes de enviar</span><span>✓ Nada fica armazenado no site</span><span>✓ Fotos são anexadas no WhatsApp</span></div>
<button class="btn btn-full" data-cta="orcamento-gerar-mensagem" type="submit">Gerar mensagem e falar no WhatsApp <span class="arrow" aria-hidden="true">↗</span></button>
<p class="form-status" data-form-status role="status" aria-live="polite"></p>
</form>
</div>
</section>`
}

// ── Páginas legais ────────────────────────────────────────────────────────

export function privacyPage() {
  return `<section class="section"><div class="container prose">
<h1>Política de privacidade</h1>
<p class="lead">Atualizada em julho de 2026.</p>

<h2>Que dados este site coleta</h2>
<p>Este site não coleta dados pessoais diretamente. Ele é estático e não possui banco de dados, cadastro, login, formulário que envie informações para um servidor nosso, nem ferramenta de analytics ou rastreamento publicitário.</p>

<h2>Como funciona o formulário de avaliação</h2>
<p>O formulário da página de orçamento executa inteiramente no seu navegador. Ele apenas organiza o que você digitou em um texto e abre o WhatsApp com essa mensagem pronta. Nada é transmitido para a Designer Inox Brasil até que você mesmo envie a mensagem. Os dados digitados não são gravados nem enviados a terceiros por este site.</p>

<h2>Dados enviados por WhatsApp</h2>
<p>Ao iniciar uma conversa, as informações que você enviar passam a ser tratadas pela Designer Inox Brasil para responder à sua solicitação, elaborar proposta e executar o serviço contratado. O tratamento da mensagem dentro do aplicativo segue a política do próprio WhatsApp, que é um serviço de terceiro.</p>

<h2>Cookies</h2>
<p>Este site não grava cookies próprios nem utiliza cookies de terceiros para publicidade ou medição de audiência.</p>

<h2>Serviços de terceiros</h2>
<p>Links para WhatsApp e Instagram levam a plataformas externas, com políticas de privacidade próprias. A hospedagem do site pode registrar dados técnicos de acesso, como endereço IP e tipo de navegador, para operação e segurança da infraestrutura.</p>

<h2>Seus direitos</h2>
<p>Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode solicitar confirmação de tratamento, acesso, correção ou eliminação dos dados que tenha nos enviado por WhatsApp. O pedido pode ser feito pelo mesmo canal de contato.</p>

<h2>Contato</h2>
<p>Para qualquer questão sobre privacidade, fale conosco pelo WhatsApp <a href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">${esc(contact.whatsappDisplay)}</a>.</p>
</div></section>`
}

export function termsPage() {
  return `<section class="section"><div class="container prose">
<h1>Termos de uso</h1>
<p class="lead">Atualizados em julho de 2026.</p>

<h2>Finalidade do site</h2>
<p>Este site apresenta os serviços da Designer Inox Brasil e serve como canal de contato inicial. O conteúdo tem caráter informativo.</p>

<h2>O conteúdo não é proposta comercial</h2>
<p>Descrições de serviço, listas de entregáveis e exemplos de escopo publicados aqui são ilustrativos do tipo de trabalho realizado. Não constituem oferta, orçamento, garantia de disponibilidade nem compromisso de execução. Qualquer contratação depende de proposta específica, elaborada após avaliação, com escopo, prazo e valor descritos.</p>

<h2>Imagens</h2>
<p>${esc(legalNotice)} Os esquemas técnicos são representações didáticas de princípio de funcionamento e não substituem projeto executivo.</p>

<h2>Escopo técnico</h2>
<p>Viabilidade, dimensionamento e solução final dependem das condições encontradas no local, das informações fornecidas pelo cliente e de levantamento técnico. Informações imprecisas ou incompletas podem alterar escopo, prazo e valor.</p>

<h2>Marcas de terceiros</h2>
<p>Nomes de organizações citados na página de clientes identificam operações atendidas e pertencem aos seus respectivos titulares. A menção não implica endosso, patrocínio ou parceria comercial dessas organizações com a Designer Inox Brasil.</p>

<h2>Links externos</h2>
<p>O site contém links para WhatsApp e Instagram. Não respondemos pelo conteúdo, pela disponibilidade ou pelas práticas de privacidade de plataformas de terceiros.</p>

<h2>Propriedade intelectual</h2>
<p>A marca, os textos e os esquemas técnicos autorais deste site pertencem à Designer Inox Brasil. As fotografias pertencem aos seus autores e são utilizadas sob a licença declarada.</p>

<h2>Alterações</h2>
<p>Estes termos podem ser atualizados a qualquer momento. A versão publicada nesta página é a vigente.</p>
</div></section>`
}

export function notFoundPage() {
  return `<section class="section notfound">
<div class="container">
${eyebrow('Erro 404')}
<h1>Esta página não existe.</h1>
<p class="section-copy">O endereço pode ter mudado ou o link estar incorreto. Abaixo estão os caminhos principais do site.</p>
<div class="notfound-links">
<a class="btn" href="/">Ir para a home</a>
<a class="btn btn-outline" href="/servicos/">Ver os ${services.length} serviços</a>
<a class="btn btn-outline" href="/orcamento/">Pedir orçamento</a>
<a class="btn btn-outline" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
</div>
</div>
</section>`
}
