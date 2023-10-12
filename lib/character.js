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
  constructor(id, y = 0, offensive_base_power,offensive_increase_amount, attack_interval, attack_method, distance, skill_1st, skill_ct, skill_dur) {
    super(id, y);
    this.x               = 100;
    this.side            = Side.Demon;
    this.level = 0;
    this.offensive_base_power = offensive_base_power; //200
    this.offensive_increase_amount = offensive_increase_amount; //50
    this.attack_interval = attack_interval; //3
    this.attack_method = attack_method; // 0:通常, 1:範囲, 2:貫通
    this.attack_distance = distance;
    this.skill_1st_cooltime = skill_1st;
    this.skill_cooltime = skill_ct; //次に発動できるまでの時間
    this.skill_duration = skill_dur; //効果時間
    this.next_skill_avalable_time = null;
    this.end_skill_time = 0; //スキルを終了させる時間
    this.skill_flag = 0; //スキルが発動中かどうか 0:発動していない 1:発動中
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
        return new Arrow(this.id,this.x, this.y,this.get_offensive_power(), this.attack_distance);
      case 1:
        return new Fire(this.id,this.x, this.y,this.get_offensive_power(), this.attack_distance);
      case 2:
        return new Penetration(this.id,this.x, enemy.y,this.get_offensive_power(), this.attack_distance);
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
    return this.offensive_base_power + this.offensive_increase_amount * this.level * (this.level + 1)
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
    super(0, y, 400, 50, 1.7, 0, 0, 10000, 30000, 30000);
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
    super(1, y, 100, 50, 1.2, 0, 0, 1000, 15000, 15000);
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
    super(2, y, 100, 50, 2.2, 2, 10, 10000, 20000, 10000);
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
    super(3, y, 300, 50, 1.2, 0, 0, 15000, 30000, 20000);
  }
  start_skill(){
    this.attack_interval /= 3; //TODO:本来は一度の攻撃に3本の矢を出す
  }
  end_skill(){
    this.attack_interval *= 3; //TODO:本来実装する攻撃を元に戻す
  }
}

// 味方キャラクター"Mummy"のクラス
export class Mummy extends Player {
  constructor(y) {
    super(4, y, 150, 50, 2, 0, 0, 10000, 30000, 2000);
    this.enemy_origin_speed = [];
  }

  start_skill(enemys){
    enemys
    .forEach(enemy => {
      this.enemy_origin_speed.push(enemy.move_speed);
      enemy.move_speed = 0;
    });
  }
  end_skill(enemys){
    enemys
    .forEach(enemy => {
      enemy.move_speed = this.enemy_origin_speed.shift();
    });  
  }
}

// 味方キャラクター"Ghost2"のクラス
export class Ghost2 extends Player {
  constructor(y) {
    super(5, y, 300, 50, 2.7, 1, 50, 15000, 30000, 6000);
    this.skill_timer_id = null; 
  }

  give_poison(enemys, time){
    enemys
    .filter(enemy => enemy.hp > 0 && enemy.pop_time <= (Date.now() - time)/1000)
    .forEach(enemy => {
      enemy.hp -= this.offensive_base_power / 2;
    });
  }

  //引数のタイムはステージの開始時間
  start_skill(enemys, time){
    this.skill_timer_id = setInterval(() => this.give_poison(enemys, time), 1000);
  }
  end_skill(){
    if(this.skill_timer_id != null){
      clearInterval(this.skill_timer_id);
    }
  }
}

// 味方キャラクター"Assasin"のクラス
export class Assasin extends Player {
  constructor(y) {
    super(6, y, 100, 50, 0.5, 0, 0, 20000, 40000, 0);
  }
  start_skill(attacks){
    attacks.push(new Arrow(this.id,this.x, this.y,this.get_offensive_power() * 5));
  }
  end_skill(){
    //do nothing
  }
}

// 味方キャラクター"Skeleton_king"のクラス
export class Skeleton_king extends Player {
  constructor(y) {
    super(7, y, 500, 50, 3, 1, 50, 15000, 30000, 10000);
  }
  start_skill(){
    this.attack_distance *= 4;
  }
  end_skill(){
    this.attack_distance /= 4;
  }
}

// 味方キャラクター"Satan"のクラス
export class Satan extends Player {
  constructor(y) {
    super(8, y, 1000, 50, 10, 1, 100, 100000000000, 10000000000, 0);
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
    super(1, y, 2000, 0.7, pop_time);
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
    super(3, y, 5000, 0.3, pop_time);
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
    super(5, y, 4000, 0.7, pop_time);
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
  constructor(id, x = 0, y = 0, power, distance){
    this.id = id;
    this.x = x;
    this.y = y;
    this.pose = 0;
    this.speed = 5.0;
    this.areaAttack = 0;
    this.power = power;
    this.distance = distance;
  }
}
//arrowクラス 単体攻撃
export class Arrow extends Attack{
  constructor(id, x = 0, y = 0, power, distance = 0){
    super(id, x, y, power, distance);
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
  constructor(id, x = 0, y = 0, power, distance){
    super(id, x, y, power, distance);
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
  constructor(id, x = 0, y = 0, power, distance){
    super(id, x, y, power, distance);
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

