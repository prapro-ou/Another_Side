import { Enemy, Player } from "./character.js";

export const EnemyArray = [
    [new Enemy(4,800,100,3000,0.3,0),new Enemy(0,800,300,1500,0.7,3),new Enemy(0,800,200,1500,0.7,3)
    ,new Enemy(0,800,100,1500,0.7,5),new Enemy(0,800,200,1500,0.7,7),new Enemy(8,800,300,1500,0.7,9)
    ,new Enemy(8,800,100,1500,0.7,9),new Enemy(0,800,200,1500,0.7,11),new Enemy(0,800,300,1500,0.7,13)
    ,new Enemy(0,800,100,1500,0.7,15),new Enemy(0,800,200,1500,0.7,15)]
    ]
;

const PlayerListArray =[new Player(1,100,200),new Player(1,100,300),new Player(1,100,400)]

export const PlayerArray = [new Player(1,100,100)];

export function add_player(){
    PlayerArray.push(PlayerListArray.reverse.pop());
}