var totalClicks=0;
var cakesNum=0;
var bakerNum=0;
var cakesPrice=10.0;
var bakerPrice=10.0;
var brickRotation = 0;


// TODO implement recursive addition to the total clicks (bakers add x bricks per second)
// TODO implement savefile via cookies on the website

function clickOnBrick() {
    totalClicks += valueOfClick();
    updateBanner();
    rotateBrick();
}

function updateBanner() {
    document.getElementById("banner").innerHTML = Math.round(100 * totalClicks)/100;
}

// un getter que determina el valor de cada click TODO debe haber una manera mas eficiente
function valueOfClick() {
    var value = 1;
    value += cakesNum * 0.5;
    return value;
}

// Funcion que realiza compra de una tarta TODO realizar una funcion para comprar set indefinido de items
function buyCake(){
    if(totalClicks > cakesPrice){
        totalClicks -= cakesPrice;
        cakesNum++;
        cakesPrice *= 1.75;
        cakesPrice = Math.round(100 * cakesPrice)/100;
        updateBanner();
        updateShopItem(0);
    }
}

function buyBaker(){
    if(totalClicks > bakerPrice){
        totalClicks -= bakerPrice;
        bakerNum++;
        bakerPrice *= 1.75;
        bakerPrice = Math.round(100 * bakerPrice)/100;
        updateBanner();
        updateShopItem(1);
    }
}

// actualiza unicamente la parte grafica del item comprado:
function updateShopItem(itemId){
    switch (itemId){
        case 0:
            document.getElementById("cakePrice").innerHTML = cakesPrice;
            document.getElementById("cakeNum").innerHTML = cakesNum;
            break;
        case 1:
            document.getElementById("bakerPrice").innerHTML = bakerPrice;
            document.getElementById("bakerNum").innerHTML = bakerNum;
        default:
            break;
    }
}

function rotateBrick() {
    brickRotation += 10;
    document.getElementById("brick").setAttribute("style", "transform: rotate(" + brickRotation + "deg)");
}
