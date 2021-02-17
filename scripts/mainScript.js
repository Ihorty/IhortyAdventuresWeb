var totalClicks = 0;
var clicksPerSecond = 0;
var valueOfClick = 1;

// Brick rotation vars
var brickRotation = 0;
var brickRotationPerClick = 5;
var brickRotationPerSecond = 0;

var shopItems = [];



// TODO implement recursive addition to the total clicks (bakers add x bricks per second)
// TODO implement savefile via cookies on the website

function startup() {
    setInterval(recurringEachSecond, 1000);

    // new item (innerId , Name shown to users, starter price , Value it adds, true if automatic/false if per click)
    shopItems.push(new shopItem("cake", "Cake", 10, 1, false));
    shopItems.push(new shopItem("terminator", "Terminator", 1, 1000000, false)); //debug item
    shopItems.push(new shopItem("baker", "Baker", 20, 1, true));
    shopItems.push(new shopItem("terminatorAuto", "Terminator Automatic", 1, 1000000, true)); //debug item

    shopItems.forEach(element => {
        var el = document.createElement("li");
        el.innerHTML = element.innerHTML;
        document.getElementById("sidebarList").appendChild(el);
    });

    setupRotationAnimation();
}

function clickOnBrick() {
    brickRotation += brickRotationPerClick;
    totalClicks += valueOfClick;
    updateBanner();
    rotateBrick();
}

function updateBanner() {
    document.getElementById("banner").innerHTML = Math.round(100 * totalClicks) / 100;
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

function recurringEachSecond() {
    totalClicks += clicksPerSecond;
    updateBanner();
}

function buyShopItem(id) {
    shopItems.find(element => element.id === id).buyItem();
}


//Inner class of any shoppable item. Here we'll hide all the functions related to the items.
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

    // When something is bought it updates its price, its graphical elements, rotation and the ammount you get per click/second
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