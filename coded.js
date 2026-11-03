var carac = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdfghjklzxcvbnm";
//aaaaaaaaaaaaaaaa
function code(){
	var finalCode ="";
	const totalCarac = 40;
	for(let i = 0; i < totalCarac; i++){
		finalCode+=carac[Math.floor(carac.length*Math.random())]
	}
	return finalCode;

}



let w = 0;
while(w < 100){
	console.log(code())
	w++


}








