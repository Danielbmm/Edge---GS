alert("Seja Bem Vindo")

let botao = document.getElementById('botao')
let form = document.getElementById('form')



form.addEventListener("submit", function(){
    let nome = document.getElementById('nome').value
    let telefone = document.getElementById('telefone').value
    let email = document.getElementById('email').value
    if(nome == ""){
        alert("Preencha o campo nome")
      console.log("Preencha o campo nome")
    }
    else if(telefone = ""){
        alert("Preencha o campo telefone")
      console.log("preencha o compo telefone")
    }
    else if(email == ""){
        alert("Preencha o campo email")
      console.log("Preencha o campo email")
    }


}) 


