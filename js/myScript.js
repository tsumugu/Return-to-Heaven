class Main extends Phaser.Scene {
  constructor() {
    super('Main');
  }
  preload() {
    this.load.image('bgLayer1', 'asset/bg/bgLayer1.png');
    this.load.image('bgLayer2', 'asset/bg/bgLayer2.png');
    this.load.image('bgLayer3', 'asset/bg/bgLayer3.png');
    this.load.image('ground', 'asset/bg/ground.png');
    this.load.spritesheet('player', 'asset/characters/angelspritesheet.png', {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.image('littleangel', 'asset/characters/littleangel.png');
    this.load.image('block', 'asset/bg/block.png');
    this.load.image('demon', 'asset/characters/demon.png');
    this.load.image('goal', 'asset/bg/goal.png');
    this.load.audio('getLittleAngel', 'asset/sounds/score.mp3');
    this.load.audio('flyingAngel', 'asset/sounds/flying.mp3');
    this.load.audio('stageBGM', 'asset/sounds/stagebgm.mp3');
  }
  create() {
    const stageHeight = 4000;
    const width = this.scale.width;
    const height = this.scale.height;
    // カメラと世界の範囲を設定
    this.cameras.main.setBounds(0, 0, 828, stageHeight);
    this.physics.world.setBounds(0, 0, 828, stageHeight);
    // 赤ちゃん救出処理
    this.getLittleAngelSE = this.sound.add('getLittleAngel');
    let collectStar = function (player, star) {
      star.destroy();
      this.getLittleAngelSE.play();
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
    this.backgroundMusic = this.sound.add('stageBGM');
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
    // 背景
    this.add.image(width/2, height/2, 'bgLayer1').setScrollFactor(0);
    this.add.image(width/2, height/2, 'bgLayer2').setScrollFactor(0.1);
    this.add.image(width/2, height/2, 'bgLayer3').setScrollFactor(0.2);
    // 地面
    this.ground = this.physics.add.staticSprite(width/2, stageHeight-32, 'ground');
    this.ground.setSize(width, 50, 1, 1);
    // 雲
    this.clouds = this.physics.add.staticGroup();
    this.clouds.create(300, stageHeight-2250, 'block');
    this.clouds.create(800, stageHeight-2000, 'block');
    this.clouds.create(50, stageHeight-1850, 'block');
    this.clouds.create(300, stageHeight-1550, 'block');
    this.clouds.create(800, stageHeight-1350, 'block');
    this.clouds.create(50, stageHeight-1050, 'block');
    this.clouds.create(500, stageHeight-950, 'block');
    this.clouds.create(50, stageHeight-650, 'block');
    this.clouds.create(800, stageHeight-550, 'block');
    this.clouds.create(300, stageHeight-250, 'block');
    this.clouds.create(0, stageHeight-0, 'block');
    this.clouds.children.entries.forEach(block=>{
      block.body.setSize(200, 150, 1, 1);
    });
    // スコア
    this.score = new Number();
    this.scoreText = this.add.text(16, 16, 'score:'+Number(0), {
      fontSize: '64px',
      fill: '#ffe663'
    }).setScrollFactor(0);
    // ゴール
    // TODO: ゴール素材差し替え
    // debug
    //this.goal = this.physics.add.staticSprite(700, stageHeight-1500, 'goal');
    // プレイヤー
    // TODO: プレイヤーをspriteアニメーションで動くように, 当たり判定をいい感じにする
    //this.player = this.physics.add.sprite(400, height-1200, 'player');
    // debug
    //this.player = this.physics.add.sprite(300, stageHeight-1750, 'player');
    this.player = this.physics.add.sprite(400, stageHeight-200, 'player');
    this.player.setSize(80, 170, 1, 1);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 1
      }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
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
    this.littleangels.create(30, stageHeight-850, 'littleangel');
    //this.littleangels.create(800, stageHeight-700, 'littleangel');
    this.littleangels.create(800, stageHeight-2200, 'littleangel');
    this.littleangels.create(550, stageHeight-1200, 'littleangel');
    this.littleangels.children.entries.forEach((littleangel)=>{
      littleangel.body.setSize(100,80, 1, 1);
      littleangel.body.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      littleangel.body.setCollideWorldBounds(false);
    });
    // 敵の悪魔
    this.enemies = this.physics.add.group();
    this.enemies.create(130, stageHeight-850, 'demon');
    this.enemies.create(50, stageHeight-2000, 'demon');
    this.enemies.children.entries.forEach(enemy => {
      enemy.body.setSize(100, 100, 1, 1);
      enemy.body.setBounce(0.4);
      enemy.body.setCollideWorldBounds(false);
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
  }
  update() {
    // 敵に関する処理
    this.enemies.children.entries.forEach(enemy => {
      // 敵とプレイヤーの距離を計算
      var distance = Math.sqrt(Math.pow(this.player.x-enemy.x, 2)+Math.pow(this.player.y-enemy.y, 2));
      //console.log(distance, [[enemy.x, enemy.y], [this.player.x, this.player.y]]);
      // 閾値よりも近かった場合
      if (distance<=350) {
        // 現時点のプレイヤーの座標にその敵を向かわせる。
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
        this.player.anims.play('right', true);
      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-400);
        this.player.anims.play('left', true);
      } else {
        this.player.setVelocityX(0);
        // 羽ばたき音停止
        this.flyingSE.stop();
        // 存在しないkeyを指定するとそのポイントで停止できる。(あまり良くない実装...)
        this.player.anims.play('idle', true);
      }
    } else {
      if (this.cursors.right.isDown) {
        this.player.setVelocityX(400);
        this.player.anims.play('right', true);
      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-400);
        this.player.anims.play('left', true);
      }
    }
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
    //
    let loadingArea = this.add.graphics();
    loadingArea.fillStyle(0x222222, 1);
    loadingArea.fillRect(0, 0, 828, 1366);
    //
    let progressArea = this.add.graphics();
    progressArea.fillStyle(0x000000, 0.8);
    progressArea.fillRect(240, height/2, 320, 50);
    let progressBar = this.add.graphics();
    //
    let loadingText = this.add.text((width/2)-250, (height/3)+100, 'Now Loading...', {
      fontSize: '64px',
      fill: '#ffffff'
    });
    this.load.on('progress', function (value) {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, height/2, 300 * value, 30);
    });
    this.load.on('complete', function () {
      loadingText.destroy();
      loadingText = _this.add.text((width/2)-180, (height/3)+100, 'Complete!', {
        fontSize: '64px',
        fill: '#ffffff'
      });
      _this.add.text(90, (height/3)*2, 'NEXT : SPACE KEY', {
        fontSize: '64px',
        fill: '#ffffff'
      })
    });
    this.load.audio('selectSE', 'asset/sounds/select.mp3');
  }
  create() {
    this.selectSE = this.sound.add('selectSE');
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }
  update() {
    if (this.spaceKey.isDown) {
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
    this.load.image('titleBG', 'asset/bg/titleBG.png');
    this.load.audio('titleBGM', 'asset/sounds/titlebgm.mp3');
    this.load.audio('selectSE', 'asset/sounds/select.mp3');
  }
  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.add.image(width/2, height/2, 'titleBG');
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.selectSE = this.sound.add('selectSE');
    // BGM
    this.titleBGM = this.sound.add('titleBGM');
    let loopMaker = {
      name: 'loop',
      start: 0,
      duration: 23,
      config: {
        loop: true
      }
    };
    this.titleBGM.addMarker(loopMaker);
    this.titleBGM.play('loop', {
      delay: 1
    });
    // TODO: タイトル画面
    this.add.text((width/2)-70, height/3, 'TITLE', {
      fontSize: '64px',
      fill: 'red'
    });
    this.add.text(90, (height/3)*2, 'START : SPACE KEY', {
      fontSize: '64px',
      fill: '#000000'
    })
  }
  update() {
    if (this.spaceKey.isDown) {
      this.titleBGM.stop();
      this.selectSE.play();
      this.scene.start('Main');
    }
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
    this.load.audio('selectSE', 'asset/sounds/select.mp3');
  }
  create() {
    this.selectSE = this.sound.add('selectSE');
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
    // TODO: 背景素材の差し替え
    this.load.audio('gameClearSoundNormal', 'asset/sounds/gameclear1.mp3');
    this.load.audio('gameClearSoundComplete', 'asset/sounds/gameclear2.mp3');
    this.load.image('gameClearImg1', 'asset/scene/gameclear1.png');
    this.load.image('gameClearImg2', 'asset/scene/gameclear2.png');
    this.load.image('gameClearImg3', 'asset/scene/gameclear3.png');
    this.load.audio('selectSE', 'asset/sounds/select.mp3');
  }
  create() {
    this.selectSE = this.sound.add('selectSE');
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
      this.gameClearSoundNormal.stop();
      this.gameClearSoundComplete.stop();
      this.gameClearImg.destroy();
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
      // debug
      debug: true
    }
  },
  // debug
  //scene: [FirstLoading, Title, Main, GameOver, GameClear]
  scene: [Main, GameOver, GameClear]
};
let fane = new Phaser.Game(config);