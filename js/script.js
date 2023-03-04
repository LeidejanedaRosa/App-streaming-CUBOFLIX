const input = document.querySelector(".input");
const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");
const btnTheme = document.querySelector(".btn-theme");
const root = document.querySelector(":root");

let filmes = [];

async function dadosDosFilmes() {
    const { data } = await api.get("discover/movie?language=pt-BR&include_adult=false");
    let resultsLista = data.results;

    let pag1 = []
    let pag2 = []
    let pag3 = []

    for (let index = 0; index < resultsLista.length - 2; index++) {
        if (index < 6) {
            pag1.push(resultsLista[index]);
        } else if (index < 12) {
            pag2.push(resultsLista[index]);
        } else {
            pag3.push(resultsLista[index]);
        }

    }
    filmes.push(pag1, pag2, pag3);
    criarCards(filmes[0]);
}

dadosDosFilmes()


function criarCards(pag) {

    const movies = document.querySelector(".movies");
    movies.innerHTML = "";

    for (const filme of pag) {
        const movie = document.createElement("div")
        movie.classList.add("movie");
        movie.style.backgroundImage = `url(${filme.poster_path})`;
        movie.id = filme.id;

        const divMovieInfo = document.createElement("div");
        divMovieInfo.classList.add("movie__info");

        const spanMovieTitle = document.createElement("span");
        spanMovieTitle.classList.add("movie__title");
        spanMovieTitle.innerText = filme.title;

        const spanMovieRating = document.createElement("span");
        spanMovieRating.classList.add("movie__rating")
        spanMovieRating.innerText = filme.vote_average;

        const img = document.createElement("img");
        img.src = "./assets/estrela.svg"
        img.alt = "Estrela";

        movies.append(movie);
        movie.append(divMovieInfo);
        divMovieInfo.append(spanMovieTitle, spanMovieRating);
        spanMovieRating.append(img);

        movie.addEventListener("click", (event) => {
            if (event.target.id.length > 1) {
                abrirModal(event.target.id);
            }
        })
    }

}

let paginaAtual = 0

function proximaPagina() {

    if (paginaAtual < 2) {
        paginaAtual++;
    } else {
        paginaAtual = 0;
    }

    criarCards(filmes[paginaAtual]);
}

function paginaAnterior() {
    if (paginaAtual !== 0) {
        paginaAtual--;
    } else {
        paginaAtual = 2;
    }

    criarCards(filmes[paginaAtual]);
}

btnNext.addEventListener('click', proximaPagina);
btnPrev.addEventListener('click', paginaAnterior);

async function buscarFilme() {
    if (!input.value) {
        return dadosDosFilmes();
    }

    filmes = [];

    const respostaInput = await api.get(`search/movie?language=pt-BR&include_adult=false&query=${input.value}`);

    let lista = respostaInput.data.results;

    let pag1 = []
    let pag2 = []
    let pag3 = []

    for (let index = 0; index < lista.length - 2; index++) {
        if (index < 6) {
            pag1.push(lista[index]);
        } else if (index < 12) {
            pag2.push(lista[index]);
        } else {
            pag3.push(lista[index]);
        }

    }
    filmes.push(pag1, pag2, pag3);
    dadosDosFilmes();
    criarCards(filmes[0]);
}

input.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        buscarFilme()
    }

})

async function abrirModal(id) {
    const respostaCard = await api.get(`movie/${id}?language=pt-BR`);
    const modal = document.querySelector(".modal");
    const modalBody = document.querySelector(".modal__body");

    modal.classList.remove("hidden");
    const modalTitle = document.querySelector(".modal__title");
    const modalImg = document.querySelector(".modal__img");
    const modalDescription = document.querySelector(".modal__description");
    const modalGenreAverage = document.querySelector(".modal__average");
    const mondalGenres = document.querySelector(".modal__genres");


    modalTitle.innerText = respostaCard.data.title;
    modalImg.src = respostaCard.data.backdrop_path;
    modalDescription.innerText = respostaCard.data.overview;
    modalGenreAverage.innerText = respostaCard.data.vote_average.toFixed(1);
    mondalGenres.innerText = "";

    for (const genero of respostaCard.data.genres) {
        const generoModal = document.createElement("span");
        generoModal.innerText = genero.name;
        generoModal.classList.add("modal__genre");
        mondalGenres.append(generoModal);
    }

    modalBody.addEventListener("click", () => {
        modal.classList.add("hidden");
    })

}

async function filmeDoDia() {
    const genero = [];
    const filme = await api.get('movie/436969?language=pt-BR');
    const respostaDoFilme = filme.data;

    for (const item of respostaDoFilme.genres) {
        genero.push(item.name);
    }
    const highlightVideo = document.querySelector(".highlight__video");
    const highlightTitle = document.querySelector(".highlight__title");
    const highlightRating = document.querySelector(".highlight__rating");
    const highlightGenres = document.querySelector(".highlight__genres");
    const highlightLaunche = document.querySelector(".highlight__launch");
    const highlightDescription = document.querySelector(".highlight__description");
    const highlightLinkVideo = document.querySelector(".highlight__video-link");

    highlightVideo.style.backgroundImage = `url(${respostaDoFilme.backdrop_path})`;
    highlightVideo.style.backgroundSize = 'cover';
    highlightTitle.textContent = respostaDoFilme.title;
    highlightRating.textContent = respostaDoFilme.vote_average.toFixed(1);
    highlightVideo.style.backgroundImage = respostaDoFilme.backdrop_path;
    highlightGenres.textContent = genero.join(", ");
    highlightLaunche.textContent = respostaDoFilme.release_date;
    highlightDescription.textContent = respostaDoFilme.overview;


    const videoLink = await api.get('movie/436969/videos?language=pt-BR');
    const respostaVideoLink = videoLink.data.results[1].key;

    highlightLinkVideo.addEventListener("click", () => {
        highlightLinkVideo.href = "https://www.youtube.com/watch?v=" + respostaVideoLink;
    })

}
filmeDoDia();

const imgLogo = document.createElement("img");
const btnFecharModal = document.querySelector(".modal__close");

function temaAtual() {
    if (localStorage.theme === "light" || !localStorage.theme) {
        modoLuz();
    } else {
        modoEscuro();
    }
}
function mudarOTema() {
    if (localStorage.theme === "dark") {
        modoLuz();
        theme = "light";
        localStorage.setItem("theme", "light");
    } else {
        modoEscuro();
        theme = "dark";
        localStorage.setItem("theme", "dark");
    }
}
function modoEscuro() {
    imgLogo.src = "./assets/logo.svg";
    btnTheme.src = "./assets/dark-mode.svg";
    btnPrev.src = "./assets/arrow-left-light.svg";
    btnNext.src = "./assets/arrow-right-light.svg";
    root.style.setProperty("--background", "#000000");
    root.style.setProperty("--input-color", "#3E434D");
    root.style.setProperty("--text-color", "#FFFFFF");
    root.style.setProperty("--bg-secondary", "#2D3440");
    btnFecharModal.src = "./assets/close.svg";
}
function modoLuz() {
    imgLogo.src = "./assets/logo-dark.png";
    btnTheme.src = "./assets/light-mode.svg";
    btnPrev.src = "./assets/arrow-left-dark.svg";
    btnNext.src = "./assets/arrow-right-dark.svg";
    root.style.setProperty("--background", "#fff");
    root.style.setProperty("--input-color", "#979797");
    root.style.setProperty("--text-color", "#1b2028");
    root.style.setProperty("--bg-secondary", "#ededed");
    btnFecharModal.src = "./assets/close-dark.svg";
}
btnTheme.addEventListener("click", () => {
    mudarOTema();
});
