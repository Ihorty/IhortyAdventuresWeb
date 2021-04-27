class shopItem {
    /**
     * 
     * @param {String} id Id of shop item
     * @param {String} shownName Public name
     * @param {Number} price Starting price, it will multiply by the default multiplier
     * @param {Number} valueThatAdds Clicks per iteration of item
     * @param {Number} type Type from types array
     * @param {URL} icon Icon url of the item
     * @param {String} parentId Where each item image will be placed in the game menu
     */
    constructor(id, shownName, price, valueThatAdds, type, icon, parentId, numToShow) {
        // Variables por defecto
        this.bought = 0;
        this.priceMultiplier = 1.25;

        // Variables construidas
        this.id = id;
        this.shownName = shownName;
        this.basePrice = price;
        this.valueThatAdds = valueThatAdds;
        this.type = type;
        this.icon = icon;
        this.parentId = parentId;
        this.numToShow = numToShow;

        this.updatePrice();

        let recurringString = this.type == 1 ? "/s" : "";
        //Html que representa cada item de la tienda
        this.innerHTML = "<div class='shopItem' id='" + this.id + "ShopItem' onclick='buyShopItem(" + '"' + this.id + '"' + ")'>" +
            "<b class='shopItemNum' id='" + this.id + "Num'> " + this.bought + " </b>" +
            "<b class='shopItemName' id='" + this.id + "Name'> " + this.shownName + " </b>" +
            "<b class='shopItemPrice' id='" + this.id + "Price'> " + this.price + " </b>" +
            "<span class='tooltipText'> Adds extra " + this.valueThatAdds + " b" + recurringString + ". </span>" +
            "</div>";

        /** TODO a way to use templates without using plain strings in js */
    }

    setupImage() {
        if (this.icon != undefined) document.getElementById(this.id + "ShopItem").style.backgroundImage = "url('" + this.icon + "')";
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
                rotationPerSecond = Math.min(rotationPerSecond + this.valueThatAdds, MAX_ROTATION);
            } else {
                valueOfClick += this.valueThatAdds;
                rotationPerClick = Math.min(rotationPerClick + this.valueThatAdds, MAX_ROTATION);
            }

            this.updatePrice();
            this.updateItem();
            updateBanner();
            this.addGameItem();

            cookieSaveFile.setItemAmount(this.id, this.bought);
            saveCookies(); //TODO delete this if it is too laggy to buy
            refreshGameView();
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
        // Actualiza la tienda
        document.getElementById(this.id + "Price").innerHTML = this.price;
        document.getElementById(this.id + "Num").innerHTML = this.bought;
    }

    addGameItem() {
        // Actualiza la parte game
        if (this.parentId != undefined) {
            var imgToAdd = document.createElement("img");
            imgToAdd.classList.add(this.id);
            imgToAdd.src = this.icon;
            document.getElementById(this.parentId).appendChild(imgToAdd);
            //<img class="this.id" src="this.icon">
        }
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
        let found = this.shopItemsAmount.find(element => element[0] === id);
        if (found === undefined) {
            this.shopItemsAmount.push([id, amount]);
        } else {
            found[1] = amount;
        }
    }

    /** 
     * Busca el la id del elemento y devuelve la cantidad comprada si existe
     */
    getItemAmount(id) {
        let found = this.shopItemsAmount.find(element => element[0] === id);
        if (found == undefined)
            return 0;
        return found[1];
    }
}

/********************************************************/
/************************* Vars *************************/
/********************************************************/

const devMode = false; //Change this to show dev tools

var totalClicks = 0;
var clicksPerSecond = 0;
var valueOfClick = 1;

// rotation
var manualRotation = 0;
var rotationPerClick = 5;
var autoRotation = 0;
var rotationPerSecond = 0;
var frame = 0;

var cookieSaveFile;
// Constant items:
const ITERATIONS_PER_SECOND = 48;
const MAX_ROTATION = 240;
const SAVE_FILE_ID = "cookie_clicker_save"
const types = {
    "clicker": 0,
    "recurring": 1,
    "mechanicalClicker": 2,
    "mechanicalRecurring": 3
}
const shopItems = [
    new shopItem("pebble", "China Arcana", 15, 0.15, types.recurring, "img/water_drop.png", "pebbleSet"),
    new shopItem("wand", "Varita magica", 150, 1, types.recurring, "img/magicWand.png"),
    new shopItem("rock", "Roca Arcana", 500, 5, types.recurring, "img/rocksMediumFat.png"),
    new shopItem("tree", "Arbol", 1500, 10, types.recurring, "img/tree.png"),
    new shopItem("mountain", "Montaña", 50000, 1000, types.recurring, "img/mountain.png"),
    new shopItem("mouse", "Raton más grande", 20, 2, types.clicker),
];

// HTML items
var devMenu;
var clickObject;
var rotatingObject;
var shopListMenu;
var energyLabel;

/* Funciones */

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
    setInterval(recurringEachFrame, 1000 / ITERATIONS_PER_SECOND); // Cada frame ocurren cosas
    setInterval(saveCookies, 60 * 1000); // Cada minuto guardamos el juego
    setupShopItems();
    updateBanner();

    clickObject.onclick = () => clickOnBrick();

    refreshGameView();
}

function refreshGameView() {
    positionAround("pebbleSet", true, true, "pebble");
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
        element.setupImage();

        for (i = 0; i < element.bought; i++) {
            element.addGameItem();
        }

        if (element.isRecurring) {
            clicksPerSecond += element.valueThatAdds * element.bought;
        } else {
            valueOfClick += element.valueThatAdds * element.bought;
        }
    });

    rotationPerClick = Math.min(valueOfClick, MAX_ROTATION);
    rotationPerSecond = Math.min(clicksPerSecond, MAX_ROTATION);
}

function clickOnBrick() {
    manualRotation += rotationPerClick;
    totalClicks += valueOfClick;
    updateBanner();
    rotateBrick();
}

function updateBanner() {
    energyLabel.innerHTML = numberWithCommas(Math.round(totalClicks));
}

function rotateBrick() {
    clickRotatingObject.style.transform = "rotate(" + manualRotation + "deg)";
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
    totalClicks += (clicksPerSecond / ITERATIONS_PER_SECOND);
    updateBanner();
    autoRotation += rotationPerSecond / ITERATIONS_PER_SECOND;
    rotatingObject.style.transform = "rotate(" + autoRotation + "deg)"; // Giramos la parte interna del click
    frame++;
}

function buyShopItem(id) {
    shopItems.find(element => element.id === id).buyItem();
}

//Copiado un regex de anadir comas entre cada 3 numeros
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //Linea magica copiada de stackoverflow <3
}