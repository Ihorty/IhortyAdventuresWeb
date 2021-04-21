/**
 * Lee la altura del elemento y esconde el hijo llamado contentHidder si es menor de 450px
 * @param {HTMLElement} element Para que funcione bien hay que usar el elemento "articleCC"
 */
function showHideGradient(element) {
    if (element.clientHeight < 450) {
        // Buscamos un hijo con el nombre "contentHidder" para hacerlo invisible
        for (let i = 0; i < element.children.length; i++) {
            let child = element.children[i];
            if (child.className === "contentHidder") {
                child.hidden = true;
                return;
            }
        };
    }
}

function showHideAllGradients() {
    let htmlElements = document.getElementsByClassName("articleCC");
    for (let i = 0; i < htmlElements.length; i++) showHideGradient(htmlElements[i]);
}


/* Evitad este sistema, mueve el contenido entero de un articulo (un html) de una página a otra. 
 * Sirve muy bien para aprender a persistir informacion entre paginas, pero es una forma incorrecta de mostrar artículos, ya que no permite compartir los artículos entre personas.
 */

/**
 * Abre un articulo en detalle. Para ello abrimos la página article.php y le mandamos el elemento html que tenemos en el contenido.
 * @param {HTMLElement} element 
 */
function openArticle(element) {
    element.innerHTML = "&#129044; Return";
    sessionStorage.setItem('article', element.parentElement.outerHTML);
    location.href = "article";
}

function loadArticle() {
    document.getElementsByClassName("mainContent")[0].innerHTML = sessionStorage.getItem('article');
    document.getElementsByClassName('contentHidder')[0].hidden = true;
    document.getElementsByClassName('articleCC')[0].style.maxHeight = "none";
    document.getElementsByClassName('articleGoToButton')[0].onclick = function() { location.href = ".."; };
}

function loadArticleDebug() {
    document.getElementsByClassName('contentHidder')[0].hidden = true;
    document.getElementsByClassName('articleCC')[0].style.maxHeight = "none";
    document.getElementsByClassName('articleGoToButton')[0].onclick = function() { location.href = ".."; };
}
/***************************/