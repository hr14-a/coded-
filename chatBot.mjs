//chatbot usando rede neural artificial
import fs from "fs"
import * as rl from "readline-sync"
import {graphic} from "./graphic.mjs"
import {rede} from "./perceptron.mjs"

const pick = (min,max) => {return Math.floor(Number((Math.random()*(max-min)+min).toFixed(2)))};
const max =  (n,m) => (n > m) ? m : n;
const min =  (n,m) => (n < m) ? m : n;
const color = (t,c=92) => {return  "\x1b["+c+"m"+t+"\x1b[0m"}
const ranp = () => {return [pick(1500,6000),pick(1,4),pick(200,5000)]} 
	

const CONFIANCE2 = 0.55;
const CONFIANCE = 0.75
const TRAIN_LOOP = 1000;



//criar sacola;
var globalBag = [];
var frazesParaTreinar = JSON.parse(fs.readFileSync("./chat.data","utf8"))

for(var f of frazesParaTreinar){
	let frase = clearText(f[0]).split(" ");
	for(let p of frase){
		if(p !== " " && globalBag.indexOf(p) < 0) globalBag.push(p)
	}
}
//console.log(globalBag)






//criar rede com base da sacola
var b = new rede(globalBag.length,Math.floor(globalBag.length*2),frazesParaTreinar.length);


//tirar impurezas no texto
function clearText(t){
	let newT =  t.toLowerCase();
	newT =  newT.trim();
	var remove = ".;,|/?!@#$%¨&*(){}[]-+§¬¢£³²¹·•¡~ºª'"
	remove =remove.split("")
	remove.map((a)=>{
		newT = newT.replaceAll(a,"")
	})


	return newT
		
}
function gerarMatriz(arr){
	var inputRede = new Array(globalBag.length).fill(0);
	arr.map(function(v){
		inputRede[globalBag.indexOf(v)] = 1;
	})
	return inputRede
}

function gerarMatrizComTexto(texto){
	var textoL =  clearText(texto);
	var inputArr = []
	var input = textoL.split(" ").map(function(r){
		if(r !== ""){
			inputArr.push(r)
		}
	})

	var inputRede = [];
	var textoLSPL =  textoL.split("")
	globalBag.map(function(v){
		if(textoL.includes(v)){
			inputRede.push(1);
			
		}else{
			inputRede.push(0)
		}
	})
	return inputRede;
}
//console.log(gerarMatrizComTexto("oi sou renan"))
function test(){
	let p = 0;
	let index = 0;
	let acertos = 0;
	for(var fpt of frazesParaTreinar){
		let input =  gerarMatrizComTexto(fpt[0]);
		let r = b.process(input);
		let m = Math.max(...r)
		let maiorI =  r.indexOf(m);
		if(maiorI === index){
			acertos++;
		}

		
		index++;
	}
	return   acertos*100/frazesParaTreinar.length
}
function train(j){
	let i = 0;
	for(var fpt of frazesParaTreinar){
		//console.log(fpt[0])
		let input =  gerarMatrizComTexto(fpt[0]);
		let output =  new Array(frazesParaTreinar.length).fill(0);
		output[i] = 1;
		b.train(input,output)

		i++;
	}
	/*
	for(let bagg of k){
		let input =  gerarMatrizComTexto(bag[bagg].split(",").join(" "));
		let output =  new Array(saidas.length).fill(0);
		output[k.indexOf(bagg)] = 1;
		b.train(input,output)
		
	}*/

}
function response(texto){
	let inputRede =  gerarMatrizComTexto(texto)
	let res = b.process(inputRede)

	let maior = -1;
	let maiorIndex = -1;
	let segundaMaior = -1;
	let segundaMaiorIndex = -1;
	res.map(function(a,i){
		//console.log(frazesParaTreinar[i][1]+" : "+ (a*100).toFixed(1)+"%")
		if(maior < a){maior = a;maiorIndex = i;}
	})
    res.map(function(a,i){
    	if(i == maiorIndex) return ;
		//console.log(frazesParaTreinar[i][1]+" : "+ (a*100).toFixed(1)+"%")
		if(segundaMaior < a){segundaMaior = a;segundaMaiorIndex = i;}
	})


	
	//console.log("maior :"+maiorIndex)
	let frase =  ""
	if(maior >= CONFIANCE){
		frase+= frazesParaTreinar[maiorIndex][1];
		if(segundaMaior >= CONFIANCE2){
			frase+= frazesParaTreinar[segundaMaiorIndex][1]+"."
		}
		//	console.log(color(">>> "+frase,33))


	}else{
		frase += "não entendi, pode reformular??"
		//console.log(color(">>> não entendi, pode reformular",33))
	}
	return frase;
	
}


function serialTrain(n){
for(let x = 0; x < n; x++){
	train()
	if(x % 100 == 0){
		if(x % 2 == 0) process.stdout.write("\x1Bc")
		console.log((x*100/n).toFixed(1)+"%")			
	}
}
}
var comandos =  {
	"train":(c)=>{
		serialTrain(Number(c[1]) || TRAIN_LOOP)	
	},
	"bag": () =>{
		console.log(globalBag)
	},
	"frases":()=>{
		console.log(frazesParaTreinar)
	},
	"test":()=>{
		console.log(test())
	},
	"help":()=>{
		console.log(Object.keys(comandos))
	}
}
function runCommand(resq){
	try{
		let cmd =  resq.slice(1,resq.length)
		let ordens =  cmd.split(" ");
		let f = comandos[ordens[0]]
		f(ordens)
	}catch{
		console.log("comando inexistente")
	}
}
while(true){
	let resq =  rl.question(color("< como posso ajudar?? ",91))
	if(resq[0] == "!"){
		runCommand(resq)		
	}else{
		if(resq == "sair") break;
		let IAresq = response(resq)
 		if(IAresq[0] == "!"){
			runCommand(IAresq)
		}else{
			console.log(color("   >> " +IAresq,93))
		}
	}
}
/*

var code =  "abcdefghijklmnopqrstuvwxyz "
var prompt =  "falar oi";
var caracteresTotais =  30;
var resposta = 30;
var bb = new rede(caracteresTotais+resposta,100,code.length)

function codeNumber(t){
	let tt =[]
	for(let i in t.split("")){
		tt[i] = code.indexOf(t[i])+1
	}
	return Object.assign(new Array(caracteresTotais).fill(0),tt)
}

function gerar(prompt){
	let pCode =  codeNumber(prompt)
	let textoAtual	= "";
	for(let l = 0; l < resposta;l++){
		let r = bb.process(pCode.concat(codeNumber(textoAtual)))

		let maiorIndex = -1;
		let nMaior = - 1;
		for(let ll in r ){
			if(r[ll] > nMaior) {
				nMaior =  r[ll];
				maiorIndex=ll
			}	
		}
		textoAtual+=code[maiorIndex]
		
	}
	return textoAtual
}
function treinarGerar(e,s){
	let codeEntrada =  codeNumber(e)
	for(let saida =0 ; saida < s.split("").length; saida++){
		let textoAtual = s.slice(0,saida);
		let codeTextoAtual =  codeNumber(textoAtual);
		//console.log(textoAtual)
		let proximaLetra =  s[saida+1];
		if(proximaLetra === undefined ) break;


		let saidaMalha = new Array(bb.output).fill(0);
			saidaMalha[code.indexOf(proximaLetra)] =  1;
		//console.log(saidaMalha)
		bb.train(codeEntrada.concat(codeTextoAtual),saidaMalha)

	}	
}
console.log("treinando")
for(let x = 0; x < 10; x ++){
	treinarGerar("oi","ola sou seu melhor amigo")
	console.log(x)	
}
console.log(gerar("oi"))




*/
