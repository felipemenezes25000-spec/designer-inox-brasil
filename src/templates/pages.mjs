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

const ctaBlock = (heading, copy) => `<section class="cta">
<div class="container cta-grid">
<div class="cta-lead">${eyebrow('Próximo passo')}<h2>${esc(heading)}</h2></div>
<div class="cta-actions">
<p>${esc(copy)}</p>
<a class="btn btn-light" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Falar no WhatsApp <span class="arrow" aria-hidden="true">↗</span></a>
<a class="btn btn-ghost" href="/orcamento/">Preparar minha mensagem <span class="arrow" aria-hidden="true">→</span></a>
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
  const serviceRows = services
    .map(
      (service, index) => `<a class="service-row reveal accent-${attr(service.accent)}" href="/${attr(service.slug)}/">
<span class="num">${String(index + 1).padStart(2, '0')}</span>
<span class="service-name"><h3>${esc(service.title)}</h3></span>
<p>${esc(service.short)}</p>
<span class="go" aria-hidden="true">→</span>
</a>`,
    )
    .join('\n')

  const clientColumns = clientGroups
    .map(
      group => `<div class="client-group reveal accent-${attr(group.accent)}">
<h3>${esc(group.sector)}</h3>
<p class="client-note">${esc(group.note)}</p>
<ul>${group.clients.map(name => `<li>${esc(name)}</li>`).join('')}</ul>
</div>`,
    )
    .join('\n')

  const segmentCards = segments
    .map(
      (segment, index) => `<a class="segment-card reveal accent-${attr(segment.accent)}" href="/segmentos/${attr(segment.slug)}/">
<span class="fine">Segmento ${String(index + 1).padStart(2, '0')}</span>
<h3>${esc(segment.title)}</h3>
<p>${esc(segment.short)}</p>
<span class="linkline">Ver contexto <span class="arrow" aria-hidden="true">→</span></span>
</a>`,
    )
    .join('\n')

  return `<section class="hero">
<div class="container hero-grid">
<div class="hero-copy">
${eyebrow('Aço inox · engenharia aplicada')}
<h1 class="hero-title">Inox que nasce da <span class="metal">operação.</span></h1>
<p class="hero-lead">Projeto técnico, fabricação, instalação, exaustão, refrigeração, aquecimento, automação e manutenção — organizados a partir do espaço, do fluxo e do uso profissional.</p>
<div class="hero-actions">
<a class="btn" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Solicitar avaliação <span class="arrow" aria-hidden="true">↗</span></a>
<a class="btn btn-outline" href="/servicos/">Ver os ${services.length} serviços <span class="arrow" aria-hidden="true">↓</span></a>
</div>
<p class="hero-note">Envie cidade, fotos, medidas ou planta para começar</p>
</div>
<div class="hero-visual">
${picture('industrial-kitchen', { sizes: '(max-width:1000px) 100vw, 48vw', priority: true })}
<span class="art-tag">Imagem ilustrativa</span>
<div class="hero-badge"><span>Projeto</span><span>até</span><span>manutenção</span></div>
</div>
</div>
<div class="capability-strip">
<div class="container capability-grid">
<div class="capability"><strong>Sob medida</strong><span>Dimensões e uso reais</span></div>
<div class="capability"><strong>Projeto aplicado</strong><span>Escopo antes da fabricação</span></div>
<div class="capability"><strong>Sistemas</strong><span>Frio, calor, gás e comando</span></div>
<div class="capability"><strong>Continuidade</strong><span>Reforma e manutenção</span></div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="section-head">
<div>${eyebrow('Ponto de partida')}</div>
<div><h2 class="section-title">Sua necessidade define o caminho.</h2><p class="section-copy">Sem pacote pronto. Primeiro entendemos o que a operação precisa sustentar; depois organizamos escopo, fabricação, sistemas e instalação.</p></div>
</div>
<div class="path-grid">
<a class="path-card reveal" href="/cozinhas-industriais/"><span class="num">01 / IMPLANTAR</span><h3>Construir do zero.</h3><p>Planejar fluxo, estruturas, equipamentos e sistemas desde o início.</p><span class="linkline">Ver cozinhas completas <span class="arrow" aria-hidden="true">→</span></span></a>
<a class="path-card reveal" href="/equipamentos-em-inox/"><span class="num">02 / FABRICAR</span><h3>Resolver sob medida.</h3><p>Criar peças que respeitam espaço, carga, uso e interferências.</p><span class="linkline">Ver equipamentos <span class="arrow" aria-hidden="true">→</span></span></a>
<a class="path-card reveal" href="/manutencao/"><span class="num">03 / CONTINUAR</span><h3>Manter de pé.</h3><p>Avaliar o existente, corrigir o que falha e planejar a prevenção.</p><span class="linkline">Ver manutenção <span class="arrow" aria-hidden="true">→</span></span></a>
</div>
</div>
</section>

<section class="section section-dark" id="servicos">
<div class="container">
<div class="section-head">
<div>${eyebrow('Índice de serviços')}</div>
<div><h2 class="section-title">Do desenho à operação.</h2><p class="section-copy">${services.length} frentes que podem trabalhar separadas ou fazer parte de uma entrega coordenada, sempre dentro do escopo aprovado.</p></div>
</div>
<div class="service-list">${serviceRows}</div>
</div>
</section>

<section class="section">
<div class="container technical-grid">
<div class="technical-art reveal">${picture('plasma', { sizes: '(max-width:1000px) 100vw, 46vw' })}<span class="art-tag">Imagem ilustrativa</span></div>
<div class="technical-copy reveal">
${eyebrow('Precisão em movimento')}
<h2>O inox é o resultado. A decisão começa antes.</h2>
<p>Temperatura, umidade, limpeza, carga, circulação e interfaces com outros sistemas mudam o projeto. Por isso orçamento sério começa pela operação — não por uma lista genérica de equipamentos.</p>
<div class="tech-points">
<div class="tech-point"><span>01 / LER</span><strong>Espaço e fluxo</strong></div>
<div class="tech-point"><span>02 / DEFINIR</span><strong>Materiais e interfaces</strong></div>
<div class="tech-point"><span>03 / PRODUZIR</span><strong>Corte, dobra e solda</strong></div>
<div class="tech-point"><span>04 / ENTREGAR</span><strong>Instalação e testes</strong></div>
</div>
</div>
</div>
</section>

<section class="section section-void" id="clientes">
<div class="container">
<div class="section-head">
<div>${eyebrow('Confiança construída')}</div>
<div><h2 class="section-title">Operações que já nos chamaram.</h2><p class="section-copy">Hospitais, embaixadas, redes de varejo, restaurantes e construtoras — contextos com exigência sanitária, acesso controlado e continuidade crítica.</p></div>
</div>
<div class="client-columns">${clientColumns}</div>
<div class="client-footnote"><a class="linkline" href="/clientes/">Ver a lista completa de clientes <span class="arrow" aria-hidden="true">→</span></a></div>
</div>
</section>

<section class="section">
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
  ['kitchen', 'welding', 'hood', 'food-factory', 'workshop', 'buffet'],
  'O tipo de ambiente onde o inox trabalha.',
  'Cozinha profissional, fabricação, exaustão, produção e distribuição — os contextos que definem material, acabamento e sistema.',
)}

<section class="section">
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
      q: 'Posso enviar desenho, medidas ou fotos?',
      a: 'Sim. Esse material ajuda na avaliação inicial. Projetos complexos podem exigir levantamento técnico no local.',
    },
  ],
  'Antes de pedir preço, alinhe o problema.',
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
<a class="btn" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Solicitar avaliação <span class="arrow" aria-hidden="true">↗</span></a>
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
<div class="hero-actions"><a class="btn" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Solicitar avaliação <span class="arrow" aria-hidden="true">↗</span></a></div>
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
<div class="hero-actions"><a class="btn" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Solicitar avaliação <span class="arrow" aria-hidden="true">↗</span></a></div>
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

  return `<section class="section form-section">
<div class="container form-layout">
<div class="form-intro">
${eyebrow('Solicitar avaliação')}
<h1>Prepare a mensagem certa.</h1>
<p>O formulário não envia e-mail: ele monta uma mensagem organizada e abre o WhatsApp com o texto pronto. Você revisa antes de enviar.</p>
<div class="checklist-mini">
<div>Descreva a operação, não só o equipamento</div>
<div>Informe cidade e tipo de ambiente</div>
<div>Anexe fotos, medidas ou plantas na conversa</div>
<div>Se a operação estiver parada, diga logo no início</div>
</div>
<div class="form-direct">
<p class="fine">Prefere ir direto?</p>
<a class="btn btn-outline" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Abrir WhatsApp sem o formulário <span class="arrow" aria-hidden="true">↗</span></a>
</div>
</div>
<form class="quote-form" data-quote-form novalidate>
<div class="field-grid">
<div class="field"><label for="nome">Nome</label><input id="nome" name="nome" type="text" autocomplete="name" placeholder="Como devemos chamar você"></div>
<div class="field"><label for="cidade">Cidade / UF <span class="req" aria-hidden="true">*</span></label><input id="cidade" name="cidade" type="text" required autocomplete="address-level2" placeholder="Brasília / DF"></div>
<div class="field field-full"><label for="operacao">Tipo de operação <span class="req" aria-hidden="true">*</span></label><input id="operacao" name="operacao" type="text" required placeholder="Restaurante, hospital, supermercado, hotel, indústria…"></div>
<div class="field field-full"><label for="servico">Serviço de interesse</label><select id="servico" name="servico"><option value="">Ainda não sei / preciso de orientação</option>${options}</select></div>
<div class="field field-full"><label for="necessidade">O que precisa ser resolvido <span class="req" aria-hidden="true">*</span></label><textarea id="necessidade" name="necessidade" required rows="6" placeholder="Descreva a situação, o que já existe no local e o que precisa mudar."></textarea></div>
<div class="field field-full"><label for="prioridade">Prioridade</label><select id="prioridade" name="prioridade"><option value="">Não informada</option><option value="Operação parada — urgente">Operação parada — urgente</option><option value="Precisa resolver nas próximas semanas">Precisa resolver nas próximas semanas</option><option value="Planejamento / sem urgência">Planejamento / sem urgência</option></select></div>
</div>
<p class="form-hint">Os campos marcados com <span aria-hidden="true">*</span> são obrigatórios. Nada é armazenado neste site — a mensagem é montada no seu navegador e enviada por você.</p>
<button class="btn btn-full" type="submit">Montar mensagem e abrir o WhatsApp <span class="arrow" aria-hidden="true">↗</span></button>
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
<a class="btn btn-outline" href="/orcamento/">Solicitar avaliação</a>
<a class="btn btn-outline" href="${attr(WHATS)}" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
</div>
</div>
</section>`
}
