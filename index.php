<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <?php include "inc/header.php";?>
    <title>Ragoria</title>
</head>

<body onload="hljs.highlightAll();">
    <?php include 'inc/navigationHead.php' ?>
    <main>
        <div class="mainContent">
            <?php
            include "inc/ajustes.php";
            include "inc/articleTemplate.php";

            /* Constants */
            const PAGE_SIZE = 8; //Supongo que creare paginacion antes de crear tantos articulos (espero)

            /* Global variables */
            if (isset($_GET['page']) && $_GET['page'] != "") {
                $page = $_GET['page'];
            } else {
                $page = 1;
            }

            function show_articles(int $page)
            {
                global $conexion;
                /* Obtenemos todos los articulos de la página actual */
                $articulos = mysqli_query($conexion, "SELECT Title,Content,CreationDate FROM articles 
                ORDER BY CreationDate DESC 
                LIMIT " . $page * PAGE_SIZE . " OFFSET " . PAGE_SIZE * ($page - 1), MYSQLI_STORE_RESULT);

                /* Repasamos todos los articulos obtenidos y los presentamos en el html usando el archivo articleTemplate.php */
                while ($line = mysqli_fetch_assoc($articulos)) {
                    print_article($line['Title'], $line['Content'], $line['CreationDate']);
                }
            }

            function get_total_pages()
            {

                global $conexion;
                $num = mysqli_query($conexion,"SELECT COUNT(*) AS row_amount FROM articles");
                return mysqli_fetch_assoc($num)['row_amount']; //TODO Test if this works
            }

            /* Startup:  */
            show_articles($page);
            /* Esta linea es para escribir un artículo a mano hasta que haga un constructor in-web */
            /* include "inc/articleTemplateDebug.php"; */
            /*************/

            ?>
<!--             
    TODO PAGINATION:
            <div class="pagination">
                <a href='?page=1'>&#60;&#60;</a>
                <a>&#60;- anterior</a>
                <a>siguiente -&#62;</a>
                <a href='?page=2'>&#62;&#62;</a>
            </div> -->
        </div>
    </main>
    <?php include 'inc/footer.php' ?>
</body>

</html>