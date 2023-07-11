import { Weapon, Side } from "./enum.js";
const debug = true;

// Character
// 味方と敵のキャラクターの親クラス
class Character{
  /// Spawn player with ID at X, Y
  constructor(id, x = 0, y = 0, color = 'normal') {
    this.id    = id;
    this.x     = x;
    this.y     = y;
    this.pose  = 0; // current sprite patern.
    this.color = color;
  }
}

// 味方のキャラクターのクラス
class Player extends Character {
  constructor(id, x = 0, y = 0, offensive_power, attack_interval, attack_method, 
    skill, skill_duration, skill_1st, skill_ct) {
    super(id, x, y);
    this.side            = Side.Demon;
    this.offensive_power = offensive_power;
    this.attack_interval = attack_interval;
    this.attack_method   = attack_method;
    this.skill           = skill;
    this.skill_duration  = skill_duration;
    this.skill_interval  = skill_interval;
    this.skill_1st       = skill_1st;
    this.skill_ct        = skill_ct;
  }

  draw(screen) {
    if (debug) {
      console.log(`Player.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.side);
  }
}

// 敵キャラクターのクラス
class Enemy extends Character {
  constructor(id, x = 0, y = 0, hp, move_speed) {
    super(id, x, y);
    this.side       = Side.Human;
    this.hp         = hp;
    this.move_speed = move_speed;
  }

  draw(screen) {
    if (debug) {
      console.log(`Enemies.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.side);
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
  constructor(Stage_name, life, num_of_enemy) {
    this.Stage_name = Stage_name;
    this.life = life;
    this.num_of_enemy = num_of_enemy;
  }
}

// ステージセレクト画面のクラス
class Stage_select {
  Stage_draw();
}