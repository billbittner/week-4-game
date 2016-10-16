
var i;
var attackPowerLibrary = [6, 12, 24, 48],

// function createCharacters(listOfCharacters){
//     for(i = 0; i < listOfCharacters.length; i++) {
//         var newPlayer = ("<div>");
//         newPlayer.addClass("character");
//         newplayer.attr("name", listOfCharacters[i].name);
//         newplayer.innerHTML("<img");
//     };
// }

function setPlayerProperties(){
    $(this).addClass("player");
    $(this).data("attackPower", attackPowerLibrary[0]);
    attackPowerLibrary.splice(0,1);
};

function setOpponentProperties(){
    $(".character").not(".player").each(function () {
        $(this).addClass("opponent");
        var attacksLeft = attackPowerLibrary.length;
        var chooseAttack = (Math.floor((Math.random() * attacksLeft) + 1) - 1);
        $(this).data("counterAttackPower", attackPowerLibrary[chooseAttack]);
        attackPowerLibrary.splice(chooseAttack,1);
        console.log($(this).data("name") + " counter attack = " + $(this).data("counterAttackPower"));
    })
    

// };

function attack(player, opposingCharacter) {
    //attack oposing player
    $(this).data("healthPoints") -= $(".player").data("attackPower");  
    //increase the attack power by attack power
    $(".player").data("attackPower") += $(".player").data("attackPower");
    //oposing player attacks
    $(".player").data("healthPoints") -= $(this).data("counterAttackPower");
};




//run the game

//create 4 characters and place them in the top row.  assign generic elements.
// createCharacters(game.characterLibrary);

$(".character").on("click", function(){
    if (/*no character has been selected*/) {
        //set the properties of this character
        setPlayerProperties();
        //set the properties of the other characters
        setOpponentProperties();
    };

});