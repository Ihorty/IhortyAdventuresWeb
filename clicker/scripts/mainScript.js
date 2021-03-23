class shopItem {

    constructor(id, shownName, price, valueThatAdds, isRecurring) {
        // Variables por defecto
        this.bought = 0;
        this.priceMultiplier = 1.25;

        // Variables construidas
        this.id = id;
        this.shownName = shownName;
        this.basePrice = price;
        this.valueThatAdds = valueThatAdds;
        this.isRecurring = isRecurring;

        this.updatePrice();

        let recurringString = this.isRecurring ? "/s" : "";
        //Html que representa cada item de la tienda
        this.innerHTML = "<div class='shopItem' id='" + this.id + "ShopItem' onclick='buyShopItem(" + '"' + this.id + '"' + ")'>" +
            "<b class='shopItemNum' id='" + this.id + "Num'> " + this.bought + " </b>" +
            "<b class='shopItemName' id='" + this.id + "Name'> " + this.shownName + " </b>" +
            "<b class='shopItemPrice' id='" + this.id + "Price'> " + this.price + " </b>" +
            "<span class='tooltipText'> Adds extra " + this.valueThatAdds + " b" + recurringString + ". </span>" +
            "</div>";

        /** TODO a way to use templates without using plain strings in js */
    }

    /**
     * This is to be launched only after loading the savefile
     * @param {number} i Amount bought already
     */
    setBought(i) {
        this.bought = i;
        this.updatePrice();
    }

    /**
     * Efectua la compra, reduciendo el dinero actual, añadiendo dinero por segundo o click
     *  y actualizando el precio y la parte gráfica del item
     */
    buyItem() {
        if (totalClicks >= this.price) {
            totalClicks -= this.price;
            this.bought++;

            if (this.isRecurring) {
                clicksPerSecond += this.valueThatAdds;
                brickRotationPerSecond += this.valueThatAdds;
                brickRotationPerSecond = Math.min(brickRotationPerSecond, MAX_ROTATION);
            } else {
                valueOfClick += this.valueThatAdds;
                brickRotationPerClick += this.valueThatAdds;
                brickRotationPerClick = Math.min(brickRotationPerSecond, MAX_ROTATION);
            }

            this.updatePrice();
            this.updateItem();
            updateBanner();
            //updateRotationAnimation();

            cookieSaveFile.setItemAmount(this.id, this.bought);
            saveCookies(); //TODO delete this if it is too laggy to buy
        }
    }

    /**
     * Actualiza el precio calculando su cantidad y el múltiplo básico de aumento por item
     */
    updatePrice() {
        if (this.bought > 0) {
            this.price = (this.bought + 1) * this.priceMultiplier * this.basePrice;
            this.price = Math.round(100 * this.price) / 100;
        } else {
            this.price = this.basePrice;
        }
    }

    /**
     * Actualiza la parte gráfica (HTML) del elemento
     */
    updateItem() {
        document.getElementById(this.id + "Price").innerHTML = this.price;
        document.getElementById(this.id + "Num").innerHTML = this.bought;
    }
}


/* Save system */

class ClickerSaveFile {

    constructor(obj) {
        this.totalClicks = totalClicks; // Number
        this.shopItemsAmount = new Array(); //Array de arrays [id item, numero items];

        for (var property in obj) this[property] = obj[property]; // Linea magica que transforma lo que viene en (obj) en propiedades de la clase
    }

    setItemAmount(id, amount) {
        let found = this.shopItemsAmount.find(element => element.id === id);
        if (found === undefined) {
            this.shopItemsAmount.push([id, amount]);
        } else {
            found.amount = amount;
        }
    }

    /** 
     * Busca el la id del elemento y devuelve la cantidad comprada si existe
     */
    getItemAmount(id) {
        let found = this.shopItemsAmount.find(element => element.id === id);
        if (found == undefined)
            return 0;
        return found.amount;
    }
}

/********************************************************/
/************************* Vars *************************/
/********************************************************/

const devMode = true; //Change this to show dev tools

var totalClicks = 0;
var clicksPerSecond = 0;
var valueOfClick = 1;

// rotation
var manualRotation = 0;
var brickRotationPerClick = 5;
var autoRotation = 0;
var brickRotationPerSecond = 0;

var cookieSaveFile;
// Constant items:
const MAX_ROTATION = 240;
const SAVE_FILE_ID = "cookie_clicker_save"
const shopItems = [
    new shopItem("pebble", "China Arcana", 15, 0.15, true),
    new shopItem("wand", "Varita magica", 150, 1, true)
];

// HTML items
var devMenu;
var clickObject;
var rotatingObject;
var shopListMenu;
var energyLabel;


window.onload = function() {
    // Cargamos los elementos HTML en variables
    devMenu = document.querySelector(".devMenu");
    clickObject = document.getElementById("clickCrystal");
    clickRotatingObject = document.getElementById("rotatingGearClick");
    rotatingObject = document.getElementById("rotatingGear");
    shopListMenu = document.getElementById("sidebarList");
    energyLabel = document.getElementById("totalPointsNumber");

    startup();
}

function startup() {
    if (!devMode) devMenu.hidden = true; // Solo se usa para cuando quiero debuguear cosas, añadiendo trampas al juego

    cookieSaveFile = Cookies.get(SAVE_FILE_ID);
    if (cookieSaveFile == undefined) {
        cookieSaveFile = new ClickerSaveFile();
    } else {
        cookieSaveFile = new ClickerSaveFile(JSON.parse(cookieSaveFile));
    }

    totalClicks = cookieSaveFile.totalClicks;
    setInterval(recurringEachFrame, 1000 / 48); // Cada frame ocurren cosas
    setInterval(saveCookies(), 60 * 1000); // Cada minuto guardamos el juego
    setupShopItems();
    updateBanner();

    clickObject.onclick = () => clickOnBrick();
}

function setupShopItems() {
    // Development mode items
    if (devMode) {
        shopItems.push(new shopItem("terminator", "Terminator", 1, 1000000, false));
        shopItems.push(new shopItem("terminatorAuto", "Terminator Automatic", 1, 1000000, true));
    }

    shopItems.forEach(element => {
        element.setBought(cookieSaveFile.getItemAmount(element.id)); // Cargamos los elementos ya comprados

        // Renderizamos el HTML de cada item
        var el = document.createElement("li");
        el.className = "shopItemListItem";
        el.innerHTML = element.innerHTML;
        shopListMenu.appendChild(el);

        element.updateItem();

        if (element.isRecurring) {
            clicksPerSecond += element.valueThatAdds * element.bought;
        } else {
            valueOfClick += element.valueThatAdds * element.bought;
        }
    });

    brickRotationPerClick = Math.min(valueOfClick, MAX_ROTATION);
    brickRotationPerSecond = Math.min(clicksPerSecond, MAX_ROTATION);
}

function clickOnBrick() {
    manualRotation += brickRotationPerClick;
    totalClicks += valueOfClick;
    updateBanner();
    rotateBrick();
}

function updateBanner() {
    energyLabel.innerHTML = numberWithCommas(Math.round(totalClicks));
}

function rotateBrick() {
    clickRotatingObject.style.transform = "rotate(" + manualRotation + "deg)";
    // TODO manual rotation to the item, TODO Rework rotation system
}

function saveCookies() {
    if (devMode) return; // No quiero guardar nada que sea de modo desarrollador
    cookieSaveFile.totalClicks = totalClicks;
    Cookies.set(SAVE_FILE_ID, JSON.stringify(cookieSaveFile), {
        expires: 180
    });
    //Todo notify save to user
}

/**
 * Funcion que ocurre en cada Frame.
 */
function recurringEachFrame() {
    //WARNING! No aplicar comandos complicados o recurrentes, puede hacer que vaya lento el juego.
    totalClicks += (clicksPerSecond / 60);
    updateBanner();
    autoRotation += (brickRotationPerSecond / 60);
    rotatingObject.style.transform = "rotate(" + autoRotation + "deg)";
}

function buyShopItem(id) {
    shopItems.find(element => element.id === id).buyItem();
}

//Copiado un regex de anadir comas entre cada 3 numeros
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //Linea magica copiada de stackoverflow <3
}