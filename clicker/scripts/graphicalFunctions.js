/**
 * A function that moves all or specified children of a div around it in a circular pattern.
 * @param {String} divId Id of the parent that needs all its children moved in a circle around it.
 * @param {String} childId Id of the children that have to be moved, if nothing is included, every children will be moved.
 * 
 * src: https://stackoverflow.com/questions/16613809/how-to-create-circles-around-a-circle-with-css-javascript/17251714
 */
function positionAround(divId, rotationOffset = 0, childId) {
    var parentdiv = document.getElementById(divId);
    var radius = parentdiv.clientWidth / 2;
    var children = /*if*/ childId != undefined ? /*then*/ parentdiv.querySelectorAll("." + childId) : /*else*/ parentdiv.children;
    var positionInterval = 360 / children.length;

    for (var i = 0; i < children.length; i++) {
        var childdiv = children[i]

        //Obtenemos el centro de cada objeto:
        var offsetToParentCenter = parseInt(parentdiv.offsetWidth / 2); //asumimos que son cuadrados todos los elementos
        var offsetToChildCenter = parseInt(childdiv.offsetWidth / 2);
        var totalOffset = offsetToParentCenter - offsetToChildCenter;

        childdiv.style.position = 'absolute';
        var y = Math.sin(((positionInterval * i) + rotationOffset) * (Math.PI / 180)) * radius;
        var x = Math.cos(((positionInterval * i) + rotationOffset) * (Math.PI / 180)) * radius;
        childdiv.style.top = (y + totalOffset).toString() + "px";
        childdiv.style.left = (x + totalOffset).toString() + "px";
    };
}


//
//src: https://stackoverflow.com/questions/19382872/how-to-connect-html-divs-with-lines