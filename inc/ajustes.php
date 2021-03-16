<?php
    //Create conexion here
    $conexion = mysqli_connect("localhost","root","","ragoria") or die("Conexion error");

    mysqli_query($conexion, "SET NAMES utf8");
?>