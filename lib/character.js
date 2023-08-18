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
  constructor(id, x = 0, y = 0, offensive_power, attack_interval, attack_method) {
    super(id, y);
    this.x               = 100;
    this.side            = Side.Demon;
    this.offensive_power = offensive_power;
    this.attack_interval = attack_interval;
    this.attack_method   = attack_method;
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
  };
  
  update(){

  };
}

// 敵キャラクターのクラス
export class Enemy extends Character {
  constructor(id, x = 0, y = 0, hp, move_speed, pop_time) {
    super(id , y);
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
class Skeleton_knight extends Player {
  constructor(y) {
    super(0, y, 400, 3, );
  }
}

// 味方キャラクター"Slime"のクラス
class Slime extends Player {
  constructor(y) {
    super(1, y, 100, 2, );
  }
}

// 味方キャラクター"Ghost1"のクラス
class Ghost1 extends Player {
  constructor(y) {
    super(2, y, 200, 5, );
  }
}

// 味方キャラクター"Goblin_archer"のクラス
class Goblin_archer extends Player {
  constructor(y) {
    super(3, y, 300, 3, );
  }
}

// 味方キャラクター"Mummy"のクラス
class Mummy extends Player {
  constructor(y) {
    super(4, y, 150, 3, );
  }
}

// 味方キャラクター"Ghost2"のクラス
class Ghost2 extends Player {
  constructor(y) {
    super(5, y, 300, 3, );
  }
}

// 味方キャラクター"Assasin"のクラス
class Assasin extends Player {
  constructor(y) {
    super(6, y, 200, 1, );
  }
}

// 味方キャラクター"Skeleton_king"のクラス
class Skeleton_king extends Player {
  constructor(y) {
    super(7, y, 500, 3, );
  }
}

// 味方キャラクター"Satan"のクラス
class Satan extends Player {
  constructor(y) {
    super(8, y, 1000, 10, );
  }
}


// 敵キャラのステータス: (id, x, y, hp, move_speed, pop_time)
// 敵キャラクター"Hero1"のクラス
class Hero1 extends Enemy {
  constructor( y, pop_time) {
    super(0, y, 1000, 0.7, pop_time);
  }
}

// 敵キャラクター"Ranger3"のクラス
class Ranger3 extends Enemy {
  constructor( y, pop_time) {
    super(1, y, 6000, 0.7, pop_time);
  }
}

// 敵キャラクター"Fighter1"のクラス
class Fighter1 extends Enemy {
  constructor( y, pop_time) {
    super(2, y, 2000, 0.5, pop_time);
  }
}

// 敵キャラクター"Hunter"のクラス
class Hunter extends Enemy {
  constructor(y, pop_time) {
    super(3, y, 800, 0.7, pop_time);
  }
}

// 敵キャラクター"Knight1"のクラス
class Knight1 extends Enemy {
  constructor(y, pop_time) {
    super(4, y, 3000, 0.3, pop_time);
  }
}

// 敵キャラクター"Knight4"のクラス
class Knight4 extends Enemy {
  constructor(y, pop_time) {
    super(5, y, 15000, 0.3, pop_time);
  }
}

// 敵キャラクター"Soldier3"のクラス
class Soldier3 extends Enemy {
  constructor(y, pop_time) {
    super(6, y, 30000, 0.3, pop_time);
  }
}

// 敵キャラクター"Pipofm_charachip"のクラス
class Pipofm_charachip extends Enemy {
  constructor(y, pop_time) {
    super(7, y, 600, 0.7, pop_time);
  }
}

// 敵キャラクター"Thief1"のクラス
class Thief1 extends Enemy {
  constructor(y, pop_time) {
    super(8, y, 1000, 2, pop_time);
  }
}

// 敵キャラクター"Thief2"のクラス
class Thief2 extends Enemy {
  constructor(y, pop_time) {
    super(9, y, 4000, 2, pop_time);
  }
}

// 敵キャラクター"Thief3"のクラス
class Thief3 extends Enemy {
  constructor(y, pop_time) {
    super(10, y, 10000, 1.5, pop_time);
  }
}

// 敵キャラクター"one_eyed_knight"のクラス
class One_eyed_knight extends Enemy {
  constructor(y, pop_time) {
    super(11, y, 40000, 0.2, pop_time);
  }
}

// 敵キャラクター"hero2"のクラス
class Hero2 extends Enemy {
  constructor(y, pop_time) {
    super(12, y, 100000, 0.1, pop_time);
  }
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