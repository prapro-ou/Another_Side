import { Player } from "./lib/character.js";
import { Enemy } from "./lib/character.js";

const debug = true;
// GameState

class GameState {
  constructor() {
    this.players = [];
    this.enemys = [];
    this.players_count = 4;
    this.enemys_count =3;

    // spawn players id = 0 ... player_count
    for (let i = 0; i < this.players_count; i++) {
      this.players.push(new Player(i, 100 * i, 100));
    }
    // spawn enemys id = players_count+1 ... players_count+enemys_count
    for (let i = 0; i < this.enemys_count; i++) {
    this.enemys.push(new Enemy(this.players_count +  i, 100 * i, 200));
    }
  }

  draw(screen) {
    screen.clear();
    this.players.forEach(player => {
      player.draw(screen);
    });
    this.enemys.forEach(enemy => {
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
  put_sprite(x, y, id, pose = 0) {
    this.sprites.put_sprite(this.ctx, x, y, id, pose);
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
  new Sprite('assets/sprites.png', 60),
  //this.sprites.push(new Sprite('assets/sprites.png', 60)),
  //this.sprites.push(new Sprite('assets/sprites_2.png', 60)),
);
let gs = new GameState();

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