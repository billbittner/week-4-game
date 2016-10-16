
$(document).ready(function(){
    var i;
    var attackPowerLibrary = [6, 12, 24, 48];
    var gameStatus = "select player";

    /* function createCharacters(listOfCharacters){
        for(i = 0; i < listOfCharacters.length; i++) {
            //create player div
            var newPlayer = ("<div>");
            newPlayer.addClass("character");
            newplayer.attr("name", listOfCharacters[i].name);
            newPlayer.data("attackPower", #);
            newPlayer.data("HP", #);
            newPlayer.data("counterAttackPower", #);
            newplayer.prepend('<img id="theImg" src="theImg.png" />');
            $(".characters-to-select").append(newPlayer);
            //create player image
            playerImage = ("<img>");
            playerImage.attr("src", "#");
            playerImage.attr("alt", "#");
            newplayer.preAppend(playerImage);
         };
     }*/

    // function attack(player, opposingCharacter) {
    //     //attack oposing player
    //     $(this).data("healthPoints") -= $(".player").data("attackPower");  
    //     //increase the attack power by attack power
    //     $(".player").data("attackPower") += $(".player").data("attackPower");
    //     //oposing player attacks
    //     $(".player").data("healthPoints") -= $(this).data("counterAttackPower");
    // };

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

    //run the game
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
            var defenseHP = $(".defender").data("HP");
            var counterAttack = $(".defender").data("counterAttackPower");
            var playerHP = $(".player").data("HP");
            var attackPower = $(".player").data("attackPower");
            var attackIncrease = $(".player").data("attackPowerIncrease");
            //attack the defender 
            $(".defender").data("HP", (defenseHP - attackPower));
            //display defender's new health
            $(".defender > .health").html("Health: " + $(".defender").data("HP"));
            //alert description text
            alert("your attack did " + attackPower + " damage.");
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
        };
    });
});