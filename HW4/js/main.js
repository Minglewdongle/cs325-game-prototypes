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
        game.stage.backgroundColor = '#007236';
        game.load.image( 'hero1', 'assets/hero1.png' );
        game.load.image( 'hero2', 'assets/hero2.png' );
        game.load.image( 'hero3', 'assets/hero3.png' );
        game.load.image( 'hero4', 'assets/hero4.png' );
        game.load.image( 'hero5', 'assets/hero5.png' );
        game.load.image( 'hero6', 'assets/hero6.png' );
        game.load.image( 'hero7', 'assets/hero7.png' );
        game.load.image( 'Gchicken', 'assets/Gchicken.png');
        game.load.image( 'chicken', 'assets/Chicken.png');

        game.load.audio('choco', 'assets/choco_run.mp3');
        game.load.audio('cry', 'assets/cry.mp3');
        
    }
    
    
    var player;
    var input;
    var chicken;
    var bg=7236;
    var platforms;
    var text;
    var choco;
    var chickennum=100;
    var Gchicken;
    var cry;
    var space;
    var time;
    var timecon=true;
    var chickencount;
    var counter=0;
    var gh;
    var gw;
    var right='hero3';
    var left='hero6';
    var total;
    var sp=200;
    function create() {
        
        choco=game.add.audio('choco');
        cry=game.add.audio('cry');
        choco.loopFull();
        Gchicken=game.add.group();
        Gchicken.enableBody = true;
        input=game.input.keyboard.createCursorKeys();
        space= game.input.keyboard.addKey(65);
        chicken=game.add.group();
        chicken.enableBody = true;
        gh=game.world.height-64;
        gw=game.world.width-64;
        total=[]
        for(var i=0; i<chickennum;i++){
            var either=Math.floor(Math.random()*2);
            if(either==1){
                either+=1;}
            else{
                either=0;}
            total.push(chicken.create(Math.random()*gw, Math.random()*gh,'chicken'));
            
        }
        
        createPlayer();  
        var style = { font: "15px Verdana", fill: "#9999ff", align: "center" };
        text = game.add.text( game.world.centerX, 15, "Devour all 100 Chickens!", style );
        text.anchor.setTo( 0.5, 0.0 );

        time = game.add.text(110, 20, 'Timer: 0', { font: "30px Arial", fill: "#ffffff", align: "center" });
        time.anchor.setTo(0.5, 0.5);
        chickencount = game.add.text(140, 50, 'Chickens left: 100', { font: "20px Arial", fill: "#ffffff", align: "center" });
        chickencount.anchor.setTo(0.5, 0.5);
        game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
         
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        
    player.body.velocity.y=0;
    player.body.velocity.x=0;
    
    player.loadTexture('hero1');
    if(input.down.isDown){
        player.body.velocity.y=sp;

    }  
    if(input.up.isDown){
        player.body.velocity.y=-1*sp;
    }  
    
    if(input.right.isDown){
    player.body.velocity.x=sp;
        player.loadTexture(right);
    
    }
    if(input.left.isDown){
        player.body.velocity.x=-1*sp;
        player.loadTexture(left);
        }
        if(timecon){
        game.physics.arcade.overlap(player,chicken, onChicken,null,this);}
        game.physics.arcade.overlap(player,Gchicken, onGchicken,null,this);
   /*     if(space.isDown){
            if(player.body.velocity.x>0)
                player.frame=2;
            else if(player.body.velocity.x<0){
                player.frame=5;
            }
            if(player.frame==2||player.frame==5)
                game.physics.arcade.overlap(player,chicken, onChicken,null,this);
        }*/
    }

    function onChicken(player,chicken){
        cry.play();    
        chicken.kill();
        chickennum--;
        
        chickencount.setText('Chickens left: ' + chickennum);

            if(chickennum==0){
                chickencount.kill();
                text.kill();
                Gchicken.create(Math.random()*gw, Math.random()*gh,'Gchicken');
        }
    }
    function onGchicken(player,Gchicken){
        sp+=50;
        game.add.text(game.world.centerX-30, 15, 'You Obtained the Myforce!');
        if(timecon==false){
            game.add.text(game.world.centerX-30, game.world.centerY, 'Welcome to Cucheaven');
         
        }
        left='hero5'
        right='hero2'
        timecon=false;
        Gchicken.kill();
    }
    function updateCounter() {
        
        counter++;
        if(timecon){
        time.setText('Time: ' + counter);
    }
        /*bg-=5;
        game.stage.backgroundColor ='#00'+bg;*/
        if(counter==15){
            game.stage.backgroundColor ='#809727'
        }
        if(counter==25){
            game.stage.backgroundColor ='#ff0000'
        }
        else if(counter==40){
            game.stage.backgroundColor ='#000000'
            chickencount.kill();
            timecon=false;
        }
        else if(counter==50){
            game.stage.backgroundColor ='#eef028'
            var len=total.length;
            for(var i=0;i<len;i++){
                total.pop().kill();
            }
            for(var i=0; i<chickennum;i++){
                Gchicken.create(Math.random()*gw, Math.random()*gh,'Gchicken');
                time.setText('Time: INFINITE');
                text.kill();
            }
        }
  
    
    }
    function createPlayer(){
        player=game.add.sprite(game.world.centerX,game.world.centerY,'hero1');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds=true;
        player.scale.setTo(2,2);
    }
};
