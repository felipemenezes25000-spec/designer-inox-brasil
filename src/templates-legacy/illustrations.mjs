/**
 * Esquemas técnicos dos serviços que não têm foto correspondente.
 *
 * São diagramas do sistema real, não ícones decorativos: quem entende de
 * exaustão reconhece a coifa com os bicos na captação, e quem entende de
 * refrigeração reconhece o ciclo compressor→condensador→expansão→evaporador.
 * Um desenho correto comunica competência; um ícone genérico comunica estoque.
 *
 * Todos usam var(--page-accent), então a mesma geometria assume a cor do
 * serviço — azul glacial no frio, âmbar no calor, amarelo na elétrica.
 */

const defs = `<defs>
<pattern id="tg" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0v34" fill="none" stroke="#fff" stroke-opacity=".055"/></pattern>
<linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#2b3136"/><stop offset=".22" stop-color="#cfd8dd"/><stop offset=".45" stop-color="#5b656c"/>
<stop offset=".68" stop-color="#eef3f5"/><stop offset="1" stop-color="#252a2e"/>
</linearGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="var(--page-accent)" stop-opacity=".38"/><stop offset="1" stop-color="var(--page-accent)" stop-opacity="0"/>
</linearGradient>
<filter id="glow" x="-45%" y="-45%" width="190%" height="190%">
<feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
</defs>`

const frame = (label, scale) => `<rect width="900" height="700" fill="#0b0e10"/>
<rect width="900" height="700" fill="url(#tg)"/>
<g fill="#e9eef1" font-family="ui-monospace,monospace" font-size="14" opacity=".5" letter-spacing="1.5">
<text x="44" y="58">${label}</text><text x="856" y="656" text-anchor="end">${scale}</text>
</g>
<path d="M44 74h150M706 74h150" stroke="var(--page-accent)" stroke-width="2" opacity=".55"/>`

const wrap = (label, scale, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">${defs}${frame(label, scale)}${inner}</svg>`

/** Coifa em corte com bicos aspersores, central de dosagem e duto. */
const saponification = wrap(
  'DIB / SISTEMA SAPONIFICANTE',
  'ESQUEMA FUNCIONAL',
  `<g stroke="url(#steel)" stroke-width="3" fill="none">
<path d="M300 210h330l58 96H242z" fill="url(#steel)" fill-opacity=".16"/>
<path d="M242 306h446v34H242z" fill="url(#steel)" fill-opacity=".3"/>
<path d="M430 210V126h96v84" />
<path d="M430 126h96" stroke-width="4"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" stroke-linecap="round">
<path d="M336 268v22M416 268v22M496 268v22M576 268v22" filter="url(#glow)"/>
<path d="M300 258h300" stroke-dasharray="7 9" opacity=".8"/>
</g>
<g fill="var(--page-accent)" opacity=".85">
<circle cx="336" cy="300" r="4"/><circle cx="416" cy="300" r="4"/><circle cx="496" cy="300" r="4"/><circle cx="576" cy="300" r="4"/>
<circle cx="356" cy="322" r="3" opacity=".6"/><circle cx="440" cy="330" r="3" opacity=".6"/><circle cx="520" cy="326" r="3" opacity=".6"/>
</g>
<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".2">
<rect x="112" y="380" width="122" height="176" rx="6"/>
</g>
<g fill="var(--page-accent)" opacity=".22"><rect x="122" y="452" width="102" height="94" rx="4"/></g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3">
<path d="M234 420h74a20 20 0 0 1 20 20v-192" stroke-linecap="round"/>
<circle cx="328" cy="248" r="7" fill="var(--page-accent)" stroke="none"/>
</g>
<g fill="#dfe6ea" font-family="ui-monospace,monospace" font-size="13" opacity=".72">
<text x="112" y="366">CENTRAL DE DOSAGEM</text><text x="700" y="330">DUTO</text><text x="430" y="112" text-anchor="middle">EXAUSTÃO</text>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="2.5" opacity=".55">
<path d="M688 322h96M760 300l24 22-24 22"/>
</g>`,
)

/** Ciclo frigorífico: compressor, condensador, expansão, evaporador. */
const refrigeration = wrap(
  'DIB / CICLO FRIGORÍFICO',
  'ESQUEMA FUNCIONAL',
  `<g fill="none" stroke="var(--page-accent)" stroke-width="3" opacity=".9">
<path d="M262 250h376v212H262z" stroke-dasharray="10 12" opacity=".35"/>
</g>
<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".22">
<circle cx="262" cy="462" r="46"/>
<rect x="576" y="204" width="128" height="92" rx="6"/>
<rect x="196" y="204" width="128" height="92" rx="6"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" stroke-linecap="round">
<path d="M212 226h96M212 246h96M212 266h96" opacity=".75"/>
<path d="M592 226h96M592 246h96M592 266h96" opacity=".75"/>
<path d="M638 462l-28-22 28-22" filter="url(#glow)"/>
</g>
<g fill="none" stroke="url(#steel)" stroke-width="3">
<path d="M262 416V296M324 250h252M638 296v120M308 462h330"/>
</g>
<g fill="var(--page-accent)" opacity=".9"><circle cx="262" cy="462" r="9"/></g>
<g fill="none" stroke="var(--page-accent)" stroke-width="2.5" opacity=".85">
<path d="M450 396v132M414 462h72M424 424l52 76M476 424l-52 76" filter="url(#glow)"/>
</g>
<g fill="#dfe6ea" font-family="ui-monospace,monospace" font-size="13" opacity=".72">
<text x="196" y="192">EVAPORADOR</text><text x="576" y="192">CONDENSADOR</text>
<text x="262" y="540" text-anchor="middle">COMPRESSOR</text><text x="450" y="576" text-anchor="middle">CARGA REFRIGERADA</text>
</g>`,
)

/** Cuba aquecida com resistência, termostato e curva de temperatura. */
const heating = wrap(
  'DIB / AQUECIMENTO CONTROLADO',
  'ESQUEMA FUNCIONAL',
  `<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".2">
<path d="M232 246h436v210a28 28 0 0 1-28 28H260a28 28 0 0 1-28-28z"/>
<path d="M212 232h476v20H212z"/>
</g>
<g fill="var(--page-accent)" opacity=".14"><path d="M252 300h396v168H252z"/></g>
<g fill="none" stroke="var(--page-accent)" stroke-width="4" stroke-linecap="round" filter="url(#glow)">
<path d="M292 428h56l24-44 40 88 40-88 40 88 24-44h48"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="2.5" opacity=".7" stroke-linecap="round">
<path d="M320 348c0-18 22-18 22-36s-22-18-22-36M450 348c0-18 22-18 22-36s-22-18-22-36M580 348c0-18 22-18 22-36s-22-18-22-36"/>
</g>
<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".25">
<rect x="700" y="322" width="92" height="128" rx="6"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3">
<circle cx="746" cy="372" r="22"/><path d="M746 358v14l10 8"/>
<path d="M700 420h92" opacity=".5"/>
</g>
<g fill="var(--page-accent)"><circle cx="746" cy="434" r="5"/></g>
<g fill="#dfe6ea" font-family="ui-monospace,monospace" font-size="13" opacity=".72">
<text x="212" y="218">CUBA EM INOX</text><text x="700" y="308">TERMOSTATO</text><text x="450" y="536" text-anchor="middle">RESISTÊNCIA / DISTRIBUIÇÃO DE CALOR</text>
</g>`,
)

/** Central de CO₂: cilindros, regulador primário e ramais até os pontos. */
const co2 = wrap(
  'DIB / LINHA DE CO₂',
  'ESQUEMA FUNCIONAL',
  `<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".22">
<rect x="146" y="252" width="82" height="286" rx="41"/>
<rect x="248" y="252" width="82" height="286" rx="41"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" opacity=".8">
<path d="M170 300h34M272 300h34"/>
</g>
<g stroke="url(#steel)" stroke-width="3" fill="none">
<path d="M187 252v-34h102v34"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" stroke-linecap="round">
<circle cx="238" cy="184" r="26" filter="url(#glow)"/><path d="M238 168v16l12 8M212 184h-24M264 184h150"/>
</g>
<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".25">
<rect x="414" y="158" width="96" height="52" rx="6"/>
</g>
<g fill="none" stroke="url(#steel)" stroke-width="3">
<path d="M510 184h180v336M600 184v122M690 306h-90"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" stroke-linecap="round" opacity=".9">
<path d="M600 306v46M690 306v46M690 520v-46"/>
</g>
<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".2">
<rect x="566" y="352" width="68" height="96" rx="5"/><rect x="656" y="352" width="68" height="96" rx="5"/>
</g>
<g fill="var(--page-accent)" opacity=".85">
<circle cx="600" cy="400" r="7"/><circle cx="690" cy="400" r="7"/>
</g>
<g fill="#dfe6ea" font-family="ui-monospace,monospace" font-size="13" opacity=".72">
<text x="146" y="576">CENTRAL DE CILINDROS</text><text x="414" y="146">REGULADOR</text><text x="566" y="486">PONTOS DE CONSUMO</text>
</g>`,
)

/** Painel de comando com disjuntores, contatores e laço de sensores. */
const automation = wrap(
  'DIB / PAINEL DE COMANDO',
  'ESQUEMA FUNCIONAL',
  `<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".18">
<rect x="150" y="168" width="368" height="392" rx="8"/>
</g>
<g stroke="url(#steel)" stroke-width="2" fill="none" opacity=".7"><path d="M150 232h368"/></g>
<g fill="var(--page-accent)" opacity=".9"><circle cx="182" cy="200" r="7"/></g>
<g fill="url(#steel)" fill-opacity=".55" stroke="url(#steel)" stroke-width="2">
<rect x="182" y="262" width="42" height="76" rx="3"/><rect x="238" y="262" width="42" height="76" rx="3"/>
<rect x="294" y="262" width="42" height="76" rx="3"/><rect x="350" y="262" width="42" height="76" rx="3"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="2.5" opacity=".85">
<path d="M182 372h310M182 404h310M182 436h214"/>
</g>
<g fill="url(#steel)" fill-opacity=".5" stroke="url(#steel)" stroke-width="2">
<rect x="410" y="262" width="82" height="76" rx="4"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" filter="url(#glow)">
<path d="M424 300h20l10-18 14 34 10-16h10"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" stroke-linecap="round">
<path d="M518 300h94M518 404h94M518 492h94"/>
</g>
<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".22">
<rect x="612" y="262" width="140" height="76" rx="6"/><rect x="612" y="366" width="140" height="76" rx="6"/><rect x="612" y="454" width="140" height="76" rx="6"/>
</g>
<g fill="var(--page-accent)"><circle cx="640" cy="300" r="6"/><circle cx="640" cy="404" r="6"/><circle cx="640" cy="492" r="6"/></g>
<g fill="#dfe6ea" font-family="ui-monospace,monospace" font-size="13" opacity=".72">
<text x="150" y="152">QUADRO DE COMANDO</text>
<text x="668" y="252" text-anchor="middle">EXAUSTÃO</text><text x="668" y="356" text-anchor="middle">COCÇÃO</text><text x="668" y="444" text-anchor="middle">SENSORES</text>
<text x="182" y="222">SINALIZAÇÃO</text>
</g>`,
)

/** Bancada em inox em corte, com sistema alojado e acesso para manutenção. */
const integration = wrap(
  'DIB / ESTRUTURA INTEGRADA',
  'CORTE ESQUEMÁTICO',
  `<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".25">
<path d="M148 258h604v34H148z"/>
<path d="M172 292h556v250H172z" fill-opacity=".12"/>
</g>
<g fill="none" stroke="url(#steel)" stroke-width="3">
<path d="M172 542v42M728 542v42M400 292v250M556 292v250"/>
</g>
<g fill="var(--page-accent)" opacity=".16"><rect x="188" y="308" width="196" height="218"/></g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" stroke-linecap="round">
<path d="M212 350h148M212 386h148M212 422h148" opacity=".8"/>
<path d="M286 458v46M262 480h48" filter="url(#glow)"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" opacity=".9">
<path d="M424 348h108M424 384h108M424 420h108"/>
<path d="M478 456c0-16 20-16 20-32s-20-16-20-32" opacity=".7"/>
</g>
<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".3">
<rect x="580" y="322" width="124" height="96" rx="5"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="2.5">
<path d="M600 348h84M600 372h84M600 396h44"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" stroke-dasharray="8 8" opacity=".6">
<path d="M642 418v76h-86"/>
</g>
<g fill="#dfe6ea" font-family="ui-monospace,monospace" font-size="13" opacity=".72">
<text x="148" y="238">TAMPO EM INOX</text>
<text x="286" y="574" text-anchor="middle">REFRIGERAÇÃO</text><text x="478" y="574" text-anchor="middle">AQUECIMENTO</text><text x="642" y="574" text-anchor="middle">COMANDO</text>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="2" opacity=".5"><path d="M556 494h86"/></g>`,
)

/** Mobiliário hospitalar em inox com superfície contínua e cantos sanitários. */
const hospital = wrap(
  'DIB / APOIO HOSPITALAR',
  'ESQUEMA FUNCIONAL',
  `<g stroke="url(#steel)" stroke-width="3" fill="url(#steel)" fill-opacity=".24">
<path d="M198 262h504v30H198z"/>
</g>
<g fill="none" stroke="url(#steel)" stroke-width="3">
<path d="M232 292v250M668 292v250M232 420h436"/>
<circle cx="256" cy="562" r="20"/><circle cx="644" cy="562" r="20"/>
</g>
<g fill="url(#steel)" fill-opacity=".14" stroke="url(#steel)" stroke-width="2">
<rect x="262" y="316" width="376" height="86" rx="4"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="3" stroke-linecap="round" opacity=".9">
<path d="M198 262c0-26 22-26 22-48M702 262c0-26-22-26-22-48" filter="url(#glow)"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="2.5" opacity=".75">
<path d="M292 350h130M292 374h96"/>
<path d="M540 340v52M514 366h52" stroke-width="4"/>
</g>
<g fill="none" stroke="var(--page-accent)" stroke-width="2.5" stroke-dasharray="7 8" opacity=".6">
<path d="M232 470h436"/>
</g>
<g fill="url(#steel)" fill-opacity=".2" stroke="url(#steel)" stroke-width="2">
<rect x="262" y="490" width="376" height="40" rx="4"/>
</g>
<g fill="#dfe6ea" font-family="ui-monospace,monospace" font-size="13" opacity=".72">
<text x="198" y="196">CANTO SANITÁRIO / SEM RETENÇÃO</text>
<text x="450" y="612" text-anchor="middle">SUPERFÍCIE CONTÍNUA EM AÇO INOX</text>
</g>`,
)

export const illustrations = {
  saponification,
  refrigeration,
  heating,
  co2,
  automation,
  integration,
  hospital,
}
