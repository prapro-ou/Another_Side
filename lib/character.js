import { Weapon, Side } from "./enum.js";
const debug = true;

// Character
// 味方と敵のキャラクターの親クラス
class Character{
  /// Spawn player with ID at X, Y
  constructor(id, x = 0, y = 0) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.pose = 0; // current sprite patern.
    this.speed = 1.0; // player's speed.
    this.offensive_power = 1;
    this.attack_speed = 1.0;
    this.attack_method = Weapon.None;
  }
}

// 味方のキャラクターのクラス
export class Player extends Character {
  // task
  // Character クラスに加えて，味方キャラクターにあるべき変数及びメソッドを追加する．
  constructor(id, x = 0, y = 0) {
    super(id, x, y);
    this.side = Side.Demon;
  }

  draw(screen) {
    if (debug) {
      console.log(`Player.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.pose, this.side);
  }
}

// 敵キャラクターのクラス
export class Enemy extends Character {
  // task
  // Character クラスに加えて，敵キャラクターにあるべき変数及びメソッドを追加する．
  constructor(id, x = 0, y = 0) {
    super(id, x, y);
    this.side = Side.Human;
  }
  draw(screen) {
    if (debug) {
      console.log(`Enemies.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.pose, this.side);
  }
}

export class Swordsman extends Enemy {

  // pose を固定する．
}