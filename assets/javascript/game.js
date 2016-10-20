
$(document).ready(function(){
    //declare variables 
    var i;
    var gameStatus;
    var characterStats = [];
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
        characterStats = [
            {
                attackPower: 10,
                hitPoints: 100
            },
            {
                attackPower: 15,
                hitPoints: 120
            },
            {
                attackPower: 20,
                hitPoints: 150
            },
            {
                attackPower: 30,
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
            //create player health display
            var playerHealth = $("<p>");
            playerHealth.addClass("health");
            playerHealth.html("Health: ?");
            playerHealth.insertAfter(playerImage);
        };
    };

    //declare functions
    function setPlayerProperties(clickedPlayer) {
        clickedPlayer.addClass("player");
        //choose an element from the opponent stats array
        var stats = (Math.floor(Math.random() * characterStats.length));
        //set attack power 
        clickedPlayer.data("attackPower", characterStats[stats].attackPower);
        //set attack power increase
        clickedPlayer.data("attackPowerIncrease", characterStats[stats].attackPower);
        //set hp
        clickedPlayer.data("HP", characterStats[stats].hitPoints);
        //remove the chosen element from the stats array
        characterStats.splice(stats,1);
        //display HP
        $(".player > .health").html("Health: " + $(".player").data("HP"));
    };
    function setOpponentProperties(){
        $(".character").not(".player").each(function () {
            //set class to opponent
            $(this).addClass("opponent");
            //choose an element from the opponent stats array
            var stats = (Math.floor(Math.random() * characterStats.length));
            //assign the counter attack from this element to the character
            $(this).data("counterAttackPower", characterStats[stats].attackPower);
            //assign the hit points from this element to the character
            $(this).data("HP", characterStats[stats].hitPoints);
            //remove the chosen element from the stats array
            characterStats.splice(stats,1);
        });
    };
    function restartGame(){
        //remove all characters
        $(".character").each( function() {
            $(this).remove();
        });
        //reset the stats array
        setStats();
        //create the characters
        createCharacters(characterList);
        //reset game status to select player
        gameStatus = "select player";
        //clear game updates
        clearGameUpdates();
        //hide the restart button
        $(".restart-button").hide();
    };
    function clearGameUpdates() {
        $(".game-updates").each( function() {
            $(this).html("");
        });
    };

    //run the game
    //set the stats (pull from object so only one place to replace them.  can also be called to reset the stats for new game)
    setStats();
    //create the character divs
    createCharacters(characterList);
    //set game status
    gameStatus = "select player";
    //hide the restart button
    $(".restart-button").hide();

    //assign on click events
    $(".characters-to-select").on("click",".character", function(){  //$(".character").on("click", function(){
        if (gameStatus === "select player") {
            //set the properties of this character
            setPlayerProperties($(this));
            //move character to proper row
            $(".player").appendTo(".your-character");
            //set the properties of the other characters
            setOpponentProperties();
            //move opponents to the opponent area
            $(".opponent").appendTo(".enemies-to-attack");
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
            //clear the game update description text
            clearGameUpdates();
        };
    });

    $(".attack-button").on("click", function(){
        if (gameStatus === "fight defender"){
            //define variables and store data from the player and defender
            var playerHP = $(".player").data("HP");
            var attackPower = $(".player").data("attackPower");
            var attackIncrease = $(".player").data("attackPowerIncrease");
            var defenseHP = $(".defender").data("HP");
            var counterAttack = $(".defender").data("counterAttackPower");

            //do all the attack calculations and updates
            //attack the defender 
            $(".defender").data("HP", (defenseHP - attackPower));
            //display defender's new health
            $(".defender > .health").html("Health: " + $(".defender").data("HP"));
            //update the game update description text
            $(".game-updates-line-one").html("your attack did " + attackPower + " damage.");
            //check to see if the bad guy is defeated
            if ($(".defender").data("HP") <= 0) {
                //update the game update text that you won
                clearGameUpdates();
                $(".game-updates-line-one").html("you defeated the defender!");
                //remove the bad guy's div and all its contents from the game
                $(".defender").remove()
                //see if there are any more defenders left to beat
                if ($(".opponent").length > 0) {
                    //change game status to 'pick opponent'
                    gameStatus = "select opponent";
                    //give direction to the player
                    $(".game-updates-line-two").html("choose a new defender!");
                } else {
                    //display that the player has won!
                    $(".game-updates-line-two").html("congratulations! You now rule the galaxy!  Click restart to play again.")
                    //show restart button
                    $(".restart-button").show(); 
                    //change game state 
                    gameStatus = "restart time";
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
                $(".game-updates-line-two").html("You were counter attacked by " + counterAttack + " damage.");
                //see if the player was defeated
                if($(".player").data("HP") <= 0 ){
                    //display that the player was defeated
                    $(".game-updates-line-one").html("you were defeated!");
                    $(".game-updates-line-two").html("Click restart to play again.")
                    //show restart button
                    $(".restart-button").show();   
                    gameStatus = "restart time";                
                };

            };
        };
    });

    $(".restart-button").on("click", function(){
        if(gameStatus === "restart time"){  
            //restart game
            restartGame();
        };
    });

});