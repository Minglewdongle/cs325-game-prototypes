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
    

    var game = new Phaser.Game( 600, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render } );
    class Creature{
        constructor(info){
            this.name=info[0][2];
            this.lvl=Math.floor(Math.random() * (info[2]-info[1]+1))+info[1];
            
            //hp, str, mag, def, spd
            var hp=info[3];
            var str=info[4];
            var mag=info[5];
            var def=info[6];
            var spd=info[7];
            var energy=info[8];

            this.sprite=game.add.sprite(info[0][1],info[0][1],this.name);
            this.moves=info[9];
            this.maxStats=[hp,hp,str,mag,def,spd,energy,energy];
            this.currentStats=[Math.floor(hp*this.lvl/100),Math.floor(hp*this.lvl/100),Math.floor(str*this.lvl/100),Math.floor(mag*this.lvl/100),Math.floor(def*this.lvl/100),Math.floor(spd*this.lvl/100),Math.floor(energy*this.lvl/100),Math.floor(energy*this.lvl/100)];

            this.exp=Math.ceil(this.lvl*this.lvl*(1+this.lvl/100));
            
            this.expCondition=((this.lvl+1)*(this.lvl+1));

            this.alive=true;

            var side=(this.sprite.centerX-this.sprite.x)*2;

            this.display={
            lvl: game.add.text(this.sprite.right, this.sprite.y, 'lvl: '.concat(this.lvl), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            hp: game.add.text(this.sprite.right, this.sprite.y+30, 'hp: '.concat(this.currentStats[0]).concat("/").concat(this.currentStats[1]), { font: "30px Arial", fill: "#ffffff", align: "center" }),
            str: game.add.text(this.sprite.right, this.sprite.y+60, 'str: '.concat(this.currentStats[2]), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            mag:game.add.text(this.sprite.right, this.sprite.y+90, 'mag: '.concat(this.currentStats[3]), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            def:game.add.text(this.sprite.right, this.sprite.y+120, 'def: '.concat(this.currentStats[4]), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            spd:game.add.text(this.sprite.right, this.sprite.y+150, 'spd: '.concat(this.currentStats[5]), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            energy:game.add.text(this.sprite.right, this.sprite.y+180, 'energy: '.concat(this.currentStats[6]).concat("/").concat(this.currentStats[7]), { font: "30px Arial", fill: "#ffffff", align: "left" }),
            exp:game.add.text(this.sprite.right, this.sprite.y+210, 'exp: '.concat(this.exp).concat("/").concat(this.expCondition), { font: "30px Arial", fill: "#ffffff", align: "left" }),
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
                this.display.mag.setText('mag: '.concat(this.currentStats[3]));
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
       /*
        will turn off stats by default
        if bool is true, stats will be visible
        if battleStats, the battling creature's stats will be shown.
        if enemy, exp will not be shown
        */
        displayStats(bool,battleStats,enemy){
            this.clearDisplay();
            if(bool){
                if(battleStats){
                    this.enableBattleStats();
                    this.resetBattleStats();
                    if(enemy){
                        this.display.exp.visible=false;
                    }
                }
                else{
                    this.enableDisplayStats();
                    this.resetDisplayStats();
                }
            }
        }
        enableBattleStats(){

            this.display.lvl.visible=true;
            this.display.hp.visible=true;
            this.display.energy.visible=true;
            this.display.exp.visible=true;

            
            this.display.str.visible=false;
            this.display.mag.visible=false;
            this.display.mag.visible=false;
            this.display.mag.visible=false;
            
        }
        resetBattleStats(){

            var side=(this.sprite.centerX-this.sprite.x)*2;
            var t=30;

            this.display.lvl.x=this.sprite.right;
            this.display.hp.x=this.sprite.right;
            this.display.energy.x=this.sprite.right;
            this.display.exp.x=this.sprite.right;
            
            this.display.lvl.y=this.sprite.y+t*0;
            this.display.hp.y=this.sprite.y+t*1;
            this.display.energy.y=this.sprite.y+t*2;
            this.display.exp.y=this.sprite.y+t*3;
        }
        clearDisplay(){
        this.display.lvl.visible=false;
        this.display.hp.visible=false;
        this.display.str.visible=false;
        this.display.mag.visible=false;
        this.display.def.visible=false;
        this.display.spd.visible=false;
        this.display.energy.visible=false;
        this.display.exp.visible=false;
        }

        enableDisplayStats(){
            this.display.lvl.visible=true;
            this.display.hp.visible=true;
            this.display.str.visible=true;
            this.display.mag.visible=true;
            this.display.def.visible=true;
            this.display.spd.visible=true;
            this.display.energy.visible=true;
            this.display.exp.visible=true;
        }
        resetDisplayStats(){ 
            var side=(this.sprite.centerX-this.sprite.x)*2;
            var t=30;

            this.display.lvl.x=this.sprite.right;
            this.display.hp.x=this.sprite.right;
            this.display.str.x=this.sprite.right;
            this.display.mag.x=this.sprite.right;
            this.display.def.x=this.sprite.right;
            this.display.spd.x=this.sprite.right;
            this.display.energy.x=this.sprite.right;
            this.display.exp.x=this.sprite.right;
            
            this.display.lvl.y=this.sprite.y+t*0;
            this.display.hp.y=this.sprite.y+t*1;
            this.display.str.y=this.sprite.y+t*2;
            this.display.mag.y=this.sprite.y+t*3;
            this.display.def.y=this.sprite.y+t*4;
            this.display.spd.y=this.sprite.y+t*5;
            this.display.energy.y=this.sprite.y+t*6;
            this.display.exp.y=this.sprite.y+t*7;
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
            if(this.type.toLowerCase() == 'physical'){
                hurt=Math.ceil(self.currentStats[2]-enemy.currentStats[4]);
            }
            else{
                hurt=Math.ceil(self.currentStats[3]-enemy.currentStats[3]);
            }
            if(hurt<=0){
                hurt=1;
            }
            
            enemy.currentStats[0]-=Math.ceil(hurt*this.power/100);
            if(enemy.currentStats[0]<=0){
                enemy.currentStats[0]=0;
                enemy.alive=false;
                //do something to dead

            }
            enemy.display.hp.setText( 'hp: '.concat(enemy.currentStats[0]).concat("/").concat(enemy.currentStats[1]));
        }
    }
    /*
    var Chicken = function (game, x, y, destination) {
        Phaser.Sprite.call(this, game, x, y, 'chicken');
        this.collideWorldBounds = true;
        this.enableBody = true;
        this.animations.add('left', [0, 1], 12, true);
        this.animations.add('left', [2,3], 12, true);
        this.body.collideWorldBounds = true;
        this.body.velocity.x = 80;
    };

    
    Chicken.prototype = Object.create(Phaser.Sprite.prototype);
    Chicken.prototype.constructor = Chicken;

    Chicken.prototype.update = function () {
 
        game.physics.arcade.collide(this, platforms, function (Chicken, platform) {
            // if Chicken is moving to the right, 
            // check if its position greater than the width of the platform minus its width
            // if Chicken is moving to the left, 
            // check if its position exceeds the left-most point of the platform
            if (Chicken.body.velocity.x > 0 && Chicken.x > platform.x + (platform.width - Chicken.width) ||
                    Chicken.body.velocity.x < 0 && Chicken.x < platform.x) {
                Chicken.body.velocity.x *= -1; 
            } 
            if (Chicken.body.velocity.x > 0) {
                Chicken.animations.play('right');
            } else {
                Chicken.animations.play('left');
            }
        });
     
        game.physics.arcade.collide(this, Chickens, function (Chicken, Chickens) {
            Chicken.body.velocity.x *= -1.0001;
        });
     
    };
    */




    function preload() {
        // Load an image and call it 'logo'.
        /*game.stage.backgroundColor = '#007236';
*/
        game.load.image( 'Gchicken', 'assets/Gchicken.png');
        game.load.image( 'teeto', 'assets/teeto.png');
        game.load.image('grass','assets/Grass.png');        
        
        game.load.image('healthBox','assets/healthBox.png');
        game.load.spritesheet('health','assets/health.png',300,100);

        game.load.spritesheet( 'chicken', 'assets/Chicken.png',18,20);
        game.load.spritesheet( 'projectile', 'assets/Projectile.png',40, 40);

        
        game.load.image( 'shield', 'assets/shield.png');
        game.load.image( 'recruit', 'assets/recruit.png');

        game.load.spritesheet('player', 'assets/player.png', 120,191);
        game.load.spritesheet('powerShield', 'assets/PowerShield.png', 300,300);

        game.load.audio('electricity', 'assets/electricFX.mp3');
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
    var chickennum=50;
    var Gchicken;
    var cry;
    var map;
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

    var enemySpeed=200;

    var allMoves;

    var obj;
    var enemy;

    var shield;
    var shieldTime=0;
    var isShieldActive=true;
    var shieldCounter=10;
    var electric;
    
    var HealingTime=0;
    var isHealing=true;
    var healCounter=10;
    //var healSound;

    var projectiles=[];
    var projectileTimer=0;
    var bulletSpeed=300;

    var pauseScreen;

    var icon1;
    var icon2;
    
    var totalHealth=10000;
    var health;
    var healthBox;













    function create() {
        controls = {
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            pause: game.input.keyboard.addKey(Phaser.Keyboard.P),
            fire: game.input.keyboard.addKey(Phaser.Keyboard.Z),
            interact: game.input.keyboard.addKey(Phaser.Keyboard.X),
            cancel: game.input.keyboard.addKey(Phaser.Keyboard.C),
        }



        game.world.setBounds(0, 0, 2000, 2000);
        map = game.add.tilemap();

        game.stage.backgroundColor ='#809727'



        choco=game.add.audio('choco');
        cry=game.add.audio('cry');
        electric=game.add.audio('electricity');
        choco.loopFull();
        Gchicken=game.add.group();
        Gchicken.enableBody = true;
        /*
        projectiles=game.add.group();
        projectiles.enableBody=true;
        */
        input=game.input.keyboard.createCursorKeys();
        /*space= game.input.keyboard.addKey(Phaser.Keyboard.SPACE);*/
        chicken=game.add.group();
        chicken.enableBody = true;
        total=[]
        for(var i=0; i<chickennum;i++){       
            randomSpawn();
        }
        for(var i=0; i<chickennum;i++){       
            SpawnProjectiles();
        }
        var style = { font: "15px Verdana", fill: "#9999ff", align: "center" };
        text = game.add.text( game.world.centerX, 15, "Devour all 100 Chickens!", style );
        text.anchor.setTo( 0.5, 0.0 );

        time = game.add.text(110, 20, 'Timer: 0', { font: "30px Arial", fill: "#ffffff", align: "center" });
        time.anchor.setTo(0.5, 0.5);
        chickencount = game.add.text(140, 50, 'Chickens left: '+total.length, { font: "20px Arial", fill: "#ffffff", align: "center" });
        chickencount.anchor.setTo(0.5, 0.5);        

        game.time.events.loop(Phaser.Timer.SECOND, secondPassed, this);
     
        //use the onDown signal to add an event
        controls.pause.onDown.add(unpause);
        input.right.onDown.add(unpause);
    

        allMoves={punch: new Move(["punch",60,"physical"])};


        obj =new Creature([[game.world.centerX,game.world.centerY,'teeto'],1,3,300,300,200,250,200,160,[allMoves.punch]]);
       enemy =new Creature([[obj.sprite.left,game.world.centerY,'teeto'],1,3,300,300,200,250,200,160,[allMoves.punch]]);
       obj.clearDisplay();
       obj.sprite.visible=false;
       enemy.sprite.visible=false;
       enemy.clearDisplay();
       
       /*
        obj.sprite.x=0;
        obj.displayStats(true,true,true);
    
        enemy.sprite.x=enemy.sprite.right;
        enemy.displayStats(true,true);
        */
        //allMoves.punch.damage(obj,enemy);

        pauseScreen = game.add.text(game.camera.x, game.camera.y,'Paused', { font: "50px Arial", fill: "#ffffff", align: "left" });
        pauseScreen.visible=false;


        shield=game.add.sprite(game.world.centerX,game.world.centerY,'powerShield');
        
        game.physics.arcade.enable(shield);
        shield.visible=false;
        shield.scale.setTo(2/3,2/3);
        shield.animations.add('play', [0,1,2,3], 13, true);

        icon1=game.add.sprite(game.world.centerX,game.world.centerY,'shield');
        icon2=game.add.sprite(game.world.centerX,game.world.centerY,'recruit');
    

    health= game.add.sprite(0,0,'health');
    game.physics.arcade.enable(health);
    health.body.collideWorldBounds=true;
    health.animations.add('green',[0],true);
    health.animations.add('yellow',[1],true);
    health.animations.add('red',[2],true);
    healthBox=game.add.sprite(0,0,'healthBox');


    createPlayer();  

    player.animations.add('down_neutral', [0], 13, true); //test
    player.animations.add('left_neutral', [4], 13, true); //test
    player.animations.add('right_neutral', [7], 13, true); //test
    player.animations.add('up_neutral', [9], 13, true); //test

    player.animations.add('down', [1,2], 13, true); //test
    player.animations.add('left', [4,3,4,5], 13, true); //test
    player.animations.add('right', [7,6,7,8], 13, true); //test
    player.animations.add('up', [9,10,11], 13, true); //test

    game.camera.follow(player);
    updateHealthbar();
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
        
    updateHealthbar();
    move();

    if(controls.pause.isDown){
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
        
        /*debug needed*/
        /*
        obj.displayStats(true);
        
        enemy.displayStats(false);
        */
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
        //obj.moves[0].damage(obj,enemy);
        
        if(Math.floor(Math.random()*20)==0){
            randomSpawn();
        }

    }
    if(controls.interact.isDown){
        if(isShieldActive){
            ActivateShield();
        }
    }    
    if(controls.fire.isDown){
        if(projectileTimer>=10){
            fireProjectile();
            projectileTimer=0;
        }
    }
    if(controls.cancel.isDown){
        if(isHealing){
            ActivateHeal();
        }
    } 

    if(shield.visible){
        shield.play('play');
        shield.centerX=player.centerX;
        shield.centerY=player.centerY;

        /**
         * Do stuff with shield
         */
    }

        if(timecon){
        //game.physics.arcade.overlap(player,total, onChicken,null,this);
            if(isShieldActive){
                if(shieldTime>=20){
                    game.physics.arcade.overlap(shield,total, shieldDamage,null,this);
                    shieldTime=0;
                }
                else{
                    shieldTime+=1;
                } 
            game.physics.arcade.overlap(projectiles,total, projectileDamage,null,this);
            }

            game.physics.arcade.overlap(player,total, onChicken,null,this);
    }
        game.physics.arcade.overlap(player,Gchicken, onGchicken,null,this);
        moveEnemy();

   /*     if(space.isDown){
            if(player.body.velocity.x>0)
                player.frame=2;
            else if(player.body.velocity.x<0){
                player.frame=5;
            }
            if(player.frame==2||player.frame==5)
                game.physics.arcade.overlap(player,chicken, onChicken,null,this);
        }*/


        moveProjectile();
        if(projectileTimer<10){
            projectileTimer+=1;
        }
        
        
    }















    /**
     * player movement control
     */
    function move(){        
        player.body.velocity.y=0;
        player.body.velocity.x=0;

        var contraLR=input.right.isDown&&input.left.isDown;
        var contraUD=input.up.isDown&&input.down.isDown;
        var anyDir=input.right.isDown||input.left.isDown||input.down.isDown||input.up.isDown;

        if(!(contraLR)){
            if(input.right.isDown){
                player.body.velocity.x=sp;
                dir='right';
            }
            else if(input.left.isDown){
                player.body.velocity.x=-1*sp;
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
                dir='down';
            }  
            else if(input.up.isDown){
                player.body.velocity.y=-1*sp;
                dir='up';
            } 
        }
        var x=player.body.velocity.x;
        var y=player.body.velocity.y;

        if(x==y||-1*x==y){
            var hypo=Math.hypot(x,y);
            player.body.velocity.x=sp*x/hypo;
            player.body.velocity.y=sp*y/hypo;
        }

        //if no directions, no speed, and no contradictions
        if((!anyDir)||(contraLR&&contraUD)||(player.body.velocity.x==0&&player.body.velocity.y==0)){
            dir=dir.concat('_neutral');
        }
        
        player.animations.play(dir);
    }


    /**
    * enemy moves towards player
    * 
    */
    function moveEnemy(){
        for(var i =0;i<total.length;i++){
            
            var x =player.centerX-total[i].x;
            var y=player.centerY-total[i].y;
            total[i].body.velocity.x=enemySpeed*x/Math.hypot(x,y);
            total[i].body.velocity.y=enemySpeed*y/Math.hypot(x,y);

            if(x>0){
                total[i].animations.play('right')
            }

            else{
                total[i].animations.play('left')
            }
        }
    }
    function moveProjectile(){
        for(var i=0;i<projectiles.length;i++){
            if(projectiles[i].visible){
                var x=projectiles[i].x;
                var y=projectiles[i].y;
                
                if((x<game.camera.x-projectiles[i].width||x>game.camera.x+game.camera.width||y<game.camera.y-projectiles[i].height||x>game.camera.x+game.camera.height)){
                    if(projectiles[i].body.velocity.x==0&&projectiles[i].body.velocity.y==0){
                    projectiles[i].visible=false;
                    projectiles[i].body.velocity.x=0;
                    projectiles[i].body.velocity.y=0;}
                }
                else{
                    projectiles[i].play('play');}
            }
        }
    }
    
    function fireProjectile(){
        var projectile;
     for(var i=0;i<projectiles.length;i++){
         if(!projectiles[i].visible){
             projectile=projectiles[i];
             break;
         }   
     }
     if(projectile!=null){
     projectile.visible=true;
     projectile.x=player.centerX;
     projectile.y=player.centerY;
     var x=player.body.velocity.x;
     var y=player.body.velocity.y;
 
 
     projectile.body.velocity.x=bulletSpeed*x/Math.hypot(x,y);
     projectile.body.velocity.y=bulletSpeed*y/Math.hypot(x,y);
     if(x==0&&y==0){
         switch(dir){
             case 'up':
             case 'up_neutral':
                 projectile.body.velocity.y=-1*bulletSpeed;
                 break;
 
             case 'down':
             case 'down_neutral':
                 projectile.body.velocity.y=bulletSpeed;
                 break;
 
             case 'left':
             case 'left_neutral':
                 projectile.body.velocity.x=-1*bulletSpeed;
                 break;
 
             case 'right':
             case 'right_neutral':
                 projectile.body.velocity.y=bulletSpeed;
                 break;
 
         }
     }
     }
    }

    function shieldDamage(shield, enemy){
        if(shield.visible){

        cry.play();    
        enemy.damage(15);
        if(!enemy.alive){
            total.splice(total.indexOf(enemy),1);
            chickencount.setText("Chickens left:"+total.length)
        }
        }  
    }    
    function projectileDamage(projectile, enemy){
        if(projectile.visible){
        enemy.damage(30);
        projectile.visible=false;
        }
    }



/**
 * 
 * 
 * @param {*} player 
 * @param {*} chicken 
 */
    function onChicken(player,chicken){

        player.damage(5);

        /*
        cry.play();    
        chicken.kill();
        total.splice(total.indexOf(chicken),1);

        chickencount.setText('Chickens left: ' + total.length);

            if(total.length==0){
                chickencount.kill();
                text.kill();
                Gchicken.create(Math.random()*(game.world.width-64), Math.random()*(game.world.height-64),'Gchicken');
        }
        */
    }

    /**
     * 
     * @param {*} player 
     * @param {*} Gchicken 
     */
    function onGchicken(player,Gchicken){
        sp+=50;
        game.add.text(game.world.centerX-30, 15, 'You Obtained the Myforce!');
        if(timecon==false){
            game.add.text(game.world.centerX-30, game.world.centerY, 'Welcome to Cucheaven');
         
        }
        timecon=false;
        Gchicken.kill();
    }




    /**
     *Do this when a second has passed 
     */
    function secondPassed(){
        counter++;
        if(timecon){
        time.setText('Time: ' + counter);
    
        /*bg-=5;
        game.stage.backgroundColor ='#00'+bg;*/
        if(counter==15){
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

    /**cooldown and active time for shield */
    if(isShieldActive&&shield.visible){
        if(shieldCounter>0){
            shieldCounter-=1;
        }
        else{
            shield.visible=false;
            isShieldActive=false;
            electric.pause();
            /**
             * check if shield is disabled
             */
        }
    }
    else{
        if(shieldCounter<10){
            shieldCounter+=1;
        }
        else{
            isShieldActive=true;
            icon1.visible=true;
    }
    }    
    
    if(isHealing&&!icon2.visible){
        if(healCounter>0){
            healCounter-=1;
        }
        else{
            isHealing=false;
        }
    }
    else{
        if(healCounter<10){
            healCounter+=1;
        }
        else{
            isHealing=true;
            icon2.visible=true;
    }
    }


}

    /**
     * 
     */
    function createPlayer(){
        player=game.add.sprite(game.world.centerX,game.world.centerY,'player');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds=true;
        player.health=totalHealth;
        player.scale.setTo(2/3,2/3);
    }
    function ActivateShield(){
        if(isShieldActive=true){
        shield.visible=true;
        icon1.visible=false;
        electric.play();
        }
    }

    function ActivateHeal(){
        if(isHealing=true){
        icon2.visible=false;
        player.health+=totalHealth/3;
        if (player.health>=totalHealth){
            player.health=totalHealth;
        }
        healCounter=0;
        isHealing=false;
        
        //healSound.play();
        }
    }
    

    function createMenu(){


    }
    function deleteMenu(){
        

    }

    /**
     * spawns enemies
     */
    function randomSpawn(){
    var c=game.add.sprite(Math.random()*(game.world.width-64), Math.random()*(game.world.height-64),'chicken');
    total.push(c);
    game.physics.arcade.enable(c);
    c.body.collideWorldBounds=true;
    c.health=100;
    c.animations.add('left', [0,1], 13, true); //test
    c.animations.add('right', [2,3], 13, true); //test
    }

    function SpawnProjectiles(){
        var projectile=game.add.sprite(0,0,'projectile');
        projectiles.push(projectile);
        game.physics.arcade.enable(projectile);
        projectile.body.collideWorldBounds=false;
        projectile.health=30;
        projectile.visible=false;
        projectile.animations.add('play', [0,1,2,3,4,5,6], 13, true); //test
    }
    function updateHealthbar(){

        health.scale.setTo(player.health/totalHealth,1);
        
        health.x=game.camera.x+1;
        health.y=game.camera.y+1;
        healthBox.x=game.camera.x;
        healthBox.y=game.camera.y;

        if(player.health<totalHealth/3){
            health.play('red');
        }
        else if(player.health<totalHealth/3*2){
            health.play('yellow');
        }
        else{
            health.play('green');
        }
        
    }

    function unpause(){
        // pause state of the game

        if(menu!=null){
            //interact with pause

        }
        if(controls.pause.isDown){
            if(!game.paused){
                //add pause
                createMenu();
                pauseScreen.x=game.camera.x+game.camera.width/2;
                pauseScreen.y=game.camera.y+game.camera.height/2;
                pauseScreen.visible=true;

            }
            else{
                //kill pause
                deleteMenu();
                menu=null;
                pauseScreen.visible=false;
            }
                game.paused = !game.paused;
        }
    };
    //tells location of the camera and sprite
    function render() {
        icon1.x=game.camera.x+5;
        icon1.y=game.camera.y+game.camera.height-icon1.height-5;

        icon2.x=game.camera.x+icon1.width+10+5;
        icon2.y=game.camera.y+game.camera.height-icon2.height-5;
        //game.debug.soundInfo(electric, 20, 32);
    }
};
