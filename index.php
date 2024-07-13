<?php
// switch on minify for remote servers
if ($_SERVER['SERVER_PORT'] == "443" || $_SERVER['SERVER_PORT'] == "80") // default SSL port number OR http: port number
{
    $min_url = ".min";
} else {
    $min_url = "";
} 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solitaire</title>
    <link rel="stylesheet" href="./assets/solitaire<?php echo $min_url; ?>.css">
    <script src="./scripts/solitaire<?php echo $min_url; ?>.js" type="module"></script>
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
</head>

<body>
    
    <h1 class="linear-wipe">Congratulations! <br />You won.</h1>
    <button id="winBtn" accesskey="c">Celebrate!</button>

    <button id="newBtn" accesskey="n">New Game</button>
    <button id="rldBtn" accesskey="r">Reload Game</button>
    <button id="sveBtn" accesskey="s">Save Game</button>
    <button id="undoBtn" accesskey="z">Undo last move</button>
    <button id="genBtn" accesskey="g">Generate ID</button>
    <button id="muteBtn" accesskey="m">♪</button>

    <div>
        <div class ="container" id="stockPileDiv"></div>
        <div class ="container" id="openPileDiv"></div>

        <div class="container bay" id="bay♣Div" data-suit="♣" data-ord="0">♣ Bay</div>
        <div class="container bay" id="bay♦Div" data-suit="♦" data-ord="0">♦ Bay</div>
        <div class="container bay" id="bay♥Div" data-suit="♥" data-ord="0">♥ Bay</div>
        <div class="container bay" id="bay♠Div" data-suit="♠" data-ord="0">♠ Bay</div>
    </div>

    <div>
        <div class="container stack" id="stack1Div">1st stack</div>
        <div class="container stack" id="stack2Div">2nd stack</div>
        <div class="container stack" id="stack3Div">3rd stack</div>
        <div class="container stack" id="stack4Div">4th stack</div>
        <div class="container stack" id="stack5Div">5th stack</div>
        <div class="container stack" id="stack6Div">6th stack</div>
        <div class="container stack" id="stack7Div">7th stack</div>
    </div>
</body>
</html>