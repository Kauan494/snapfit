import { COMBINACOES } from "../data/cores";


export function combinam(corA, corB) {
  if (!corA || !corB) return true; 
  if (corA === corB) return true; 
  const deA = COMBINACOES[corA]?.some((combo) => combo.cores.includes(corB));
  const deB = COMBINACOES[corB]?.some((combo) => combo.cores.includes(corA));
  return Boolean(deA || deB);
}


export function lookCombina(pecas) {
  for (let i = 0; i < pecas.length; i++) {
    for (let j = i + 1; j < pecas.length; j++) {
      if (!combinam(pecas[i].cor, pecas[j].cor)) return false;
    }
  }
  return true;
}