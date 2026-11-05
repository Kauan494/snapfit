
export const CORES = [
  { id: "preto", nome: "Preto", hex: "#000000" },
  { id: "branco", nome: "Branco", hex: "#FFFFFF" },
  { id: "cinza", nome: "Cinza", hex: "#8E8E93" },
  { id: "bege", nome: "Bege", hex: "#D8C3A5" },
  { id: "marrom", nome: "Marrom", hex: "#7B4B2A" },
  { id: "azul-marinho", nome: "Azul-marinho", hex: "#1F2A44" },
  { id: "azul-claro", nome: "Azul-claro", hex: "#8EC5FC" },
  { id: "verde", nome: "Verde", hex: "#3A7D44" },
  { id: "vermelho", nome: "Vermelho", hex: "#C62828" },
  { id: "amarelo", nome: "Amarelo", hex: "#F9D342" },
  { id: "rosa", nome: "Rosa", hex: "#F4A6C1" },
];


export const TIPOS = [
  { id: "cima", nome: "Parte de cima" },
  { id: "baixo", nome: "Parte de baixo" },
  { id: "calcado", nome: "Calçado" },
];

// Combinações por cor: cada uma lista as cores que combinam com a cor base
export const COMBINACOES = {
  preto: [
    { cores: ["branco"], estilo: "Clássico", dica: "Contraste máximo, nunca erra." },
    { cores: ["vermelho"], estilo: "Marcante", dica: "Ótimo para a noite." },
    { cores: ["bege"], estilo: "Elegante", dica: "Suaviza o preto sem perder a classe." },
    { cores: ["cinza", "branco"], estilo: "Monocromático", dica: "Moderno e urbano." },
    { cores: ["rosa"], estilo: "Contraste suave", dica: "Traz leveza ao visual escuro." },
  ],
  branco: [
    { cores: ["azul-marinho"], estilo: "Navy", dica: "Clima praiano e arrumado." },
    { cores: ["bege", "marrom"], estilo: "Natural", dica: "Tons de terra combinam com tudo." },
    { cores: ["preto"], estilo: "Clássico", dica: "O básico que sempre funciona." },
    { cores: ["azul-claro"], estilo: "Leve", dica: "Perfeito para dias quentes." },
    { cores: ["verde"], estilo: "Fresco", dica: "Visual limpo e descontraído." },
  ],
  cinza: [
    { cores: ["preto"], estilo: "Urbano", dica: "Discreto e moderno." },
    { cores: ["rosa"], estilo: "Delicado", dica: "O cinza equilibra o rosa." },
    { cores: ["azul-marinho"], estilo: "Sóbrio", dica: "Bom para ocasiões formais." },
    { cores: ["amarelo"], estilo: "Vibrante", dica: "O cinza deixa o amarelo mais fácil de usar." },
    { cores: ["branco"], estilo: "Minimalista", dica: "Simples e elegante." },
  ],
  bege: [
    { cores: ["branco"], estilo: "Clean", dica: "Visual claro e sofisticado." },
    { cores: ["marrom"], estilo: "Tons terrosos", dica: "Combinação aconchegante." },
    { cores: ["azul-marinho"], estilo: "Sofisticado", dica: "Clássico do estilo casual chique." },
    { cores: ["verde"], estilo: "Natural", dica: "Inspirado na natureza." },
    { cores: ["preto"], estilo: "Elegante", dica: "Contraste equilibrado." },
  ],
  marrom: [
    { cores: ["bege"], estilo: "Terroso", dica: "Tom sobre tom, muito harmônico." },
    { cores: ["azul-claro"], estilo: "Contraste suave", dica: "Quente e frio em equilíbrio." },
    { cores: ["verde"], estilo: "Outono", dica: "Paleta da estação." },
    { cores: ["branco"], estilo: "Casual", dica: "Fácil para o dia a dia." },
    { cores: ["azul-marinho"], estilo: "Clássico", dica: "Combinação tradicional e segura." },
  ],
  "azul-marinho": [
    { cores: ["branco"], estilo: "Navy", dica: "O clássico do azul-marinho." },
    { cores: ["bege"], estilo: "Sofisticado", dica: "Elegante sem ser formal demais." },
    { cores: ["vermelho"], estilo: "Esportivo", dica: "Energia e contraste." },
    { cores: ["cinza"], estilo: "Social", dica: "Bom para trabalho." },
    { cores: ["amarelo"], estilo: "Contraste vivo", dica: "Para quem quer chamar atenção." },
  ],
  "azul-claro": [
    { cores: ["branco"], estilo: "Leve", dica: "Fresco e luminoso." },
    { cores: ["bege"], estilo: "Primavera", dica: "Suave e delicado." },
    { cores: ["marrom"], estilo: "Casual chique", dica: "Contraste quente e frio." },
    { cores: ["azul-marinho"], estilo: "Tom sobre tom", dica: "Dois azuis em harmonia." },
    { cores: ["cinza"], estilo: "Discreto", dica: "Combinação tranquila." },
  ],
  verde: [
    { cores: ["bege"], estilo: "Natural", dica: "Tons da natureza juntos." },
    { cores: ["marrom"], estilo: "Outdoor", dica: "Pegada aventureira." },
    { cores: ["branco"], estilo: "Fresco", dica: "Destaca o verde." },
    { cores: ["preto"], estilo: "Moderno", dica: "Deixa o verde mais sério." },
    { cores: ["azul-marinho"], estilo: "Clássico", dica: "Combinação elegante e discreta." },
  ],
  vermelho: [
    { cores: ["preto"], estilo: "Marcante", dica: "Forte e confiante." },
    { cores: ["azul-marinho"], estilo: "Esportivo", dica: "Clássico de uniformes." },
    { cores: ["branco"], estilo: "Vibrante", dica: "O branco destaca o vermelho." },
    { cores: ["bege"], estilo: "Equilibrado", dica: "Suaviza a intensidade." },
    { cores: ["cinza"], estilo: "Urbano", dica: "Vermelho com uma base neutra." },
  ],
  amarelo: [
    { cores: ["azul-marinho"], estilo: "Contraste vivo", dica: "Uma das melhores combinações do amarelo." },
    { cores: ["cinza"], estilo: "Moderno", dica: "Equilibra a cor forte." },
    { cores: ["branco"], estilo: "Solar", dica: "Alegre e leve." },
    { cores: ["preto"], estilo: "Ousado", dica: "Alto contraste." },
    { cores: ["bege"], estilo: "Suave", dica: "Amarelo mais delicado." },
  ],
  rosa: [
    { cores: ["cinza"], estilo: "Delicado", dica: "O neutro valoriza o rosa." },
    { cores: ["branco"], estilo: "Romântico", dica: "Leve e suave." },
    { cores: ["azul-marinho"], estilo: "Equilibrado", dica: "O marinho dá peso ao visual." },
    { cores: ["bege"], estilo: "Suave", dica: "Tons claros em harmonia." },
    { cores: ["preto"], estilo: "Contraste", dica: "Rosa com atitude." },
  ],
};