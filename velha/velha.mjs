import  {rede} from "./perceptron.mjs";
import * as rl from "readline-sync"
import fs from "fs"
const brain = new rede(9,50,9)
brain.lr = 0.25
var bot =  "O"
var player= "X"
const repeatTrain = 20;
var mesaAtual =  [
	0,0,0,
	0,0,0,
	0,0,0
]

var bancoDeDados = []

bancoDeDados= JSON.parse(fs.readFileSync("./velhaData.dt",'utf8'))

function drawTable(){
	let index = 0
	let linhaT = ""
	console.log("   A B C")
	for(let coluna = 0; coluna < 3 ; coluna++){
		linhaT =  "."+(coluna+1)+" "
		for(let linha = 0; linha < 3 ; linha++){
			if(mesaAtual[index] == 1){
				linhaT+=bot+" "
			}
			if(mesaAtual[index] == -1){
				linhaT+=player+" "
			}
			if(mesaAtual[index] == 0){			
				linhaT+= "  "
				
			}
			//console.log(mesaAtual[index])

			index++;
		}	
		console.log(linhaT)

	}

}
var taxaDeAcertos = 0;
function testar(){
	let a = 0;
		for(let x of bancoDeDados){
			let r = brain.process(x[0])
			let maxIndex =  r.indexOf(Math.max(...r))
			let maxIndexEsperado =  x[1].indexOf(Math.max(...x[1]))
			if(maxIndex === maxIndexEsperado){
				a++
			}
		}		
		taxaDeAcertos= (a*100/bancoDeDados.length)
}

function treinar(){
	for(let t = 0; t < repeatTrain;t++){
		for(let x of bancoDeDados){
			brain.train(x[0].map(x => x*-1),x[1])
			
		}	
		console.log(t*100/repeatTrain, " ", taxaDeAcertos)
		
	}
	testar()
}
function verificarGanhador(){
	let m = mesaAtual;
	if(m[0] !== 0 && m[0] == m[1] && m[1] == m[2]){
		let g = (m[1] > 0) ? "BOT" : "PLAYER" ;
		console.log(g+" ganhou !!")
		return true;
	}
	if(m[3] !== 0 && m[3] == m[4] && m[4] == m[5]){
		let g = (m[4] > 0) ? "BOT" : "PLAYER" ;
		console.log(g+" ganhou !!")
		return true;
	}
	if(m[6] !== 0 && m[6] == m[7] && m[7] == m[8]){
		let g = (m[7] > 0) ? "BOT" : "PLAYER" ;
		console.log(g+" ganhou !!")
		return true;
	}



	if(m[0] !== 0 && m[0] == m[3] && m[3] == m[6]){
		let g = (m[3] > 0) ? "BOT" : "PLAYER" ;
		console.log(g+" ganhou !!")
		return true;
	}
	if(m[1] !== 0 && m[1] == m[4] && m[4] == m[7]){
		let g = (m[4] > 0) ? "BOT" : "PLAYER" ;
		console.log(g+" ganhou !!")
		return true;
	}
	if(m[2] !== 0 && m[2] == m[5] && m[5] == m[8]){
		let g = (m[5] > 0) ? "BOT" : "PLAYER" ;
		console.log(g+" ganhou !!")
		return true;
	}



	if(m[0] !== 0 && m[0] == m[4] && m[4] == m[8]){
		let g = (m[4] > 0) ? "BOT" : "PLAYER" ;
		console.log(g+" ganhou !!")
		return true;
	}
	if(m[2] !== 0 && m[2] == m[4] && m[4] == m[6]){
		let g = (m[4] > 0) ? "BOT" : "PLAYER" ;
		console.log(g+" ganhou !!")
		return true;
	}







	return false;
}
function predict(){
	let r = brain.process(mesaAtual.map(x => x*-1));
	let matriz =  mesaAtual.map(function(a){
		if(a == 0){
			return 1;
		}else{
			return 0;
		}
	})

	let rr =  r.map(function(a,i){
		return a * matriz[i];
	})

	let maxIndex =  rr.indexOf(Math.max(...rr));
	let saidaLimpa = new Array(9).fill(0)
	mesaAtual[maxIndex] = 1;
	//console.log(rr)
	//console.log(maxIndex,rr[maxIndex])
}
function predictt(){
	let r = brain.process(mesaAtual);
	let rCopy =  Object.assign([],r)
	//console.log(rCopy)
	while(true){
	if(rCopy.length == 0) break;
	let maior =  Math.max(...rCopy);
	let index =  r.indexOf(maior);
	let indexC =  rCopy.indexOf(maior);

	if(mesaAtual[index] == 0){
		mesaAtual[index] = 1;
		break;
	}else{
		
	    rCopy.splice(indexC,1);

	}	
	//console.log(rCopy)
	}
}
function verificarMesCheia(){
	let n  = 0;
	mesaAtual.map(function (v){
		if(v == 0){
			n++;
		}
	})
	if(n == 0){
		return true;
	}
	return false;
}		
function save(){
		try{
		fs.writeFileSync("./velhaData.dt",JSON.stringify(bancoDeDados),"utf8")
		console.log("save")
	
		}catch(err){
			throw "error:"+err
		}

}
function clear(){
		process.stdout.write("\x1Bc")

}
while(true){
	clear()
	console.log("VELHA___________________________________________________")

	drawTable()
	console.log("________________________________________________________")

	console.log(bancoDeDados.length,taxaDeAcertos)
	console.log(brain.process(mesaAtual))
	console.log("________________________________________________________")
	let res =rl.question("aplicar X onde ?")
	let s =  res.trim().split("")
	if(res.length == 0) continue;
	if(s[0] == "s"){
		save()
		continue;
	}
	if(s[0] == "t"){
		clear()
		console.log("TREINANDO..")
		treinar()
		continue;
	}
	if(s[0] == "es"){
		save();
		break;
	}
	if(s[0] =="o"){
		clear()
		console.log("TESTANDO REDE")
		testar()
		continue;
	}
	if(s[0] == "e"){
		break;
	}
	let letras = ["a","b","c"];
	let num =  ["1","2","3"];
	let indexL1 = letras.indexOf(s[0]);
	let indexN1 = num.indexOf(s[1]);
	//console.log(indexN1,indexL1)
	let index = (indexN1*3)+indexL1
	//console.log(index)
	if(mesaAtual[index] !== 0) continue;	
	//_________________________________________________
	let malha =  new Array(9).fill(0)
	malha[index] = 1;
	
	bancoDeDados.push([mesaAtual,malha])
	
	//if(bancoDeDados.length > 5) bancoDeDados.shift();
	//_________________________________________________

	
	mesaAtual[index] = -1;
	if(verificarGanhador()){
		mesaAtual.fill(0);
		
	}else
	if(verificarMesCheia()){
		console.log("VELHA!!")
		mesaAtual.fill(0)
	
	}else{
		predict()	
	}
	
}
