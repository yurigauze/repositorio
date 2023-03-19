const form = document.querySelector("form");
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const repositorio = document.querySelector("#repositorio").value;
    const dataInicial = document.querySelector("#dataInicial").value;
    const dataFinal = document.querySelector("#dataFinal").value;
    //console.log(repositorio + " " + dataInicial + " " + dataFinal);
    buscarCommits(repositorio, dataInicial, dataFinal);
});

function extrairUsuarioRepositorio(linkGithub) {
    // extrair apenas a parte do link após "github.com/"
    const partesLink = linkGithub.split("github.com/")[1];
    document.getElementById("teste").innerHTML = partesLink;
    
    // extrair o usuário e o nome do repositório utilizando expressões regulares
    const regexUsuarioRepositorio = /^(.+)\/(.+)\.git$/;
    const match = partesLink.match(regexUsuarioRepositorio);
  
    // se o link estiver em um formato inválido, retornar null
    if (!match || match.length !== 3) {
      return null;
    }
  
    var teste = `${match[1]}/${match[2]}`;
    // retornar a string no formato "usuário/nome_do_repositório"
    document.getElementById("teste").innerHTML = teste;
    
  }

function buscarCommits(repositorio, dataInicial, dataFinal) {
    // Colocar no final da URL ? caso queira colocar mais parâmetros
    // Para separar os parâmetros, utilizar &
    // per_page = 100: demostra o máximo de itens que aparecem na página
    const url = `https://api.github.com/repos/${repositorio}/commits?since=${dataInicial}&until=${dataFinal}&per_page=100`;

    //Assíncrona: não vai travar a página. Caso exista uma resposta dessa chamada, ele vai executar o que tem dentro do then enquanto a execução da página continua.
    fetch(url).then(response => response.json()).then(commits => {
        // Demonstra no console do navegador os commits
        console.log(commits);
        contarCommits(commits);
    }).catch(error => {
        console.log(error);
    });
    console.log(new Date());
}

function contarCommits(commits) {
    const commitsPorDia = {};
    commits.forEach(element => {
        // Procurará a data dentro do objeto
        // date.substr(0,10): pegará apenas a data, ou seja, sem a hora
        const dataCommit = element.commit.author.date.substr(0, 10);

        // Verifica se existe dentro desse objeto esse atributo
        if (commitsPorDia[dataCommit]) {
            commitsPorDia[dataCommit].quantidade++;
        }
        // Caso não existe, eu crio a quantidade = 1 e com a data do commit
        else {
            commitsPorDia[dataCommit] = { quantidade: 1, data: dataCommit };
        }
    });

    console.log(commitsPorDia);

    const commitsPorDiaArray = Object.keys(commitsPorDia).map(dataCommit => {
        return { data: dataCommit, quantidade: commitsPorDia[dataCommit].quantidade };
    })
    console.log(commitsPorDiaArray);
    mostrarTela(commitsPorDiaArray);
}

function mostrarTela(commits) {
    const dados = document.querySelector("#dados");

    commits.forEach(element => {
        const h1 = document.createElement("h1");
        h1.innerHTML = element.data + " - " + element.quantidade;
        dados.appendChild(h1);
    });

}

function validarCampoVazio(campo) {
    if (campo.value === '') {
        campo.style.border = '2px solid red';
    } else {
        campo.style.border = '';
    }
}