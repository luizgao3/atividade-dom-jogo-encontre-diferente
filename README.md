# 🛰️ Patrulha Orbital — Genius Espacial

**Aluno:** Luiz Gabriel Abreu Oliveira

---

## 🎮 Mecânica escolhida e tema

- **Mecânica:** Genius / Simon — o jogo "pisca" uma sequência de planetas coloridos e o jogador precisa repetir clicando na ordem correta. A cada rodada certa, a sequência ganha um novo passo.
- **Tema visual:** Espaço. Os "alvos" são planetas (🔴🔵🟢🟡) em um painel de controle de uma nave, simulando uma "transmissão" que o jogador precisa decifrar antes que ela caia.

## 🧑‍🚀 Briefing do cliente

**Público-alvo escolhido:** 🏆 Jogador hardcore.

Isso guiou decisões como:
- A sequência de planetas acelera a cada rodada (fica mais rápida de memorizar).
- Errar custa pontos **e** uma vida ao mesmo tempo (penalidade dupla, não só "tente outra vez").
- Existe um sistema de combo que recompensa sequências longas sem erro, incentivando jogar no limite.

## 📜 Regras do jogo

1. O jogador digita seu nome e aperta **Jogar**.
2. O jogo mostra uma sequência de planetas piscando, um a um.
3. Quando a sequência termina, o jogador deve clicar nos planetas na **mesma ordem** que foi mostrada.
4. Acertar a sequência inteira avança para a próxima rodada, que adiciona **mais um passo** à sequência e diminui o tempo entre os "piscas" (fica mais difícil).
5. Errar um clique:
   - tira **5 pontos**,
   - tira **1 vida** (o jogador começa com 3),
   - e a mesma sequência é mostrada de novo, para o jogador tentar de novo na mesma rodada.
6. O jogo termina quando as vidas chegam a zero.
7. Ao final, é exibido o **nome do jogador**, a **pontuação** e a **quantidade de rodadas alcançadas**, com a opção de **jogar novamente**.

### Variações desta versão (conforme as Restrições da atividade)

- **Grid:** 2×2 (4 planetas), decisão explicada na seção "Minhas Decisões" abaixo.
- **Pontuação:** +10 por acerto, -5 por erro, +5 de bônus a cada 5 acertos consecutivos (combo).
- **Tempo:** a velocidade da sequência diminui progressivamente, ficando mais rápida a cada rodada (mínimo de 250ms por planeta).
- **Dificuldade:** cresce a cada rodada, somando 1 passo na sequência e acelerando a exibição.
- **Término:** o jogo acaba quando o jogador perde as 3 vidas.

## ✨ Seu diferencial (mecânica original)

**Planeta Bônus:** a cada nova rodada, existe 15% de chance de um dos planetas da sequência ser sorteado como "planeta bônus" (isso não é visível para o jogador antecipadamente — é uma surpresa, como um sinal de rádio especial captado na rota). Se o jogador completar a sequência inteira da rodada e essa sequência contiver o planeta sorteado como bônus, ele ganha **+15 pontos extras**, além da pontuação normal.

No código, isso é controlado pela variável `estadoJogo.planetaBonusAtivo`, sorteada dentro da função `proximaRodada()`, e verificada dentro de `registrarAcerto()` quando a sequência da rodada é concluída.

## 🕹️ Como jogar

1. Abra o jogo (link de publicação na seção "Como executar" abaixo ou pelo `index.html`).
2. Digite seu nome no campo "Identificação do piloto".
3. Clique em **🚀 Jogar**.
4. Observe atentamente a sequência de planetas que pisca.
5. Clique nos planetas na mesma ordem mostrada.
6. Continue até errar 3 vezes (perder todas as vidas).
7. Veja seu resultado final e, se quiser, clique em **🔁 Jogar novamente**.

Use o botão **🌙 Modo escuro**, no topo da página, para alternar o tema visual a qualquer momento — a preferência é salva automaticamente.

## ⚙️ Como executar

### Localmente

1. Faça o download ou clone deste repositório.
2. Abra o arquivo `index.html` diretamente em qualquer navegador moderno (não é necessário instalar nada, é JavaScript puro).

### Publicado na internet

> Adicione aqui o link do projeto publicado (ex.: GitHub Pages, Vercel, Netlify) depois de fazer o deploy.

## 🧩 Minhas Decisões

| Item | O que escolhi | Por quê |
|---|---|---|
| **Tamanho/formato do grid** | 2×2 (4 planetas) | Para o público hardcore, um grid pequeno não significa "fácil": com poucos elementos a dificuldade vem da velocidade e do tamanho da sequência, não da quantidade de opções para escolher. Isso também deixa o jogo jogável e legível no celular. |
| **Quantidade de cores/elementos** | 4 (vermelho, azul, verde, amarelo), cada um com símbolo próprio (🔴🔵🟢🟡) | Cada planeta tem cor **e** símbolo, então o jogo não depende só de diferenciar cores — pensei nisso mesmo sem esse ser o briefing escolhido, como boa prática de acessibilidade. |
| **Fórmula de pontuação** | +10 por acerto, -5 por erro, +5 de bônus a cada 5 acertos em combo, +15 se a rodada tiver o planeta bônus | Quis que o jogador hardcore sinta o "risco x recompensa": errar realmente dói (perde pontos e vida), mas manter uma sequência de acertos é recompensado com o combo, incentivando jogar com precisão e sem pausas. |
| **Critérios de tempo** | A velocidade de exibição da sequência começa em 700ms por planeta e diminui 30ms por rodada, até um mínimo de 250ms | Não criei um cronômetro de partida porque achei que, para esse estilo de jogo (Genius), o que realmente testa o jogador hardcore é a velocidade da sequência piscando, não um relógio correndo na tela. |
| **Curva de dificuldade** | A cada rodada correta, a sequência ganha +1 passo e a velocidade aumenta (tempo de exibição diminui) | Dificuldade dupla: memória (sequência mais longa) e reflexo (mais rápida), que é o tipo de desafio que um jogador hardcore busca. |
| **Condição de término** | 3 vidas; perder todas encerra o jogo | Optei por vidas em vez de "um erro encerra tudo" para o jogo não ficar frustrante demais logo na primeira rodada, mas ainda manter penalidade real (perde pontos a cada erro). |

## 🤖 Declaração de uso de IA

Usei IA (Claude, da Anthropic) como apoio na criação deste projeto, para:

- Estruturar a separação de responsabilidades entre as funções JavaScript (`iniciarJogo`, `proximaRodada`, `tocarSequencia`, `registrarAcerto`, `registrarErro`, `salvarNoRanking`, entre outras).
- Organizar o CSS em variáveis (`:root`) para facilitar o modo escuro.
- Revisar a lógica de combo e da mecânica de planeta bônus.

O que aprendi: a importância de manter um único objeto de estado (`estadoJogo`) em vez de várias variáveis globais soltas, o que tornou muito mais fácil depurar o jogo e explicar seu funcionamento. Também entendi melhor como manipular `localStorage` com `JSON.stringify`/`JSON.parse` para guardar listas de objetos (o ranking), e não apenas valores simples de texto.

Entendo e sei explicar todas as funções entregues neste projeto.

## 🤔 Reflexão obrigatória

**1. Qual foi o bug mais chato e como resolveu?**
O bug mais incômodo foi o jogador conseguir clicar nos planetas **durante** a exibição da sequência, o que deixava a lógica de comparação de cliques confusa (cliques contavam como "tentativa" mesmo sem o jogo ainda ter terminado de mostrar a sequência). Resolvi criando a flag `estadoJogo.aguardandoCliqueDoJogador`, que só fica `true` depois que `tocarSequencia()` termina de piscar todos os planetas. Assim, `reagirAoCliqueDoJogador()` ignora qualquer clique fora da hora certa.

**2. Por que escolheu essa fórmula de pontuação?**
Porque o briefing do cliente hardcore pede "penalidades duras". Uma pontuação onde errar não custa nada (ou custa pouco) não combina com esse perfil. Por isso o erro tira pontos **e** vida ao mesmo tempo, enquanto o acerto contínuo (combo) é recompensado — isso cria uma curva de risco e recompensa parecida com a de jogos de ritmo/reflexo voltados a jogadores experientes.

**3. Como o briefing do cliente mudou suas decisões?**
Se o cliente fosse, por exemplo, "criança de 6 anos", eu manteria a velocidade alta constante e sem aceleração, sem perda de vida (só "tente novamente"), e usaria cores bem mais vivas e poucos elementos. Como o cliente é hardcore, fiz o oposto: dificuldade crescente agressiva, penalidade real para erro e uma mecânica de bônus que recompensa quem joga "no limite".

**4. Se tivesse mais uma semana, o que mudaria?**
Adicionaria efeitos sonoros reais para cada planeta (já deixei uma frequência prevista no array `PLANETAS`, no campo `som`, mas não cheguei a implementar o `AudioContext`), e um modo de "dois jogadores" alternando quem repete a sequência, para aproveitar ainda mais o perfil competitivo do público hardcore.

**5. Aponte uma função sua que ficou boa e explique o que ela faz.**
A função `tocarSequencia()` ficou bem resolvida: ela calcula a velocidade atual da rodada (com base em `CONFIGURACAO.velocidadeInicialMs`, na rodada atual e em um limite mínimo), e depois usa uma função interna recursiva (`piscarProximo`) que vai acendendo e apagando cada planeta da sequência em ordem, usando `setTimeout` encadeado, até liberar a vez do jogador. Gostei dela porque concentra toda a lógica de "exibir a sequência" em um único lugar, sem misturar com a lógica de pontuação ou de cliques.

## 📚 Créditos

- Estrutura geral do desafio (mecânicas, briefings de cliente e restrições): enunciado da atividade #09 fornecido pela professora.
- Apoio de IA (Claude, da Anthropic) para organização do código e revisão da lógica, conforme descrito na "Declaração de uso de IA" acima — todo o código foi compreendido, adaptado e personalizado por mim.
- Emojis de planetas/cores: caracteres Unicode padrão, sem uso de bibliotecas externas.

## 🧐 Bônus aplicados

1. **Mecânica original (Planeta Bônus):** já descrita na seção "Seu diferencial" acima, implementada em `proximaRodada()` e `registrarAcerto()`.
2. **Ranking com localStorage:** ao final de cada partida, a função `salvarNoRanking()` guarda nome e pontuação em `localStorage` (chave `patrulhaOrbital_ranking`), mantendo apenas os 5 melhores resultados, ordenados do maior para o menor. A função `exibirRanking()` lê esses dados e monta a lista na tela inicial.
3. **Responsivo:** o layout usa `max-width`, `grid` flexível e uma media query (`@media (max-width: 400px)`) que reduz o tamanho do grid e reorganiza o botão de modo escuro em telas pequenas, mantendo o jogo jogável no celular.

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT) — uso livre para fins educacionais, com créditos ao autor original.