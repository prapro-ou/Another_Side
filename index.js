import { Key, KeyBind } from "./lib/keybind.js";
import { BackgroundArray, EnemyArray, PlayerArray, StageArray, add_player } from "./lib/character_array.js";
import { Skeleton_knight, Slime, Assasin, Mummy, Ghost1, Ghost2, Goblin_archer, Satan, Skeleton_king } from "./lib/character.js";

const debug = true;
// GameStage

class GameStage {
  static life = 3;
  static dead_line = 110;
  static gameover_bgm = new Audio('assets/music/bgm/gameover_loop.mp3');
  static clear_stage_bgm = new Audio('assets/music/bgm/stage_clear_loop.mp3');
  static move_sound = new Audio('assets/music/sounds/move_pointer_se.mp3');
  static enter_sound = new Audio('assets/music/sounds/enter_button_se.mp3');
  constructor(id, bgm = new Audio('assets/music/bgm/battle1_loop.mp3')) {
    this.stage_name = id;
    this.bgm = bgm;
    this.bgm.volume = 0.1;
    this.bgm.loop = true;
    this.players = PlayerArray;
    this.enemys = EnemyArray[id];
    this.attacks = [];
    this.start_time = Date.now();
    this.defeated_enemy = [];
    this.background = BackgroundArray[id]
    this.next_stages = StageArray[id]; //[[StageNumbers],[Audios]] 
    this.key_states = [];
    this.selectable_text = ["キャラクター追加", "キャラクター強化", "回復", "リロードでスタート画面に戻る"];
    this.arrow = "→";
    this.arrow_pos = 0;
    this.clear_flag = 0; //0:戦闘中, 1:ステージクリア, 2:ゲームクリア 
    this.next_state = 'select';
  }

  play_bgm(){
    if(GameStage.life > 0 && this.clear_flag == 0){
      this.bgm.play();
    }
    else if(GameStage.life > 0 && this.clear_flag == 1){
      this.bgm.pause();
      GameStage.clear_stage_bgm.play();
    }
    else if(GameStage.life <= 0){
      this.bgm.pause();
      GameStage.gameover_bgm.play();
    }
  }

  stop_bgm(){
    this.bgm.pause();
    GameStage.clear_stage_bgm.pause();
    GameStage.clear_stage_bgm.currentTime = 0;
    GameStage.gameover_bgm.pause();
  }

  play_hit_sound(areaAttack){
    const hit_sound0 = new Audio('assets/music/sounds/punch2_se.mp3');
    hit_sound0.volume = 0.3;
    const hit_sound1 = new Audio('assets/music/sounds/explosion_se.mp3');
    hit_sound1.volume = 0.3;
    const hit_sound2 = new Audio('assets/music/sounds/sword_se.mp3');
    hit_sound2.volume = 0.3;

    if(areaAttack == 0) hit_sound0.play();
    else if(areaAttack == 1) hit_sound1.play();
    else if(areaAttack == 2) hit_sound2.play();
  }

  play_defeated_sound(){
    const defeat_sound = new Audio('assets/music/sounds/defeat_se.mp3');
    defeat_sound.volume = 0.3;
    defeat_sound.play();
  }

  play_sound(key){
    switch(key){
      case 'arrow':
        // this.move_sound.volume = 0.3;
        GameStage.move_sound.currentTime = 0;
        GameStage.move_sound.play();
        break;
      case 'enter':
        // StageSelect.enter_sound.volume = 0.3;
        GameStage.enter_sound.play();
        break;
      default:
        break;
    }
  }

  skill_init(){
    this.players.forEach(player => {
     player.next_skill_avalable_time = Date.now() + player.skill_1st_cooltime;
    });
  }

  start_skill(player){
    const time = Date.now()
    if(time > player.next_skill_avalable_time && player.skill_flag == 0){
      switch(player.constructor){
        case Skeleton_knight:
          player.start_skill(this.players);
          player.end_skill_time = time + player.skill_duration;
          player.skill_flag = 1;
          break;
        case Slime:
          player.start_skill();
          player.end_skill_time = time + player.skill_duration;
          player.skill_flag = 1;
          break;
        case Ghost1:
          player.start_skill();
          player.end_skill_time = time + player.skill_duration;
          player.skill_flag = 1;
          break;
        case Goblin_archer:
          player.start_skill();
          player.end_skill_time = time + player.skill_duration;
          player.skill_flag = 1;
          break;
        case Mummy:
          player.start_skill(this.enemys);
          player.end_skill_time = time + player.skill_duration;
          player.skill_flag = 1;
          break;
        case Ghost2:
          player.start_skill(this.enemys, this.start_time);
          player.end_skill_time = time + player.skill_duration;
          player.skill_flag = 1;
          break;
        case Assasin:
          player.start_skill(this.attacks);
          player.end_skill_time = time + player.skill_duration;
          player.skill_flag = 1;
          break;
        case Skeleton_king:
          player.start_skill();
          player.end_skill_time = time + player.skill_duration;
          player.skill_flag = 1;
          break;
        case Satan:
          player.start_skill();
          player.end_skill_time = time + player.skill_duration;
          player.skill_flag = 1;
          break;
        default:
          break;
      }
    }
  }

  end_skills(){
    const now = Date.now();
    this.players.forEach(player => {
      if((now > player.end_skill_time && player.skill_flag == 1) || this.clear_flag == 1){
        switch(player.constructor){
          case Skeleton_knight:
            player.end_skill(this.players);
            player.skill_flag = 0;
            break;
          case Slime:
            player.end_skill();
            player.skill_flag = 0;
            break;
          case Ghost1:
            player.end_skill();
            player.skill_flag = 0;
            break;
          case Goblin_archer:
            player.end_skill();
            player.skill_flag = 0;
            break;
          case Mummy:
            player.end_skill(this.enemys);
            player.skill_flag = 0;
            break;
          case Ghost2:
            player.end_skill();
            player.skill_flag = 0;
            break;
          case Assasin:
            player.end_skill();
            player.skill_flag = 0;
            break;
          case Skeleton_king:
            player.end_skill();
            player.skill_flag = 0;
            break;
          case Satan:
            player.end_skill();
            player.skill_flag = 0;
            break;
          default:
            break;
        }
        player.next_skill_avalable_time = now + player.skill_cooltime;
      }
    });
  }

  // ステージの描画
  draw(screen) {
    screen.clear();

    if (debug) console.log(`next_stages[0] is ${this.next_stages[0]}`)
    if (debug) console.log(`1st character skill state: ${this.players[0].skill_flag}`)

    this.end_skills();

    //背景画像の描画
    screen.sprites.pop();
    screen.sprites.push(new Sprite(`assets/image/background/${this.background}`, 1024));
    screen.put_sprite(0,0,0,0,3)

    this.players.forEach(player => {
      player.draw(screen);
    });

    this.defeated_enemy = this.enemys.filter(enemy => enemy.hp <= 0)

    this.enemys
    .filter(enemy => (enemy.pop_time <= (Date.now() - this.start_time )/1000) && enemy.hp > 0)
    .forEach(enemy => {
      enemy.draw(screen);
    });

    if(GameStage.life > 0){
      this.players.forEach(player =>{
        const now = Date.now();
        if((now - player.last_attacked_time)/1000 > player.attack_interval && this.is_not_enemy_empty()){
          this.attacks.push(player.update(this.find_nearest_enemy()));
          player.last_attacked_time = now;
        }
      });
    }

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
          this.play_hit_sound(attack.areaAttack);
          targetEnemy.hp -= attack.power;

          const index = this.attacks.indexOf(attack);
          this.attacks.splice(index, 1);
        }
      }
      else if(attack.areaAttack ==1){
        if (Math.abs(attack.x - targetEnemy.x) < 10 && Math.abs(attack.y - targetEnemy.y) < 10) {
          this.play_hit_sound(attack.areaAttack);
          this.apply_area_damage(targetEnemy.x, targetEnemy.y, attack.power, attack.distance);

          const index = this.attacks.indexOf(attack);
          this.attacks.splice(index, 1);
        }
      }
      else if(attack.areaAttack ==2){
        this.apply_penetration_damage(attack.x, attack.y, attack.power, attack.distance);
        if(attack.x > 1024){
          const index = this.attacks.indexOf(attack);
          this.attacks.splice(index, 1);
        }
      }
    });

    screen.ctx.fillStyle = "#FF0000";
    screen.ctx.font = ' 36px sans-serif';
    screen.ctx.fillText(`残機: ${GameStage.life}`, 20, 50);
    screen.ctx.fillText(`撃破数: ${this.defeated_enemy.length} / ${this.enemys.length}`, 500, 50)

    // ゲームオーバー処理
    // 負けたとき
    if (GameStage.life <= 0) {
      screen.ctx.fillStyle = "#FF0000";
      screen.ctx.font = ' 100px sans-serif';
      screen.ctx.fillText("GAME OVER",screen.height/3, screen.width/4);
      this.next_state = 'select'

      screen.ctx.font = ' 36px sans-serif';
      screen.ctx.fillText( this.selectable_text[this.selectable_text.length-1], screen.height/2, screen.width/3 );

      return;
    }
    // 勝ったとき
    else if ((GameStage.life > 0) && (this.defeated_enemy.length == this.enemys.length)){
      this.end_skills();

      screen.ctx.fillStyle = "#FF0000";
      screen.ctx.font = ' 100px sans-serif';
      screen.ctx.fillText("STAGE CLEAR",screen.height/3, screen.width/4);

      //gse.stages.splice(0, gse.stages.length); // gse.stagesの長さを0にする．不要かも
      gse.stages = this.next_stages;
      gse.next_stage = [gse.stages[0][0],gse.stages[1][0]];
      if (this.next_stages[0][0] == 'clear'){
        this.clear_flag = 2;
      }
      else {
        this.clear_flag = 1;
      }

      screen.ctx.font = ' 36px sans-serif';
      let font_size = 36;
      let addY = 0;
      for( let i=0; i<this.selectable_text.length-1; i++ ) {
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
  apply_area_damage(x, y, damage, dist){
    this.enemys
    .filter(enemy => enemy.hp > 0)
    .forEach((enemy) => {
      const distance = Math.sqrt((x - enemy.x) ** 2 + (y - enemy.y) ** 2);
      if (distance <= dist) {
        enemy.hp -= damage;
      }
    });
  }

  apply_penetration_damage(x, y, damage, dist){
    this.enemys
    .filter(enemy => enemy.hp > 0)
    .forEach((enemy) => {
      const distance = Math.sqrt((x - enemy.x) ** 2 + (y - enemy.y) ** 2);
      if (distance <= dist) {
        this.play_hit_sound(2);
        enemy.hp -= damage;
      }
    });
  }

  // 状態の更新
  update() {
    // this.players.forEach(player => {
    //   player.update();
    // });
    if(GameStage.life > 0){
      this.enemys
      .filter(enemy => (enemy.pop_time <= (Date.now() - this.start_time)/1000) && enemy.hp > 0)
      .forEach(enemy => {
        enemy.pos_update();
        this.reach(enemy);
      });
    }
  }

  // 敵が防衛ラインに到達したか？
  reach(enemy) {
    if (enemy.x <= GameStage.dead_line) {
      this.play_defeated_sound();
      enemy.hp_update(enemy.hp);
      GameStage.life -= 1;
      enemy.hp = 0;
    }
  }

  //key()
  toggle_key(key_symbol, state) {
    this.key_states[key_symbol] = state;

    // クリアすると操作可能
    if (this.clear_flag){
      if (this.key_states[Key.Up]) {
        this.play_sound('arrow');
        if (this.arrow_pos > 0) {
          this.arrow_pos -= 1;
        }
      }
      if (this.key_states[Key.Down]) {
        this.play_sound('arrow');
        if (this.arrow_pos < this.selectable_text.length-2) {
          this.arrow_pos += 1;
        }
      }
      if (this.key_states[Key.Enter]) {
        this.play_sound('enter');
        switch (this.arrow_pos) {
          case 0:
            add_player();
            break;
          case 1:
            power_up_player();
            break;
          case 2:
            add_life();
            break;
        }
        game_state = this.next_state;
      }
    }

    if (this.key_states[Key.Skill_1]) {
      if (this.players[0] != undefined) {
        this.start_skill(this.players[0]);
      }
    }
    if (this.key_states[Key.Skill_2]) {
      if (this.players[1] != undefined) {
        this.start_skill(this.players[1]);
      }
    }
    if (this.key_states[Key.Skill_3]) {
      if (this.players[2] != undefined) {
        this.start_skill(this.players[2]);
      }
    }
    if (this.key_states[Key.Skill_4]) {
      if (this.players[3] != undefined) {
        this.start_skill(this.players[3]);
      }
    }
    if (this.key_states[Key.Skill_5]) {
      if (this.players[4] != undefined) {
        this.start_skill(this.players[4]);
      }
    }
    if (this.key_states[Key.Skill_6]) {
      if (this.players[5] != undefined) {
        this.start_skill(this.players[5]);
      }
    }
    if (this.key_states[Key.Skill_7]) {
      if (this.players[6] != undefined) {
        this.start_skill(this.players[6]);
      }
    }
    if (this.key_states[Key.Skill_8]) {
      if (this.players[7] != undefined) {
        this.start_skill(this.players[7]);
      }
    }
    if (this.key_states[Key.Skill_9]) {
      if (this.players[8] != undefined) {
        this.start_skill(this.players[8]);
      }
    }
    if (this.key_states[Key.Escape]) {
      game_state = 'select';
    }
  }

}

function power_up_player() {
  gs.players.forEach(player => {
    player.level_up();
  });
}

function add_life() {
  GameStage.life += 1;
}

////////////////////////////////////////////////////////////////
/// StartScreen
////////////////////////////////////////////////////////////////
class StartScreen {
  static move_sound = new Audio('assets/music/sounds/move_pointer_se.mp3');
  static enter_sound = new Audio('assets/music/sounds/enter_button_se.mp3');
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

  play_sound(key){
    switch(key){
      case 'arrow':
        // this.move_sound.volume = 0.3;
        StartScreen.move_sound.currentTime = 0;
        StartScreen.move_sound.play();
        break;
      case 'enter':
        // StageSelect.enter_sound.volume = 0.3;
        StartScreen.enter_sound.play();
        break;
      default:
        break;
    }
  }


  //key()
  toggle_key(key_symbol, state) {
    this.key_states[key_symbol] = state;

    if (debug) console.log(this.next_state);

    if (this.key_states[Key.Up]) {
      this.play_sound('arrow');
      this.arrow_pos = 0;
      this.next_state = 'select';
    }
    if (this.key_states[Key.Down]) {
      this.play_sound('arrow');
      this.arrow_pos = 1;
      this.next_state = 'exit';
    }
    if (this.key_states[Key.Enter]) {
      this.play_sound('enter');
      game_state = this.next_state;
    }
  }

}
////////////////////////////////////////////////////////////////
/// StageSelect
////////////////////////////////////////////////////////////////
// ステージセレクト画面のクラス
class StageSelect {
  static move_sound = new Audio('assets/music/sounds/move_pointer_se.mp3');
  static enter_sound = new Audio('assets/music/sounds/enter_button_se.mp3');
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

  play_sound(key){
    switch(key){
      case 'arrow':
        // this.move_sound.volume = 0.3;
        StageSelect.move_sound.currentTime = 0;
        StageSelect.move_sound.play();
        break;
      case 'enter':
        // StageSelect.enter_sound.volume = 0.3;
        StageSelect.enter_sound.play();
        break;
      default:
        break;
    }
  }

  //key()
  toggle_key(key_symbol, state) {
    this.key_states[key_symbol] = state;

    if (debug) console.log(this.next_stage);

    if (this.key_states[Key.Up]) {
      this.play_sound('arrow');
      if (this.arrow_pos > 0) {
        this.arrow_pos -= 1;
      }
      if (this.arrow_pos < this.stages[0].length) {
        this.next_state = 'stage';
      }
      else {
        this.next_state = 'start'
      }
      this.next_stage = [this.stages[0][this.arrow_pos],this.stages[1][this.arrow_pos]];
    }
    if (this.key_states[Key.Down]) {
      this.play_sound('arrow');
      if (this.arrow_pos < this.stages[0].length) {
        this.arrow_pos += 1;
      }
      if (this.arrow_pos < this.stages[0].length) {
        this.next_state = 'stage';
      }
      else {
        this.next_state = 'start'
      }
      this.next_stage = [this.stages[0][this.arrow_pos],this.stages[1][this.arrow_pos]];
    }
    if (this.key_states[Key.Enter]) {
      this.play_sound('enter');
      game_state = this.next_state;
      gs = new GameStage(this.next_stage[0], this.next_stage[1])
      gs.skill_init();
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