<?php

function print_article($title, $content, $date)
{
    $html = <<<"EOT"
<div class="articleContainer">
    <h3 class="articleTitle"> $title </h3>
    <div class="articleContent"> $content </div>
    <hr class="articleSeparator">
    <button class="articleGoToButton"> Go to &#10140; </button>
    <p class="articleDate"> $date </p>
</div>
EOT;
    echo $html;
}
