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
    let parentdiv = document.getElementById(divId);
    let children = parentdiv.getElementsByClassName(childDivClass);
    let points = "";

    parentdiv.getElementsByClassName("programmedLines").length > 0 ? parentdiv.removeChild(parentdiv.getElementsByClassName("programmedLines").item(0)) : null;

    for (let i = 0; i < children.length; i++) {
        let item;
        // No se puede hacer estrella si es par el numero de nodos
        if (children.length < 3) {
            item = children.item(i);
        } else {
            let j = i * 2 > children.length ? (i * 2) - children.length : i * 2;
            item = children.item(j);
        }
        let x = parseInt(item.style.left) + item.clientWidth / 2;
        let y = parseInt(item.style.top) + item.clientHeight / 2;
        points += (x + "," + y + " ");
    }
    let svg = getNode("svg", { class: "programmedLines" })
    let poly = getNode("polygon", { "points": points, "stroke": "#66ccff", "stroke-width": "4px", "fill": "#00000000", "filter": "url(#f1)" });
    svg.innerHTML = '<defs> <filter id="f1" x="0" y="0"> <feGaussianBlur in="SourceGraphic" stdDeviation="3" /> </filter> </defs>';
    svg.appendChild(poly);
    parentdiv.appendChild(svg);
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