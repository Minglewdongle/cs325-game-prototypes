//TODO: test moves and add defeat state


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
    

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render } );
    class Creature{
        constructor(info){
            this.name=info[0];
            this.lvl=Math.floor(Math.random() * (info[2]-info[1]+1))+info[1];
            
            //hp, str, mag, def, spd
            var hp=info[3];
            var str=info[4];
            var mag=info[5];
            var def=info[6];
            var spd=info[7];
            this.sprite=game.add.sprite(game.world.centerX,game.world.centerY,this.name);
            this.moves=[8];
            this.maxStats=[hp,hp,str,mag,def,spd];
            this.currentStats=[Math.floor(hp*this.lvl/100),Math.floor(hp*this.lvl/100),Math.floor(str*this.lvl/100),Math.floor(mag*this.lvl/100),Math.floor(def*this.lvl/100),Math.floor(spd*this.lvl/100)];

            this.exp=(this.lvl*this.lvl);
            
            this.expCondition=0;

            this.alive=true;

            var quart=(this.sprite.centerX-this.sprite.x)*2;

            this.display={
            lvl: game.add.text(this.sprite.x+quart, this.sprite.y, 'lvl: '.concat(this.lvl), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            hp: game.add.text(this.sprite.x+quart, this.sprite.y+30, 'hp: '.concat(this.currentStats[0]).concat("/").concat(this.currentStats[1]), { font: "30px Arial", fill: "#ffffff", align: "center" }),
            str: game.add.text(this.sprite.x+quart, this.sprite.y+60, 'str: '.concat(this.currentStats[2]), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            mag:game.add.text(this.sprite.x+quart, this.sprite.y+90, 'mag: '.concat(this.currentStats[3]), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            def:game.add.text(this.sprite.x+quart, this.sprite.y+120, 'def: '.concat(this.currentStats[4]), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            spd:game.add.text(this.sprite.x+quart, this.sprite.y+150, 'spd: '.concat(this.currentStats[5]), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            exp:game.add.text(this.sprite.x+quart, this.sprite.y+180, 'exp: '.concat(this.exp), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            }
            //game.add.text(this.sprite.x, this.sprite.y-150, 'hp: '.concat(this.hp)), { font: "30px Arial", fill: "#ffffff", align: "center" }),
            
        }
        levelUp(){
            if(this.lvl<100){
                this.lvl+=1;
                for(var i=0;i<this.currentStats.length;i+=1){
                    this.currentStats[i]=Math.floor(this.maxStats[i]*this.lvl/100);
                }

                //change exp condition
                this.expCondition=((this.lvl+1)*(this.lvl+1));
                
                this.display.lvl.setText('lvl: '.concat(this.lvl));
                this.display.hp.setText( 'hp: '.concat(this.currentStats[0]).concat("/").concat(this.currentStats[1]));
                this.display.str.setText('str: '.concat(this.currentStats[2]));
                this.display.mag.setText('mag: '.concat(this.currentStats[3]),);
                this.display.def.setText('def: '.concat(this.currentStats[4]));
                this.display.spd.setText('spd: '.concat(this.currentStats[5]));
            }
        }
        gainExp(gains){
        this.exp+=gains;
        this.display.exp.setText('exp: '.concat(this.exp));
        if(this.exp>=this.expCondition){
            this.levelUp();
        }
        }
    }


    //needs testing
    class Move{
        constructor(info){
            this.name=info[0];
            this.power=info[1];
            //physical or magical
            this.type=info[2];

            this.display={
                
            name: game.add.text(0, 0, this.name, { font: "30px Arial", fill: "#ffffff", align: "left" }),
            power: game.add.text(0, 30, 'power: '.concat(this.power), { font: "30px Arial", fill: "#ffffff", align: "center" }),
            type: game.add.text(0, 60, 'type: '.concat(this.type), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            }

        }
        damage(self,enemy){
            var  hurt;
            if(this.type.equals('physical')){
                hurt=self.currentStats[2]-enemy.currentStats[4];
            }
            else{
                hurt=self.currentStats[3]-enemy.currentStats[3];
            }
            if(hurt>0){
                enemy.currentStats[0]-=Math.ceil(hurt*this.power/100);
                enemy.display.hp.setText( 'hp: '.concat(this.currentStats[0]).concat("/").concat(this.currentStats[1]));
                if(enemy.currentStats[0]<=0){
                    enemy.currentStats[0]=0;
                    alive=false;
                    //do something to dead

                }
            }
        }
    }

    function preload() {
        // Load an image and call it 'logo'.
        /*game.stage.backgroundColor = '#007236';
*/
        game.load.image( 'Gchicken', 'assets/Gchicken.png');
        game.load.image( 'chicken', 'assets/Chicken.png');
        game.load.image( 'teeto', 'assets/teeto.png');
        game.load.spritesheet('player', 'assets/player.png', 120,191);

        game.load.audio('choco', 'assets/choco_run.mp3');
        game.load.audio('cry', 'assets/cry.mp3');
        
    }
    
    var player;
    var input;
    var controls;

    var chicken;
    var bg=7236;
    var text;
    var choco;
    var chickennum=100;
    var Gchicken;
    var cry;

    var Creatures=[];
    var menu;
    var menuFunctions;

    var time;
    var timecon=true;
    var chickencount;
    var counter=0;
    var total;
    var dir="down";
    var sp=250;//speed

    var obj;
    var enemy;
    function create() {
        controls = {
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            menu: game.input.keyboard.addKey(Phaser.Keyboard.Z),
            interact: game.input.keyboard.addKey(Phaser.Keyboard.X),
            cancel: game.input.keyboard.addKey(Phaser.Keyboard.C),
        }



        game.world.setBounds(0, 0, 1000, 1000);
        
        choco=game.add.audio('choco');
        cry=game.add.audio('cry');
        choco.loopFull();
        Gchicken=game.add.group();
        Gchicken.enableBody = true;
        input=game.input.keyboard.createCursorKeys();
        /*space= game.input.keyboard.addKey(Phaser.Keyboard.SPACE);*/
        chicken=game.add.group();
        chicken.enableBody = true;
        total=[]
        for(var i=0; i<chickennum;i++){
            var either=Math.floor(Math.random()*2);
            if(either==1){
                either+=1;}
            else{
                either=0;}
            total.push(chicken.create(Math.random()*(game.world.width-64), Math.random()*(game.world.height-64),'chicken'));
            
        }
        
    createPlayer();  

    player.animations.add('down_neutral', [0], 15, true); //test
    player.animations.add('left_neutral', [4], 15, true); //test
    player.animations.add('right_neutral', [7], 15, true); //test
    player.animations.add('up_neutral', [9], 15, true); //test

    player.animations.add('down', [1,2], 15, true); //test
    player.animations.add('left', [4,3,4,5], 15, true); //test
    player.animations.add('right', [7,6,7,8], 15, true); //test
    player.animations.add('up', [9,10,11], 15, true); //test

    game.camera.follow(player);
        var style = { font: "15px Verdana", fill: "#9999ff", align: "center" };
        text = game.add.text( game.world.centerX, 15, "Devour all 100 Chickens!", style );
        text.anchor.setTo( 0.5, 0.0 );

        time = game.add.text(110, 20, 'Timer: 0', { font: "30px Arial", fill: "#ffffff", align: "center" });
        time.anchor.setTo(0.5, 0.5);
        chickencount = game.add.text(140, 50, 'Chickens left: 100', { font: "20px Arial", fill: "#ffffff", align: "center" });
        chickencount.anchor.setTo(0.5, 0.5);
        game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
     
        //use the onDown signal to add an event
        controls.menu.onDown.add(unpause);
        input.right.onDown.add(unpause);
    
        var punch=new Move(["punch",60,"physical"]);
        obj =new Creature(['teeto',1,3,300,150,200,250,300,[punch]]);
        enemy =new Creature(['teeto',1,3,300,150,200,250,300,[punch]]);
    }
    
/*
    window.onkeydown = function() {
        if(game.input.keyboard.event!=null){
        if (game.input.keyboard.event.keyCode == controls.cancel){
            game.paused = !game.paused;
        }
    }
    }
*/

    function update() {
    move();

    if(controls.menu.isDown){
        /*            
           [name, lvl, hp, str, mag, def, spd, sprite]
            this.sprite=game.add.sprite(game.world.centerX,game.world.centerY,[]]);
            this.moves=[];
        */
        if(game.paused){
            game.paused=false;}
        else{
            game.paused=true;
        }
    }    
    if(controls.cancel.isDown){
        /*            
           [name, lvl, hp, str, mag, def, spd, sprite]
            this.sprite=game.add.sprite(game.world.centerX,game.world.centerY,[]]);
            this.moves=[];
        */        
       //let obj =new Creature(['teeto',1,20,300,150,200,250,300]);
        

       //visibility of display
       /*obj.display.lvl.visible=false;
        obj.display.lvl.visible=true;*/
        
        //object position
        //obj.display.lvl.x=0;
        
        //creature gains experience
        //obj.gainExp(obj.expCondition);

        //damage using attack
        obj.moves[0].damage(obj,enemy);
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





















    //movement control
    function move(){        
        player.body.velocity.y=0;
        player.body.velocity.x=0;

        var contraLR=input.right.isDown&&input.left.isDown;
        var contraUD=input.up.isDown&&input.down.isDown;
        var anyDir=input.right.isDown||input.left.isDown||input.down.isDown||input.up.isDown;

        if(!(contraLR)){
            if(input.right.isDown){
            player.body.velocity.x=sp;
            player.animations.play('right');
            dir='right';
            }
            else if(input.left.isDown){
                player.body.velocity.x=-1*sp;
                player.animations.play('left');
                dir='left';
            }
            /*
            if(player.body.collideWorldBounds){
                player.body.velocity.x=0;
            }*/
        }
        if(!(contraUD)){
            if(input.down.isDown){
                player.body.velocity.y=sp;
                player.animations.play('down');
                dir='down';
            }  
            else if(input.up.isDown){
                player.body.velocity.y=-1*sp;
                player.animations.play('up');
                dir='up';
            } 
        }
        if((!anyDir)||contraLR||contraUD||(player.body.velocity.x==0&&player.body.velocity.y==0)){
            player.animations.play(dir.concat('_neutral'));
        }
    }

    function onChicken(player,chicken){
        cry.play();    
        chicken.kill();
        chickennum--;
        
        chickencount.setText('Chickens left: ' + chickennum);

            if(chickennum==0){
                chickencount.kill();
                text.kill();
                Gchicken.create(Math.random()*(game.world.width-64), Math.random()*(game.world.height-64),'Gchicken');
        }
    }
    function onGchicken(player,Gchicken){
        sp+=50;
        game.add.text(game.world.centerX-30, 15, 'You Obtained the Myforce!');
        if(timecon==false){
            game.add.text(game.world.centerX-30, game.world.centerY, 'Welcome to Cucheaven');
         
        }
        timecon=false;
        Gchicken.kill();
    }

    function updateCounter() {
        counter++;
        if(timecon){
        time.setText('Time: ' + counter);
    
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
                Gchicken.create(Math.random()*(game.world.width-64), Math.random()*(game.world.height-64),'Gchicken');
                time.setText('Time: INFINITE');
                text.kill();
            }
        }
    }
    }

    function createPlayer(){
        player=game.add.sprite(game.world.centerX,game.world.centerY,'player');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds=true;
        player.scale.setTo(2/3,2/3);
    }

    function createMenu(){


    }
    function deleteMenu(){
        

    }
    function unpause(){
        // pause state of the game

        if(menu!=null){
            //interact with menu

        }
        if(controls.menu.isDown){
            if(!game.paused){
                //add menu
                createMenu();
            }
            else{
                //kill menu
                deleteMenu();
                menu=null;
            }
                game.paused = !game.paused;
        }
    };
    //tells location of the camera and sprite
    function render() {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
    }
};
