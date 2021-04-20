<div class="articleContainer">
    <h3 class="articleTitle"> Php conectado a la base de datos web! [2] </h3>
    <div class="articleCC">
        <div class="articleContent">
            <p>
                Ahora que tenemos una manera fácil de crear artículos mediante código, sólo tendremos que unir los dos conceptos. La llamada a la base de datos mediante php y la muestra de datos.
                <br>Os muestro la función final ahora:</p>
                <pre><code>
                function show_articles(int $page)
                    {
                        global $conexion;
                        /* Obtenemos todos los articulos de la página actual */
                        $articulos = mysqli_query($conexion, "SELECT  Title,Content,CreationDate
                        FROM articles ORDER BY CreationDate DESC" , MYSQLI_STORE_RESULT);
        
                        /* Repasamos todos los articulos obtenidos y los presentamos en el html usando el archivo articleTemplate.php */
                        while ($line = mysqli_fetch_assoc($articulos)) {
                            print_article($line['Title'], $line['Content'], $line['CreationDate']);
                        }
                    }
                </code></pre><p>
                La explico linea a linea;
                <br>Primero tenemos que poder acceder a la variable $conexion, que fue declarada fuera de ésta funcion. Para ello le ponemos el "global" antes de la variable.
                <br>Con la conexion, realizo una llamada en código SQL para obtener sólo las filas "Title", "Content" y "CreationDate" de la base de datos, no necesito más que esos datos:
                </p>
                <pre><code>
                SELECT  Title, Content, CreationDate FROM articles ORDER BY CreationDate DESC
                </code></pre>
                <p>
                Este código lo ponemos entre comillado en la funcion msqli_query y como 3er parametro le metemos una constante de Mysqli: "MYSQLI_STORE_RESULT". Dice que guarde el resultado en la variable que le hemos pedido: "$articulos".
                <br><br>Y el último paso, como dice en el comentario del código, repasamos por todo el contenido de lo que hemos recogido con un while y enviamos los datos a la función que hicimos el otro día: "print_article".
                <br><br><br> Y ya está! Con ésto imprimimos todos los artículos que estén guardados en la base de datos a la página principal! Si quereis ver todos los archivos .css y .php os recuerdo que teneis disponible el código fuente en mi <a href="https://github.com/ihorty">Github</a>, con el link disponible también en el píe de página.
                </p>
        
        </div>
        <div class="contentHidder"></div>
    </div>
    <hr class="articleSeparator">
    <button class="articleGoToButton"> Go to &#10140; </button>
    <p class="articleDate"> 31/02/2012 </p>
</div>