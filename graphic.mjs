export function graphic(){
 this.clea =  false; 	
 }
 graphic.prototype.clearT = function(){
	//if(this.clea) return;
	this.clea = true;
 	process.stdout.write("\x1Bc")
 }
 graphic.prototype.color = (t = "", c = 91) =>{return "\x1b[1;40;"+c+"m"+t+"\x1b[0m"}
 graphic.prototype.dimension = function(stri){
 	let v =  stri.split("x");
 	this.width = v[0]
 	this.height = v[1];
 }
 graphic.prototype.matrizer = function(){
 	this.matriz =  new Array(this.width*this.height).fill(47)
 }
 graphic.prototype.draw = function(){
 	//if(!this.clea) return;
 	let i = 0;
 	let line = ""
 	for(let h = 0; h < this.height; h++){
 		for(let w = 0; w < this.width; w++){
 			line+=this.color("  ",this.matriz[i])
			i++
 		}
 		console.log(line)
 		line=""
 		
 	}
 	
 }
 graphic.prototype.bit=function(x=0,y=0,v=40){
 	if(x < 0 || y < 0 || x > this.width || y > this.height) return;
 	let {floor,abs} = Math; 	
	this.matriz[floor(x)+(floor(y)*this.width)] = v
 }
 graphic.prototype.rect= function(x,y,w,h,c =40){
 	for(let xx =  x; xx< x+w;xx++){
 		for(let yy =  y; yy< y+h;yy++){
 			this.bit(xx,yy,c)	
 		}
 	}
 }
 graphic.prototype.init = function(){
 	this.clearT()
 	this.matrizer()
 } 
 graphic.prototype.mainLoop =  function(f = new Function()){
	let t = this;
 	setInterval(function(){
 	
		t.clearT()
 		t.matrizer();
 		f()
 		t.draw();
 		t.clea=false;
 	},1000/4)
 }
