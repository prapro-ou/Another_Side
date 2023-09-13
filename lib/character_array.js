import { Assasin, Enemy, Ghost1, Ghost2, Goblin_archer, Mummy, Satan, Skeleton_king, Skeleton_knight, Slime } from "./character.js";

export const EnemyArray = [
    [new Enemy(1,50,100,1.0,0),new Enemy(2,300,110,1.1,0),new Enemy(3,90,120,1.2,2),new Enemy(4,110,130,1.3,2),new Enemy(1,130,100,1.0,2),new Enemy(2,150,110,1.1,4)], //0
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2)], //1
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2),new Enemy(2,130,130,1.3,2)], //2
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2),new Enemy(2,130,130,1.3,2),new Enemy(1,150,130,1.3,2)], //3
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2),new Enemy(2,130,130,1.3,2),new Enemy(1,150,130,1.3,2)], //4
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2)], //5
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2),new Enemy(2,130,130,1.3,2)], //6
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2),new Enemy(2,130,130,1.3,2),new Enemy(1,150,130,1.3,2)], //7
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2),new Enemy(2,130,130,1.3,2),new Enemy(1,150,130,1.3,2)], //8
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2)], //9
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2),new Enemy(2,130,130,1.3,2)], //10
    [new Enemy(3,90,120,1.2,1),new Enemy(4,110,130,1.3,2),new Enemy(2,130,130,1.3,2),new Enemy(1,150,130,1.3,2)], //11
];

const PlayerListArray =[new Slime(90), new Ghost1(150), new Goblin_archer(210), new Mummy(270), new Ghost2(330), new Assasin(390), new Skeleton_king(450), new Satan(510)]

export const PlayerArray = [new Skeleton_knight(30), new Ghost1(90)];

export function add_player(){
    PlayerArray.push(PlayerListArray.reverse.pop());
}

export const StageArray = [
    [[1],[new Audio('assets/music/bgm/battle1_loop.mp3')]], //stage0 の次のステージ候補
    [[2,3],[new Audio('assets/music/bgm/battle1_loop.mp3'),new Audio('assets/music/bgm/battle1_loop.mp3')]], //stage1 の次のステージ候補
    [[4,5],[new Audio('assets/music/bgm/battle1_loop.mp3'),new Audio('assets/music/bgm/battle1_loop.mp3')]], //2
    [[5,6],[new Audio('assets/music/bgm/battle1_loop.mp3'),new Audio('assets/music/bgm/battle1_loop.mp3')]], //3
    [[7],[new Audio('assets/music/bgm/battle1_loop.mp3')]],//4
    [[7,8],[new Audio('assets/music/bgm/battle1_loop.mp3'),new Audio('assets/music/bgm/battle1_loop.mp3')]],//5
    [[8],[new Audio('assets/music/bgm/battle1_loop.mp3')]],//6
    [[9],[new Audio('assets/music/bgm/battle1_loop.mp3')]],//7
    [[10],[new Audio('assets/music/bgm/battle1_loop.mp3')]],//8
    [[11],[new Audio('assets/music/bgm/battle1_loop.mp3')]],//9
    [[11],[new Audio('assets/music/bgm/battle1_loop.mp3')]],//10
    [['clear'],[new Audio('assets/music/bgm/battle1_loop.mp3')]]//11
]

export const BackgroundArray = [
    'pipo-battlebg001.jpg', //0
    'pipo-battlebg003.jpg', //1
    'pipo-battlebg004.jpg', //2
    'pipo-battlebg005.jpg', //3
    'pipo-battlebg006.jpg', //4
    'pipo-battlebg007.jpg', //5
    'pipo-battlebg008.jpg', //6
    'pipo-battlebg009.jpg', //7
    'pipo-battlebg010.jpg', //8
    'pipo-battlebg012.jpg', //9
    'pipo-battlebg013.jpg', //10
    'pipo-battlebg015.jpg', //11
]