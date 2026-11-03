//neural 
export function brain(i,h,o){
	this.input = i;
	this.hidden = h;
	this.output = o;
	this.ih = this.rede(this.input, this.hidden);
	this.ho = this.rede(this.hidden,this.output);
	this.memoryInput = [];
	this.memoryHidden =[];
	this.memoryOutput =[];
}
brain.prototype.rede = function(a,b){//a matriz 1 e b matriz 2
	let arr = {};
	for(let B = 0; B < b; B++){
		for(let A = 0; A < a; A++){
			arr[[B,A]] = this.peso()
		}
	}
	console.log(arr)
	return arr;
}
brain.prototype.peso = function(){
	let n = Math.random()*2-1;
	//console.log("peso criado:"+n.toFixed(4)) 
	return Number(n.toFixed(4));
}
brain.prototype.ativation = function(x) {
	return (x < 0) ? 0 : 1;
}
brain.prototype.run = function(input){
	this.memoryInput = input;
	this.memoryHidden = new Array(this.hidden);
	this.memoryOutput = new Array(this.output);
	this.memoryHidden.fill(0);
	this.memoryOutput.fill(0);

	for(let H = 0; H < this.hidden; H ++){
		for(let I = 0; I < this.input; I++){
			this.memoryHidden[H] =+ this.memoryInput[I] * this.ih[[I,H]]	
		}
		this.memoryHidden[H] = this.ativation(this.memoryHidden[H])
	}
	
	for(let O = 0; O < this.output; O++){
		for(let H = 0; H < this.hidden;H++){
			this.memoryOutput[O] += this.memoryHidden[H] * this.ho[[H,O]];
		}
		this.memoryOutput[O] = this.ativation(this.memoryOutput[O])
	}




	
	console.log("input: "+this.memoryInput)
	console.log("hidden: "+this.memoryHidden)
	console.log("output: "+this.memoryOutput)

		
}
