var canvas;
var game;
var anim;
var moveR = 0;
var moveL = 0;

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const MAX_SPEED = 12;

/**
 * Dessine le tableau de jeu
 *  Details:
 *      1       Init le dessin 2d
 *      2       Met le fond en noir
 *      3       Dessine les traits de milieu de terrain
 *      4       Dessine les barres de jeux
 *      5       Dessine la balle
 *      6       Ecrit les points
 */
function draw()
{
    var context = canvas.getContext('2d');//1
    context.fillStyle = 'black';//2
    context.fillRect(0, 0, canvas.width, canvas.height);
    let nb_traits = 30;//3
    let height_trait = canvas.height / nb_traits;
    for (let i = 1; i <= nb_traits; i++)
    {
        if (i % 2)
        {
            context.fillStyle = 'white';
            context.fillRect((canvas.width / 2) - (PLAYER_WIDTH / 2), height_trait * i, PLAYER_WIDTH, height_trait);
        }
    }//4
    context.fillStyle = 'white';
    context.fillRect(0 + 5, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width - PLAYER_WIDTH - 5, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.beginPath();
    context.fillStyle = 'white'; //5
    let x_ball = game.ball.x - (PLAYER_WIDTH);
    let y_ball = game.ball.y - (PLAYER_WIDTH);
    context.fillRect(x_ball, y_ball, PLAYER_WIDTH * 2, PLAYER_WIDTH * 2);
    context.font = "center 50px serif"; //6
    context.fillText(game.player.score, 250, 60);   
    context.fillText(game.computer.score, canvas.width - 250, 60);   
}

/**
 * Modifie la direction de la balle a l'impacte
 */
function changeDirection(playerPosition)
{
    var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
    var ratio = 100 / (PLAYER_HEIGHT / 2);
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

/**
 * Bouge les coordonnees de la barre du player
 *  Details:
 *      1       Obtiens les coordonnees du canvas
 *      2       Obtiens la position de la souris
 *      3       Si la souris est en haut on met la coord y a 0
 *      4       Si la souris est en bas on met la coord y a la hauteur max
 *      5       Sinon on met la coord y a la position de la souris
 */
// function playerMove(event)
// {
//     var canvasLocation = canvas.getBoundingClientRect();//1
//     var mouseLocation = event.clientY - canvasLocation.y;//2
//     if (mouseLocation < PLAYER_HEIGHT / 2) //3
//         game.player.y = 0;
//     else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) //4
//         game.player.y = canvas.height - PLAYER_HEIGHT;
//     else //5
//         game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
// }
function playerRRefresh()
{
    game.player.y += moveR;
    if (game.player.y < 0)
        game.player.y = 0;
    else if (game.player.y + PLAYER_HEIGHT > canvas.height) //4
        game.player.y = canvas.height - PLAYER_HEIGHT;
}

function playerLRefresh()
{
    game.computer.y += moveL;
    if (game.computer.y < 0)
        game.computer.y = 0;
    else if (game.computer.y + PLAYER_HEIGHT > canvas.height) //4
        game.computer.y = canvas.height - PLAYER_HEIGHT;
}

/**
 * Verifie les collisions
 * Details:
 *  1       Si la balle touche une barre
 *      a   Remet le jeu a 0
 *      b   Ajoute le point a l'ordi ou au jour
 *  2       Sinon
 *      a   inverse la vitesse de la balle (l'envoi dans l'autre sens)
 *      b   Augmente la vitesse si inferieur a la vitesse max
 */
function collide(player)
{
    if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT)
    {
        reset();
        if (player == game.player)
            ++game.computer.score;
        else
            ++game.player.score;
    }
    else
    {
        game.ball.speed.x *= -1;
        changeDirection(player.y);
        if (Math.abs(game.ball.speed.x) < MAX_SPEED)
            game.ball.speed.x *= 1.05;
    }
}

/**
 * Change la position de la balle et verifie les collisions
 *  Details
 *  1       Change la balle de sens
 *  2       Verifie les collisions
 *  3       Bouge les coord de la balle
 */
function ballMove()
{
    if (game.ball.y > canvas.height || game.ball.y < 0)//1
        game.ball.speed.y *= -1;
    if (game.ball.x > canvas.width - PLAYER_WIDTH)//2
        collide(game.computer);
    else if (game.ball.x < PLAYER_WIDTH)
        collide(game.player);
    game.ball.x += game.ball.speed.x;//3
    game.ball.y += game.ball.speed.y;
}

/**
 * Dessine le jeu
 *  Details
 *  1       Dessine les barres et le point
 *  2       Bouge la barre
 *  3       Bouge la balle
 *  4       Relance la fonction (toutes les 10ms)
 */
function play()
{
    draw();//1
    playerLRefresh()
    playerRRefresh()
    ballMove();//3
    anim = window.requestAnimationFrame(play);//4
}

/**
 * Remet la balle et les joueurs a la position initiale
 * Details:
 *  1       Remet la balle
 *  2       Remet la barre du joueur
 *  3       Remet la barre de l'ordi
 *  4       Remet la vitesse de la balle
 */
function reset()
{
    game.ball.x = canvas.width / 2;//1
    game.ball.y = canvas.height / 2;
    game.player.y = game.ball.y - PLAYER_HEIGHT / 2;//2
    game.computer.y = game.ball.y - PLAYER_HEIGHT / 2;//3
    game.ball.speed.x = 3;//4
    game.ball.speed.y = Math.random() * 3;
}

/**
 * Arrete le jeu
 * Details:
 *  1       Arrete Timeout
 *  2       Remet les score a 0
 *  3       Dessine le terrain
 */
function stop()
{
    cancelAnimationFrame(anim);//1

    game.computer.score = 0; //2
    game.player.score = 0;

    reset();//3
    draw();
}

canvas = document.getElementById('canvas');
game = 
{
    player:
    {
        score: 0
    },
    computer:
    {
        score: 0,
        speedRatio: 0.75
    },
    ball:
    {
        r: 5,
        speed: {}
    }
};

reset();

// Mouse move event
// canvas.addEventListener('mousemove', playerMove);
document.body.addEventListener('keydown', (e) => {
    if (e.key =='w')
        moveR = -7.5;
    else if (e.key == 's')
        moveR = 7.5;
    else if (e.key =='ArrowUp')
        moveL = -7.5;
    else if (e.key == 'ArrowDown')
        moveL = 7.5;
})

document.body.addEventListener('keyup', (e) => {
    if (e.key =='ArrowUp')
        moveL = 0;
    else if (e.key == 'ArrowDown')
        moveL = 0;
    else if (e.key =='w')
        moveR = 0;
    else if (e.key == 's')
        moveR = 0;
})
// Mouse click event
document.querySelector('#start-game').addEventListener('click', play);
document.querySelector('#stop-game').addEventListener('click', stop);