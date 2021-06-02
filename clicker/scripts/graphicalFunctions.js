/**
 * A function that moves all or specified children of a div around it in a circular pattern.
 * @param {String} divId Id of the parent that needs all its children moved in a circle around it.
 * @param {Boolean} rotateThowardsCenter If true, the down part of the image will be rotated thowards the center.
 * @param {String} childClass Class of the children that have to be moved, if nothing is included, every children will be moved.
 * 
 * src: https://stackoverflow.com/questions/16613809/how-to-create-circles-around-a-circle-with-css-javascript/17251714
 */
function positionAround(divId, rotateThowardsCenter, includeLines, childClass, rotationOffset = 0) {
    let parentdiv = document.getElementById(divId);
    let radius = parentdiv.clientWidth / 2;
    let children = /*if*/ childClass != undefined ? /*then*/ parentdiv.querySelectorAll("." + childClass) : /*else*/ parentdiv.children;
    let positionInterval = 360 / children.length;

    for (let i = 0; i < children.length; i++) {
        let childdiv = children[i];

        //Obtenemos el centro de cada objeto:
        let offsetToParentCenter = parseInt(parentdiv.offsetWidth / 2); //asumimos que son cuadrados todos los elementos
        let offsetToChildCenter = parseInt(childdiv.offsetWidth / 2);
        let totalOffset = offsetToParentCenter - offsetToChildCenter;

        childdiv.style.position = 'absolute';
        let y = Math.sin(((positionInterval * i) + rotationOffset) * (Math.PI / 180)) * radius;
        let x = Math.cos(((positionInterval * i) + rotationOffset) * (Math.PI / 180)) * radius;
        childdiv.style.top = (y + totalOffset).toString() + "px";
        childdiv.style.left = (x + totalOffset).toString() + "px";
        childdiv.style.visibility = "visible";
        childdiv.style.opacity = 1;

        if (rotateThowardsCenter) {
            let rad = Math.atan2((x + offsetToParentCenter) - radius, radius - (y + offsetToParentCenter));
            rad = rad < 0 ? Math.abs(rad) : 2 * Math.PI - rad;
            childdiv.style.rotate = (360 - (rad * (180 / Math.PI))) + "deg";
        }

    };

    if (includeLines) {
        joinWithLines(divId, childClass);
    }
}

function joinWithLines(divId, childDivClass) {
    const STROKE_ATTR = { "stroke-linecap": "round", "stroke": "#ffffffc0", "stroke-width": "2px", "fill": "#00000000" };
    const SUBSTROKE_ATTR = { "stroke-linecap": "round", "stroke": "#66ccff", "stroke-width": "6px", "fill": "#00000000", "filter": "url(#f1)" };
    let parentdiv = document.getElementById(divId);
    let children = parentdiv.getElementsByClassName(childDivClass);
    let points = "";
    let pointsB = "";

    parentdiv.getElementsByClassName("programmedLines").length > 0 ? parentdiv.removeChild(parentdiv.getElementsByClassName("programmedLines").item(0)) : null;
    let svg = getNode("svg", { class: "programmedLines" });
    svg.innerHTML = '<defs> <filter id="f1" x="-20%" y="-20%" height=140% width=140%> <feGaussianBlur in="SourceGraphic" stdDeviation="4" /> </filter> </defs>';


    if (children.length != 2) {
        for (let i = 0; i < children.length; i++) {
            try {
                let item;
                if (children.length < 5) {
                    item = children.item(i);
                    let x = parseInt(item.style.left) + item.clientWidth / 2;
                    let y = parseInt(item.style.top) + item.clientHeight / 2;
                    points += (x + "," + y + " ");
                } else {
                    if (i * 2 >= children.length) {
                        if (children.length % 2 == 0) {
                            item = children.item(i * 2 + 1 - children.length);
                            let x = parseInt(item.style.left) + item.clientWidth / 2;
                            let y = parseInt(item.style.top) + item.clientHeight / 2;
                            pointsB += (x + "," + y + " ");
                        } else {
                            item = children.item(i * 2 - children.length);
                            let x = parseInt(item.style.left) + item.clientWidth / 2;
                            let y = parseInt(item.style.top) + item.clientHeight / 2;
                            points += (x + "," + y + " ");
                        }
                    } else {
                        item = children.item(i * 2);
                        let x = parseInt(item.style.left) + item.clientWidth / 2;
                        let y = parseInt(item.style.top) + item.clientHeight / 2;
                        points += (x + "," + y + " ");
                    }
                }
            } catch {
                console.log("error on :" + i);
            };
        }
        SUBSTROKE_ATTR.points = STROKE_ATTR.points = points;
        svg.appendChild(getNode("polygon", SUBSTROKE_ATTR));
        svg.appendChild(getNode("polygon", STROKE_ATTR));

        if (pointsB != "") {
            SUBSTROKE_ATTR.points = STROKE_ATTR.points = pointsB;
            svg.appendChild(getNode("polygon", SUBSTROKE_ATTR));
            svg.appendChild(getNode("polygon", STROKE_ATTR));
        }
    } else {
        SUBSTROKE_ATTR.x1 = STROKE_ATTR.x1 = parseInt(children.item(0).style.left) + children.item(0).clientWidth / 2;
        SUBSTROKE_ATTR.y1 = STROKE_ATTR.y1 = parseInt(children.item(0).style.top) + children.item(0).clientHeight / 2;
        SUBSTROKE_ATTR.x2 = STROKE_ATTR.x2 = parseInt(children.item(1).style.left) + children.item(1).clientWidth / 2;
        SUBSTROKE_ATTR.y2 = STROKE_ATTR.y2 = parseInt(children.item(1).style.top) + children.item(1).clientHeight / 2;
        svg.appendChild(getNode("line", SUBSTROKE_ATTR));
        svg.appendChild(getNode("line", STROKE_ATTR));
    }
    parentdiv.appendChild(svg);
    inicializarAnimacionChinaSVG(parentdiv);
}

function getNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v)
        n.setAttributeNS(null, p, v[p]);
    return n
}


//
//src: https://stackoverflow.com/questions/19382872/how-to-connect-html-divs-with-lines

// A function that determines the duration for the fragment of the animation based on its total duration
/**
 * 
 * @param {Element} htmlItem 
 * @param {Number} maxDuration 
 * @param {Number} from 
 * @param {Number} to 
 */
function getIntervalDuration(maxDuration, from, to) {
    return to / maxDuration - from / maxDuration;
}


/* Anime JS Functions */
function inicializarAnimacionChinaSVG() {
    anime({
        targets: '.programmedLines polygon',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1000
    })
}