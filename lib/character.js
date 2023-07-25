import { Weapon, Side } from "./enum.js";
const debug = true;

// 味方と敵のキャラクターの親クラス
class Character{
  /// Spawn player with ID at X, Y
  constructor(id, x = 0, y = 0) {
    this.id    = id;
    this.x     = x;
    this.y     = y;
    this.pose  = 0; // current sprite patern
  }
}

// 味方のキャラクターのクラス
export class Player extends Character {
  constructor(id, x = 0, y = 0) {
    super(id, x, y);
    this.side            = Side.Demon;
    this.offensive_power = 0;
    this.attack_interval = 0;
    this.attack_method   = 0;
    this.skill           = 0;
    this.skill_duration  = 0;
    this.skill_interval  = 0;
    this.skill_1st       = 0;
    this.skill_ct        = 0;
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
  constructor(id, x = 0, y = 0, hp, move_speed, time) {
    super(id, x, y);
    this.side       = Side.Human;
    this.hp         = hp;
    this.move_speed = move_speed;
    this.pop_time = time;
  }


  draw(screen) {
    if (debug) {
      console.log(`Enemies.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.pose, this.side);
  }
}

// 味方キャラクター"Ghost"のクラス
class Ghost extends Player {

}

// 味方キャラクター"Dragon"のクラス
class Dragon extends Player {

}

// 味方キャラクター"Skeleton"のクラス
class Skeleton extends Player {

}

// 敵キャラクター"Hero"のクラス
class Hero extends Enemy {

}

// 敵キャラクター"Fairy"のクラス
class Fairy extends Enemy {

}

// 敵キャラクター"Warrior"のクラス
class Warrior extends Enemy {

}

// 敵キャラクター"Boss"のクラス
class Boss extends Enemy {

}

// 敵キャラクター"subBoss"のクラス
class subBoss extends Enemy {

}

// ステージのクラス
class Stage {
  constructor(stage_name, life, num_of_enemy) {
    this.stage_name   = stage_name;
    this.life         = life;
    this.num_of_enemy = num_of_enemy;
  }
  draw(){

  };
  play_bgm(){

  };
}

// ステージセレクト画面のクラス
class Stage_select {
  constructor(stage) {
    this.stage = stage;
  }
  draw(){

  };
}