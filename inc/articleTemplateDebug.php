<div class="articleContainer">
    <h3 class="articleTitle"> Php conectado a la base de datos web! </h3>
    <div class="articleContent">
        <?php
        $content_of_article = '<p>
        Esto lo he conseguido realizar dando varios pasos, el primero de ellos es modularizar y hacer posible la construccion de artículos:
    </p>
    <pre><code>
 $conexion = mysqli_connect("servidor_de_bdd", "usuario_de_bdd", "contraseña_de_bdd", "base_de_datos")
  or die("Conexion error");
 mysqli_query($conexion, "SET NAMES utf8"); //Esta línea es para que las tíldes funcionen
    </code></pre>
    <p>
        Tras realizar la conexion y pensarlo un poco, me dí cuenta de que no tengo una manera de presentar el artículo. Una vez obtenga el artículo no sé como mostrarlo.<br>
        Para corregir eso, pausé la parte de conexión y empecé a modularizar el artículo en sí: <br>
        <ul>
            <li>Creamos un nuevo archivo php que es artículo y separamos todo el html que tenemos sobre el artículo en el.<br>Copy paste sin pensarlo mucho.</li>
            <li>Después lo metemos dentro de un string de php. Hay varias maneras, entre ellas podemos imitar a js:</li>
        </ul>
    </p>
    <pre><code class="language-php">
 $articulo = "&#60;div class=\'articulo\'>" . $contenido_de_articulo . "&#60;/div>";
    </code></pre>
    <p>pero yo vi más comodo usar EOT, sobre todo para múltiples líneas:</p>
    <pre><code class="language-php">
$articulo = &#60;&#60;&#60;"EOT"
&#60;div class="articulo">
    $contenido_de_articulo
&#60;div>
EOT;
    </code></pre>
    <p> Tened en cuenta que el principio del EOT como el final tienen que estar en líneas separadas para que funcione correctamente, vuestro IDE os corregira.<br>
    Tras varias pruebas acabé con un código tal que así:</p>
    <pre><code class="language-php-template">
    &#60;?php
    function print_article($title, $content, $date)
    {
        $html = &#60;&#60;&#60; "EOT" </code><code class="language-html">
            &#60;div class="articleContainer" >
                &#60;h3 class="articleTitle"> $title &#60;/h3>
                &#60;div class="articleContent"> $content &#60;/div>
                &#60;hr class="articleSeparator">
                &#60;button class="articleGoToButton"> Go to &#10140; &#60;/button>
                &#60;p class="articleDate"> $date &#60;/p>
            &#60;/div> </code><code>
            EOT;
            
        echo $html;
    }
    ?>
    </code></pre>

    <p>Con este archivo sólo nos hace falta meter el siguiente código en cualquier sitio que queramos meter un articulo:</p>
    <pre><code>
    include "inc/articleTemplate.php";
    print_article($titulo, $contenido, $fecha);
    </code></pre>
    <p>Claramente donde entra $titulo sería el título del artículo en concreto, $contenido seria el texto completo (aunque ahora uso el texto con formato html, mas adelante os cuento) y $fecha pues fecha de cuando fue creado (vease abajo a la derecha de cada artículo).
    <br><br>
    Con esto conseguimos modularizar los artículos y podremos separarlos y publicarlos donde sea. Más adelante veremos la parte dos, donde subiremos los artículos a la base de datos y los importaremos de ahi usando php.
    </p>
    ';
        echo $content_of_article;
        ?>
    </div>
    <hr class="articleSeparator">
    <button class="articleGoToButton"> Go to &#10140; </button>
    <p class="articleDate"> 31/02/2012 </p>
</div>