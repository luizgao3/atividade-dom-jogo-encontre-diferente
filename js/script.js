// =======================================================
// Patrulha Orbital — Genius Espacial
// Autor: Luiz Gabriel Abreu Oliveira
//
// Cliente escolhido: 🏆 Jogador hardcore.
// Por isso a sequência cresce rápido, o tempo de exibição
// diminui a cada rodada e os erros custam pontos de forma
// pesada (perde vida + pontos), ao invés de só "tentar de
// novo sem custo".
// =======================================================

// -------------------------------------------------------
// 1. CONFIGURAÇÃO E ESTADO DO JOGO
// -------------------------------------------------------

// guardo as configurações fixas aqui em cima para não
// espalhar "números mágicos" pelo código
const CONFIGURACAO = {
  vidasIniciais: 3,
  pontosPorAcerto: 10,
  penalidadePorErro: 5,
  bonusCombo: 5, // a cada 5 acertos seguidos, ganho de combo
  acertosParaCombo: 5,
  velocidadeInicialMs: 700, // tempo que cada planeta fica "ativo" na sequência
  velocidadeMinimaMs: 250,  // hardcore: a sequência fica bem rápida no fim
  reducaoVelocidadePorRodada: 30,
  chanceDePlanetaBonus: 0.15 // 15% de chance de a rodada ter um planeta bônus
};

// "estadoJogo" concentra tudo que muda durante a partida.
// Prefiro um único objeto de estado a vários let soltos,
// porque facilita ler o que o jogo "sabe" em um dado momento.
let estadoJogo = {
  nomeJogador: '',
  sequencia: [],
  posicaoNaSequencia: 0,
  pontuacao: 0,
  vidas: CONFIGURACAO.vidasIniciais,
  rodada: 0,
  combo: 0,
  aguardandoCliqueDoJogador: false,
  planetaBonusAtivo: null
};

// defino os planetas como dados (cor + símbolo + tecla),
// não como innerHTML — assim cada planeta nasce como
// elemento real do DOM, conforme pedido na atividade
const PLANETAS = [
  { id: 'vermelho', classe: 'planeta-vermelho', simbolo: '🔴', som: 220 },
  { id: 'azul',     classe: 'planeta-azul',     simbolo: '🔵', som: 330 },
  { id: 'verde',    classe: 'planeta-verde',    simbolo: '🟢', som: 440 },
  { id: 'amarelo',  classe: 'planeta-amarelo',  simbolo: '🟡', som: 550 }
];

const CHAVE_RANKING = 'patrulhaOrbital_ranking';

// -------------------------------------------------------
// 2. REFERÊNCIAS AOS ELEMENTOS DA TELA
// -------------------------------------------------------

const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const telaFim = document.getElementById('tela-fim');

const inputNome = document.getElementById('input-nome');
const botaoJogar = document.getElementById('btn-jogar');
const botaoJogarNovamente = document.getElementById('btn-jogar-novamente');
const botaoModoEscuro = document.getElementById('btn-modo-escuro');

const statusJogador = document.getElementById('status-jogador');
const statusPontos = document.getElementById('status-pontos');
const statusVidas = document.getElementById('status-vidas');
const statusRodada = document.getElementById('status-rodada');
const mensagemJogo = document.getElementById('mensagem-jogo');
const gridPlanetas = document.getElementById('grid-planetas');
const resultadoFinal = document.getElementById('resultado-final');
const listaRanking = document.getElementById('lista-ranking');

// -------------------------------------------------------
// 3. FUNÇÕES DE CONTROLE DE TELA
// -------------------------------------------------------

// função simples e única responsabilidade: trocar qual
// "section" está visível, escondendo as outras
function mostrarTela(telaParaMostrar) {
  [telaInicial, telaJogo, telaFim].forEach(function (tela) {
    if (tela === telaParaMostrar) {
      tela.classList.remove('escondido');
    } else {
      tela.classList.add('escondido');
    }
  });
}

// -------------------------------------------------------
// 4. CRIAÇÃO DO GRID (sem innerHTML, como pede a restrição)
// -------------------------------------------------------

// crio cada planeta com createElement e guardo referências
// no próprio elemento via dataset, em vez de inventar um
// array paralelo de botões — fica mais fácil de manter
function criarGrid() {
  // limpo o grid antes de recriar, usando removeChild em
  // vez de innerHTML = '' para manter a restrição do DOM puro
  while (gridPlanetas.firstChild) {
    gridPlanetas.removeChild(gridPlanetas.firstChild);
  }

  PLANETAS.forEach(function (planeta) {
    const botaoPlaneta = document.createElement('button');
    botaoPlaneta.classList.add('planeta', planeta.classe);
    botaoPlaneta.dataset.idPlaneta = planeta.id;
    botaoPlaneta.setAttribute('aria-label', 'Planeta ' + planeta.id);

    // o símbolo é texto simples (textContent), não HTML
    // arbitrário — continua sem usar innerHTML
    botaoPlaneta.textContent = planeta.simbolo;

    botaoPlaneta.addEventListener('click', function () {
      reagirAoCliqueDoJogador(planeta.id, botaoPlaneta);
    });

    gridPlanetas.appendChild(botaoPlaneta);
  });
}

// busco o elemento <button> de um planeta pelo id guardado
// no dataset, em vez de usar índices fixos do array
function buscarElementoDoPlaneta(idPlaneta) {
  return gridPlanetas.querySelector('[data-id-planeta="' + idPlaneta + '"]');
}

// -------------------------------------------------------
// 5. FLUXO PRINCIPAL DO JOGO
// -------------------------------------------------------

function iniciarJogo() {
  const nomeDigitado = inputNome.value.trim();

  // exijo um nome porque o requisito final pede para
  // informar "nome do jogador" no resultado
  estadoJogo.nomeJogador = nomeDigitado || 'Piloto desconhecido';

  estadoJogo.sequencia = [];
  estadoJogo.posicaoNaSequencia = 0;
  estadoJogo.pontuacao = 0;
  estadoJogo.vidas = CONFIGURACAO.vidasIniciais;
  estadoJogo.rodada = 0;
  estadoJogo.combo = 0;
  estadoJogo.aguardandoCliqueDoJogador = false;

  criarGrid();
  atualizarPainelStatus();
  mostrarTela(telaJogo);

  proximaRodada();
}

// cada rodada acrescenta um passo novo na sequência —
// é assim que o Genius cresce de dificuldade
function proximaRodada() {
  estadoJogo.rodada += 1;
  estadoJogo.posicaoNaSequencia = 0;
  estadoJogo.aguardandoCliqueDoJogador = false;

  // diferencial/bônus: de vez em quando sorteio um
  // "planeta bônus" da rodada — se o jogador acertar a
  // sequência completa de uma rodada que tinha bônus,
  // ganha pontos extras. É a mecânica original do projeto.
  estadoJogo.planetaBonusAtivo =
    Math.random() < CONFIGURACAO.chanceDePlanetaBonus
      ? PLANETAS[Math.floor(Math.random() * PLANETAS.length)].id
      : null;

  const novoPasso = PLANETAS[Math.floor(Math.random() * PLANETAS.length)].id;
  estadoJogo.sequencia.push(novoPasso);

  atualizarPainelStatus();
  mensagemJogo.textContent = 'Observe a sequência...';

  tocarSequencia();
}

// pisca os planetas da sequência em ordem, com velocidade
// que diminui (fica mais rápida) conforme a rodada avança —
// é a curva de dificuldade pensada para o cliente hardcore
function tocarSequencia() {
  const velocidadeAtual = Math.max(
    CONFIGURACAO.velocidadeMinimaMs,
    CONFIGURACAO.velocidadeInicialMs -
      (estadoJogo.rodada - 1) * CONFIGURACAO.reducaoVelocidadePorRodada
  );

  let indice = 0;

  function piscarProximo() {
    if (indice >= estadoJogo.sequencia.length) {
      // sequência terminou de piscar, agora é a vez do jogador
      estadoJogo.aguardandoCliqueDoJogador = true;
      mensagemJogo.textContent = 'Sua vez! Repita a sequência.';
      return;
    }

    const idPlaneta = estadoJogo.sequencia[indice];
    const elemento = buscarElementoDoPlaneta(idPlaneta);

    elemento.classList.add('ativo');
    setTimeout(function () {
      elemento.classList.remove('ativo');
      indice += 1;
      setTimeout(piscarProximo, velocidadeAtual * 0.3);
    }, velocidadeAtual * 0.7);
  }

  // pequena pausa antes de começar, para o jogador se
  // preparar visualmente
  setTimeout(piscarProximo, 500);
}

// trata o clique do jogador em um planeta, comparando com
// a posição esperada da sequência
function reagirAoCliqueDoJogador(idPlanetaClicado, elementoClicado) {
  if (!estadoJogo.aguardandoCliqueDoJogador) {
    // ignoro cliques fora da hora (durante a exibição da
    // sequência, por exemplo) — evita "trapaça" por clique
    // antecipado, importante para o cliente hardcore
    return;
  }

  const idEsperado = estadoJogo.sequencia[estadoJogo.posicaoNaSequencia];

  if (idPlanetaClicado === idEsperado) {
    registrarAcerto(idPlanetaClicado, elementoClicado);
  } else {
    registrarErro(elementoClicado);
  }
}

// -------------------------------------------------------
// 6. PONTUAÇÃO, COMBO E VIDAS
// -------------------------------------------------------

function registrarAcerto(idPlaneta, elemento) {
  destacarPlaneta(elemento, 'acerto');

  estadoJogo.posicaoNaSequencia += 1;
  estadoJogo.combo += 1;

  let pontosGanhos = CONFIGURACAO.pontosPorAcerto;

  // bônus de combo: recompensa quem mantém uma sequência
  // de acertos sem errar, reforçando o ritmo "hardcore"
  if (estadoJogo.combo % CONFIGURACAO.acertosParaCombo === 0) {
    pontosGanhos += CONFIGURACAO.bonusCombo;
    mensagemJogo.textContent = 'Combo! +' + pontosGanhos + ' pontos';
  }

  atualizarPontuacao(pontosGanhos);

  const terminouASequenciaDaRodada =
    estadoJogo.posicaoNaSequencia === estadoJogo.sequencia.length;

  if (terminouASequenciaDaRodada) {
    // se a rodada tinha planeta bônus e ele apareceu na
    // sequência, dou pontos extras por completar com ele
    if (
      estadoJogo.planetaBonusAtivo &&
      estadoJogo.sequencia.includes(estadoJogo.planetaBonusAtivo)
    ) {
      atualizarPontuacao(15);
      mensagemJogo.textContent = '🌟 Planeta bônus na rota! +15 pontos extras';
    }

    estadoJogo.aguardandoCliqueDoJogador = false;
    setTimeout(proximaRodada, 900);
  }
}

function registrarErro(elemento) {
  destacarPlaneta(elemento, 'erro');

  estadoJogo.combo = 0;
  atualizarPontuacao(-CONFIGURACAO.penalidadePorErro);
  perderVida();
}

// adiciono uma classe visual temporária de feedback
// (acerto/erro) e removo depois de um curto intervalo
function destacarPlaneta(elemento, classeFeedback) {
  elemento.classList.add(classeFeedback);
  setTimeout(function () {
    elemento.classList.remove(classeFeedback);
  }, 300);
}

// atualiza a pontuação total e repassa para o painel —
// função pequena e de responsabilidade única, como pede
// a restrição técnica da atividade
function atualizarPontuacao(delta) {
  estadoJogo.pontuacao = Math.max(0, estadoJogo.pontuacao + delta);
  atualizarPainelStatus();
}

function perderVida() {
  estadoJogo.vidas -= 1;
  estadoJogo.aguardandoCliqueDoJogador = false;
  atualizarPainelStatus();

  if (estadoJogo.vidas <= 0) {
    finalizarJogo();
  } else {
    mensagemJogo.textContent = 'Errou! Vidas restantes: ' + estadoJogo.vidas;
    // dou uma nova chance mostrando a mesma sequência de novo,
    // em vez de avançar de rodada — penalidade dura (perde vida
    // e pontos) mas sem travar o jogo por completo
    setTimeout(tocarSequencia, 1200);
  }
}

// -------------------------------------------------------
// 7. PAINEL DE STATUS (texto, sem innerHTML)
// -------------------------------------------------------

function atualizarPainelStatus() {
  statusJogador.textContent = 'Piloto: ' + estadoJogo.nomeJogador;
  statusPontos.textContent = 'Pontos: ' + estadoJogo.pontuacao;
  statusVidas.textContent = 'Vidas: ' + '❤️'.repeat(Math.max(0, estadoJogo.vidas));
  statusRodada.textContent = 'Rodada: ' + estadoJogo.rodada;
}

// -------------------------------------------------------
// 8. FIM DE JOGO E RANKING (localStorage)
// -------------------------------------------------------

function finalizarJogo() {
  mostrarTela(telaFim);

  // monto o texto de resultado por linhas, usando \n com
  // white-space na mensagem seria outra opção, mas aqui
  // prefiro parágrafos reais criados via DOM
  while (resultadoFinal.firstChild) {
    resultadoFinal.removeChild(resultadoFinal.firstChild);
  }

  const linhaNome = document.createElement('p');
  linhaNome.textContent = 'Piloto: ' + estadoJogo.nomeJogador;

  const linhaPontos = document.createElement('p');
  linhaPontos.textContent = 'Pontuação final: ' + estadoJogo.pontuacao;

  const linhaRodadas = document.createElement('p');
  linhaRodadas.textContent = 'Rodadas alcançadas: ' + (estadoJogo.rodada - 1);

  resultadoFinal.appendChild(linhaNome);
  resultadoFinal.appendChild(linhaPontos);
  resultadoFinal.appendChild(linhaRodadas);

  salvarNoRanking(estadoJogo.nomeJogador, estadoJogo.pontuacao);
}

// guardo o ranking em localStorage como pede o item de
// bônus — uso JSON para armazenar uma lista de objetos
function salvarNoRanking(nome, pontuacao) {
  const rankingAtual = carregarRanking();

  rankingAtual.push({ nome: nome, pontuacao: pontuacao });

  // ordeno do maior para o menor e guardo só os 5 melhores,
  // para o ranking não crescer infinitamente
  rankingAtual.sort(function (a, b) {
    return b.pontuacao - a.pontuacao;
  });

  const top5 = rankingAtual.slice(0, 5);

  localStorage.setItem(CHAVE_RANKING, JSON.stringify(top5));
}

function carregarRanking() {
  const dadosSalvos = localStorage.getItem(CHAVE_RANKING);

  try {
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  } catch (erro) {
    // se o JSON salvo estiver corrompido por algum motivo,
    // prefiro recomeçar o ranking a quebrar o jogo
    return [];
  }
}

// desenha a lista de ranking na tela inicial, sempre que
// ela for exibida (ao carregar a página e ao voltar do fim)
function exibirRanking() {
  const ranking = carregarRanking();

  while (listaRanking.firstChild) {
    listaRanking.removeChild(listaRanking.firstChild);
  }

  if (ranking.length === 0) {
    const itemVazio = document.createElement('li');
    itemVazio.textContent = 'Nenhuma pontuação registrada ainda.';
    listaRanking.appendChild(itemVazio);
    return;
  }

  ranking.forEach(function (registro) {
    const item = document.createElement('li');
    item.textContent = registro.nome + ' — ' + registro.pontuacao + ' pts';
    listaRanking.appendChild(item);
  });
}

// -------------------------------------------------------
// 9. MODO ESCURO
// -------------------------------------------------------

// alterno uma classe no body e guardo a preferência, para
// não "esquecer" a escolha do jogador se ele recarregar
function alternarModoEscuro() {
  document.body.classList.toggle('modo-escuro');
  const ativado = document.body.classList.contains('modo-escuro');
  localStorage.setItem('patrulhaOrbital_modoEscuro', ativado ? '1' : '0');
}

function aplicarPreferenciaDeModoEscuro() {
  const preferenciaSalva = localStorage.getItem('patrulhaOrbital_modoEscuro');
  if (preferenciaSalva === '1') {
    document.body.classList.add('modo-escuro');
  }
}

// -------------------------------------------------------
// 10. EVENTOS E INICIALIZAÇÃO
// -------------------------------------------------------

botaoJogar.addEventListener('click', iniciarJogo);

botaoJogarNovamente.addEventListener('click', function () {
  exibirRanking();
  mostrarTela(telaInicial);
});

botaoModoEscuro.addEventListener('click', alternarModoEscuro);

// permito iniciar também apertando Enter no campo de nome,
// só por conforto de uso — não substitui o botão "Jogar"
inputNome.addEventListener('keydown', function (evento) {
  if (evento.key === 'Enter') {
    iniciarJogo();
  }
});

// preparo a tela inicial assim que o script carrega
aplicarPreferenciaDeModoEscuro();
exibirRanking();
mostrarTela(telaInicial);
