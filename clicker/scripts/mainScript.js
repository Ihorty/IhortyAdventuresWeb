const devMode = false; //Change this to show dev tools

var totalClicks = 0;
var clicksPerSecond = 0;
var valueOfClick = 1;

// Brick rotation vars
var brickRotation = 0;
var brickRotationPerClick = 5;
var brickRotationPerSecond = 0;

var cookieSaveFile;
const SAVE_FILE_ID = "cookie_clicker_save"
const shopItems = [];

// TODO implement savefile via cookies on the website

function startup() {
    if (!devMode) document.querySelector(".devMenu").hidden = true;

    cookieSaveFile = Cookies.get(SAVE_FILE_ID);
    if (cookieSaveFile == undefined) {
        cookieSaveFile = new ClickerSaveFile();
    } else {
        cookieSaveFile = new ClickerSaveFile(JSON.parse(cookieSaveFile));
    }

    totalClicks = cookieSaveFile.totalClicks;
    setInterval(recurringEachFrame, 1000 / 24); // Each frame
    setInterval(saveCookies(), 60 * 1000); // Each minute
    setupShopItems();
    setupRotationAnimation();
    updateBanner();
}

function setupShopItems() {
    // new item (innerId , Name shown to users, starter price , Value it adds, true if automatic/false if per click)
    shopItems.push(new shopItem("cake", "Cake", 10, 1, false));
    shopItems.push(new shopItem("terminator", "Terminator", 1, 1000000, false)); //debug item
    shopItems.push(new shopItem("baker", "Baker", 20, 1, true));
    shopItems.push(new shopItem("terminatorAuto", "Terminator Automatic", 1, 1000000, true)); //debug item

    shopItems.forEach(element => {
        element.setBought(cookieSaveFile.getItemAmount(element.id));

        var el = document.createElement("li");
        el.className = "shopItemListItem";
        el.innerHTML = element.innerHTML;
        document.getElementById("sidebarList").appendChild(el);

        element.updateItem();

        if (element.isRecurring) {
            clicksPerSecond += element.valueThatAdds * element.bought;
        } else {
            valueOfClick += element.valueThatAdds * element.bought;
        }
    });
}

function clickOnBrick() {
    brickRotation += brickRotationPerClick;
    totalClicks += valueOfClick;
    updateBanner();
    rotateBrick();
}

function updateBanner() {
    document.getElementById("banner").innerHTML = numberWithCommas(Math.round(totalClicks));
}

function setupRotationAnimation() {
    var styleObject = document.getElementById("brickImg").style;
    styleObject.animation = "fullRotation";
    styleObject.animationTimingFunction = "linear";
    styleObject.animationIterationCount = "infinite";
}

function updateRotationAnimation() {
    var styleObject = document.getElementById("brickImg").style;
    if (brickRotationPerSecond < 180)
        styleObject.animationDuration = 360 / brickRotationPerSecond + "s";
    else
        styleObject.animationDuration = 2 + "s";
}

function rotateBrick() {
    document.getElementById("brick").style.transform = "rotate(" + brickRotation + "deg)";
}

function saveCookies() {
    cookieSaveFile.totalClicks = totalClicks;
    Cookies.set(SAVE_FILE_ID, JSON.stringify(cookieSaveFile), { expires: 180 });
    //Todo notify save to user
}

function recurringEachFrame() {
    totalClicks += (clicksPerSecond / 60);
    updateBanner();
}

function buyShopItem(id) {
    shopItems.find(element => element.id === id).buyItem();
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*****************************/
/******* Inner Classes *******/
/*****************************/

class shopItem {

    constructor(id, shownName, price, valueThatAdds, isRecurring) {
        this.id = id;
        this.shownName = shownName;
        this.basePrice = price;
        this.valueThatAdds = valueThatAdds;
        this.isRecurring = isRecurring;

        this.bought = 0;
        this.priceMultiplier = 1.4;

        this.updatePrice();

        //took this out just for readability:
        var recurringString = this.isRecurring ? "/s" : "";

        //Html that represents any item shop
        this.innerHTML = "<div class='shopItem' id='" + this.id + "ShopItem' onclick='buyShopItem(" + '"' + this.id + '"' + ")'>" +
            "<b class='shopItemNum' id='" + this.id + "Num'> " + this.bought + " </b>" +
            "<b class='shopItemName' id='" + this.id + "Name'> " + this.shownName + " </b>" +
            "<b class='shopItemPrice' id='" + this.id + "Price'> " + this.price + " </b>" +
            "<span class='tooltipText'> Adds extra " + this.valueThatAdds + " b" + recurringString + ". </span>" +
            "</div>";
    }

    /**
     * This is to be launched only after loading the savefile
     * @param {number} i Amount bought already
     */
    setBought(i) {
        this.bought = i;
        this.updatePrice();
    }

    // When something is bought it updates its price, its graphical elements, rotation and the amount you get per click/second
    buyItem() {
        if (totalClicks >= this.price) {
            totalClicks -= this.price;
            this.bought++;

            if (this.isRecurring) {
                clicksPerSecond += this.valueThatAdds;
                brickRotationPerSecond += this.valueThatAdds;
            } else {
                valueOfClick += this.valueThatAdds;
                brickRotationPerClick += this.valueThatAdds;
            }

            this.updatePrice();
            this.updateItem();
            updateBanner();
            updateRotationAnimation();

            cookieSaveFile.setItemAmount(this.id, this.bought);
            saveCookies(); //TODO delete this if it is too laggy to buy
        }
    }

    updatePrice() {
        if (this.bought > 0) {
            this.price = (this.bought + 1) * this.priceMultiplier * this.basePrice;
            this.price = Math.round(100 * this.price) / 100;
        } else {
            this.price = this.basePrice;
        }
    }

    // The graphical part of the item
    updateItem() {
        document.getElementById(this.id + "Price").innerHTML = this.price;
        document.getElementById(this.id + "Num").innerHTML = this.bought;
    }
}


/* Save system */

class ShopItemBought {
    constructor(id, amount) {
        this.id = id;
        this.amount = amount;
    }
}

class ClickerSaveFile {

    constructor(obj) {
        this.totalClicks = totalClicks; // Number
        this.lastLogin = Date.now(); // Date
        this.shopItemsAmount = new Array(); //Array of ShopItemBought;

        for (var property in obj) this[property] = obj[property]; // Por cada propiedad dentro del objeto que viene, lo asignamos al archivo local
    }

    setItemAmount(id, amount) {
        let found = this.shopItemsAmount.find(element => element.id === id);
        if (found === undefined) {
            this.shopItemsAmount.push(new ShopItemBought(id, amount));
        } else {
            found.amount = amount;
        }
    }

    getItemAmount(id) {

        let found = this.shopItemsAmount.find(element => element.id === id);
        if (found == undefined)
            return 0;
        return found.amount;
    }
}