import { Weapon, Side } from "./enum.js";
const debug = true;

// 味方と敵のキャラクターの親クラス
class Character{
  /// Spawn player with ID at X, Y
  constructor(id, y = 0) {
    this.id    = id;
    this.x;
    this.y     = y;
    this.pose  = 0; // current sprite patern
  }
}

// 味方のキャラクターのクラス
class Player extends Character {
  constructor(id, y = 0, offensive_base_power,offensive_increase_amount, attack_interval, attack_method, skill_1st, skill_ct, skill_dur) {
    super(id, y);
    this.x               = 100;
    this.side            = Side.Demon;
    this.level = 0;
    this.offensive_base_power = offensive_base_power; //200
    this.offensive_increase_amount = offensive_increase_amount; //50
    this.attack_interval = attack_interval; //3
    this.attack_method = attack_method; // 0:通常, 1:範囲, 2:貫通
    this.skill_1st_cooltime = skill_1st;
    this.skill_cooltime = skill_ct;
    this.skill_duration = skill_dur;
    this.next_skill_avalable_time = null;
    this.last_attacked_time = 0;
  }

  draw(screen) {
    if (debug) {
      console.log(`Player.draw id:${this.id}+${this.pose} at ${this.x}, ${this.y}`);
    }
    screen.put_sprite(this.x, this.y, this.id, this.pose, this.side);
  };

  update(enemy){
    switch (this.attack_method){
      case 0:
        return new Arrow(this.id,this.x, this.y,this.get_offensive_power());
      case 1:
        return new Fire(this.id,this.x, this.y,this.get_offensive_power());
      case 2:
        return new Penetration(this.id,this.x, enemy.y,this.get_offensive_power());
      default:
        return
    }
  };

  level_up(){
    this.level += 1;
  }

  get_offensive_power() {
    // this.offensive_base_power と this.level を使って計算
    // 例 400 + 50n(n+1) 
    return this.offensive_base_power + this.offensive_increase_amount * this.level * (this.level  + 1)
  }


}

// 敵キャラクターのクラス
export class Enemy extends Character {
  constructor(id, y = 0, hp, move_speed, pop_time) {
    super(id, y);
    this.x          = 800;
    this.side       = Side.Human;
    this.hp         = hp;
    this.move_speed = move_speed;
    this.pop_time   = pop_time;
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


// 味方キャラのステータス: (id, x, y, offensive_power, attack_interval, attack_method)
// 味方キャラクター"Skeleton_knight"のクラス
export class Skeleton_knight extends Player {
  constructor(y) {
    super(0, y, 400, 50, 2, 0, 10, 30, 30);
  }
  start_skill(players){
    players.forEach(player => {
      player.offensive_base_power *= 2; 
    });
  }

  end_skill(players){
    players.forEach(player => {
      player.offensive_base_power /= 2; 
    });
  }
}

// 味方キャラクター"Slime"のクラス
export class Slime extends Player {
  constructor(y) {
    super(1, y, 100, 50, 2, 0, 1, 15, 15);
  }
  start_skill(){
    this.offensive_base_power *= 2;
  }
  end_skill(){
    this.offensive_base_power /= 2;
  }
}

// 味方キャラクター"Ghost1"のクラス
export class Ghost1 extends Player {
  constructor(y) {
    super(2, y, 200, 50, 5, 2, 10, 20, 10);
  }
  start_skill(){
    this.attack_interval /= 2.5;
  }
  end_skill(){
    this.attack_interval *= 2.5;
  }
}

// 味方キャラクター"Goblin_archer"のクラス
export class Goblin_archer extends Player {
  constructor(y) {
    super(3, y, 300, 50, 3, 0, 15, 30, 20);
  }
  start_skill(){

  }
  end_skill(){
    
  }
}

// 味方キャラクター"Mummy"のクラス
export class Mummy extends Player {
  constructor(y) {
    super(4, y, 150, 50, 3, 0, 10, 30, 2);
  }

  start_skill(enemys){
    enemys
    .filter(enemy => enemy.hp > 0)
    .forEach(enemy => {
      enemy.move_speed = //値を別の変数に保存する．スキル発動中に敵が倒れたら値を消去する？
      enemy.move_speed = 0;
    });
  }
  end_skill(enemys){
    enemys
    .filter(enemy => enemy.hp > 0)
    .forEach(enemy => {
      enemy.move_speed = 
    });  
  }
}

// 味方キャラクター"Ghost2"のクラス
export class Ghost2 extends Player {
  constructor(y) {
    super(5, y, 300, 50, 3, 1, 15, 30, 6);
  }

  give_poison(enemys){
    enemys
    .filter(enemy => enemy.hp > 0)
    .forEach(enemy => {
      enemy.hp -= this.offensive_base_power / 2;
    });
  }

  start_skill(){
    setInterval(this.give_poison, 1000);
  }
  end_skill(){
    
  }
}

// 味方キャラクター"Assasin"のクラス
export class Assasin extends Player {
  constructor(y) {
    super(6, y, 200, 50, 1, 0, 20, 40, 0);
  }
  start_skill(enemys){
    let nearestEnemy = null;
    let minX = 1024;

    enemys
    .filter(enemy => enemy.hp > 0)
    .forEach((enemy) => {
      if (enemy.x < minX) {
        minX = enemy.x;
        nearestEnemy = enemy;
      }
    });
    nearestEnemy.hp -=  this.offensive_base_power * 5;
  }
  end_skill(){
    
  }
}

// 味方キャラクター"Skeleton_king"のクラス
export class Skeleton_king extends Player {
  constructor(y) {
    super(7, y, 500, 50, 3, 1, 15, 30, 10);
  }
  start_skill(distance){
    distance *= 4;
  }
  end_skill(distance){
    distance /= 4;
  }
}

// 味方キャラクター"Satan"のクラス
export class Satan extends Player {
  constructor(y) {
    super(8, y, 1000, 50, 10, 1, 100000000000, 10000000000, 0);
  }
  start_skill(){

  }
  end_skill(){
    
  }
}


// 敵キャラのステータス: (id, x, y, hp, move_speed, pop_time)
// 敵キャラクター"Hero1"のクラス
export class Hero1 extends Enemy {
  constructor(y, pop_time) {
    super(1, y, 1000, 0.7, pop_time);
  }
}

// 敵キャラクター"Ranger3"のクラス
export class Ranger3 extends Enemy {
  constructor(y, pop_time) {
    super(6, y, 6000, 0.7, pop_time);
  }
}

// 敵キャラクター"Fighter1"のクラス
export class Fighter1 extends Enemy {
  constructor(y, pop_time) {
    super(0, y, 2000, 0.5, pop_time);
  }
}

// 敵キャラクター"Hunter"のクラス
export class Hunter extends Enemy {
  constructor(y, pop_time) {
    super(2, y, 600, 1.4, pop_time);
  }
}

// 敵キャラクター"Knight1"のクラス
export class Knight1 extends Enemy {
  constructor(y, pop_time) {
    super(3, y, 3000, 0.3, pop_time);
  }
}

// 敵キャラクター"Knight4"のクラス
export class Knight4 extends Enemy {
  constructor(y, pop_time) {
    super(7, y, 15000, 0.3, pop_time);
  }
}

// 敵キャラクター"Soldier3"のクラス
export class Soldier3 extends Enemy {
  constructor(y, pop_time) {
    super(4, y, 30000, 0.3, pop_time);
  }
}

// 敵キャラクター"Pipofm_charachip"のクラス
export class Pipofm_charachip extends Enemy {
  constructor(y, pop_time) {
    super(5, y, 6000, 0.7, pop_time);
  }
}

// 敵キャラクター"Thief1"のクラス
export class Thief1 extends Enemy {
  constructor(y, pop_time) {
    super(8, y, 1000, 2, pop_time);
  }
}

// 敵キャラクター"Thief2"のクラス
export class Thief2 extends Enemy {
  constructor(y, pop_time) {
    super(9, y, 4000, 2, pop_time);
  }
}

// 敵キャラクター"Thief3"のクラス
export class Thief3 extends Enemy {
  constructor(y, pop_time) {
    super(10, y, 10000, 1.5, pop_time);
  }
}

// 敵キャラクター"One_eyed_knight"のクラス
export class One_eyed_knight extends Enemy {
  constructor(y, pop_time) {
    super(11, y, 40000, 0.2, pop_time);
  }
}

// 敵キャラクター"Hero2"のクラス
export class Hero2 extends Enemy {
  constructor(y, pop_time) {
    super(12, y, 100000, 0.1, pop_time);
  }
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
//arrowクラス 単体攻撃
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
    screen.put_sprite(this.x, this.y, this.id, this.pose, 2);
  }
}

// 範囲攻撃
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
    screen.put_sprite(this.x, this.y, this.id, this.pose, 2);
  }
}

// 貫通攻撃
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
    screen.put_sprite(this.x, this.y, this.id, this.pose, 2);
  }
}

