<?php

    //Mi conexion local, cuando el servidor esté subido
    $conexion = mysqli_connect("192.168.1.128","IhortyReader","R34d3r@PotatoDatabase","ragoria","3307");

    //Mi conexion accedida desde cualquier punto del mundo (permito probar vuestras paginas con mi contenido <3)
    //$conexion = mysqli_connect("ragoria.com","IhortyReader","R34d3r@PotatoDatabase","ragoria", "3307"); //TODO aun no funciona

    //Mi conexion local de xampp si todo lo demás falla. Esta conexion fallará si está en mi hosting
    //$conexion = mysqli_connect("localhost","root","","ragoria");

    //Compatibilidad para simbolos y tildes:
    mysqli_query($conexion, "SET NAMES utf8");
?>