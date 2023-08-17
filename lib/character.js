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
    this.offensive_power = 200;
    this.attack_interval = 3;
    this.attack_method   = 0;
    this.skill           = 0;
    this.skill_duration  = 0;
    this.skill_interval  = 0;
    this.skill_1st       = 0;
    this.skill_ct        = 0;
    this.last_attacked_time = 0;
  }

  draw(screen) {
    if (debug) {
      console.log(`Player.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.pose, this.side);
  };

  update(enemy){
   // return new Penetration(2,this.x, enemy.y,this.offensive_power)
    // return new Arrow(2,this.x, this.y,this.offensive_power)
     return new Fire(2,this.x, this.y,this.offensive_power)
  };
}

// 敵キャラクターのクラス
export class Enemy extends Character {
  constructor(id, x = 0, y = 0, hp, move_speed, pop_time) {
    super(id, x, y);
    this.side       = Side.Human;
    this.hp         = hp;
    this.move_speed = move_speed;
    this.pop_time = pop_time;
  }


  draw(screen) {
    if (debug) {
      console.log(`Enemies.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.pose, this.side);

    screen.ctx.fillStyle = "#FF0000";
    screen.ctx.font = ' 24px sans-serif';
    screen.ctx.fillText(this.hp, this.x+10, this.y+80);
  };

  pos_update() {
    this.x -= this.move_speed;
  };

  hp_update(damage) {
    this.hp -= damage;
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

//アタッククラス
class Attack{
  constructor(id, x = 0, y = 0, power){
    this.id = id;
    this.x = x;
    this.y = y;
    this.pose = 0;
    this.speed = 2.0;
    this.areaAttack = 0; 
    this.power = power;
  }
}
//arrowクラス
export class Arrow extends Attack{
  constructor(id, x = 0, y = 0, power){
    super(id, x, y, power);
    this.areaAttack = 0;
  }
  update(e_x, e_y){
    const angle = Math.atan2(e_y - this.y, e_x - this.x);
    this.x += Math.cos(angle) * this.speed; 
    this.y += Math.sin(angle) * this.speed;
  }


  draw(screen){
    if (debug) {
      console.log(`Arrow.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.pose, 0);
  }
}

export class Fire extends Attack{
  constructor(id, x = 0, y = 0, power){
    super(id, x, y, power);
    this.areaAttack = 1;
  }
  update(e_x, e_y){
    const angle = Math.atan2(e_y - this.y, e_x - this.x);
    this.x += Math.cos(angle) * this.speed; 
    this.y += Math.sin(angle) * this.speed;
  }


  draw(screen){
    if (debug) {
      console.log(`Fire.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.pose, 0);
  }
}

export class Penetration extends Attack{
  constructor(id, x = 0, y = 0, power){
    super(id, x, y, power);
    this.areaAttack = 2;
  }
  update(){
    this.x += this.speed; 
  }
  
  
  draw(screen){
    if (debug) {
      console.log(`Penetration.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.pose, 0);
  }
}

