import $ from 'jquery'
import './css/style.css'

const item_class = 'game-field__game-item';
const item = `<td class=${item_class}></td>`;
const row = `<tr></tr>`;
let item_array;
let timeOut = 0;
let timer;
let size = 0;
let bomb = 0;
let items = 0;
let isGame = false;
let isGenerate = false;
let isTimer = false;

$(window).ready(function(e) {
    $('#medium').click();
    $('.game-field').on('contextmenu', false);
});

$('#easy').click(function() {
    size = 5;
    items = 5*5;
    bomb = 4;
    start();
});

$('#medium').click(function() {
    size = 16;
    items = 16*16;
    bomb = 64;
    start();
});

$('#hard').click(function() {
    size = 25;
    items = 25*25;
    bomb = 400;
    start();
});

const start = () => {
    $('.game-field').empty();
    isGame = true;
    isGenerate = false;
    isTimer = false;
    timeOut = 0;

    for(let i = 0; i < size; i+=1) { $('.game-field').append(row); }
    for(let i = 0; i < size; i+=1) { $('tr').append(item); }

    push();
    setOnClickListener();
}

const push = () => {
    item_array = [];
    $('.game-field').children().each(function(i) {
        item_array.push([]);
        $(this).children().each(function() {
            item_array[i].push({
                $item: $(this),
                num: 0,
                isBomb: false,
                isOpen: false,
                isFlag: false
            });
        });
    });
}

const setOnClickListener = () => {
    for(let i=0; i<size; i++) {
        for(let j=0; j<size; j++) {
            item_array[i][j].$item.click(function() {
                if(isGenerate === false) {
                    isGenerate = true;
                    generate(bomb, i, j);
                }
                if (item_array[i][j].isBomb === true && isGame === true 
                                                     && item_array[i][j].isFlag === false) {
                    $(this).addClass("game-field__bomb-item");
                    stopGame(false);
                } else if(isGame === true && item_array[i][j].isFlag === false) {
                    $(this).html(item_array[i][j].num === 0 ? "" : item_array[i][j].num);
                    item_array[i][j].isOpen = true;
                    items-=1;
                    $(this).addClass("game-field__active-item");
                    if(item_array[i][j].num === 0) {
                        check(i, j);
                    }
                    if(items === bomb) {
                        stopGame(true);
                    }
                    if(isTimer === false) {
                        isTimer = true;
                        timer = setInterval(updateTimer, 1000);
                    }
                } 
            })
            item_array[i][j].$item.contextmenu(function(e) {
                if(item_array[i][j].isOpen === false && isGame === true) {
                    if(item_array[i][j].isFlag === false) {
                        $(this).addClass("game-field__flag-item");
                        item_array[i][j].isFlag = true;
                    } else {
                        $(this).removeClass("game-field__flag-item");
                        item_array[i][j].isFlag = false;
                    }
                }
            })
        }
    }
}

const generate = (quantity, n ,m) => {
    while(true) {
        for(let i=0; i<size; i++) {
            for(let j=0; j<size; j++) {
                if(Math.floor(Math.random() * Math.floor(2)) === 1 && item_array[i][j].isBomb === false
                                                                   && item_array[i][j].isOpen === false
                                                                   && i !== n && j !== m) {
                    item_array[i][j].isBomb = true;
                    quantity -= 1;

                    for(let k=i-1; k<i+2; k++) {
                        for(let g=j-1; g<j+2; g++) {
                            try {
                                item_array[k][g].num += 1;
                            } catch { }
                        }
                    }
                    if(quantity === 0) {
                        return;
                    }
                    i += 1;
                    if(i>=size-1) {
                        i=0;
                    }
                } 
            }
        }
    }
}

const stopGame = (mode) => {
    if(mode === true) {
        $(".body").append(`<div class="end-game shadow-box cyrcle">You won</div>`);
    } else {
        $(".body").append(`<div class="end-game shadow-box cyrcle">You loss</div>`);
        for(let i=0; i<size; i++) {
            for(let j=0; j<size; j++) {
                if(item_array[i][j].isBomb === true) {
                    item_array[i][j].$item.addClass("game-field__bomb-item");
                    console.log(i)
                }
            }
        }
        $(".end-game").click(function() {
            $('#medium').click();
            $(this).detach();
            $('#hour').text("00");
            $('#minut').text("00");
            $('#second').text("00");
        });
    }
    isGame = false;
    isTimer = false;
}

const check = (i, j) => {
    i-=1;
    j-=1;

        for(let n = i; n<i+3; n++) {
            for(let m = j; m<j+3; m++) {
                try {
                    if(item_array[n][m].num === 0 && item_array[n][m].isOpen === false
                                                  && item_array[n][m].isBomb === false) {
                        item_array[n][m].$item.click();
                    } else if(item_array[n][m].isOpen === false && item_array[n][m].isBomb === false) {
                        item_array[n][m].$item.html(item_array[n][m].num);
                        items-=1;
                        item_array[n][m].$item.addClass("game-field__active-item");
                        item_array[n][m].isOpen = true;
                    }
                }
                catch {}
            }
        }
}

const updateTimer = () => {
    timeOut++;
    console.log(timeOut)
    $("#second").text(timeOut);
    if(timeOut === 60) {
        timeOut = 0;
        $("#minut").text($("#minut").text()+1);
    }
    if($("#minut").text() === 60) {
        $("#minut").text("00");
        $("#hour").text($("#hour").text()+1);
    }
    if(isTimer === false) {
        clearInterval(timer);
    }
}