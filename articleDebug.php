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
        <!-- Form to write the article in web -->
        <form style="width: 100%;margin: 16px">
        <label>Title: </label>
        <input type="text" name="title" oninput="document.getElementsByClassName('articleTitle')[0].innerHTML=this.value;">
        <br><label>Content: </label><br>
        <textarea style="width: 100%;" name="content" oninput="document.getElementsByClassName('articleContent')[0].innerHTML=this.value;"></textarea>
        </form>
        <hr class="articleSeparator">
        <!--  -->
            <?php 
                include 'inc/articleTemplateDebug.php'
            ?>
        </div>
    </main>
    <?php include 'inc/footer.php' ?>
</body>

</html>