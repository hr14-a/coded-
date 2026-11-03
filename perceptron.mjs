export function perceptron(i,o){	
	this.lr = 0.1;
	this.input = i;
	this.output = o;
	this.io = this.rede(i,o);

	this.bias = new Array(o);
	this.bias.fill(0)
	this.memoryInput =[];
	this.memoryOutput = [];
	
}
perceptron.prototype.export = function(){
	return JSON.stringify(this.io)
}
perceptron.prototype.import = function(t){
	this.io = JSON.parse(t)
}
perceptron.prototype.ativate = function(n){return 1/(1+Math.exp(-n))}

perceptron.prototype.peso = function(){return Number((Math.random()*2-1).toFixed(2))}

perceptron.prototype.rede =  function(i,o){
	let rede = [];
	for(let O = 0; O < o; O++){
		for(let I = 0; I < i; I++){
			
			rede[[I,O]] = this.peso();
		}
	}
	return rede;
}
perceptron.prototype.process = function(input){
	this.memoryInput =  input;
	this.memoryOutput = new Array(this.output);
	this.memoryOutput.fill(0);
	for(let O =  0; O < this.output; O++){
		for(let I = 0; I < this.input; I++){
			this.memoryOutput[O] += this.memoryInput[I] * this.io[[I,O]];
		}
		this.memoryOutput[O] = this.ativate(this.memoryOutput[O]+this.bias[O])
	}


	return this.memoryOutput;
}
perceptron.prototype.train = function(entrada,espero){
	let resp = this.process(entrada);
	let errorOutput =  new Array(this.output);
	let media =  0;
	for(let O = 0; O < this.output; O ++){
		errorOutput[O]=espero[O]-resp[O]
		media+= Math.abs(errorOutput[O]);		
	}
	media =  media/this.output

	for(let O = 0; O < this.output; O++){
		for(let I = 0; I < this.input; I++){
			if(errorOutput[O] != 0){
				this.io[[I,O]] = this.io[[I,O]] + (errorOutput[O]*this.lr*(this.memoryInput[I]))
				this.bias[O] = this.bias[O]+(this.lr*errorOutput[O])
			}
		}
	}

	return {media,entrada,espero,response:resp,errorOutput};	
}
perceptron.prototype.trainer= function(entrada=[],espero=[],vezes=1,print=true){
	for(let i = 0; i < vezes; i++){
		let res = this.train(entrada,espero);
		console.log(res.media)

	}
	if(print) console.log(this.process(entrada))
}
perceptron.prototype.trainData = function(data,vezes=1,print=true){
	if(print) console.log("treinando")
	var dt = data;
	for(let i = 0; i < vezes; i++){
		for(let d of data){
			let res = this.train(d[0],d[1]);
			//if(print) console.log(res.media)
		}
		
	}
	for(let d in data){
		dt[d][2] = this.process(dt[d][0]).map(function(x){return Number(x.toFixed(5))})
		let error = 0;
		for(let e in dt[d][2]){
			error+= Math.abs(dt[d][1][e]-dt[d][2][e])
		}
		error /= (dt[d][2]).length
		error = Number(error.toFixed(2))

		
		dt[d][3] = ""+error*100+"%"
	}
	if(print) console.table(dt)
}

export function rede(i,h,o){
	this.input = i;
	this.hidden = h
	this.output = o;
	this.lr = 0.1;
	this.layer1 = new perceptron(i,h)
	this.layer2 = new perceptron(h,o)
}
rede.prototype.gerarFilho = function(){
	let filho = new rede(this.input,this.hidden, this.output);
	filho.layer1.io = structuredClone(this.layer1.io)
	filho.layer2.io = structuredClone(this.layer2.io)
	filho.layer1.bias = structuredClone(this.layer1.bias)
	filho.layer2.bias = structuredClone(this.layer2.bias)
	filho.mutation();
	return filho;
}
rede.prototype.mutation = function(){
	for(var H = 0; H < this.hidden;H++){
		for(var I = 0; I < this.input;I++){

			if(Math.random() < 0.1){
				this.layer1.io[[I,H]] = this.layer1.peso()
							
			}
		}	
	}
	for(var O = 0; O < this.ouput;O++){
		for(var H = 0; H < this.hidden;H++){

			if(Math.random() < 0.1){
				this.layer2.io[[H,O]] = this.layer2.peso()
							
			}
		}	
	}	
	
}
rede.prototype.derivada = x => x*(1-x)
rede.prototype.process =  function(input){
	return this.layer2.process(this.layer1.process(input))
}
rede.prototype.train =function(entrada,espero){
	let predict = this.process(entrada);

	let g_saida = []
	let e_hidden = new Array(this.hidden).fill(0)
	let g_hidden = new Array(this.hidden).fill(0)
	for(let O = 0; O < this.output; O++){
		g_saida[O] = (predict[O]-espero[O])*(this.derivada(predict[0]))
	}
	//errorHidden
	for(let H = 0; H < this.hidden; H++){
		for(let O =  0; O < this.output; O++){
			e_hidden[H]+= g_saida[O]*this.layer2.io[[H,O]]
		}
	}
	//gradiente hidden
	for(let H = 0; H < this.hidden; H++){
		g_hidden[H] = e_hidden[H]*(this.derivada(this.layer2.memoryInput[H]))
	}






	
	for(let O =  0; O < this.output; O++){
		for(let H = 0; H < this.hidden; H++){
			this.layer2.io[[H,O]] -= this.lr*g_saida[O]*this.layer2.memoryInput[H]
			if(isNaN(this.layer2.io[[H,O]])) throw "na mudanda i,h"

		}
	}

	for(let H =  0; H < this.hidden;H++){
		for(let I = 0; I < this.input; I++){
			if(isNaN(g_hidden[H])) throw "aqui no "+H;
			this.layer1.io[[I,H]] -= this.lr*g_hidden[H]*entrada[I]
		}
	}
	for(let bH in this.layer1.bias){
		this.layer1.bias[bH] -= this.lr * g_hidden[bH]
	}
	for(let bO in this.layer2.bias){
		this.layer2.bias[bO] -= this.lr * g_saida[bO]
	}

}











