"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    

    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'marsh', 'assets/Marsh.png' );
        game.load.image( 'sunrise', 'assets/sunset.png' );
        game.load.image( 'ice', 'assets/ice.png' );
        game.load.image( 'fire', 'assets/fire.gif');
        game.load.image( 'water', 'assets/tex_Water.jpg');
    }
    
    var bouncy;
    
    var player;
    var input;
    var fire;

    var winText;
    function create() {

        room=game.add.tileSprite(0,0,800,600,'sunrise');
        player=game.add.sprite(game.world.centerX-400,game.world.centerY=+200,'marsh');
        game.physics.enable(player, Phaser.Physics.ARCADE);
        input=game.input.keyboard.createCursorKeys();
        player.body.collideWorldBounds=true;
        fire=game.add.sprite(game.world.centerX-100,game.world.centerY=+200,'fire');
        ice=game.add.sprite(game.world.centerX -200,game.world.centerY=+200,'ice');
        water=game.add.sprite(game.world.centerX ,game.world.centerY=+200,'water');
        


        winText= game.add.text(game.world.centerX,game.world.centerY, 'You stopped the fire!', font: "30px Verdana", fill: "#9999ff", align: "center");




        // Create a sprite at the center of the screen using the 'logo' image.
        bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'marsh' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        bouncy.body.collideWorldBounds = true;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
    
    
    }
};
