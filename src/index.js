// import $ from 'jquery'
// import './css/style.css'

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
    $('.button').click();
    $('.game-field').on('contextmenu', false);
});

$('.button').click(function() {
    size = 16;
    items = 16*16;
    bomb = 100;
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
                item_array[i][j].isOpen = true;
                if(isGenerate === false) {
                    isGenerate = true;
                    Generate(bomb);
                }
                if (item_array[i][j].isBomb === true && isGame === true) {
                    $(this).addClass("game-field__bomb-item");
                    StopGame(false);
                } else if(item_array[i][j].num !== 0 && isGame === true) {
                    $(this).html(item_array[i][j].num);
                    items-=1;
                    if(items === bomb) {
                        StopGame(true);
                    }
                    $(this).addClass("game-field__active-item");
                }
            })
            item_array[i][j].$item.contextmenu(function(e) {
                if(item_array[i][j].isOpen === false) {
                    $(this).addClass("game-field__flag-item");
                }
            })
        }
    }
}

const Generate = function Generate(quantity) {
    while(true) {
        for(let i=0; i<size; i++) {
            for(let j=0; j<size; j++) {
                if(Math.floor(Math.random() * Math.floor(2)) === 1 && item_array[i][j].isBomb === false && item_array[i][j].isOpen === false) {
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
    isGame = false;
    if(mode === true) {
        
    } else {

    }
}