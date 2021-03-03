<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Brick site</title>
    <link rel="stylesheet" href="styles/mainStyles.css">
    <script type="text/javascript" src="scripts/mainScript.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js"></script>
    <template></template>
</head>

<body onload="startup()">
    <div class="mainContent">
        <?php include 'inc/game_zone/gameZone.php'?>
    </div>
    <div class="sidebar">
        <ul id="sidebarList">

        </ul>
        <div class="devMenu">
            <button onclick="saveCookies()"> Save </button>
        </div>
    </div>
</body>

</html>