import $ from 'jquery'
import './css/style.css'

const item_class = 'game-field__game-item';
const item = `<td class=${item_class}></td>`;
const row = `<tr></tr>`;
let item_array;
let size = 0;
let bomb = 0;
let items = 0;
let isGame = false;
let isGenerate = false;

$(window).ready(function(e) {
    $('#medium').click();
    $('.game-field').on('contextmenu', false);
});

$('#easy').click(function() {
    size = 5;
    items = 5*5;
    bomb = 4;
    Start();
});

$('#medium').click(function() {
    size = 16;
    items = 16*16;
    bomb = 64;
    Start();
});

$('#hard').click(function() {
    size = 25;
    items = 25*25;
    bomb = 400;
    Start();
});

const Start = function Start() {
    $('.game-field').empty();
    isGame = true;
    isGenerate = false;

    for(let i = 0; i < size; i+=1) { $('.game-field').append(row); }
    for(let i = 0; i < size; i+=1) { $('tr').append(item); }

    Push();
    setOnClickListener();
}

const Push = function Push() {
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

const setOnClickListener = function setOnClickListener() {
    for(let i=0; i<size; i++) {
        for(let j=0; j<size; j++) {
            item_array[i][j].$item.click(function() {
                if(isGenerate === false) {
                    isGenerate = true;
                    Generate(bomb, i, j);
                }
                if (item_array[i][j].isBomb === true && isGame === true 
                                                     && item_array[i][j].isFlag === false) {
                    $(this).addClass("game-field__bomb-item");
                    StopGame(false);
                } else if(isGame === true && item_array[i][j].isFlag === false) {
                    $(this).html(item_array[i][j].num === 0 ? "" : item_array[i][j].num);
                    item_array[i][j].isOpen = true;
                    items-=1;
                    $(this).addClass("game-field__active-item");
                    if(item_array[i][j].num === 0) {
                        Check(i, j);
                    }
                    if(items === bomb) {
                        StopGame(true);
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

const Generate = function Generate(quantity, n ,m) {
    while(true) {
        for(let i=0; i<size; i++) {
            for(let j=0; j<size; j++) {
                if(Math.floor(Math.random() * Math.floor(2)) === 1 && item_array[i][j].isBomb === false
                                                                   && item_array[i][j].isOpen === false
                                                                   && i !== n && j !== m) {
                    item_array[i][j].isBomb = true;
                    quantity -= 1;
                    try {
                        item_array[i+1][j].num += 1;
                    } catch { }
                    try {
                        item_array[i+1][j+1].num += 1;
                    } catch { }
                    try {
                        item_array[i+1][j-1].num += 1;
                    } catch { }
                    try {
                        item_array[i-1][j].num += 1;
                    } catch { }
                    try {
                        item_array[i-1][j+1].num += 1;
                    } catch { }
                    try {
                        item_array[i-1][j-1].num += 1;
                    } catch { }
                    try {
                        item_array[i][j+1].num += 1;
                    } catch { }
                    try {
                        item_array[i][j-1].num += 1;
                    } catch { }
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

const StopGame = function StopGame(mode) {
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
        });
    }
    isGame = false;
}

const Check = function Check(i, j) {
    try {
        if(item_array[i+1][j].num === 0 && item_array[i+1][j].isOpen === false
                                        && item_array[i+1][j].isBomb === false) {
            item_array[i+1][j].$item.click();
        } else if(item_array[i+1][j].isOpen === false && item_array[i+1][j].isBomb === false) {
            item_array[i+1][j].$item.html(item_array[i+1][j].num);
            items-=1;
            item_array[i+1][j].$item.addClass("game-field__active-item");
            item_array[i+1][j].isOpen = true;
        }
    } catch { }
    try {
        if(item_array[i+1][j+1].num === 0 && item_array[i+1][j+1].isOpen === false
                                          && item_array[i+1][j+1].isBomb === false) { 
            item_array[i+1][j+1].$item.click();
        } else if(item_array[i+1][j+1].isOpen === false && item_array[i+1][j+1].isBomb === false) {
            item_array[i+1][j+1].$item.html(item_array[i+1][j+1].num);
            items-=1;
            item_array[i+1][j+1].$item.addClass("game-field__active-item");
            item_array[i+1][j+1].isOpen = true;
        }
    } catch { }
    try {
        if(item_array[i+1][j-1].num === 0 && item_array[i+1][j-1].isOpen === false
                                          && item_array[i+1][j-1].isBomb === false) {
            item_array[i+1][j-1].$item.click();
        } else if (item_array[i+1][j-1].isOpen === false && item_array[i+1][j-1].isBomb === false) {
            item_array[i+1][j-1].$item.html(item_array[i+1][j-1].num);
            items-=1;
            item_array[i+1][j-1].$item.addClass("game-field__active-item");
            item_array[i+1][j-1].isOpen = true;
        }
    } catch { }
    try {
        if(item_array[i-1][j].num === 0 && item_array[i-1][j].isOpen === false
                                        && item_array[i-1][j].isBomb === false) {
            item_array[i-1][j].$item.click();
        } else if (item_array[i-1][j].isOpen === false && item_array[i-1][j].isBomb === false){
            item_array[i-1][j].$item.html(item_array[i-1][j].num);
            items-=1;
            item_array[i-1][j].$item.addClass("game-field__active-item");
            item_array[i-1][j].isOpen = true;
        }
    } catch { }
    try {
        if(item_array[i-1][j+1].num === 0 && item_array[i-1][j+1].isOpen === false
                                          && item_array[i-1][j+1].isBomb === false) {
            item_array[i-1][j+1].$item.click();
        } else if(item_array[i-1][j+1].isOpen === false && item_array[i-1][j+1].isBomb === false){
            item_array[i-1][j+1].$item.html(item_array[i-1][j+1].num);
            items-=1;
            item_array[i-1][j+1].$item.addClass("game-field__active-item");
            item_array[i-1][j+1].isOpen = true;
        }
    } catch { }
    try {
        if(item_array[i-1][j-1].num === 0 && item_array[i-1][j-1].isOpen === false
                                          && item_array[i-1][j-1].isBomb === false) {
            item_array[i-1][j-1].$item.click();
        } else if(item_array[i-1][j-1].isOpen === false && item_array[i-1][j-1].isBomb === false) {
            item_array[i-1][j-1].$item.html(item_array[i-1][j-1].num);
            items-=1;
            item_array[i-1][j-1].$item.addClass("game-field__active-item");
            item_array[i-1][j-1].isOpen = true;
        }
    } catch { }
    try {
        if(item_array[i][j+1].num === 0 && item_array[i][j+1].isOpen === false
                                        && item_array[i][j+1].isBomb === false) {
            item_array[i][j+1].$item.click();
        } else if(item_array[i][j+1].isOpen === false && item_array[i][j+1].isBomb === false) {
            item_array[i][j+1].$item.html(item_array[i][j+1].num);
            items-=1;
            item_array[i][j+1].$item.addClass("game-field__active-item");
            item_array[i][j+1].isOpen = true;
        }
    } catch { }
    try {
        if(item_array[i][j-1].num === 0 && item_array[i][j-1].isOpen === false
                                        && item_array[i][j-1].isBomb === false) {
            item_array[i][j-1].$item.click();
        } else if (item_array[i][j-1].isOpen === false && item_array[i][j-1].isBomb === false){
            item_array[i][j-1].$item.html(item_array[i][j-1].num);
            items-=1;
            item_array[i][j-1].$item.addClass("game-field__active-item");
            item_array[i][j-1].isOpen = true;
        }
    } catch { }
}