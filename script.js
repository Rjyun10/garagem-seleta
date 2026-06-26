// Função para carregar componentes HTML externos
function carregarComponente(idContainer, urlArquivo) {
  fetch(urlArquivo)
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error(`Erro ao carregar o arquivo: ${urlArquivo}`);
      }
      return resposta.text();
    })
    .then((html) => {
      document.getElementById(idContainer).innerHTML = html;
    })
    .catch((erro) => console.error("Erro na requisição:", erro));
}

// Executa a função para o Header e para o Footer
document.addEventListener("DOMContentLoaded", () => {
  carregarComponente("header-container", "componentes/header.html");
  carregarComponente("footer-container", "componentes/footer.html");
});
// -------------------------- //

document.addEventListener("DOMContentLoaded", function () {
  // --- ROLAGEM INTELIGENTE ENTRE PÁGINAS E MENUS RESPONSIVOS ---
  document.addEventListener("click", function (e) {
    const anchor = e.target.closest("a");
    if (!anchor || !anchor.getAttribute("href")) return;

    const href = anchor.getAttribute("href");

    if (href.includes("#")) {
      const partes = href.split("#");
      const paginaDestino = partes[0]; // ex: "index.html" ou vazio ""
      const targetId = "#" + partes[1]; // ex: "#sobre"

      if (targetId === "#") return;

      // Pegamos o nome da página atual onde o usuário está navegando
      const paginaAtual = window.location.pathname.split("/").pop();

      // SE o link for para outra página (ex: está em contato.html e o link é index.html#sobre)
      // OU se a página de destino for vazia mas o elemento não existir nessa página atual:
      // Deixamos o navegador trocar de página normalmente (NÃO usamos e.preventDefault())
      const targetElement = document.querySelector(targetId);

      if (
        !targetElement ||
        (paginaDestino !== "" &&
          paginaDestino !== paginaAtual &&
          !window.location.href.includes(paginaDestino))
      ) {
        // Não faz nada aqui. O navegador vai seguir o link "index.html#sobre" naturalmente.
        return;
      }

      // Se o elemento existe na página atual, fazemos a animação suave perfeita:
      e.preventDefault();

      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;

      const duration = 2000;
      let start = null;

      function customScrollAnimation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;

        const t = Math.min(timeElapsed / duration, 1);
        const intensidadeMeio = 4.0;

        const progress =
          t < 0.5
            ? Math.pow(t * 2, intensidadeMeio) / 2
            : 1 - Math.pow((1 - t) * 2, intensidadeMeio) / 2;

        window.scrollTo(0, startPosition + distance * progress);

        if (timeElapsed < duration) {
          requestAnimationFrame(customScrollAnimation);
        }
      }

      requestAnimationFrame(customScrollAnimation);
    }
  });

  // --- TRATAMENTO PARA QUANDO CHEGAR EM OUTRA PÁGINA VINDO DE UM LINK COM # ---
  // Se o usuário acabou de entrar na index.html vindo de outra página com "#sobre" na URL,
  // fazemos o scroll suave iniciar assim que a página carregar.
  if (window.location.hash) {
    const hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      // Pequeno timeout de 100ms apenas para garantir que o layout responsivo renderizou
      setTimeout(function () {
        const targetPosition =
          hashTarget.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth", // Usa a rolagem nativa do navegador para a chegada externa
        });
      }, 100);
    }
  }
});
// ------------- //

document.addEventListener("DOMContentLoaded", function () {
  /* ==========================================================================
     1. ROLAGEM SUAVE INTELIGENTE COMPATÍVEL ENTRE PÁGINAS E MENUS MOBILE
     ========================================================================== */
  document.addEventListener("click", function (e) {
    const anchor = e.target.closest("a");
    if (!anchor || !anchor.getAttribute("href")) return;

    const href = anchor.getAttribute("href");

    if (href.includes("#")) {
      const partes = href.split("#");
      const paginaDestino = partes[0]; // Ex: "index.html" ou vazio ""
      const targetId = "#" + partes[1]; // Ex: "#sobre"

      if (targetId === "#") return;

      const paginaAtual = window.location.pathname.split("/").pop();
      const targetElement = document.querySelector(targetId);

      // Se o link aponta para outra página ou se o elemento não existe na página atual,
      // deixa o navegador trocar de página normalmente.
      if (
        !targetElement ||
        (paginaDestino !== "" &&
          paginaDestino !== paginaAtual &&
          !window.location.href.includes(paginaDestino))
      ) {
        return;
      }

      // Caso o elemento exista na página atual, faz o scroll suave customizado
      e.preventDefault();

      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;

      const duration = 1400; // Tempo do scroll suave (1.4 segundos)
      let start = null;

      function customScrollAnimation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;

        const t = Math.min(timeElapsed / duration, 1);
        const intensidadeMeio = 3.0; // Velocidade fluida no meio da animação

        const progress =
          t < 0.5
            ? Math.pow(t * 2, intensidadeMeio) / 2
            : 1 - Math.pow((1 - t) * 2, intensidadeMeio) / 2;

        window.scrollTo(0, startPosition + distance * progress);

        if (timeElapsed < duration) {
          requestAnimationFrame(customScrollAnimation);
        }
      }

      requestAnimationFrame(customScrollAnimation);
    }
  });

  // Tratamento extra: Se o usuário veio de OUTRA página direto para um link com # hash
  if (window.location.hash) {
    const hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      setTimeout(function () {
        const targetPosition =
          hashTarget.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }, 100);
    }
  }

  /* ==========================================================================
     2. CONTADOR PROGRESSIVO E SINCRONIZAÇÃO BASEADA EM TEMPO REAL (REALISTA)
     ========================================================================== */
  const cardsTecnicos = document.querySelectorAll(".card-tecnico");

  cardsTecnicos.forEach(function (card) {
    const contador = card.querySelector(".numero-animado");
    const barraProgresso = card.querySelector(".bg-esquerda-direita");
    if (!contador) return;

    const tipo = card.getAttribute("data-tipo"); // 'inteiro' ou 'decimal'
    const valorFinal = parseFloat(contador.getAttribute("data-target"));

    let valorAtual = 0;
    let idAnimacao = null;
    let tempoInicial = null;
    let valorNoMomentoDaSaida = 0;

    // ⏱️ DURAÇÃO DA ANIMAÇÃO DOS INTEIROS (Potência e Velocidade)
    // Como potência não são segundos reais, definimos um tempo fixo de exibição (ex: 800ms)
    const duracaoInteiro = 800;

    // Se for decimal (0-100 km/h), a duração em milissegundos é o próprio valor final * 1000!
    const duracaoTotalMs =
      tipo === "decimal" ? valorFinal * 1000 : duracaoInteiro;

    // Função interna que faz o número SUBIR baseado no relógio do sistema
    function subirNumero(tempoAtual) {
      if (!tempoInicial) tempoInicial = tempoAtual;

      // Quanto tempo se passou desde o início do hover
      const tempoDecorrido = tempoAtual - tempoInicial;

      // Fração do progresso (vai de 0 a 1)
      const progresso = Math.min(tempoDecorrido / duracaoTotalMs, 1);

      valorAtual = progresso * valorFinal;

      if (tipo === "decimal") {
        contador.innerText = valorAtual.toFixed(1);
        if (barraProgresso) {
          barraProgresso.style.width = progresso * 100 + "%";
        }
      } else {
        contador.innerText = Math.floor(valorAtual);
      }

      if (progresso < 1) {
        idAnimacao = requestAnimationFrame(subirNumero);
      } else {
        // Força os valores exatos no frame final
        contador.innerText =
          tipo === "decimal" ? valorFinal.toFixed(1) : valorFinal;
        if (barraProgresso) barraProgresso.style.width = "100%";
      }
    }

    // Função interna que faz o número DESCER de forma fluida ao tirar o mouse
    // Função interna que faz o número DESCER de forma fluida ao tirar o mouse
    function descerNumero(tempoAtual) {
      if (!tempoInicial) tempoInicial = tempoAtual;

      const tempoDecorrido = tempoAtual - tempoInicial;

      // 🏎️ Sincronizado: Dividindo por 4 para a descida ser quatro vezes mais rápida que a subida!
      const duracaoDescida = duracaoTotalMs / 4;
      const progresso = Math.min(tempoDecorrido / duracaoDescida, 1);

      // Diminui a partir do valor que o card estava quando o mouse saiu
      valorAtual = valorNoMomentoDaSaida * (1 - progresso);

      if (tipo === "decimal") {
        if (valorAtual <= 0.05) valorAtual = 0; // Evita bugs de arredondamento negativo
        contador.innerText = valorAtual.toFixed(1);
        if (barraProgresso) {
          barraProgresso.style.width = (valorAtual / valorFinal) * 100 + "%";
        }
      } else {
        contador.innerText = Math.floor(valorAtual);
        // Aplica o efeito visual do fundo descendo rápido também para Potência/Velocidade
        if (card.querySelector(".bg-baixo-cima")) {
          card.querySelector(".bg-baixo-cima").style.height =
            (valorAtual / valorFinal) * 100 + "%";
        }
      }

      if (progresso < 1 && valorAtual > 0) {
        idAnimacao = requestAnimationFrame(descerNumero);
      } else {
        contador.innerText = tipo === "decimal" ? "0.0" : "0";
        if (barraProgresso) barraProgresso.style.width = "0%";
        if (card.querySelector(".bg-baixo-cima"))
          card.querySelector(".bg-baixo-cima").style.height = "0%";
      }
    } // Eventos do mouse
    card.addEventListener("mouseenter", function () {
      cancelAnimationFrame(idAnimacao);
      tempoInicial = null; // Reseta o cronômetro para iniciar a subida
      idAnimacao = requestAnimationFrame(subirNumero);
    });

    card.addEventListener("mouseleave", function () {
      cancelAnimationFrame(idAnimacao);
      tempoInicial = null; // Reseta o cronômetro para iniciar a descida
      valorNoMomentoDaSaida = valorAtual; // Salva onde o número parou para descer dali
      idAnimacao = requestAnimationFrame(descerNumero);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 1. ROLAGEM SUAVE INTELIGENTE
  document.addEventListener("click", function (e) {
    const anchor = e.target.closest("a");
    if (!anchor || !anchor.getAttribute("href")) return;
    const href = anchor.getAttribute("href");
    if (href.includes("#")) {
      const partes = href.split("#");
      const paginaDestino = partes[0];
      const targetId = "#" + partes[1];
      if (targetId === "#") return;
      const paginaAtual = window.location.pathname.split("/").pop();
      const targetElement = document.querySelector(targetId);
      if (
        !targetElement ||
        (paginaDestino !== "" &&
          paginaDestino !== paginaAtual &&
          !window.location.href.includes(paginaDestino))
      )
        return;
      e.preventDefault();
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1400;
      let start = null;
      function customScrollAnimation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const t = Math.min(timeElapsed / duration, 1);
        const intensidadeMeio = 3.0;
        const progress =
          t < 0.5
            ? Math.pow(t * 2, intensidadeMeio) / 2
            : 1 - Math.pow((1 - t) * 2, intensidadeMeio) / 2;
        window.scrollTo(0, startPosition + distance * progress);
        if (timeElapsed < duration)
          requestAnimationFrame(customScrollAnimation);
      }
      requestAnimationFrame(customScrollAnimation);
    }
  });

  // 2. CARREGAR DADOS DO JSON
  fetch("carros.json")
    .then((response) => response.json())
    .then((dadosCarros) => {
      const containerVitrine = document.getElementById("container-vitrine");
      const containerCatalogo = document.getElementById("container-catalogo");

      if (containerVitrine) {
        const carrosDestaque = dadosCarros.filter(
          (carro) => carro.destaque === true,
        );
        renderizarCards(carrosDestaque, containerVitrine);
      } else if (containerCatalogo) {
        renderizarCards(dadosCarros, containerCatalogo);
      }

      // Ativa a inteligência da pesquisa indepedente da página que o usuário está!
      configurarPesquisa();
      inicializarAnimacoes();
    })
    .catch((error) => console.error("Erro ao carregar o arquivo JSON:", error));

  // 3. RENDERIZADOR DOS CARDS (Monta o HTML baseado no seu CSS e propriedades extras)
  function renderizarCards(listaCarros, containerAlvo) {
    let htmlGerado = "";

    listaCarros.forEach((carro) => {
      htmlGerado += `
        <div class="col-12 col-md-6 col-lg-4 p-2 item-carro" 
             data-marca="${carro.marca}" 
             data-modelo="${carro.modelo}" 
             data-ano="${carro.ano}" 
             data-motor="${carro.motor}"
             data-potencia="${carro.potencia}" 
             data-velocidade="${carro.velocidadeMax}"
             data-tracao="${carro.tracao}"
             data-zeroa100="${carro.zeroA100}"
             data-preco="${carro.precoFiltro}"
             data-precomax="${carro.precoFiltroMax}">
             
          <div class="card card-carros text-start">
            <img src="${carro.imagem}" alt="${carro.modelo}" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title mb-1" style="font-weight: bold; color: var(--text-headline);">${carro.marca} ${carro.modelo}</h5>
              
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span style="font-size: 0.85rem; color: var(--text-subtle);">${carro.ano.split(" ").pop()}</span>
                <span style="color: var(--accent-spotlight); font-weight: bold; font-size: 0.95rem;">${carro.precoTexto}</span>
              </div>
              
              <div style="font-size: 0.8rem; color: var(--text-details); border-top: 1px solid var(--border-light); padding-top: 8px; margin-bottom: 12px;">
                <div><strong>Motor:</strong> ${carro.motor}</div>
                <div><strong>Tração:</strong> ${carro.tracao}</div>
              </div>

              <div class="row g-2 mt-2">
                <div class="col-4">
                  <div class="card p-2 text-center sub-card card-tecnico" data-tipo="inteiro">
                    <div class="bg-progresso bg-baixo-cima"></div>
                    <div class="conteudo-card">
                      <small class="titulo-tecnico">POTÊNCIA</small>
                      <div class="bloco-numero">
                        <strong class="numero-animado" data-target="${carro.potencia}">0</strong><span class="unidade"> cv</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="col-4">
                  <div class="card p-2 text-center sub-card card-tecnico" data-tipo="inteiro">
                    <div class="bg-progresso bg-baixo-cima"></div>
                    <div class="conteudo-card">
                      <small class="titulo-tecnico">VEL. MAX</small>
                      <div class="bloco-numero">
                        <strong class="numero-animado" data-target="${carro.velocidadeMax}">0</strong><span class="unidade"> km/h</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="col-4">
                  <div class="card p-2 text-center sub-card card-tecnico" data-tipo="decimal">
                    <div class="bg-progresso bg-esquerda-direita"></div>
                    <div class="conteudo-card">
                      <small class="titulo-tecnico">0 a 100</small>
                      <div class="bloco-numero">
                        <strong class="numero-animado" data-target="${carro.zeroA100}">0.0</strong><span class="unidade">s</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      `;
    });

    containerAlvo.innerHTML = htmlGerado;
  }

  // 4. SISTEMA DE ANIMAÇÃO DOS CONTADORES E BARRAS (Alinhado com o seu CSS)
  function inicializarAnimacoes() {
    const cardsTecnicos = document.querySelectorAll(".card-tecnico");

    cardsTecnicos.forEach(function (card) {
      const contador = card.querySelector(".numero-animado");
      const barraHorizontal = card.querySelector(".bg-esquerda-direita");
      const barraVertical = card.querySelector(".bg-baixo-cima");
      if (!contador) return;

      const tipo = card.getAttribute("data-tipo");
      const valorFinal = parseFloat(contador.getAttribute("data-target"));

      let valorAtual = 0;
      let idAnimacao = null;
      let tempoInicial = null;
      let valorNoMomentoDaSaida = 0;

      const duracaoInteiro = 450;
      const duracaoTotalMs =
        tipo === "decimal" ? valorFinal * 1000 : duracaoInteiro;

      function subirNumero(tempoAtual) {
        if (!tempoInicial) tempoInicial = tempoAtual;
        const tempoDecorrido = tempoAtual - tempoInicial;
        const progresso = Math.min(tempoDecorrido / duracaoTotalMs, 1);

        valorAtual = progresso * valorFinal;

        if (tipo === "decimal") {
          contador.innerText = valorAtual.toFixed(1);
          if (barraHorizontal)
            barraHorizontal.style.width = progresso * 100 + "%";
        } else {
          contador.innerText = Math.floor(valorAtual);
          if (barraVertical) barraVertical.style.height = progresso * 100 + "%";
        }

        if (progresso < 1) {
          idAnimacao = requestAnimationFrame(subirNumero);
        } else {
          contador.innerText =
            tipo === "decimal" ? valorFinal.toFixed(1) : valorFinal;
          if (barraHorizontal) barraHorizontal.style.width = "100%";
          if (barraVertical) barraVertical.style.height = "100%";
        }
      }

      function descerNumero(tempoAtual) {
        if (!tempoInicial) tempoInicial = tempoAtual;
        const tempoDecorrido = tempoAtual - tempoInicial;
        const duracaoDescida = duracaoTotalMs / 3;
        const progresso = Math.min(tempoDecorrido / duracaoDescida, 1);

        valorAtual = valorNoMomentoDaSaida * (1 - progresso);

        if (tipo === "decimal") {
          if (valorAtual <= 0.05) valorAtual = 0;
          contador.innerText = valorAtual.toFixed(1);
          if (barraHorizontal)
            barraHorizontal.style.width = (valorAtual / valorFinal) * 100 + "%";
        } else {
          contador.innerText = Math.floor(valorAtual);
          if (barraVertical)
            barraVertical.style.height = (valorAtual / valorFinal) * 100 + "%";
        }

        if (progresso < 1 && valorAtual > 0) {
          idAnimacao = requestAnimationFrame(descerNumero);
        } else {
          contador.innerText = tipo === "decimal" ? "0.0" : "0";
          if (barraHorizontal) barraHorizontal.style.width = "0%";
          if (barraVertical) barraVertical.style.height = "0%";
        }
      }

      card.addEventListener("mouseenter", function () {
        cancelAnimationFrame(idAnimacao);
        tempoInicial = null;
        idAnimacao = requestAnimationFrame(subirNumero);
      });

      card.addEventListener("mouseleave", function () {
        cancelAnimationFrame(idAnimacao);
        tempoInicial = null;
        valorNoMomentoDaSaida = valorAtual;
        idAnimacao = requestAnimationFrame(descerNumero);
      });
    });
  }

  // 5. SISTEMA DE FILTRO DA BARRA DE PESQUISA (Busca Dinâmica por Intervalo de Preço)
  function configurarPesquisa() {
    const formBusca = document.querySelector('form[role="search"]');
    const barraPesquisa = document.querySelector(".input-search");
    const containerCatalogo = document.getElementById("container-catalogo");

    if (!barraPesquisa) return;

    // Captura parâmetro da URL (caso o usuário venha pesquisando lá da index.html)
    const parametros = new URLSearchParams(window.location.search);
    const termoDaUrl = parametros.get("busca");

    if (termoDaUrl && containerCatalogo) {
      barraPesquisa.value = termoDaUrl;
      setTimeout(() => {
        executarFiltro(termoDaUrl);
      }, 100);
    }

    // Função interna que processa a lógica de esconder/mostrar os cards
    function executarFiltro(termo) {
      const termoOriginal = termo.toLowerCase().trim();
      let termoNumerico = null;
      let termoLimpo = termoOriginal.replace(",", ".");

      // Transforma o texto digitado em número real (Ex: "4m" ou "4.1" vira 4000000)
      if (termoLimpo !== "") {
        if (termoLimpo.endsWith("m") || termoLimpo.includes("m")) {
          const apenasNumero = parseFloat(termoLimpo.replace("m", "").trim());
          if (!isNaN(apenasNumero)) termoNumerico = apenasNumero * 1000000;
        } else {
          const numeroSeco = parseFloat(termoLimpo);
          if (!isNaN(numeroSeco)) {
            if (numeroSeco < 100) termoNumerico = numeroSeco * 1000000;
            else termoNumerico = numeroSeco;
          }
        }
      }

      const carros = document.querySelectorAll(".item-carro");

      carros.forEach(function (carro) {
        const marca = carro.getAttribute("data-marca").toLowerCase();
        const modelo = carro.getAttribute("data-modelo").toLowerCase();
        const ano = carro.getAttribute("data-ano").toLowerCase();
        const motor = carro.getAttribute("data-motor").toLowerCase();
        const potencia = carro.getAttribute("data-potencia").toLowerCase();
        const velocidade = carro.getAttribute("data-velocidade").toLowerCase();
        const tracao = (carro.getAttribute("data-tracao") || "").toLowerCase();
        const zeroA100 = (
          carro.getAttribute("data-zeroa100") || ""
        ).toLowerCase();

        // Pega os limites de preço mínimo e máximo que injetamos no HTML do card
        const precoMin = parseFloat(carro.getAttribute("data-preco"));
        const precoMax = parseFloat(carro.getAttribute("data-precomax"));

        // Validação dos filtros de texto normais (marca, modelo, motor...)
        let corresponde =
          marca.includes(termoOriginal) ||
          modelo.includes(termoOriginal) ||
          ano.includes(termoOriginal) ||
          motor.includes(termoOriginal) ||
          potencia.includes(termoOriginal) ||
          velocidade.includes(termoOriginal) ||
          tracao.includes(termoOriginal) ||
          zeroA100.includes(termoOriginal);

        // VALIDAÇÃO MATEMÁTICA: Vê se o valor pesquisado está DENTRO do intervalo do carro
        if (termoNumerico !== null && !isNaN(precoMin) && !isNaN(precoMax)) {
          if (termoNumerico >= precoMin && termoNumerico <= precoMax) {
            corresponde = true;
          }
        }

        // Aplica o display correspondente
        carro.style.display =
          corresponde || termoOriginal === "" ? "block" : "none";
      });
    }

    // Evento para filtrar em tempo real na página do catálogo
    barraPesquisa.addEventListener("input", function (e) {
      if (containerCatalogo) executarFiltro(e.target.value);
    });

    // Evento para interceptar o Submit do formulário (Botão Buscar ou Enter)
    if (formBusca) {
      formBusca.addEventListener("submit", function (e) {
        e.preventDefault();
        const termoDigitado = barraPesquisa.value.trim();

        if (containerCatalogo) {
          executarFiltro(termoDigitado);
        } else {
          // Se estiver na Home, manda para o catálogo passando o termo na URL
          window.location.href = `catalogo.html?busca=${encodeURIComponent(termoDigitado)}`;
        }
      });
    }
  }
});
