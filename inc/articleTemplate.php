<?php
$atitle;
$acontent;
$adate;
function get_printed_article($title, $content, $date)
{
    return <<<"EOT"
<div class="articleContainer">
    <h3 class="articleTitle"> $title </h3>
    <div class="articleCC">
        <div class="articleContent"> $content </div>
        <div class="contentHidder"></div>
    </div>
    <hr class="articleSeparator">
    <button class="articleGoToButton" onclick="openArticle(this)"> Go to &#10142; </button>
    <p class="articleDate"> $date </p>
</div>
EOT;
}
?>
