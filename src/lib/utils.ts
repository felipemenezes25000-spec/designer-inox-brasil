import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Preenchimento para grades no estilo "gap-px bg-border" (o divisor nasce do
 * fundo do container aparecendo no espaçamento de 1px; cada item cobre sua
 * própria célula com `bg-background`). Quando a contagem de itens não é
 * múltiplo do número de colunas, a última linha deixa células sem item — e
 * sem nada para cobrir o fundo do container, elas aparecem como um retângulo
 * cinza sólido em vez de espaço em branco.
 *
 * Retorna quantos itens fantasma (`bg-background`, sem conteúdo,
 * `aria-hidden`) somar ao fim da lista para a última linha fechar. Usado em
 * vez de mudar a técnica de divisor em si, que é a assinatura visual
 * recorrente do site (ver `specular` em src/styles.css) e aparece em cerca de
 * dez seções.
 */
export function gridFillerCount(itemCount: number, columns: number): number {
  if (columns <= 0 || itemCount === 0) return 0;
  return (columns - (itemCount % columns)) % columns;
}
