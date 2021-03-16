<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <script type="text/javascript" src="scripts/main.js"></script>
    <link rel="stylesheet" href="styles/main.css">
    <title>Ragoria</title>
</head>

<body>
    <?php include 'inc/navigationHead.php' ?>
    <main>
        <div class="mainContent">
            <?php
            include "inc/ajustes.php";
            include "inc/articleTemplate.php";

            /* Constants */
            const PAGE_SIZE = 5;

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

                echo <<<EOC
                <scrpit>console.log("entra en $page")</script>
                EOC;
            }

            function get_total_pages()
            {
            }

            /* Startup:  */
            show_articles($page);
            /*************/

            ?>
            <div class="pagination">
                <a href='?page=1'>&#60;&#60;</a>
                <a>&#60;- anterior</a>
                <!-- Implementamos programaticamente la cantidad de paginas que tenemos -->
                <?php
                /* TODO: cuando las paginas excedan un número en concreto, poner un separador "..." entre las 
                        páginas cercanas a la actual y las primeras y últimas */

                ?>
                <a>siguiente -&#62;</a>
                <a href='?page=2'>&#62;&#62;</a>
            </div>
        </div>
    </main>
    <?php include 'inc/footer.php' ?>
</body>

</html>