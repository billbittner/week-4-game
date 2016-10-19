
$(document).ready(function(){
    //declare variables 
    var i;
    var gameStatus;
    var playerStats = {};
    var opponentStats = [];
    var characterOne = {
            name: "Luke Skywalker",
            picSrc: "assets/images/luke.jpg",
            picAlt: "Luke Skywalker"
        };
    var characterTwo = {
            name: "Darth Vader",
            picSrc: "assets/images/vader.jpg",
            picAlt: "Darth Vader"
        };
    var characterThree = {
            name: "Emperor Palpatine",
            picSrc: "assets/images/emperor.jpg",
            picAlt: "Emperor Palpatine"
        };
    var characterFour = {
            name: "Princess Leia",
            picSrc: "assets/images/leia.jpg",
            picAlt: "Princess Leia"
        };
    var characterList = [characterOne, characterTwo, characterThree, characterFour];

    //declare functions 
    function setStats(){
        playerStats = {
            attackPower: 30,
            attackPowerIncrease: 30,
            hitPoints: 120
        };
        opponentStats = [
            {
                counterAttack: 10, 
                hitPoints: 100
            },
            {
                counterAttack: 20, 
                hitPoints: 150
            },
            {
                counterAttack: 30, 
                hitPoints: 200
            }
        ];
    };
    function createCharacters(charactersToCreate){
        for(i = 0; i < charactersToCreate.length; i++) {
            //create player div
            var newPlayer = $("<div>");
            newPlayer.addClass("character");
            newPlayer.data("name", charactersToCreate[i].name); //only necessary for debug
            $(".characters-to-select").append(newPlayer);
            //create player characer title
            var playerTitle = $("<p>");
            playerTitle.addClass("character-title");
            playerTitle.html(charactersToCreate[i].name);
            playerTitle.appendTo(newPlayer);
            //create player image
            var playerImage = $("<img>");
            playerImage.addClass("character-pic");
            playerImage.attr("src", charactersToCreate[i].picSrc);
            playerImage.attr("alt", charactersToCreate[i].picAlt);
            playerImage.insertAfter(playerTitle);
            //create player health
            var playerHealth = $("<p>");
            playerHealth.addClass("health");
            playerHealth.html("Health: ?");
            playerHealth.insertAfter(playerImage);
        };
        //console log
        console.log("i created all the characters");
    };

    //declare functions
    function setPlayerProperties(clickedPlayer) {
        clickedPlayer.addClass("player");
        //set attack power 
        clickedPlayer.data("attackPower", playerStats.attackPower);
        //set attack power increase
        clickedPlayer.data("attackPowerIncrease", playerStats.attackPowerIncrease);
        //set hp
        clickedPlayer.data("HP", playerStats.hitPoints);
        //display HP
        $(".player > .health").html("Health: " + $(".player").data("HP"));
    };
    function setOpponentProperties(){
        $(".character").not(".player").each(function () {
            //set class to opponent
            $(this).addClass("opponent");
            //assign an element from the opponent stats array
            var chooseStats = (Math.floor(Math.random() * opponentStats.length));
            //assign the counter attack from this element to the character
            $(this).data("counterAttackPower", opponentStats[chooseStats].counterAttack);
            console.log($(this).data("name") +" counter attack = " + $(this).data("counterAttackPower"));
            //assign the hit points from this element to the character
            $(this).data("HP", opponentStats[chooseStats].hitPoints);
            console.log($(this).data("name") +" starting HP = " + $(this).data("HP"));
            //remove one element from the stats array
            opponentStats.splice(chooseStats,1);
        });
    };
    function restartGame(){
        //remove all characters
        $(".character").each( function() {
            console.log("i will remove " + $(this).data("name"));
            $(this).remove();
            console.log("i removed " + $(this).data("name"));
        });
        //reset the variables as necessary
        setStats();
        //create the characters
        createCharacters(characterList);
        //restart game status
        gameStatus = "select player";
        //clear game updates
        clearGameUpdates();
        //hide the restart button
        $(".restart-button").hide();
        console.log("I restarted the game.  Game status is: " + gameStatus);
    };
    function clearGameUpdates() {
        $(".game-updates").each( function() {
            $(this).html("");
        });
    };

    //run the game
    //set non-permanent variables
    setStats();
    //create the characters
    createCharacters(characterList);
    //set game status
    gameStatus = "select player";
    //hide the restart button
    $(".restart-button").hide();
    console.log("I started the game.  Game status is: " + gameStatus);

    //assign on click events
    $(".characters-to-select").on("click",".character", function(){  //$(".character").on("click", function(){
        console.log("a character was clicked");
        if (gameStatus === "select player") {
            //set the properties of this character
            setPlayerProperties($(this));
            //move character to proper row
            $(".player").appendTo(".your-character");
            console.log("the player should have moved");
            //set the properties of the other characters
            setOpponentProperties();
            //move opponents to the opponent area
            $(".opponent").appendTo(".enemies-to-attack");
            console.log("the enemeies should have moved");
            //flip the gameStatus switch
            gameStatus = "select opponent";
        };
    });
    $(".enemies-to-attack").on("click",".character", function(){
        if (gameStatus === "select opponent"){
            //assign the character the defender class
            $(this).addClass("defender");
            //move the character to the defender area;
            $(".defender").appendTo(".defender-area");
            //display HP
            $(".defender > .health").html("Health: " + $(this).data("HP"));
            //flip the gamestatus switch
            gameStatus = "fight defender";
        };
    });

    $(".attack-button").on("click", function(){
        if (gameStatus === "fight defender"){
            //define variables
            var defenseHP = $(".defender").data("HP");
            var counterAttack = $(".defender").data("counterAttackPower");
            var playerHP = $(".player").data("HP");
            var attackPower = $(".player").data("attackPower");
            var attackIncrease = $(".player").data("attackPowerIncrease");

            //do all the attack calculations and updates
            //attack the defender 
            $(".defender").data("HP", (defenseHP - attackPower));
            //display defender's new health
            $(".defender > .health").html("Health: " + $(".defender").data("HP"));
            //alert description text
            $(".game-updates-line-one").html("your attack did " + attackPower + " damage.");
            //check to see if the bad guy is defeated
            if ($(".defender").data("HP") <= 0) {
                //alert that you won
                clearGameUpdates();
                $(".game-updates-line-one").html("you defeated the defender!");
                //remove the bad guy's div and all contents from the game
                $(".defender").remove()
                //see if here are any more defenders
                if ($(".opponent").length > 0) {
                    //restart game status
                    gameStatus = "select opponent";
                    //give direction to the player
                    $(".game-updates-line-two").html("choose a new defender!");
                } else {
                    //display that the player has won!
                    $(".game-updates-line-two").html("congratulations! You now rule the galaxy!  Click restart to play again.")
                    //show restart button
                    $(".restart-button").show(); 
                };
            //if the bad guy was not defeated, do his counter attck
            } else {
                //do all the counter attack calculations and updates
                //increase the attack power by attack power increase
                $(".player").data("attackPower", (attackPower + attackIncrease));
                //oposing player attacks
                $(".player").data("HP", (playerHP - counterAttack));
                //display your new health
                $(".player > .health").html("Health: " + $(".player").data("HP"));
                //alert descriptive text
                $(".game-updates-line-two").html("you were counter attacked by " + counterAttack + " damage.");
                //see if the player was defeated
                if($(".player").data("HP") <= 0 ){
                    clearGameUpdates();
                    //display that the player was defeated
                    $(".game-updates-line-one").html("you were defeated!");
                    $(".game-updates-line-two").html("Click restart to play again.")
                    //show restart button
                    $(".restart-button").show();                   
                };

            };
        };
    });

    $(".restart-button").on("click", function(){
        //console log
        console.log("restarting game");      
        //restart game
        restartGame();
    });

});