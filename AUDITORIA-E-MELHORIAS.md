# Auditoria de conversão e redesign — Designer Inox Brasil

## O que foi melhorado no código

1. **Primeira dobra reescrita para clareza imediata**: o visitante entende em poucos segundos que a empresa projeta, fabrica, instala e mantém cozinhas, equipamentos e sistemas em inox em Brasília/DF e entorno.
2. **Hero cinematográfico com foco em conversão**: fundo imersivo, contraste reforçado, CTA principal explícito e painel com quatro necessidades comuns.
3. **WhatsApp contextual**: cada atalho abre uma mensagem diferente para implantação, fabricação sob medida, manutenção ou orientação.
4. **Prova de confiança antecipada**: segmentos, quantidade de frentes, região de atendimento e clientes aparecem antes da rolagem longa.
5. **Catálogo reorganizado por objetivo**: os 13 serviços continuam acessíveis e indexáveis, mas a home agora os organiza em quatro caminhos compreensíveis.
6. **Página mais curta e com ritmo melhor**: a galeria foi reduzida e blocos repetitivos foram trocados por painéis de decisão, prova e ação.
7. **CTAs distribuídos sem poluição**: hero, serviços, painel intermediário, prova e encerramento têm próximos passos claros.
8. **Conversão mobile**: o botão flutuante virou uma barra completa “Pedir orçamento”, fácil de tocar e visível durante a navegação.
9. **Formulário de orçamento aprimorado**: linguagem mais simples, explicação visual do fluxo, garantias de privacidade e suporte a serviço pré-selecionado por URL.
10. **Mensuração preparada**: cliques em CTAs geram eventos apenas quando um `dataLayer` já existir; nenhum rastreador foi adicionado.
11. **Correções técnicas**: remoção de meta tag duplicada, manutenção do gerador estático, cache-busting, SEO, acessibilidade e rotas existentes.

## Principal limite atual de conversão

As fotos são de banco e estão corretamente identificadas como ilustrativas. Isso protege juridicamente, mas reduz a força comercial. A próxima melhoria mais valiosa é substituir parte delas por fotos reais autorizadas de obras, detalhes de solda/acabamento, instalação e antes/depois. Não foram inventados cases, avaliações, garantias, prazos ou números de faturamento.

## Como publicar

1. Extraia o pacote.
2. Rode `npm run build` após qualquer alteração em `src/`, `assets/css/styles.css` ou `assets/js/main.js`.
3. Envie o conteúdo para o mesmo projeto da Vercel ou faça commit no repositório conectado.
4. O projeto continua sem framework e sem dependência em tempo de execução.

## Validações executadas

- Geração das 26 páginas.
- Verificação de HTML, canonical, imagens com `alt`, IDs, links, assets e sitemap.
- Testes automatizados em larguras desktop e mobile.
- Testes de menu, formulário, CTAs e overflow horizontal.
