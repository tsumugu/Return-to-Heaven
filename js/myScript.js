let isSP = ()=>{
  return window.ontouchstart !== undefined && 0 < navigator.maxTouchPoints;
}
let titleNextWayName = ()=>{
  if (isSP()) {
    return "   TAP SCREEN!  ";
  } else {
    return "Press SPACE KEY!";
  }
}
let restartWayName = ()=>{
  if (isSP()) {
    return "TAP SCREEN";
  } else {
    return "SPACE KEY";
  }
}
class FirstLoading extends Phaser.Scene {
  //
  constructor() {
    super('FirstLoading');
  }
  preload() {
    const width = this.scale.width;
    const height = this.scale.height;
    const _this = this;
    this.isLoadCompleted = false;
    var progressBarPos = 220;
    //
    let loadingArea = this.add.graphics();
    loadingArea.fillStyle(0x222222, 1);
    loadingArea.fillRect(0, 0, 828, 1366);
    //
    let progressArea = this.add.graphics();
    progressArea.fillStyle(0x000000, 0.8);
    progressArea.fillRect(progressBarPos-10, height/2, 320, 50);
    let progressBar = this.add.graphics();
    //
    let loadingText = this.add.text((width/2)-220, (height/3)+100, "Now Loading...", {
      fontSize: '64px',
      fill: '#ffffff',
      fontFamily: 'DotGothic16'
    });
    //
    let progressValueText = this.add.text(progressBarPos+340, height/2, "0%", {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'DotGothic16'
    }).setOrigin(0.5, 0);
    //
    this.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(progressBarPos, height/2, 300 * value, 30);
      progressValueText.setText(Math.floor(value*100)+"%");
    });
    //
    this.load.on('complete', function () {
      loadingText.destroy();
      loadingText = _this.add.text((width/2)-290, (height/3)+100, "Loading Completed!", {
        fontSize: '64px',
        fill: '#ffffff',
        fontFamily: 'DotGothic16'
      });
      _this.add.text(150, (height/6)*5, "NEXT : "+restartWayName(), {
        fontSize: '64px',
        fill: '#ffffff',
        fontFamily: 'DotGothic16'
      })
      _this.isLoadCompleted = true;
    });
    // 全素材をロード
    // クリック時の効果音
    this.load.audio('selectSE', 'asset/sounds/select.mp3');
    // Title
    this.load.image('titleBG', 'asset/bg/title.png');
    this.load.image('logo', 'asset/bg/logo.png');
    this.load.audio('titleBGM', 'asset/sounds/titlebgm.mp3');
    // GameOver
    this.load.audio('gameOverSound', 'asset/sounds/gameover1.mp3');
    this.load.image('gameOverImg', 'asset/scene/gameover.png');
    // GameClear
    this.load.audio('gameClearSoundNormal', 'asset/sounds/gameclear1.mp3');
    this.load.audio('gameClearSoundComplete', 'asset/sounds/gameclear2.mp3');
    this.load.image('gameClearImgNormal', 'asset/scene/gameclearnormal.png');
    this.load.image('gameClearImgComplete', 'asset/scene/gameclearcomplete.png');
    // Main
    this.load.image('bgLayer1', 'asset/bg/bgLayer1.png');
    this.load.image('bgLayer2', 'asset/bg/bgLayer2.png');
    this.load.image('bgLayer3', 'asset/bg/bgLayer3.png');
    this.load.image('ground', 'asset/bg/ground.png');
    this.load.spritesheet('player', 'asset/characters/angelspritesheet.png', {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet('demon', 'asset/characters/demonspritesheet.png', {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet('littleangel', 'asset/characters/littleangelspritesheet.png', {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.image('cloud', 'asset/bg/cloud.png');
    this.load.image('goal', 'asset/bg/goal.png');
    this.load.audio('getLittleAngel', 'asset/sounds/score.mp3');
    this.load.audio('flyingAngel', 'asset/sounds/flying.mp3');
    this.load.audio('stageBGM', 'asset/sounds/stagebgm.mp3');
    //
  }
  create() {
    this.selectSE = this.sound.add('selectSE');
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // スマホ向け
    if(isSP()) {
      this.input.on('pointerdown', ()=>{
        this.selectSE.play();
        this.scene.start('Title');
      });
    }
    //
  }
  update() {
    if (this.spaceKey.isDown && this.isLoadCompleted) {
      this.selectSE.play();
      this.scene.start('Title');
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
    const width = this.scale.width;
    const height = this.scale.height;
    //
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.selectSE = this.sound.add('selectSE');
    // タイトル背景
    this.add.image(width/2, height/2, 'titleBG');
    // ロゴ
    this.logo = this.add.image(width/2, 470, 'logo');
    this.logo.scale = 0.55;
    this.logoDirection = "down";
    // ↓ロゴの動く範囲、スピードの設定
    this.upSpeed = 0.25;
    this.downSpeed = 0.25;
    this.topLimit = 465;
    this.bottomLimit = 480;
    // BGM
    this.titleBGM = this.sound.add('titleBGM');
    let loopMaker = {
      name: 'loop',
      start: 0,
      duration: 22.856,
      config: {
        loop: true
      }
    };
    this.titleBGM.addMarker(loopMaker);
    this.titleBGM.play('loop', {
      delay: 0.5
    });
    //
    this.add.text(150, (height/6)*5, titleNextWayName(), {
      fontSize: '64px',
      fill: '#8586fb',
      fontFamily: 'DotGothic16'
    })
    // スマホ向けの処理
    if(isSP()) {
      this.input.on('pointerdown', ()=>{
        this.titleBGM.stop();
        this.selectSE.play();
        this.scene.start('Main');
      });
    }
    //
  }
  update() {
    if (this.spaceKey.isDown) {
      this.titleBGM.stop();
      this.selectSE.play();
      this.scene.start('Main');
    }
    // ロゴを動かす処理
    if (this.logo.y<this.topLimit) {
      this.logoDirection = "down";
    } else if (this.logo.y>this.bottomLimit) {
      this.logoDirection = "up";
    }
    if (this.logoDirection == "down") {
      this.logo.y += this.downSpeed;
    } else if (this.logoDirection== "up") {
      this.logo.y -= this.upSpeed;
    }
  }
}

class Main extends Phaser.Scene {
  constructor() {
    super('Main');
  }
  preload() {
    // スマホ向けの処理
    if(isSP()) {
      this.load.scenePlugin('rexgesturesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js', 'rexGestures', 'rexGestures');
    }
  }
  create() {
    const stageHeight = 4000;
    const width = this.scale.width;
    const height = this.scale.height;
    const _this = this;
    // カメラと世界の範囲を設定
    this.cameras.main.setBounds(0, 0, 828, stageHeight);
    this.physics.world.setBounds(0, 0, 828, stageHeight);
    // 赤ちゃん救出処理
    this.getLittleAngelSE = this.sound.add('getLittleAngel');
    let collectStar = function (player, star) {
      star.destroy();
      this.getLittleAngelSE.play();
      this.score += 1;
      this.scoreText.setText(this.score+'/3');
    }
    // ゲームオーバー処理
    let gameOver = function (player, enemy) {
      this.flyingSE.stop();
      this.backgroundMusic.stop();
      this.scene.start('GameOver');
    }
    //クリア処理
    let gameClear = function (player, enemy) {
      this.backgroundMusic.stop();
      this.scene.start('GameClear');
    }
    // animation
    this.anims.create({
      key: 'littleangelIdle',
      frames: this.anims.generateFrameNumbers('littleangel', {
        start: 0,
        end: 1
      }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'demonIdle',
      frames: this.anims.generateFrameNumbers('demon', {
        start: 0,
        end: 1
      }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'leftwalk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 0
      }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'rightwalk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 4,
        end: 4
      }),
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'leftfly',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 1
      }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'rightfly',
      frames: this.anims.generateFrameNumbers('player', {
        start: 4,
        end: 5
      }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', {
        start: 2,
        end: 3
      }),
      frameRate: 2,
      repeat: -1
    });
    // BGM
    this.backgroundMusic = this.sound.add('stageBGM');
    let loopMaker = {
      name: 'loop',
      start: 0,
      duration: 33.85,
      config: {
        loop: true
      }
    };
    this.backgroundMusic.addMarker(loopMaker);
    this.backgroundMusic.play('loop', {
      delay: 0.5
    });
    // 背景
    this.add.image(width/2, height/2, 'bgLayer1').setScrollFactor(0);
    this.add.image(width/2, height/2, 'bgLayer2').setScrollFactor(0.15);
    this.add.image(width/2, height/2, 'bgLayer3').setScrollFactor(0.2);
    // 地面
    this.ground = this.physics.add.staticSprite(width/2, stageHeight-32, 'ground');
    this.ground.setSize(width, 50, 1, 1);
    // 雲
    this.clouds = this.physics.add.staticGroup();
    this.clouds.create(750, stageHeight-3400, 'cloud');
    this.clouds.create(10, stageHeight-3200, 'cloud');
    this.clouds.create(200, stageHeight-3000, 'cloud');
    if(isSP()) {
      this.clouds.create(880, stageHeight-2600, 'cloud');
    } else {
      this.clouds.create(900, stageHeight-2600, 'cloud');
    }
    this.clouds.create(300, stageHeight-2250, 'cloud');
    this.clouds.create(800, stageHeight-2000, 'cloud');
    // 難易度調整ポイント: 1870を1850にすると、プレイヤーが雲のすきまを抜けられなくなる。
    this.clouds.create(50, stageHeight-1870, 'cloud');
    this.clouds.create(300, stageHeight-1550, 'cloud');
    this.clouds.create(800, stageHeight-1350, 'cloud');
    this.clouds.create(50, stageHeight-1050, 'cloud');
    this.clouds.create(500, stageHeight-950, 'cloud');
    this.clouds.create(50, stageHeight-650, 'cloud');
    this.clouds.create(800, stageHeight-550, 'cloud');
    this.clouds.create(300, stageHeight-250, 'cloud');
    this.clouds.children.entries.forEach(block=>{
      block.body.setSize(200, 150, 1, 1);
    });
    // スコア
    this.score = new Number();
    this.add.text(16, 32, "助けた天使の数: ", {
      fontSize: '42px',
      fill: '#ff99e7',
      fontFamily: 'DotGothic16'
    }).setScrollFactor(0);
    this.scoreText = this.add.text(340, 16, "0/3", {
      fontSize: '64px',
      fill: '#ff99e7',
      fontFamily: 'DotGothic16'
    }).setScrollFactor(0);
    // ゴール
    this.goal = this.physics.add.staticSprite(785, stageHeight-3550, 'goal');
    this.goal.scale = 1.2;
    this.goal.setSize(150, 150, 1, 1);
    // プレイヤー
    this.player = this.physics.add.sprite(600, stageHeight-200, 'player');
    this.player.setSize(80, 170, 1, 1);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.flyingSE = this.sound.add('flyingAngel');
    let loopMaker2 = {
      name: 'loop',
      start: 0,
      duration: 2,
      config: {
        loop: true
      }
    };
    this.flyingSE.addMarker(loopMaker2);
    // 赤ちゃん天使
    this.littleangels = this.physics.add.group();
    this.littleangels.create(30, stageHeight-3400, 'littleangel');
    this.littleangels.create(800, stageHeight-2200, 'littleangel');
    this.littleangels.create(30, stageHeight-1200, 'littleangel');
    this.littleangels.children.entries.forEach((littleangel)=>{
      littleangel.body.setSize(100,80, 1, 1);
      littleangel.body.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      littleangel.body.setCollideWorldBounds(false);
      littleangel.anims.play('littleangelIdle', true);
    });
    // 敵の悪魔
    this.enemies = this.physics.add.group();
    this.enemies.create(200, stageHeight-3200, 'demon');
    this.enemies.create(50, stageHeight-2000, 'demon');
    this.enemies.create(130, stageHeight-1200, 'demon');
    this.enemies.children.entries.forEach(enemy => {
      enemy.body.setSize(100, 100, 1, 1);
      enemy.body.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
      // 難易度調整ポイント: falseにすると敵がステージ外に消えていく
      enemy.body.setCollideWorldBounds(true);
      enemy.anims.play('demonIdle', true);
      this.physics.add.collider(this.player, enemy);
      this.physics.add.collider(enemy, this.ground);
      this.physics.add.collider(enemy, this.clouds);
    });
    // cursor
    this.cursors = this.input.keyboard.createCursorKeys();
    // cameraがプレイヤーを追うように設定
    this.cameras.main.startFollow(this.player, true);
    // colliderを設定
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.littleangels, this.ground);
    this.physics.add.collider(this.player, this.clouds);
    this.physics.add.collider(this.littleangels, this.clouds);
    // 衝突時の処理を設定
    this.physics.add.overlap(this.player, this.littleangels, collectStar, null, this);
    this.physics.add.overlap(this.player, this.enemies, gameOver, null, this);
    this.physics.add.overlap(this.player, this.goal, gameClear, null, this);
    // スマホ向けの処理
    // スマホ向けにスワイプでも動作するように。
    if(isSP()) {
      var swipe = this.rexGestures.add.swipe(config);
      swipe.on('swipe', function(swipe, gameObject, lastPointer){
        if (this.player.body.touching.down) {
          if (swipe.up) {
            this.player.setVelocityY(-600);
            //羽ばたき音再生
            this.flyingSE.play('loop', {
              delay: 0
            });
            this.player.anims.play('jump', true);
          } else if (swipe.right) {
            this.player.setVelocityX(400);
            this.player.anims.play('rightwalk', true);
            this.flyingSE.stop();
          } else if (swipe.left) {
            this.player.setVelocityX(-400);
            this.player.anims.play('leftwalk', true);
            this.flyingSE.stop();
          }
        } else {
          if (swipe.right) {
            this.player.setVelocityX(400);
            this.player.anims.play('rightfly', true);
          } else if (swipe.left) {
            this.player.setVelocityX(-400);
            this.player.anims.play('leftfly', true);
          }
        }
      }, this);
    }
    //
  }
  update() {
    // 敵に関する処理
    this.enemies.children.entries.forEach(enemy => {
      // 敵とプレイヤーの距離を計算
      var distance = Math.sqrt(Math.pow(this.player.x-enemy.x, 2)+Math.pow(this.player.y-enemy.y, 2));
      // 閾値よりも近かった場合
      if (distance<=350) {
        // 現時点のプレイヤーの座標と同じ力をその敵にかける
        enemy.setVelocity(this.player.x/2, this.player.y/2);
      }
    });
    // プレイヤーの移動に関する処理
    if (this.player.body.touching.down) {
      // 地面にいるときの左右キー処理
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-600);
        //羽ばたき音再生
        this.flyingSE.play('loop', {
          delay: 0
        });
        this.player.anims.play('jump', true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(400);
        this.player.anims.play('rightwalk', true);
        this.flyingSE.stop();
      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-400);
        this.player.anims.play('leftwalk', true);
        this.flyingSE.stop();
      } else {
        // 難易度調整ポイント: 雲が滑るかどうか (コメントを外すと滑らなくなる)
        //this.player.setVelocityX(0);
        // 羽ばたき音停止
        this.flyingSE.stop();
        // 1フレーム目でアニメーション停止
        this.player.anims.stop(null, true);
      }
    } else {
      if (this.cursors.right.isDown) {
        this.player.setVelocityX(400);
        this.player.anims.play('rightfly', true);
      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-400);
        this.player.anims.play('leftfly', true);
      }
    }
  }
}

class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }
  preload() {
  }
  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    //
    this.selectSE = this.sound.add('selectSE');
    this.gameOverSound = this.sound.add('gameOverSound');
    this.gameOverSound.play();
    //
    this.gameOverImg = this.add.image(width/2, height/2, 'gameOverImg');
    //
    this.add.text(120, height-150, "RESTART : "+restartWayName(), {
      fontSize: '64px',
      fill: '#ffffff',
      fontFamily: 'DotGothic16'
    })
    // スマホ向けの処理
    if(isSP()) {
      this.input.on('pointerdown', ()=>{
        this.gameOverSound.stop();
        this.selectSE.play();
        this.scene.start('Main');
      });
    }
    //
  }
  update() {
    if (this.spaceKey.isDown) {
      this.gameOverSound.stop();
      this.selectSE.play();
      this.scene.start('Main');
    }
  }
}

class GameClear extends Phaser.Scene {
  constructor() {
    super('GameClear');
  }
  preload() {
  }
  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    //
    this.selectSE = this.sound.add('selectSE');
    this.gameClearSoundNormal = this.sound.add('gameClearSoundNormal');
    this.gameClearSoundComplete = this.sound.add('gameClearSoundComplete');
    // スコアに応じたエンディング変化
    this.MainScene = this.scene.get("Main");
    let score = this.MainScene.score;
    if (score <= 0) {
      this.gameClearSoundNormal.play();
      this.gameClearImg = this.add.image(width/2, height/2, 'gameClearImgNormal');
    } else if (score == 1) {
      this.gameClearSoundNormal.play();
      this.gameClearImg = this.add.image(width/2, height/2, 'gameClearImgNormal');
    } else if (score == 2) {
      this.gameClearSoundNormal.play();
      this.gameClearImg = this.add.image(width/2, height/2, 'gameClearImgNormal');
    } else if (score == 3) {
      this.gameClearSoundComplete.play();
      this.gameClearImg = this.add.image(width/2, height/2, 'gameClearImgComplete');
    }
    //
    this.add.text(120, height-150, "RESTART : "+restartWayName(), {
      fontSize: '64px',
      fill: '#000000',
      fontFamily: 'DotGothic16'
    })
    // スマホ向けの処理
    if(isSP()) {
      this.input.on('pointerdown', ()=>{
        this.gameClearSoundNormal.stop();
        this.gameClearSoundComplete.stop();
        this.selectSE.play();
        this.scene.start('Main');
      });
    }
    //
  }
  update() {
    if (this.spaceKey.isDown) {
      this.gameClearSoundNormal.stop();
      this.gameClearSoundComplete.stop();
      this.selectSE.play();
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
  scene: [FirstLoading, Title, Main, GameOver, GameClear]
};
let fane = new Phaser.Game(config);