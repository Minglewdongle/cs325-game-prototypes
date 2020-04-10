"use strict";

function make_main_game_state( game )
{
    function preload() {
		
		
    }
    "use strict";

var GameStates = {};
/**creating variables */
var player;
controls = {
	right: game.input.keyboard.addKey(Phaser.Keyboard.D),
	left: game.input.keyboard.addKey(Phaser.Keyboard.A),
	up: game.input.keyboard.addKey(Phaser.Keyboard.W),
	down: game.input.keyboard.addKey(Phaser.Keyboard.S),
	interact: game.input.keyboard.addKey(Phaser.Keyboard.X),
	cancel: game.input.keyboard.addKey(Phaser.Keyboard.C),
}
function create() {
/*
	 map = game.add.tilemap('map', 16, 16);
	 
	 map.addTilesetImage('tileset');
	 
	 layer = map.createLayer(0); 

	 layer.resizeWorld();
	 
	 map.setCollisionBetween(0, 10000, true); // for touching tiles in tilemap.
	 
	 */
	 player = this.add.sprite(8 * 16, 60 * 16, 'player'); 
	 
	 player.anchor.setTo(0.5, 0.5) 
/*
	 player.animations.add('neutral_left', [0], 10, true); 
	 player.animations.add('neutral_right', [1], 10, true); 
	 player.animations.add('left', [2, 4, 6], 10, true);
	 player.animations.add('left_jump', [8], 10, true);
	 player.animations.add('right', [3, 5, 7], 10, true);
	 player.animations.add('right_jump', [9], 10, true);
*/ 
	 
	 //Enabling physics ARCADE on the player
	 game.physics.arcade.enable(player);
	 //Player physics properties. Give the player some bounceyness.
	 //player.body.bounce.y = 0.2; //test
	 game.camera.follow(player);
	 player.body.collideWorldBounds = true;
	 

	 /*create player level and enemies */


	}

	/**update */
	function update() {

	}



	makeBoot = function( game ) {
    return {
        init: function () {
    
            //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
            game.input.maxPointers = 1;
    
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            game.stage.disableVisibilityChange = true;
    
            if (game.device.desktop){
                //  If you have any desktop specific settings, they can go in here
                game.scale.pageAlignHorizontally = true;
            }
            else{
                //  Same goes for mobile settings.
                //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                game.scale.setMinMax(480, 260, 1024, 768);
                game.scale.forceLandscape = true;
                game.scale.pageAlignHorizontally = true;
            }
        },	
        preload: function () {
    
            //  Here we load the assets required for our Preloader state (in this case a background and a loading bar)
            game.load.image('preloaderBackground', 'assets/preloader_background.jpg');
            game.load.image('preloaderBar', 'assets/preloader_bar.png');
    
        },
        create: function () {
            //  By this point the preloader assets have loaded to the cache, we've set the game settings
            //  So now let's start the real preloader going
            game.state.start('Preloader');
        }
    };
};








window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	
	// An object for shared variables, so that them main menu can show
	// the high score if you want.
	var shared = {};
		
	// Boot loads in the loading bar and background in preloader
	game.state.add( 'Boot', makeBoot( game ) );
	// Preloader loads all the stuff from boot
	game.state.add( 'Preloader', makePreloader( game ) );
	// MainMenu loads in the background music and the playbutton before letting you play the game
	game.state.add( 'MainMenu', makeMainMenu( game, shared ) );
	// Game is the file that actually has the entire game in it
	game.state.add( 'Game', makeGame( game, shared ) );
    // GameOver is the state of the game over screen
    game.state.add( 'Battle', makeBattle( game, shared ) );
	// GameOver is the state of the game over screen
	game.state.add( 'GameOver', makeGameOver(game));


	//	Now start the Boot state.
	game.state.start('Boot');
};
}