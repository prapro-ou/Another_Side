import { Player } from "./lib/character.js";
import { EnemyArray, PlayerArray } from "./lib/character_array.js";

const debug = true;
// GameStage

class GameStage {
  static life = 3;
  static dead_line = 110;
  constructor(id) {
    this.stage_name = id;
    this.players = PlayerArray;
    this.enemys = EnemyArray[id];
    this.attacks = [];
    this.start_time = Date.now();
    this.defeated_enemy = 0
  }

  // ステージの描画
  draw(screen) {
    screen.clear();

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
      screen.ctx.font = ' 120px sans-serif';
      screen.ctx.fillText("GAME OVER",screen.height/3, screen.width/3, screen.width);
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
}


////////////////////////////////////////////////////////////////
// Main loop
////////////////////////////////////////////////////////////////

let screen = new Screen(
  1024,
  576,
  document.getElementById('canvas').getContext('2d'),
  [new Sprite('assets/image/demon.png', 60), new Sprite('assets/image/human.png', 60)],
);
let gs = new GameStage(0);

let start = null;
let prev_timestamp = null;

let game_loop = (timestamp) => {
  if (!prev_timestamp) {
    start = timestamp;
    prev_timestamp = timestamp;
    requestAnimationFrame(game_loop);
    return;
  }

  gs.draw(screen);
  if (GameStage.life > 0) {
    gs.update();
  }
  prev_timestamp = timestamp;
  requestAnimationFrame(game_loop);

};

////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////

function start_game() {
  game_loop();
}

start_game();