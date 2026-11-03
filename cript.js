var fs = require("fs")
var rd =  require("readline-sync")






console.log("o que voce quer fazer")
var funcao = rd.question("ler [ r ] ou escrever [ w ] ?");
function print(txt){
	console.log(""+txt+"")


}






var alfabeto = '\/@#$%&*()_+qwertyuiopasdfghjklçzxcvbnmQWERTYUIOPASDFGHJKLÇZXCVBNM1234567890[]{}":,.!? ';

function criarEscada(value,senha){
	let code = "";
	let index = 0;
	for(let x = 0; x < value.length;x++){
		if(alfabeto.indexOf(senha[index]) < 10) code+= "0";
		if(alfabeto.indexOf(senha[index]) < 0){
			code += "0"
		}else{
			code += alfabeto.indexOf(senha[index])
		}
		
		index++;
		if(index >= senha.length) index = 0;
	}
	//console.log("escada: "+code)
	return code;
}
function cript(value, senha)
{
	value = escape(value)
	let final = ""
	let escada = criarEscada(value,senha);
	let escadaAtual = 0;
	for(let x = 0; x < value.length; x++){
		let indexLetra = alfabeto.indexOf(value[x]);
		let novaI = Number(escada[escadaAtual]+escada[escadaAtual+1]);
		let novaLetraIndex = indexLetra+novaI
			if(novaLetraIndex >= alfabeto.length) novaLetraIndex = novaLetraIndex- alfabeto.length;
		final+=alfabeto[novaLetraIndex]
		escadaAtual+=2;
			if(escadaAtual > escada.length) escadaAtual = 0;
	}
	return final;
}

function Descript(value, senha)
{
	let final = ""
	let escada = criarEscada(value,senha);
	let escadaAtual = 0;
	for(let x = 0; x < value.length; x++){
		let indexLetra = alfabeto.indexOf(value[x]);
		let novaI = Number(escada[escadaAtual]+escada[escadaAtual+1]);
		let novaLetraIndex = indexLetra-novaI;
			if(novaLetraIndex < 0) novaLetraIndex =  alfabeto.length + novaLetraIndex;
		final+=alfabeto[novaLetraIndex]
		escadaAtual+= 2;
			if(escadaAtual < 0) escadaAtual = escada.length;
	}
	return unescape(final);
}
function lockFile(value,senha,name){
	if(typeof value != "string") throw new Error("erro de tipo:O valor do arquivo tem que ser string");
	if(typeof senha != "string") throw new Error("erro de tipo:A senha do arquivo tem que ser string");
	if(typeof name != "string") throw new Error("erro de tipo:O nome do arquivo tem que ser string");
	var obj =  {value,senha}
	var fileValue = cript(JSON.stringify(obj),senha)
	Descript(fileValue,senha)
	fs.writeFile(name,fileValue, function(A){
		if(A) return console.log("error");
	})
	console.log("arquivo salvo!!");
	//console.log(fileValue);
}

if(funcao === "w"){
	var valor = rd.question("que informção deseja salvar ? ");
	var senha = rd.question("escolha uma senha ? ");
	var nome = rd.question("nome do arquivo ? ");
	lockFile(valor,senha,nome);
}else{
	var nome = rd.question("nome do arquivo ?");
	var senha = rd.question("qual a senha do arquivo? ")
	var value  = fs.readFileSync(nome,"utf8",(err,data) => {
		if(err){
			throw "arquivo não exite"
		}
		console.log(data)
	})
	console.log(JSON.parse(Descript(value,senha)).value);
}
