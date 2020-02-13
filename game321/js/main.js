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
        game.load.image( 'wet_marsh', 'assets/Marsh.png' );
        game.load.image( 'sunrise', 'assets/sunset.png' );
        game.load.image( 'ice', 'assets/ice.png' );
        game.load.image( 'fire', 'assets/fire.gif');
        game.load.image( 'water', 'assets/tex_Water.jpg');
        game.load.image('ground', 'assets/ground.png');
    }
    
    var bouncy;
    
    var player;
    var input;
    var fire;
    var wet=false;
    var platforms;
    var ice;
    function create() {

        game.add.sprite(0,0,'sunrise');
        ice=game.add.group();
        
        platforms=game.add.group();
        platforms.enableBody=true;

        platforms.enableBody=true;
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2,2);

        ground.body.immovable = true;
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;


        player=game.add.sprite(game.world.centerX-400,game.world.centerY+200,'marsh');
        game.physics.arcade.enable(player);
        input=game.input.keyboard.createCursorKeys();
        player.body.collideWorldBounds=true;
        
        player.body.gravity.y = 300;

        fire=game.add.sprite(-130, 250,'fire');

        water=game.add.sprite(game.world.centerX ,game.world.centerY+200,'water');
        
        var style = { font: "15px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Gotta Put Out The Fire!", style );
        text.anchor.setTo( 0.5, 0.0 );
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    if(input.down.isDown){
        player.body.velocity.y=200;
    }  
    if(input.left.isDown){
    player.body.velocity.x=-80;
    }
    if(input.right.isDown){
    player.body.velocity.x=80;
    }
    
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -250;
    }


    game.physics.arcade.overlap(player, water,inWater,null,this);
    game.physics.arcade.overlap(player, ice, onIce,null,this);
    game.physics.arcade.overlap(player,fire, onFire,null,this);
    
    

    }
    function inWater(){
        wet=true;
        player.sprite='wet_marsh';
    }
    function onIce(){
        player.kill();
        ice.create(player.x, player.y, 'ice');
        player=game.add.sprite(game.world.centerX-400,game.world.centerY=+200,'marsh');
        wet=false;
    }
    function onFire(){
        if(wet==false){
        player.kill();
        player=game.add.sprite(game.world.centerX-400,game.world.centerY=+200,'marsh');
        }
        else{
            fire.kill();
            wet=false;

            //only one fire in the game so players win when it's put out.
            
        game.add.text(game.world.centerX,game.world.centerY, 'You stopped the fire!');
    }

    }
};
