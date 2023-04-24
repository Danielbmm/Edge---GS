let test=confirm("Vamos conhecer sobre vinho")

let pergunta1 =(prompt("1) O vinho precisa ser guardado na horizontal ou na vertical?"))

if (pergunta1 === "horizontal"){
      document.write("1) A resposta está correta pois é na ", pergunta1, " que se guarda o vinho")
      document.write("<br><br>")
      
}else{(pergunta1 === "vertical")
      document.write("1) A resposta está errada, a resposta correta seria na horizontal")
      document.write("<br><br>")
}

let pergunta2 =(prompt("2) O vinho precisa respirar ou ser oxigenado para o sabor suavizar?"))

if(pergunta2 === "sim"){
      document.write("2) Para o vinho suavizar ele precisa sim respirar ou ser oxigenado")
      document.write("<br><br>")

}else{(pergunta2 === "não")
      document.write("2) A resposta está errada pois para o sabor suavizar ele precisar respirar")
      document.write("<br><br>")
}

let pergunta3 =(prompt("3) Um vinho pode durar 1 mês após ser aberto?"))

if(pergunta3 ==="não"){
      Document.write("3) A resposta está correta, pois um vinho dura entre 5 a 7 dias após ser aberto")
      document.write("<br><br>")

}else{(pergunta3 === "sim")
      document.write("3) A resposta está errada pois um vinho não dura 1 mês após ser aberto")
}



