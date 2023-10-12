import { Assasin, Enemy, Ghost1, Ghost2, Goblin_archer, Hero1, Hero2, Knight1, Knight4, Mummy, One_eyed_knight, Pipofm_charachip, Ranger3, Satan, Skeleton_king, Skeleton_knight, Slime, Soldier3, Thief1, Thief2, Thief3 } from "./character.js";

export const EnemyArray = [
    [new Hero1(100,0),new Hero1(300,3),new Hero1(200,15),new Hero1(100,18)], //0

    [new Knight1(100,0),new Hero1(300,3),new Hero1(200,3),new Hero1(100,5),new Hero1(200,7),new Thief1(300,9)
     ,new Thief1(100,9),new Hero1(200,11),new Hero1(300,13)], //1

    [new Hero1(200,0),new Hero1(400,3),new Hero1(100,4),new Hero1(100,7),new Hero1(200,13),new Hero1(400,13),
     new Pipofm_charachip(100,23),new Pipofm_charachip(300,23),new Pipofm_charachip(200,23),
     new Pipofm_charachip(400,23),new Knight1(250,19),new Hero1(200,25),new Hero1(400,25),new Hero1(200,28),new Hero1(400,28),
     new Thief1(200,33),new Thief1(100,33),new Thief1(400,33)], //2
    [new Knight1(100,0),new Hero1(300,3),new Hero1(200,3),new Hero1(100,5),new Hero1(200,7),new Thief1(300,9),
     new Thief1(100,9),new Hero1(200,11),new Hero1(300,13)], //3
    [new Knight1(100,0),new Hero1(300,3),new Hero1(200,3),new Hero1(100,5),new Hero1(200,7),new Thief1(300,9),
     new Thief1(100,9),new Hero1(200,11),new Hero1(300,13)], //4
    [new Knight4(100,0),new Hero1(300,3),new Hero1(200,3),new Hero1(100,5),new Hero1(200,7),new Thief1(300,9),
     new Thief1(100,9),new Hero1(200,11),new Hero1(300,13)], //5
    [new Knight4(100,0),new Ranger3(300,3),new Hero1(200,3),new Hero1(100,5),new Hero1(200,7),new Thief1(300,9),
     new Thief1(100,9),new Hero1(200,11),new Hero1(300,13)], //6
    [new Knight4(100,0),new Hero1(300,3),new Hero1(200,3),new Hero1(100,5),new Hero1(200,7),new Thief1(300,9),
     new Thief1(100,9),new Hero1(200,11),new Hero1(300,13)], //7
    [new Knight4(100,0),new Hero1(300,3),new Hero1(200,3),new Hero1(100,5),new Hero1(200,7),new Thief2(300,9),
     new Thief1(100,9),new Hero1(200,11),new Hero1(300,13)], //8
    [new Soldier3(100,0),new Hero1(300,3),new Hero1(200,3),new Hero1(100,5),new Hero1(200,7),new Thief3(300,9),
     new Thief1(100,9),new Hero1(200,11),new Hero1(300,13)], //9
    [new One_eyed_knight(100,0),new Hero1(300,3),new Hero1(200,3),new Hero1(100,5),new Hero1(200,7),new Thief1(300,9),
     new Thief1(100,9),new Hero1(200,11),new Hero1(300,13)], //10
    [new Hero2(250,0),new Soldier3(100,0),new Ranger3(300,3),new Hero1(200,3),new Hero1(100,5),new Hero1(200,7),new Thief1(300,9),
     new Thief1(100,9),new Hero1(200,11),new Hero1(300,13)], //11
];

const PlayerListArray =[new Slime(90), new Ghost1(150), new Goblin_archer(210), new Mummy(270), new Ghost2(330), new Assasin(390), new Skeleton_king(450), new Satan(510)]

export const PlayerArray = [new Skeleton_knight(30)];

export function add_player(){
    PlayerArray.push(PlayerListArray.shift());
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