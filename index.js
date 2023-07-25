import { Player } from "./lib/character.js";
import { EnemyArray } from "./lib/enemy_arryay.js";

const debug = true;
// GameStage

class GameStage {
  constructor(id) {
    this.stage_name = id;
    this.life = 3;
    this.players = [];
    this.enemys = EnemyArray[id];
    const players_count = 4;
    this.start_time = Date.now()/1000;

    // spawn players id = 0 ... player_count
    for (let i = 0; i < players_count; i++) {
      this.players.push(new Player(i, 100 * i, 100));
    }
  }

  draw(screen) {
    screen.clear();
    this.players.forEach(player => {
      player.draw(screen);
    });
    this.enemys
    .filter(enemy => (enemy.pop_time <= (Date.now()/1000 - this.start_time)) && enemy.hp > 0)
    .forEach(enemy => {
      enemy.draw(screen);
    });
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