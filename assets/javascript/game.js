
$(document).ready(function(){
    var i;
    var attackPowerLibrary = [30, 10, 10, 10];
    var gameStatus = "select player";
    var characterList = [ 
        {
            name: "Luke Skywalker",
            picSrc: "assets/images/luke.jpg",
            picAlt: "Luke Skywalker"
        },
        {
            name: "Darth Vader",
            picSrc: "assets/images/vader.jpg",
            picAlt: "Darth Vader"
        },
        {
            name: "Emperor Palpatine",
            picSrc: "assets/images/emperor.jpg",
            picAlt: "Emperor Palpatine"
        },
        {
            name: "Princess Leia",
            picSrc: "assets/images/leia.jpg",
            picAlt: "Princess Leia"
        },
    ];

    function createCharacters(charactersToCreate){
        for(i = 0; i < charactersToCreate.length; i++) {
            //create player div
            var newPlayer = $("<div>");
            newPlayer.addClass("character");
            // newPlayer.data("attackPower", #);
            // newPlayer.data("HP", #);
            // newPlayer.data("counterAttackPower", #);
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
            playerHealth.html("health: ?");
            playerHealth.insertAfter(playerImage);
        };
    }

    //declare functions
    function setPlayerProperties(clickedPlayer) {
        clickedPlayer.addClass("player");
        //set attack power 
        clickedPlayer.data("attackPower", attackPowerLibrary[0]);
        attackPowerLibrary.splice(0,1);
        //set attack power increase
        clickedPlayer.data("attackPowerIncrease", clickedPlayer.data("attackPower"));
        //set hp
        clickedPlayer.data("HP", 100);
        //display HP
        $(".player > .health").html("Health: " + $(".player").data("HP"));
    };
    function setOpponentProperties(){
        $(".character").not(".player").each(function () {
            //set class to opponent
            $(this).addClass("opponent");
            //assign a random counter attack power
            var chooseAttackIndex = (Math.floor((Math.random() * attackPowerLibrary.length) + 1) - 1);
            $(this).data("counterAttackPower", attackPowerLibrary[chooseAttackIndex]);
            attackPowerLibrary.splice(chooseAttackIndex,1);
            console.log("the chosen counter attack = " + $(this).data("counterAttackPower"));
            //assign HP
            var startingHP = 100;
            $(this).data("HP", startingHP);
            console.log("the starting HP is = " + $(this).data("HP"));
        });
    };
    function resetGame(){
        //reset variables that need to be reset
        var attackPowerLibrary = [30, 10, 10, 10];
        var gameStatus = "select player";
        //create the characters
        createCharacters(characterList);
        //hide the restart button
        $(".restart-button").hide();
        
    };

    //run the game
    resetGame();  //DRY???
    //assign on click events
    $(".character").on("click", function(){
        console.log("a character was clicked");
        if (gameStatus === "select player") {
            console.log("& it was the first character clicked");
            //set the properties of this character
            setPlayerProperties($(this));
            //move character to proper row
            $(".player").appendTo(".your-character");
            console.log("the player should have moved");
            //set the properties of the other characters
            setOpponentProperties();
            //move opponents to the proper row
            $(".opponent").appendTo(".enemies-to-attack");
            console.log("the enemeies should have moved");
            //flip the gameStatus switch
            gameStatus = "select opponent";
        } else if (gameStatus === "select opponent"){
            if( $(this).hasClass("opponent") ){
                //assign the character the defender class
                $(this).addClass("defender");
                //move the character to the defender area;
                $(".defender").appendTo(".defender-area");
                //display HP
                $(".defender > .health").html("Health: " + $(this).data("HP"));
                //flip the gamestatus switch
                gameStatus = "fight defender";
            };
        } else if (gameStatus === "fight defender") {
            //do nothing
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
            alert("your attack did " + attackPower + " damage.");
            
            //check to see if the bad guy is defeated
            if ($(".defender").data("HP") <= 0) {
                //alert that you won
                alert("you defeated the defender!");
                //remove the bad guy's div and all contents from the game
                $(".defender").remove()
                //see if here are any more defenders
                if ($(".opponent").length > 0) {
                    //reset game status
                    gameStatus = "select opponent";
                    //give direction to the player
                    alert("choose a new defender!");
                } else {
                    //display that the player has won!
                    alert("congratulations!  you now rule the galaxy!")
                    //show reset button
                    $(".restart-button").show(); 
                };
                
            //if the bad guy was not defeated, do his counter attck
            } else {
                //do all the counter attack calculations and updates
                //increase the attack power by attack power increase
                $(".player").data("attackPower", (attackPower + attackIncrease));
                //alert description text
                alert("your attack increased to: " + $(".player").data("attackPower"));
                //oposing player attacks
                $(".player").data("HP", (playerHP - counterAttack));
                //display your new health
                $(".player > .health").html("Health: " + $(".player").data("HP"));
                //alert descriptive text
                alert("you were counter attacked by " + counterAttack + " damage.");

                //see if the player was defeated
                if($(".player").data("HP") < 0 ){
                    //display that the player was defeated
                    alert("you were defeated!");
                    //show reset button
                    $(".restart-button").show();                   
                };

            };
        };
    });
    $(".restart-button").on("click", function(){
        //remove all characters
        $(".character").each().remove();
        //restart game
        resetGame();
    });
});