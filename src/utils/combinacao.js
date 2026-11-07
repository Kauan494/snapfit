import { COMBINACOES } from "../data/cores";

// Diz se duas cores combinam
export function combinam(corA, corB) {
  if (!corA || !corB) return true; // foto da câmera sem cor definida não bloqueia
  if (corA === corB) return true; // mesma cor = monocromático
  const deA = COMBINACOES[corA]?.some((combo) => combo.cores.includes(corB));
  const deB = COMBINACOES[corB]?.some((combo) => combo.cores.includes(corA));
  return Boolean(deA || deB);
}

// Diz se todas as peças do look combinam entre si 
export function lookCombina(pecas) {
  for (let i = 0; i < pecas.length; i++) {
    for (let j = i + 1; j < pecas.length; j++) {
      if (!combinam(pecas[i].cor, pecas[j].cor)) return false;
    }
  }
  return true;
}