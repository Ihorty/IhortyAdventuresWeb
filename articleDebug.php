<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <?php include "inc/header.php";?>
    <title>Ragoria</title>
</head>

<body onload="hljs.highlightAll();loadArticleDebug()">
    <?php include 'inc/navigationHead.php' ?>
    <main>
        <div class="mainContent">
            <?php 
                include 'inc/articleTemplateDebug.php'
            ?>
        </div>
    </main>
    <?php include 'inc/footer.php' ?>
</body>

</html>