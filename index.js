import { Key, KeyBind } from "./lib/keybind.js";
import { BackgroundArray, EnemyArray, PlayerArray, StageArray } from "./lib/character_array.js";

const debug = true;
// GameStage

class GameStage {
  static life = 3;
  static dead_line = 110;
  static gameover_bgm = new Audio('assets/music/bgm/gameover_loop.mp3');
  constructor(id, bgm = new Audio('assets/music/bgm/battle1_loop.mp3')) {
    this.stage_name = id;
    this.bgm = bgm;
    this.bgm.volume = 0.1;
    this.bgm.loop = true;
    this.players = PlayerArray;
    this.enemys = EnemyArray[id];
    this.attacks = [];
    this.start_time = Date.now();
    this.defeated_enemy = 0;
    this.background = BackgroundArray[id]
    this.next_stages = StageArray[id]; //[[StageNumbers],[Audios]]
    this.key_states = [];
    this.selectable_text = ["next", "home menu"];
    this.arrow = "→";
    this.arrow_pos = 0;
    this.clear_flag = 0; //0:戦闘中or敗北, 1:ステージクリア, 2:ゲームクリア
    this.next_state = 'select';
  }

  play_bgm(){
    if(GameStage.life > 0)this.bgm.play();
    else if(GameStage.life <= 0){
      this.bgm.pause();
      GameStage.gameover_bgm.play();
    }
  }

  stop_bgm(){
    this.bgm.pause();
    GameStage.gameover_bgm.pause();
  }

  // ステージの描画
  draw(screen) {
    screen.clear();

    if (debug) console.log(`next_stages[0] is ${this.next_stages[0]}`)

    //背景画像の描画
    screen.sprites.pop();
    screen.sprites.push(new Sprite(`assets/image/background/${this.background}`, 1024));
    screen.put_sprite(0,0,0,0,3)

    this.players.forEach(player => {
      player.draw(screen);
    });

    this.enemys
    .filter(enemy => (enemy.pop_time <= (Date.now() - this.start_time )/1000) && enemy.hp > 0)
    .forEach(enemy => {
      enemy.draw(screen);
    });

    this.players.forEach(player =>{
      const now = Date.now();
      if((now - player.last_attacked_time)/1000 > player.attack_interval && this.is_not_enemy_empty()){
        this.attacks.push(player.update(this.find_nearest_enemy()));
        player.last_attacked_time = now;
      }
    });


    this.attacks.forEach(attack => {
      //現状は狙った敵が死んだ後に攻撃対象を別の敵に変更する
      //TODO:死んだ後もそのまま画面外まで直進
      const targetEnemy = this.find_nearest_enemy();
      if(targetEnemy == null){
        return;
      }
      attack.update(targetEnemy.x,targetEnemy.y);
      attack.draw(screen);

      //当たった時の処理
      if(attack.areaAttack == 0){
        if (Math.abs(attack.x - targetEnemy.x) < 10 && Math.abs(attack.y - targetEnemy.y) < 10) {
          targetEnemy.hp -= attack.power;

          if(targetEnemy.hp <= 0) this.defeated_enemy += 1;

          const index = this.attacks.indexOf(attack);
          this.attacks.splice(index, 1);
        }
      }
      else if(attack.areaAttack ==1){
        if (Math.abs(attack.x - targetEnemy.x) < 10 && Math.abs(attack.y - targetEnemy.y) < 10) {
          this.apply_area_damage(targetEnemy.x, targetEnemy.y, attack.power);

          const index = this.attacks.indexOf(attack);
          this.attacks.splice(index, 1);
        }
      }
      else if(attack.areaAttack ==2){
        this.apply_penetration_damage(attack.x, attack.y, attack.power);
        if(attack.x > 1024){
          const index = this.attacks.indexOf(attack);
          this.attacks.splice(index, 1);
        }
      }
    });

    screen.ctx.fillStyle = "#FF0000";
    screen.ctx.font = ' 36px sans-serif';
    screen.ctx.fillText(`残機: ${GameStage.life}`, 20, 50);
    screen.ctx.fillText(`撃破数: ${this.defeated_enemy} / ${this.enemys.length}`, 500, 50)

    // ゲームオーバー処理
    if (GameStage.life <= 0) {
      screen.ctx.fillStyle = "#FF0000";
      screen.ctx.font = ' 100px sans-serif';
      screen.ctx.fillText("GAME OVER",screen.height/3, screen.width/4);
      game_state = 'select'
      return;
    }
    else if ((GameStage.life > 0) && (this.defeated_enemy == this.enemys.length)){
      screen.ctx.fillStyle = "#FF0000";
      screen.ctx.font = ' 100px sans-serif';
      screen.ctx.fillText("STAGE CLEAR",screen.height/3, screen.width/4);

      //gse.stages.splice(0, gse.stages.length); // gse.stagesの長さを0にする．不要かも
      gse.stages = this.next_stages;
      gse.next_stage = gse.stages[0][0];
      if (this.next_stages[0][0] == 'clear'){
        this.clear_flag = 2;
        this.next_state = 'clear';
      }
      else {
        this.clear_flag = 1;
        this.next_state = 'select';
      }

      screen.ctx.font = ' 36px sans-serif';
      let font_size = 36;
      let addY = 0;
      for( let i=0; i<this.selectable_text.length; i++ ) {
        let line = this.selectable_text[i] ;
        if ( i ) addY = font_size * i ;
        screen.ctx.fillText( line, screen.height/2, screen.width/3 + addY);
      }
      screen.ctx.fillText(this.arrow, screen.height/2-36, screen.width/3 + this.arrow_pos*36) ;
      if (debug) console.log(this.clear_flag);
      if (debug) console.log(this.arrow_pos);
      return;
    }

  }

  is_not_enemy_empty(){
    let flag = 0;
    this.enemys.forEach(enemy => {
      if(enemy.hp > 0) flag = 1;
    });
    return flag;
  }

  //最も近い敵を探す
  find_nearest_enemy() {
    let nearestEnemy = null;
    let minX = 1024;

    this.enemys
    .filter(enemy => enemy.hp > 0)
    .forEach((enemy) => {
      if (enemy.x < minX) {
        minX = enemy.x;
        nearestEnemy = enemy;
      }
    });

    return nearestEnemy;
  }

  //範囲攻撃の定義
  apply_area_damage(x, y, damage){
    this.enemys
    .filter(enemy => enemy.hp > 0)
    .forEach((enemy) => {
      const distance = Math.sqrt((x - enemy.x) ** 2 + (y - enemy.y) ** 2);
      if (distance <= 50) {
        enemy.hp -= damage;
        if(enemy.hp <= 0) this.defeated_enemy += 1;
      }
    });
  }

  apply_penetration_damage(x, y, damage){
    this.enemys
    .filter(enemy => enemy.hp > 0)
    .forEach((enemy) => {
      const distance = Math.sqrt((x - enemy.x) ** 2 + (y - enemy.y) ** 2);
      if (distance <= 10) {
        enemy.hp -= damage;
        if(enemy.hp <= 0) this.defeated_enemy += 1;
      }
    });
  }

  // 状態の更新
  update() {
    // this.players.forEach(player => {
    //   player.update();
    // });

    this.enemys
    .filter(enemy => (enemy.pop_time <= (Date.now() - this.start_time)/1000) && enemy.hp > 0)
    .forEach(enemy => {
      enemy.pos_update();
      this.reach(enemy);
    });
  }

  // 敵が防衛ラインに到達したか？
  reach(enemy) {
    if (enemy.x <= GameStage.dead_line) {
      enemy.hp_update(enemy.hp);
      GameStage.life -= 1;
      this.defeated_enemy += 1;
    }
  }

  //key()
  toggle_key(key_symbol, state) {
    this.key_states[key_symbol] = state;

    // クリアすると操作可能
    if (this.clear_flag){
      if (this.key_states[Key.Up]) {
        if (this.arrow_pos > 0) {
          this.arrow_pos -= 1;
        }
        if (this.arrow_pos == 0){
          if (this.clear_flag == 2){
            this.next_state = 'clear';
          }
          else {
            this.next_state = 'select';
          }
        }
        else {
          this.next_state = 'start';
        }
      }
      if (this.key_states[Key.Down]) {
        if (this.arrow_pos < this.selectable_text.length-1) {
          this.arrow_pos += 1;
        }
        if (this.arrow_pos == 0){
          if (this.clear_flag == 2){
            this.next_state = 'clear';
          }
          else {
            this.next_state = 'select';
          }
        }
        else {
          this.next_state = 'start';
        }
      }
      if (this.key_states[Key.Enter]) {
        game_state = this.next_state;
      }
    }

    if (this.key_states[Key.Skill_1]) {
      if (this.players.length > 0) {
        this.players[0].skill
      }
    }
    if (this.key_states[Key.Skill_2]) {
      if (this.players.length > 1) {
        this.players[1].skill
      }
    }
    if (this.key_states[Key.Skill_3]) {
      if (this.players.length > 2) {
        this.players[2].skill
      }
    }
    if (this.key_states[Key.Skill_4]) {
      if (this.players.length > 3) {
        this.players[3].skill
      }
    }
    if (this.key_states[Key.Skill_5]) {
      if (this.players.length > 4) {
        this.players[4].skill
      }
    }
    if (this.key_states[Key.Skill_6]) {
      if (this.players.length > 5) {
        this.players[5].skill
      }
    }
    if (this.key_states[Key.Skill_7]) {
      if (this.players.length > 6) {
        this.players[6].skill
      }
    }
    if (this.key_states[Key.Skill_8]) {
      if (this.players.length > 7) {
        this.players[7].skill
      }
    }
    if (this.key_states[Key.Skill_9]) {
      if (this.players.length > 8) {
        this.players[8].skill
      }
    }
    if (this.key_states[Key.Escape]) {
      game_state = 'select';
    }
  }

}

////////////////////////////////////////////////////////////////
/// StartScreen
////////////////////////////////////////////////////////////////
class StartScreen {
  constructor(){
    this.title = "Game";
    this.selectable_text = ["start", "quit"];
    this.arrow = "→";
    this.arrow_pos = 0;
    this.key_states = [];
    this.next_state = 'select' //'select' or 'exit'
  }

  draw(screen){
    screen.clear()
    screen.put_sprite(0,0,0,0,0)

    screen.ctx.fillStyle = "#FF0000";
    screen.ctx.font = ' 100px sans-serif';
    screen.ctx.fillText(`${this.title}`,
                                screen.height/3,
                                screen.width/4);

    screen.ctx.font = ' 36px sans-serif';
    // 1行ずつ描画
    let font_size = 36;
    let addY = 0;
    for( let i=0; i<this.selectable_text.length; i++ ) {
      let line = this.selectable_text[i] ;
      if ( i ) addY = font_size * i ;
      screen.ctx.fillText( line, screen.height/2, screen.width/3 + addY ) ;
    }

    screen.ctx.fillText(this.arrow, screen.height/2-36, screen.width/3 + this.arrow_pos*36) ;
  }

  //key()
  toggle_key(key_symbol, state) {
    this.key_states[key_symbol] = state;

    if (debug) console.log(this.next_state);

    if (this.key_states[Key.Up]) {
      this.arrow_pos = 0;
      this.next_state = 'select';
    }
    if (this.key_states[Key.Down]) {
      this.arrow_pos = 1;
      this.next_state = 'exit';
    }
    if (this.key_states[Key.Enter]) {
      game_state = this.next_state;
    }
  }

}
////////////////////////////////////////////////////////////////
/// StageSelect
////////////////////////////////////////////////////////////////
// ステージセレクト画面のクラス
class StageSelect {
  constructor() {
    this.stages = [[0],[new Audio('assets/music/bgm/battle1_loop.mp3')]];
    this.arrow = "→";
    this.arrow_pos = 0;
    this.key_states = [];
    this.next_stage = [this.stages[0][this.arrow_pos],this.stages[1][this.arrow_pos]];
    this.next_state = 'stage'; //'stage' or 'start'
  }
  draw(screen){
    screen.clear()
    screen.put_sprite(0,0,0,0,0)
    screen.ctx.fillStyle = "#FF0000";
    screen.ctx.font = ' 36px sans-serif';
    // 1行ずつ描画
    let font_size = 36;
    let addY = 0;
    for( let i=0; i<this.stages[0].length; i++ ) {
      let line = "stage" + Number(this.stages[0][i]+1).toString();
      if ( i ) addY = font_size * i ;
      screen.ctx.fillText( line, screen.height/2, screen.width/3 + addY ) ;
    }
    screen.ctx.fillText("back", screen.height/2, screen.width/3 + addY+font_size) ;
    screen.ctx.fillText(this.arrow, screen.height/2-36, screen.width/3 + this.arrow_pos*36) ;
  }

  //addstages()

  //key()
  toggle_key(key_symbol, state) {
    this.key_states[key_symbol] = state;

    if (debug) console.log(this.next_stage);

    if (this.key_states[Key.Up]) {
      if (this.arrow_pos > 0) {
        this.arrow_pos -= 1;
      }
      if (this.arrow_pos < this.stages[0].length) {
        this.next_state = 'stage';
      }
      else {
        this.next_state = 'start'
      }
      this.next_stage = this.stages[0][this.arrow_pos];
    }
    if (this.key_states[Key.Down]) {
      if (this.arrow_pos < this.stages[0].length) {
        this.arrow_pos += 1;
      }
      if (this.arrow_pos < this.stages[0].length) {
        this.next_state = 'stage';
      }
      else {
        this.next_state = 'start'
      }
      this.next_stage = this.stages[0][this.arrow_pos];
    }
    if (this.key_states[Key.Enter]) {
      game_state = this.next_state;
      gs = new GameStage(this.next_stage[0], this.next_stage[1])
    }
  }

}

////////////////////////////////////////////////////////////////
/// GameClearScreen
////////////////////////////////////////////////////////////////
// ステージクリア次の画面のクラス
class GameClearScreen {
  constructor(){
    this.title = "Congratulations!";
    this.texts = ["おめでとう!",
                  "あなたたちの頑張りにより",
                  "無事に勇者たちを退けることができました!",
                  "今夜は大宴会だ!!"
    ]
    this.key_states = [];
  }

  draw(screen){
    screen.clear()
    screen.put_sprite(0,0,0,0,0)

    screen.ctx.fillStyle = "#FF0000";
    screen.ctx.font = ' 80px sans-serif';
    screen.ctx.fillText(`${this.title}`,12,screen.width/6);

    screen.ctx.font = ' 36px sans-serif';
    // 1行ずつ描画
    let font_size = 36;
    let addY = 0;
    for( let i=0; i<this.texts.length; i++ ) {
      let line = this.texts[i] ;
      if ( i ) addY = font_size * i ;
      screen.ctx.fillText( line, 12, screen.width/4 + addY ) ;
    }
    screen.ctx.font = ' 12px sans-serif';
    screen.ctx.fillText("最初から遊ぶにはリロードをお願いします......", 12, screen.width/4 + this.texts.length*36) ;
  }

  //key()
  toggle_key(key_symbol, state) {
    this.key_states[key_symbol] = state;

    if (this.key_states[Key.Enter]) {
      game_state = 'exit';
    }
  }

}
////////////////////////////////////////////////////////////////
/// Screen and Sprites
////////////////////////////////////////////////////////////////

/// スクリーンをクリアする関数
///
/// ctx: canvas 要素の 2D コンテキスト
///
class Screen {
  constructor(width, height, ctx, sprites) {
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.sprites = sprites;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /// id に対応するキャラクタの pose パターンを描画
  put_sprite(x, y, id, pose = 0, side=0) {
    this.sprites[side].put_sprite(this.ctx, x, y, id, pose);
  }
}

/// スプライト画像を管理するクラス
///
/// image_path: スプライト並べた画像ファイルへのパス
/// grid_size:  スプライト1枚当りのサイズ
///
/// スプライト画像は grid_size の正方形をタイル状に並べたものタイル画
/// 像は，y軸方向に異なるキャラクタ，x軸方向に1キャラクタの pose 変
/// 化を並べたもの
///
/// 参考: assets/sprites.png
///
class Sprite {
  constructor(image_path, grid_size) {
    this.image = new Image();
    this.image.src = image_path;
    this.grid_size = grid_size
  }

  /// x, y 位置に character を pose パターンで描画
  ///
  /// ctx: canvas 要素の 2D コンテキスト
  ///
  put_sprite(ctx, x, y, character, pose = 0) {
    ctx.drawImage(this.image,
                  this.grid_size * pose, this.grid_size * character,
                  this.grid_size, this.grid_size,
                  x, y,
                  this.grid_size, this.grid_size);
  }

  put_big_sprite(ctx, x, y, character, pose = 0) {
    ctx.drawImage(this.image,
                  this.grid_size * pose, this.grid_size * character,
                  this.grid_size, this.grid_size,
                  x, y,
                  this.grid_size*2, this.grid_size*2);
  }
}

/// キーが押されたときと離されたときに呼ばれる関数
///
/// key は "ArrowLeft" 等の押されたキーに対する文字列が入ってくる．
/// key に対応する動作が KeyBind 内にあれば，gs (StartScreen, StageSelect, GameStage のいずれか) に反映．
///
function process_key(key, state) {
  if (debug) console.log(key);
  let bind = KeyBind[key];
  if (bind) {
    switch (game_state){
      case 'start':
        // bind は Key.Left 等の Enum
        // state は，押されていれば true
        ss.toggle_key(bind, state);
        break
      case 'select':
        gse.toggle_key(bind, state);
        break
      case 'stage':
        gs.toggle_key(bind, state);
        break
      case 'clear':
        gcs.toggle_key(bind, state);
        break
      default:
        break
    }
  }
}

////////////////////////////////////////////////////////////////
// Main loop
////////////////////////////////////////////////////////////////

let start_screen = new Screen(
  1024,
  576,
  document.getElementById('canvas').getContext('2d'),
  [new Sprite('assets/image/background/pipo-battlebg001.jpg', 1024)],
);

let select_screen = new Screen(
  1024,
  576,
  document.getElementById('canvas').getContext('2d'),
  [new Sprite('assets/image/background/pipo-battlebg002.jpg', 1024)],
);

let game_screen = new Screen(
  1024,
  576,
  document.getElementById('canvas').getContext('2d'),
  [new Sprite('assets/image/demon.png', 60),
   new Sprite('assets/image/human.png', 60),
   new Sprite('assets/image/demon_attack.png', 60),
   new Sprite('assets/image/background/pipo-battlebg001.jpg', 1024)],
);

let game_clear_screen = new Screen(
  1024,
  576,
  document.getElementById('canvas').getContext('2d'),
  [new Sprite('assets/image/background/pipo-battlebg011.jpg', 1024)],
);

let start = null;
let prev_timestamp = null;
let game_state = 'start';
let start_time = Date.now();
let ss = new StartScreen();
let gse = new StageSelect();
let gs = new GameStage(0,new Audio('assets/music/bgm/battle1_loop.mp3'));
GameStage.gameover_bgm.volume = 0.1;
let gcs = new GameClearScreen();


let game_loop = (timestamp) => {
  if (!prev_timestamp) {
    start = timestamp;
    prev_timestamp = timestamp;
    requestAnimationFrame(game_loop);
    return;
  }

  if (debug) console.log(game_state);
  switch (game_state){
    case 'start':
      ss.draw(start_screen);
      break
    case 'select':
      gs.stop_bgm();
      gse.draw(select_screen);
      break
    case 'stage':
      gs.play_bgm();
      gs.draw(game_screen);
      gs.update();
      break
    case 'clear':
      gs.stop_bgm();
      gcs.draw(game_clear_screen);
      break
    case 'exit':
      return false;
    default:
      break;
  }

  prev_timestamp = timestamp;
  requestAnimationFrame(game_loop);

};

////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////

function start_game() {
  document.addEventListener('keydown', e => process_key(e.key, true));
  document.addEventListener('keyup',   e => process_key(e.key, false));
  game_loop();
}

start_game();