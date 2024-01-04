//table states
//0 => empty
//1 => covered
//2 => covered with flag
//3 => number
//4 => mine
//5 => covered mine
//6 => mine covered with flag

let my_board = [
    [1,2,1,1,1,1,1,1,1,1],
    [1,1,1,4,3,1,3,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,0,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,5,1],
    [1,1,4,3,1,1,4,3,1,1],
    [1,1,1,1,4,1,1,1,5,1],
    [1,1,1,1,1,1,1,1,1,1]
];

window.onload = function(){
    new_game_handler();
}

function generate_board_html(board){
    let board_inner_html = "";
    for(let i = 0; i < board.length; i++) {
        let row_html = "<tr>";
        for(let j = 0; j < board[i].length; j++) {
            switch(board[i][j]) 
            {
                case 0:
                    row_html += "<td class=\"emptyTile\" oncontextmenu='event.preventDefault();'></td>";
                    break;
                case 1:
                    row_html += "<td class=\"coveredTile\" oncontextmenu='event.preventDefault();' onmousedown='square_click_handler(event, this)' ></td>";
                    break;
                case 2:
                    row_html += "<td class=\"coveredTile\" oncontextmenu='event.preventDefault();' onmousedown='square_click_handler(event, this)'><img src='flag.png' alt='flag' width='40' height='40'></td>";
                    break;
                case 3:
                    let number = check_number_of_mines(board, i, j);
                    row_html += "<td class=\"emptyTile\" oncontextmenu='event.preventDefault();'>" + number + "</td>";
                    break;
                case 4:
                    row_html += "<td class=\"emptyTile\" oncontextmenu='event.preventDefault();'><img src='bomb.png' alt='bomb' width='40' height='40'></td>";
                    break;
                case 5:
                    row_html += "<td class=\"coveredTile\" oncontextmenu='event.preventDefault();' onmousedown='square_click_handler(event, this)'></td>";
                    break;
                case 6:
                    row_html += "<td class=\"coveredTile\" oncontextmenu='event.preventDefault();' onmousedown='square_click_handler(event, this)'><img src='flag.png' alt='flag' width='40' height='40'></td>";
                    break;
            }
        }
        row_html += "</tr>";
        board_inner_html += row_html;
    }
    return `<table>${board_inner_html}</table>`;
}

function draw_board(board){
    let board_html = generate_board_html(board);
    document.getElementById("mine_container").innerHTML = board_html;
}

function generate_random_board(n, m) {
    let board = [];

    for(let i = 0; i < n;i++) {
        board[i] = [];
        for(let j = 0; j < m; j++) {
            board[i][j] = 1;
        }
    }

    for(let mine = 0; mine < n; mine++) {
        random_i = getRandomInt(n);
        random_j = getRandomInt(m);
        for(let i = 0; i < n;i++) {
            if(random_i == i) {
                for(let j = 0; j < m; j++) {
                    if(random_j == j) {
                        if(board[i][j] != 5) {
                            board[i][j] = 5;
                        } else {
                            mine -= 1;
                        }
                    }
                }
            }
        }
    }
    return board;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function check_number_of_mines(board, i, j) {
    let number = 0;
    
    for(let k = i-1; k < i+2; k++)
        for(let l = j-1; l < j+2; l++)
            if(!(k == i && l == j))
                if(0 <= k && k < board.length && 0 <= l && l < board[0].length)
                    if(board[k][l] == 4 || board[k][l] == 5 || board[k][l] == 6)
                        number += 1;

    return number;
}

function uncover_area(i, j) {
    if(0<=i<my_board.length && 0<=j<my_board.length) {
        if(my_board[i][j] == 1 || my_board[i][j] == 0) {
            number = check_number_of_mines(my_board, i, j);
            if(number == 0) {
                my_board[i][j] = 0;
                draw_board(my_board);
                for(let k = i-1; k < i+2; k++)
                    for(let l = j-1; l < j+2; l++)
                        if(!(k == i && l == j))
                            if(0 <= k && k < my_board.length && 0 <= l && l < my_board[0].length && my_board[k][l] != 0)
                                uncover_area(k, l);
                

            } else {
                my_board[i][j] = 3;
                draw_board(my_board);
            }
        }
    }
}

function show_all_mines(board) {
    for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board[i].length; j++) {
            if(board[i][j] == 5) {
                board[i][j] = 4;
                draw_board(board);
            } else if(board[i][j] == 6) {
                board[i][j] = 4;
            } else if(board[i][j] == 2 || board[i][j] == 1) {
                let number = check_number_of_mines(board, i, j);
                if(number != 0) {
                    board[i][j] = 3;
                } else {
                    board[i][j] = 0;
                }
            }
        }
    }

    return board;
}

function check_game_complete(board) {
    check = 0;
    for(let i = 0; i < board.length;i++) {
        for(let j = 0; j < board[i].length; j++) {
            if(board[i][j] == 0 || board[i][j] == 2 || board[i][j] == 3) {
                check += 1;
            }
        }
    }
    if(check == my_board.length*my_board[0].length - my_board.length) {
        return true;
    }
}

function left_click_handler(row, col) {
    if(my_board[row][col] == 5) {
        clicks += 1;
        draw_clicks();
        clearInterval(timer);
        my_board = show_all_mines(my_board);
        draw_board(my_board);
        alert("Je hebt verloren.");
    } else if(my_board[row][col] == 1) {
        clicks += 1;
        draw_clicks();
        uncover_area(row, col);
        draw_board(my_board);
        if(check_game_complete(my_board)) {
            clearInterval(timer);
            my_board = show_all_mines(my_board);
            draw_board(my_board);
            alert("Proficiat, je hebt gewonnen!");
        }
    }
}

function right_click_handler(row, col) {
    switch(my_board[row][col]) 
    {
        case 5:
            my_board[row][col] = 6;
            break;
        case 6:
            my_board[row][col] = 5;
            break;
        case 1:
            my_board[row][col] = 2;
            break;
        case 2:
            my_board[row][col] = 1;
            break;
    }
    draw_board(my_board);
}

function square_click_handler(event, cell) {
    let col = cell.cellIndex;
    let row = cell.parentNode.rowIndex;
    if(clicks == 0)
        reset_timer();
    if(event.button == 0) {
        left_click_handler(row, col);
    } else if (event.button == 2) {
        right_click_handler(row, col);
    }
}

let clicks = 0;
let seconds_spent = 0;
let timer;

function draw_clicks() {
    document.getElementById("clicks").innerHTML = clicks;
}

function draw_time() {
    document.getElementById("timer").innerHTML = seconds_spent;
}

function increment_time() {
    seconds_spent++;
    draw_time();
}

function reset_timer() {
    if(timer != undefined)
        clearInterval(timer);
    seconds_spent = 0;
    draw_time();
    timer = setInterval(increment_time,1000)
}

function new_game_handler() {
    let n = document.getElementById("n").value;
    let m = document.getElementById("m").value;
    my_board = generate_random_board(n, m);
    draw_board(my_board)
    clicks = 0;
}