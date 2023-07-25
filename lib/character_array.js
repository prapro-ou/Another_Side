import { Enemy, Player } from "./character.js";

export const EnemyArray = [
    [new Enemy(1,800,50,100,1.0,0),new Enemy(2,800,70,110,1.1,0),new Enemy(3,800,90,120,1.2,2),new Enemy(4,800,110,130,1.3,2),new Enemy(1,800,130,100,1.0,2),new Enemy(2,800,150,110,1.1,4)],
    [new Enemy(3,800,90,120,1.2,100),new Enemy(4,800,110,130,1.3,200)],
];

const PlayerListArray =[new Player(1,100,200),new Player(1,100,300),new Player(1,100,400)]

export const PlayerArray = [new Player(1,100,100)];

export function add_player(){
    PlayerArray.push(PlayerListArray.reverse.pop());
}