class Main extends Phaser.Scene {
  constructor() {
    super('Main');
  }
  preload() {
    this.load.image('bgLayer1', 'asset/bg/bgLayer1.png');
    this.load.image('bgLayer2', 'asset/bg/bgLayer2.png');
    this.load.image('bgLayer3', 'asset/bg/bgLayer3.png');
    this.load.image('ground', 'asset/bg/ground.png');
    this.load.image('player', 'asset/characters/angel.png');
    /*
    this.load.spritesheet('player', 'asset/spritesheet.png', {
      frameWidth: 200,
      frameHeight: 200
    });
    */
    this.load.image('littleangel', 'asset/characters/littleangel.png');
    // TODO: 音入れる
    //this.load.audio('se', 'asset/se.mp3');
    //
    this.load.image('block', 'asset/bg/block.png');
    this.load.image('demon', 'asset/characters/demon.png');
    this.load.image('goal', 'asset/bg/goal.png');
    //
    this.load.audio('bgmLoop', 'asset/sounds/bgm.mp3');
  }
  create() {
    //this.scene.start('GameClear');
    //this.scene.start('GameOver');
    // 赤ちゃん救出処理
    // TODO: 赤ちゃん天使救出効果音挿入
    //this.seMusic = this.sound.add('se');
    let collectStar = function (player, star) {
      star.destroy();
      //this.seMusic.play();
      this.score += 1;
      this.scoreText.setText('Score: '+this.score);
    }
    // ゲームオーバー処理
    let gameOver = function (player, enemy) {
      this.backgroundMusic.stop();
      this.scene.start('GameOver');
    }
    //クリア処理
    let gameClear = function (player, enemy) {
      this.backgroundMusic.stop();
      this.scene.start('GameClear');
    }
    // BGM
    this.backgroundMusic = this.sound.add('bgmLoop');
    let loopMaker = {
      name: 'loop',
      start: 0,
      duration: 34,
      config: {
        loop: true
      }
    };
    this.backgroundMusic.addMarker(loopMaker);
    this.backgroundMusic.play('loop', {
      delay: 0
    });
    const height = 4000;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(0, 0, 828, height);
    this.physics.world.setBounds(0, 0, 828, height);
    // 背景
    // TODO: パララックスで動くようにしたい
    this.add.image(600, 800, 'bgLayer1').setScrollFactor(0);
    this.add.image(600, 800, 'bgLayer2').setScrollFactor(0);
    this.add.image(600, 800, 'bgLayer3').setScrollFactor(0);
    // スコア
    // TODO: スコアが正しく表示されるように
    this.score = new Number();
    this.scoreText = this.add.text(16, 16, 'score:'+Number(0), {
      fontSize: '64px',
      fill: '#ffe663'
    }).setScrollFactor(0);
    // 地面
    // TODO: 画面幅を揃える
    this.ground = this.physics.add.staticSprite(400, height-32, 'ground');
    // 背景
    this.add.image(600, 800, 'bg');
    // ゴール
    // TODO: ゴール素材差し替え
    this.goal = this.physics.add.staticSprite(700, height-1500, 'goal');
    // プレイヤー
    // TODO: プレイヤーをspriteアニメーションで動くように, 当たり判定をいい感じにする
    //this.player = this.physics.add.sprite(400, height-1200, 'player');
    this.player = this.physics.add.sprite(400, height-200, 'player');
    this.player.setSize(80, 170, 1, 1);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    /*
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', {
        start: 3,
        end: 4
      }),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 2
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        start: 5,
        end: 8
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', {
        start: 9,
        end: 11
      }),
      frameRate: 8,
      repeat: -1
    });
    */
    this.cameras.main.startFollow(this.player, true);
    // 赤ちゃん天使
    this.littleangels = this.physics.add.group();
    this.littleangels.create(50, height-850, 'littleangel');
    this.littleangels.create(800, height-700, 'littleangel');
    this.littleangels.create(550, height-1200, 'littleangel');
    this.littleangels.children.entries.forEach((littleangel)=>{
      littleangel.body.setSize(100, 100, 1, 1);
      littleangel.body.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    // 雲
    this.blocks = this.physics.add.staticGroup();
    this.blocks.create(50, height-1050, 'block');
    this.blocks.create(500, height-950, 'block');
    this.blocks.create(50, height-650, 'block');
    this.blocks.create(800, height-550, 'block');
    this.blocks.create(300, height-250, 'block');
    this.blocks.create(0, height-0, 'block');
    this.blocks.children.entries.forEach(block=>{
      block.body.setSize(200, 150, 1, 1);
    });
    // 敵の悪魔
    // TODO: 一定間隔でプレイヤーの周辺にスポーンするように, 当たり判定をいい感じにする
    this.enemies = this.physics.add.group();
    let genEnemy = ()=>{
      this.enemies.children.entries.forEach(enemy => {
        enemy.destroy();
      });
      /*
      const spawnRange = 30;
      console.log(
        (this.player.x-(this.player.width/2))-spawnRange,
        this.player.x-(this.player.width/2),
        this.player.x+(this.player.width/2),
        (this.player.x+(this.player.width/2))+spawnRange
      );
      */
      this.enemies.create(50, height-300, 'demon');
      this.enemies.children.entries.forEach(enemy => {
        enemy.body.setSize(100, 100, 1, 1);
        enemy.body.setBounce(0.8);
        enemy.body.setCollideWorldBounds(false);
        this.physics.add.collider(this.player, enemy);
        this.physics.add.collider(enemy, this.ground);
        this.physics.add.collider(enemy, this.blocks);
      });
    };
    function getInterval() {
      return 2000;
    }
    function doLoop(i) {
      genEnemy();
      setTimeout(function(){doLoop(++i)}, getInterval());
    }
    genEnemy();
    //doLoop(0);
    // colliderを設定
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.littleangels, this.ground);
    this.physics.add.collider(this.player, this.blocks);
    this.physics.add.collider(this.littleangels, this.blocks);
    // 衝突時の処理を設定
    this.physics.add.overlap(this.player, this.littleangels, collectStar, null, this);
    this.physics.add.overlap(this.player, this.enemies, gameOver, null, this);
    this.physics.add.overlap(this.player, this.goal, gameClear, null, this);
  }
  update() {
    if (this.player.body.touching.down) {
      // 地面にいるときの左右キー処理
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-600);
        //this.player.anims.play('jump', true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(400);
        //this.player.anims.play('right', true);
      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-400);
        //this.player.anims.play('left', true);
      } else {
        this.player.setVelocityX(0);
        //this.player.anims.play('idle', true);
      }
    } else {
      if (this.player.body.newVelocity.y>0) {
        //this.player.anims.play('idle', true);
      }
      if (this.cursors.right.isDown) {
        this.player.setVelocityX(400);
      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-400);
      }
    }
  }
}

class Title extends Phaser.Scene {
  constructor() {
    super('Title');
  }
  preload() {
  }
  create() {
    // TODO: タイトル画面
    const width = 828;
    const height = 1366;
    this.add.text((width/2)-70, height/3, 'TITLE', {
      fontSize: '64px',
      fill: 'red'
    });
    this.add.text((width/2)-70, (height/3)*2, 'START', {
      fontSize: '64px',
      fill: '#000000'
    }).setInteractive().on('pointerdown', ()=>{
      this.scene.start('Main');
    });
  }
  update() {
  }
}

class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }
  preload() {
    // TODO: 背景素材の差し替え
    this.load.audio('gameOverSound', 'asset/sounds/gameover1.mp3');
    this.load.image('gameOverImg', 'asset/scene/gameover.png');
  }
  create() {
    this.gameOverSound = this.sound.add('gameOverSound');
    this.gameOverSound.play();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.gameOverImg = this.add.image(400, 300, 'gameOverImg');
    this.exprainText = this.add.text(180, 400, 'RESTART : Press SPACE KEY', {
      fontSize: '32px',
      fill: '#ffffff'
    });
  }
  update() {
    if (this.spaceKey.isDown) {
      this.gameOverSound.stop();
      this.gameOverImg.destroy();
      this.scene.start('Main');
    }
  }
}

class GameClear extends Phaser.Scene {
  constructor() {
    super('GameClear');
  }
  preload() {
    // TODO: 背景素材の差し替え
    this.load.audio('gameClearSoundNormal', 'asset/sounds/gameclear1.mp3');
    this.load.audio('gameClearSoundComplete', 'asset/sounds/gameclear2.mp3');
    this.load.image('gameClearImg1', 'asset/scene/gameclear1.png');
    this.load.image('gameClearImg2', 'asset/scene/gameclear2.png');
    this.load.image('gameClearImg3', 'asset/scene/gameclear3.png');
  }
  create() {
    this.gameClearSoundNormal = this.sound.add('gameClearSoundNormal');
    this.gameClearSoundComplete = this.sound.add('gameClearSoundComplete');
    // スコアに応じたエンディング変化
    this.MainScene = this.scene.get("Main");
    let score = this.MainScene.score;
    if (score <= 0) {
      this.gameClearSoundNormal.play();
      this.gameClearImg = this.add.image(400, 300, 'gameClearImg1');
    } else if (score == 1) {
      this.gameClearSoundNormal.play();
      this.gameClearImg = this.add.image(400, 300, 'gameClearImg1');
    } else if (score == 2) {
      this.gameClearSoundNormal.play();
      this.gameClearImg = this.add.image(400, 300, 'gameClearImg2');
    } else if (score == 3) {
      this.gameClearSoundComplete.play();
      this.gameClearImg = this.add.image(400, 300, 'gameClearImg3');
    }
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // TODO: テキストをよき感じに入れる(画像埋め込みでも良いかも)
    this.exprainText = this.add.text(180, 400, 'RESTART : Press SPACE KEY', {
      fontSize: '32px',
      fill: '#ffffff'
    });
  }
  update() {
    if (this.spaceKey.isDown) {
      this.gameClearImg.destroy();
      this.scene.start('Main');
    }
  }
}

let config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 828,
  height: 1366,
  backgroundColor: 0xF0F0FF,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 400
      },
      debug: false
    }
  },
  scene: [Title, Main, GameOver, GameClear]
};
let fane = new Phaser.Game(config);