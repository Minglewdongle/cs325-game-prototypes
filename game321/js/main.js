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
        game.load.image( 'wet_marsh', 'assets/wet_marsh.png' );
        game.load.image( 'sunrise', 'assets/sunrise.png' );
        game.load.image( 'ice', 'assets/ice.png' );
        game.load.image( 'fire', 'assets/fire.gif');
        game.load.image( 'water', 'assets/tex_Water.jpg');
        game.load.image('ground3', 'assets/ground3.png');

        game.load.audio('bounce', 'assets/bounce.mp3');
        game.load.audio('splash', 'assets/splash.mp3');
        game.load.audio('flame', 'assets/flame.mp3');
        
    }
    
    
    var player;
    var input;
    var star;
    var water;
    var wet=false;
    var platforms;
    var text;
    var firenum=3;
    var bounce;
    var splash;
    var flame;
    var ice;
    function create() {
        bounce=game.add.audio('bounce');
        splash=game.add.audio('splash');
        flame=game.add.audio('flame');
   game.add.sprite(0,0,'sunrise');
        
        ice=game.add.group();
        
        platforms=game.add.group();
        platforms.enableBody=true;



        var ground = platforms.create(0, game.world.height - 30, 'ground3');
        ground.scale.setTo(10,1/2);
        ground.body.immovable = true;

        var ledge = platforms.create(400, 400, 'ground3');
        ledge.body.immovable = true;
        ledge.scale.setTo(2,1/2);
        ledge = platforms.create(0, 300, 'ground3');
        ledge.body.immovable = true;
        ledge=platforms.create(200, 400, 'ground3');
        ledge.scale.setTo(1/2,4);
        ledge.body.immovable = true;
        
        ledge=platforms.create(592, 220, 'ground3');
        ledge.scale.setTo(1/2,2);
        ledge.body.immovable = true;

        ledge=platforms.create(700, 100, 'ground3');
        ledge.body.immovable = true;

        star=game.add.group();
        star.enableBody = true;
        
        var fire =star.create(0, 223,'fire');
        fire.scale.setTo(4,4);
        
        fire =star.create(0,game.world.height - 110 ,'fire');
        fire.scale.setTo(4,4);

        fire =star.create(700,20,'fire');
        fire.scale.setTo(4,4);
        
        water=game.add.group();
        water.enableBody=true;
        
        var w1=water.create(530,396,'water');
        w1.scale.setTo(1/2,1/2);
/*
        ice=game.add.group();
        var i1=ice.create(game.world.centerX +300,game.world.centerY-100,'ice');
        i1.scale.setTo(1/2,1/2);
*/
        createPlayer();
        var style = { font: "15px Verdana", fill: "#9999ff", align: "center" };
        text = game.add.text( game.world.centerX, 15, "Gotta Put Out The Star!", style );
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
        player.body.velocity.y=150;
    }  
    if(input.left.isDown){
    player.body.velocity.x=-150;
    }
    if(input.right.isDown){
    player.body.velocity.x=150;
    }
    if(!(input.right.isDown||input.left.isDown)){
        player.body.velocity.x=0;
        }
    if(hitPlatform && (player.body.touching.down||player.body.touching.up)){
            if (input.up.isDown){
                player.body.velocity.y = -150;
            }
            if (!input.down.isDown){
            bounce.play();
            }
        }
    if(player.body.velocity.y>200){
        player.body.velocity.y=200;
    }

    game.physics.arcade.overlap(player, water,inWater,null,this);
    //game.physics.arcade.overlap(player, ice, onIce,null,this);
    game.physics.arcade.overlap(player,star, onStar,null,this);
    

    }


    function inWater(){
        if(!wet){
        wet=true;
        player.loadTexture('wet_marsh');
        }
        splash.play();
    }

    /*
    function onIce(){
        player.kill();
        ice.create(player.x, player.y, 'ice');
        createPlayer();
        wet=false;
    }*/

    function onStar(player,star){
        flame.play();
        if(!wet){
        player.kill();
       createPlayer();
    }
        else{    
        star.kill();
        firenum--;
            wet=false;
            player.loadTexture("marsh");
            //only one fire in the game so players win when it's put out.
            text.kill();
            if(firenum==0){
        game.add.text(game.world.centerX, 15, 'You stopped the fires!');
            }
    }
    }
    function createPlayer(){
        
        player=game.add.sprite(game.world.centerX,game.world.centerY,'marsh');
        
        player.loadTexture('marsh');
        game.physics.arcade.enable(player);
        input=game.input.keyboard.createCursorKeys();
        player.body.collideWorldBounds=true;
        player.body.gravity.y = 140;  
        player.body.velocity.y=-1;
        player.scale.setTo(1/2,1/2); 
        player.body.bounce.set(0,1.2);    
        
    }
};
