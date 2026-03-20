let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let height = canvas.height;

/*--------------------------------------------------
drawPoint

Dibuja un punto en el canvas.

ctx  -> contexto del canvas
x,y  -> coordenadas
size -> tamaño del pixel

Se usa fillRect para simular un pixel de mayor tamaño.
--------------------------------------------------*/
function drawPoint(ctx, x, y, size){

ctx.fillRect(x - size/2, y - size/2, size, size);

}

/*--------------------------------------------------
canvasToCartesiana

Convierte coordenadas del canvas al sistema cartesiano.

En el canvas el origen está arriba a la izquierda.
En matemáticas el origen está abajo a la izquierda.

Por eso invertimos el eje Y.
--------------------------------------------------*/
function canvasToCartesiana(p1, height){

return [p1.x , height - p1.y];

}

/*--------------------------------------------------
drawLine

Función general para dibujar líneas.

Se encarga de elegir qué algoritmo usar:
DDA o Bresenham.

x1,y1 -> punto inicial
x2,y2 -> punto final
size  -> tamaño del pixel
method-> algoritmo seleccionado
--------------------------------------------------*/
function drawLine(x1, y1, x2, y2, size, method){

if(method=="dda"){

drawDDA(x1,y1,x2,y2,size);

}
else{

drawBresenham(x1,y1,x2,y2,size);

}

}

/*--------------------------------------------------
Algoritmo DDA (Digital Differential Analyzer)

Concepto:
Se calcula cuántos pasos se necesitan para
trazar la línea y luego se incrementan
las coordenadas x e y gradualmente.

Permite aproximar la recta usando
incrementos decimales.

Pasos principales:
1 calcular dx y dy
2 determinar número de pasos
3 calcular incrementos
4 iterar dibujando puntos
--------------------------------------------------*/
function drawDDA(x1,y1,x2,y2,size){

let dx = x2-x1;
let dy = y2-y1;

let steps = Math.max(Math.abs(dx),Math.abs(dy));

let xinc = dx/steps;
let yinc = dy/steps;

let x = x1;
let y = y1;

for(let i=0;i<=steps;i++){

drawPoint(ctx,x,y,size);

x += xinc;
y += yinc;

}

}

/*--------------------------------------------------
Algoritmo Bresenham

Concepto:
Evita el uso de números decimales.
Utiliza un parámetro de decisión
para determinar qué pixel está
más cerca de la recta ideal.

Ventaja:
Es más eficiente que DDA porque
solo usa operaciones enteras.
--------------------------------------------------*/
function drawBresenham(x1,y1,x2,y2,size){

let dx = Math.abs(x2-x1);
let dy = Math.abs(y2-y1);

let sx = (x1<x2)?1:-1;
let sy = (y1<y2)?1:-1;

let err = dx-dy;

while(true){

drawPoint(ctx,x1,y1,size);

if(x1==x2 && y1==y2) break;

let e2 = 2*err;

if(e2>-dy){
err -= dy;
x1 += sx;
}

if(e2<dx){
err += dx;
y1 += sy;
}

}

}

/*--------------------------------------------------
Función esTriangulo

Verifica si tres puntos forman un triángulo
comparando las pendientes de las rectas.

Si las pendientes son iguales,
los puntos están alineados
y no forman triángulo.
--------------------------------------------------*/
function esTriangulo(xa, ya, xb, yb, xc, yc){

if ((xb - xa) === 0 || (xc - xa) === 0) {
return false;
}

let pendienteAB = (yb - ya) / (xb - xa);
let pendienteAC = (yc - ya) / (xc - xa);

return pendienteAB !== pendienteAC;

}

/*--------------------------------------------------
Dibuja los ejes del plano cartesiano
con números de referencia.
--------------------------------------------------*/
function drawAxes(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.beginPath();

ctx.moveTo(0,height);
ctx.lineTo(canvas.width,height);

ctx.moveTo(0,0);
ctx.lineTo(0,height);

ctx.stroke();

for(let i=0;i<=400;i+=50){

ctx.fillText(i,i,height-5);
ctx.fillText(i,5,height-i);

}

}

/*--------------------------------------------------
Función principal

1 Obtiene datos del usuario
2 Verifica si hay triángulo
3 Dibuja puntos y líneas
--------------------------------------------------*/
function verificar(){

drawAxes();

let x1 = parseFloat(document.getElementById("x1").value);
let y1 = parseFloat(document.getElementById("y1").value);

let x2 = parseFloat(document.getElementById("x2").value);
let y2 = parseFloat(document.getElementById("y2").value);

let x3 = parseFloat(document.getElementById("x3").value);
let y3 = parseFloat(document.getElementById("y3").value);

let method = document.getElementById("method").value;

if(esTriangulo(x1,y1,x2,y2,x3,y3)){

document.getElementById("resultado").innerText =
"Sí se forma un triángulo";

drawLine(x1,height-y1,x2,height-y2,3,method);
drawLine(x2,height-y2,x3,height-y3,3,method);
drawLine(x3,height-y3,x1,height-y1,3,method);

}
else{

document.getElementById("resultado").innerText =
"No se forma un triángulo";

}

}

drawAxes();