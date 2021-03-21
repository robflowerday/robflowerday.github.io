let board = [null, "0", null, "1", null, "2", null, "3",
             "4", null, "5", null, "6", null, "7", null,
             null, "8", null, "9", null, "10", null, "11",
             null, null, null, null, null, null, null, null,
             null, null, null, null, null, null, null, null,
             "12", null, "13", null, "14", null, "15", null,
             null, "16", null, "17", null, "18", null, "19",
             "20", null, "21", null, "22", null, "23", null];

let kingList = {"0": false,"1": false, "2": false, "3": false, "4": false, "5": false, "6": false, "7": false, "8": false, "9": false, "9": false, "10": false, "11": false, "12": false, "13": false, "14": false, "15": false, "16": false, "17": false, "18": false, "19": false, "20": false, "21": false, "22": false, "23": false};

const cells = document.querySelectorAll("td");
let brownPieces = document.querySelectorAll("p");
let goldPieces = document.querySelectorAll("span");

let selectedPieceIndex = -1;
let selectedPieceId = -1;   
let newSpotIndex = -1;

let turn = "gold";

let persistentNewBoardIndex = -1;
let persistentBrownPieceId = -1;

let persistentGoldDestination = -1;

function recalibrateVariables() {
    brownPieces = document.querySelectorAll("p");
    goldPieces = document.querySelectorAll("span");
}

function goldMove() {
    recalibrateVariables();
    // loop through each gold piece
    for (let i = 0; i < goldPieces.length; i++) {
        goldPieces[i].addEventListener("click", addGoldEventListenersFunction);
    }
}

function addGoldEventListenersFunction() {
    resetGoldBorders();
    resetGreenSpots();
    addGreenBorder(this);
    let index = board.indexOf(this.id)
    selectedPieceIndex = index;
    selectedPieceId = this.id;
    addGreenSpots(index);
}

function addGreenBorder(object) {
    object.style.border = "3px solid green";
}

function addGreenSpots(index) {
    //        adding attacks
    
    if (goldAttackPossible()) {
        let attackSpots = getAttackGoldSpots(index);
        for (let i=0; i < attackSpots.length; i++) {
            let j = attackSpots[i];
            cells[j].innerHTML = '<span class="possible-position"></span>';
            persistentGoldDestination = j;
            cells[j].addEventListener("click", greenSpotEventListenerFunction);
        }
    } else {
        let immediateSpots = getImmediateGoldSpots(index);
        for (let i=0; i < immediateSpots.length; i++) {
            let j = immediateSpots[i];
            cells[j].innerHTML = '<span class="possible-position"></span>';
            persistentGoldDestination = j;
            cells[j].addEventListener("click", greenSpotEventListenerFunction);
        }
    }
}

function greenSpotEventListenerFunction() {
    // new
    // -------------------------------------------------------------------------------------------------------
    // remove piece from previous location
    if (kingList[selectedPieceId]) {
        this.innerHTML = '<span class="gold-king" id="'+selectedPieceId+'"></span>';
    } else {
        if (persistentGoldDestination < 8) {
            //alert("persistentGoldDestination: "+persistentGoldDestination);
            kingList[selectedPieceId] = true;
            this.innerHTML = '<span class="gold-king" id="'+selectedPieceId+'"></span>';
        } else {
            this.innerHTML = '<span class="gold-piece" id="'+selectedPieceId+'"></span>';
        }
    }
    cells[selectedPieceIndex].innerHTML = '';
    // remove from js board
    board[selectedPieceIndex] = null;
    // add to js board
    // add piece onto green spot
    // --------------------------------------------------------------------------------------------------------
    /*
    // remove piece from previous location
    cells[selectedPieceIndex].innerHTML = '';
    // remove from js board
    board[selectedPieceIndex] = null;
    // add to js board
    // add piece onto green spot
    this.innerHTML = '<span class="gold-piece" id="'+selectedPieceId+'"></span>';
    */
    findNewIndex();
    board[newSpotIndex] = selectedPieceId;
    if (selectedPieceIndex - newSpotIndex === 18) {
        board[selectedPieceIndex - 9] = null;
        cells[selectedPieceIndex - 9].innerHTML = '';
    }
    if (selectedPieceIndex - newSpotIndex === 14) {
        board[selectedPieceIndex - 7] = null;
        cells[selectedPieceIndex - 7].innerHTML = '';
    }
    // dealing with kings
    //------------------------------------------------------------------------------
    if (selectedPieceIndex - newSpotIndex === -18) {
        board[selectedPieceIndex + 9] = null;
        cells[selectedPieceIndex + 9].innerHTML = '';
    }
    if (selectedPieceIndex - newSpotIndex === -14) {
        board[selectedPieceIndex + 7] = null;
        cells[selectedPieceIndex + 7].innerHTML = '';
    }
    //------------------------------------------------------------------------------
    // remove green spots
    resetGreenSpots();
    // remove all event listeners
    removeEventListeners();
    //alert("new spot index: "+newSpotIndex+"\nattack move possible: "+goldPieceAttackPossible(newSpotIndex));
    if (((selectedPieceIndex - newSpotIndex === 18) || (selectedPieceIndex - newSpotIndex === 14) || (selectedPieceIndex - newSpotIndex === -14) || (selectedPieceIndex - newSpotIndex === -18)) && goldPieceAttackPossible(newSpotIndex)) {
    //if (((selectedPieceIndex - newSpotIndex === 18) && goldPieceAttackPossible(newSpotIndex)) || ((selectedPieceIndex - newSpotIndex === 14) && goldPieceAttackPossible(newSpotIndex))) {
        selectedPieceIndex = newSpotIndex;
        findNewIndex();
        addGreenSpots(selectedPieceIndex);
    } else {
        turn = 'brown';
        if (winTest()) {
            alert(winTest());
        } else {
            brownMove();
        }
    }
    /*if (goldPieceAttackPossible(newSpotIndex)) {
        addGreenSpots(newSpotIndex);
    }*/
}

function resetGreenSpots() {
    let greenSpots = document.querySelectorAll(".possible-position");
    for (let j=0; j < cells.length; j++) {
        cells[j].removeEventListener("click", greenSpotEventListenerFunction);
    }
    for (let i=0; i < greenSpots.length; i++) {
        greenSpots[i].remove();
    }
}

function getImmediateGoldSpots(boardIndex) {
    let immediateSpots = [];
    if (boardIndex % 8 != 0 && (boardIndex - 9) > 0 && board[boardIndex - 9] === null) {
        immediateSpots.push(boardIndex - 9);
    }
    if ((boardIndex + 1) % 8 != 0 && (boardIndex - 7) > 0 && board[boardIndex - 7] === null) {
        immediateSpots.push(boardIndex - 7);
    }
    // adding king movement
    //-----------------------------------------------------------------------------------------------------------------------------
    
    if (kingList[board[boardIndex]]) {
        if (boardIndex % 8 != 0 && (boardIndex + 7) > 0 && board[boardIndex + 7] === null) {
            immediateSpots.push(boardIndex + 7);
        }
        if ((boardIndex + 1) % 8 != 0 && (boardIndex + 9) > 0 && board[boardIndex + 9] === null) {
            immediateSpots.push(boardIndex + 9);
        }
    }
    //-----------------------------------------------------------------------------------------------------------------------------
    return immediateSpots;
}

// Gold Attack Moves
// -----------------------------------------------------------------------------------------------

function getAttackGoldSpots(boardIndex) {
    let attackSpots = [];
    if (boardIndex % 8 != 0 && (boardIndex - 1) % 8 != 0 && (boardIndex - 18) > 0 && board[boardIndex - 18] === null && board[boardIndex - 9] != null && board[boardIndex - 9] < 12) {
        attackSpots.push(boardIndex - 18);
    }
    if ((boardIndex + 1) % 8 != 0 && (boardIndex + 2) % 8 != 0 && (boardIndex - 14) > 0 && board[boardIndex - 14] === null && board[boardIndex - 7] != null && board[boardIndex - 7] < 12) {
        attackSpots.push(boardIndex - 14);
    }
    // adding king movement
    //-----------------------------------------------------------------------------------------------------------------------------
    
    if (kingList[board[boardIndex]]) {
        if (boardIndex % 8 != 0 && (boardIndex - 1) % 8 != 0 && (boardIndex + 14) > 0 && board[boardIndex + 14] === null && board[boardIndex + 7] != null && board[boardIndex + 7] < 12) {
            attackSpots.push(boardIndex + 14);
        }
        if ((boardIndex + 1) % 8 != 0 && (boardIndex + 2) % 8 != 0 && (boardIndex + 18) > 0 && board[boardIndex + 18] === null && board[boardIndex + 9] != null && board[boardIndex + 9] < 12) {
            attackSpots.push(boardIndex + 18);
        }
    }
    //-----------------------------------------------------------------------------------------------------------------------------
    return attackSpots;
}

function goldAttackPossible() {
    for (let i=0; i < goldPieces.length; i++) {
        let boardIndex = board.indexOf(goldPieces[i].id);
        if (getAttackGoldSpots(boardIndex).length > 0) {
            return true;
        }
    }
    return false;
}

function goldPieceAttackPossible(boardIndex) {
    if (getAttackGoldSpots(boardIndex).length > 0) {
        return true;
    } else {
        return false;
    }
}

// -----------------------------------------------------------------------------------------------

function resetGoldBorders() {
    for (let i = 0; i < goldPieces.length; i++) {
        goldPieces[i].style.border = "1px solid goldenrod";
    }
}

function removeEventListeners() {
    for (let i=0; i < goldPieces.length; i++) {
        goldPieces[i].removeEventListener("click", addGoldEventListenersFunction);
    }
}

function findNewIndex() {
    for (let i=0;i < cells.length; i++) {
        if ((cells[i].innerHTML === '<span class="gold-piece" id="'+selectedPieceId+'"></span>') || (cells[i].innerHTML === '<span class="gold-king" id="'+selectedPieceId+'"></span>')) {
            newSpotIndex = i;
            break;
        }
    }
}


goldMove();


// ----------------------------------------------------------------------
// Jarvis functionality
// -----------------------------------------------------------------------------------

function getImmediateBrownSpots(boardIndex) {
    let immediateSpots = [];
    if (boardIndex % 8 != 0 && (boardIndex + 7) < 64 && board[boardIndex + 7] === null) {
        immediateSpots.push(boardIndex + 7);
    }
    if ((boardIndex + 1) % 8 != 0 && (boardIndex + 9) < 64 && board[boardIndex + 9] === null) {
        immediateSpots.push(boardIndex + 9);
    }
    // deal with brown kings
    //--------------------------------------------------------------------------------------------------------------
    if (kingList[board[boardIndex]]) {
        if (boardIndex % 8 != 0 && (boardIndex - 9) < 64 && board[boardIndex - 9] === null) {
            immediateSpots.push(boardIndex - 9);
        }
        if ((boardIndex + 1) % 8 != 0 && (boardIndex - 7) < 64 && board[boardIndex - 7] === null) {
            immediateSpots.push(boardIndex - 7);
        }
    }
    //--------------------------------------------------------------------------------------------------------------
    return immediateSpots;
}

function actionBrownMove() {
    if (brownAttackPossible()) {
        let brownPieceIndex = Math.floor(Math.random() * brownPieces.length);
        let brownPieceId = brownPieces[brownPieceIndex].id;
        let boardIndex = board.indexOf(brownPieceId);
        let possibleMoves = getAttackBrownSpots(boardIndex);
        while (possibleMoves.length === 0 || boardIndex === -1) {
            brownPieceIndex = Math.floor(Math.random() * brownPieces.length);
            brownPieceId = brownPieces[brownPieceIndex].id;
            boardIndex = board.indexOf(brownPieceId);
            possibleMoves = getAttackBrownSpots(boardIndex);
            delete brownPieces[brownPieceIndex];
        }
        let randomChoice = Math.floor(Math.random()*possibleMoves.length);
        let chosenPosition = possibleMoves[randomChoice];
        board[chosenPosition] = brownPieceId;
        board[boardIndex] = null;
        // -------------------------------------------------------------------------------------------------------------------------
        if (chosenPosition > 55) {
            kingList[brownPieceId] = true;
        }
        if (kingList[brownPieceId]) {
            cells[chosenPosition].innerHTML = '<p class="brown-king" id="'+brownPieceId+'"></p>';
        } else {
            cells[chosenPosition].innerHTML = '<p class="brown-piece" id="'+brownPieceId+'"></p>';
        }
        // -------------------------------------------------------------------------------------------------------------------------
        //cells[chosenPosition].innerHTML = '<p class="brown-piece" id="'+brownPieceId+'"></p>';
        cells[boardIndex].innerHTML = '';
        if (chosenPosition - boardIndex  === 18) {
            board[boardIndex + 9] = null;
            cells[boardIndex + 9].innerHTML = '';
        }
        if (chosenPosition - boardIndex  === 14) {
            board[boardIndex + 7] = null;
            cells[boardIndex + 7].innerHTML = '';
        }
        // -------------------------------------------------------------------------------------------------------------------------
        if (chosenPosition - boardIndex  === -18) {
            board[boardIndex - 9] = null;
            cells[boardIndex - 9].innerHTML = '';
        }
        if (chosenPosition - boardIndex  === -14) {
            board[boardIndex - 7] = null;
            cells[boardIndex - 7].innerHTML = '';
        }
        // -------------------------------------------------------------------------------------------------------------------------
        let newBoardIndex = chosenPosition;
        persistentNewBoardIndex = newBoardIndex;
        timer = setInterval(secondBrownMoveAction, 300);
    } else {
        let brownPieceIndex = Math.floor(Math.random() * brownPieces.length);
        let brownPieceId = brownPieces[brownPieceIndex].id;
        persistentBrownPieceId = brownPieceId;
        let boardIndex = board.indexOf(brownPieceId);
        let possibleMoves = getImmediateBrownSpots(boardIndex);
        while (possibleMoves.length === 0 || boardIndex === -1) {
            brownPieceIndex = Math.floor(Math.random() * brownPieces.length);
            brownPieceId = brownPieces[brownPieceIndex].id;
            persistentBrownPieceId = brownPieceId;
            boardIndex = board.indexOf(brownPieceId);
            possibleMoves = getImmediateBrownSpots(boardIndex);
            delete brownPieces[brownPieceIndex];
        }
        let randomChoice = Math.floor(Math.random()*possibleMoves.length);
        let chosenPosition = possibleMoves[randomChoice];
        board[chosenPosition] = brownPieceId;
        board[boardIndex] = null;
        // -------------------------------------------------------------------------------------------------------------------------
        if (chosenPosition > 55) {
            kingList[brownPieceId] = true;
        }
        if (kingList[brownPieceId]) {
            cells[chosenPosition].innerHTML = '<p class="brown-king" id="'+brownPieceId+'"></p>';
        } else {
            cells[chosenPosition].innerHTML = '<p class="brown-piece" id="'+brownPieceId+'"></p>';
        }
        // -------------------------------------------------------------------------------------------------------------------------
        //cells[chosenPosition].innerHTML = '<p class="brown-piece" id="'+brownPieceId+'"></p>';
        cells[boardIndex].innerHTML = '';
    }
    turn = 'gold';
    if (winTest()) {
        alert(winTest);
    } else {
        goldMove();
    }

}

function secondBrownMoveAction() {
    if (brownPieceAttackPossible(persistentNewBoardIndex)) {
        possibleMoves = getAttackBrownSpots(persistentNewBoardIndex);
        let randomChoice = Math.floor(Math.random()*possibleMoves.length);
        let newChosenPosition = possibleMoves[randomChoice];
        board[newChosenPosition] = persistentBrownPieceId;
        board[persistentNewBoardIndex] = null;        
        // -------------------------------------------------------------------------------------------------------------------------
        if (newChosenPosition > 55) {
            kingList[persistentBrownPieceId] = true;
        }
        if (kingList[persistentBrownPieceId]) {
            cells[newChosenPosition].innerHTML = '<p class="brown-king" id="'+persistentBrownPieceId+'"></p>';
        } else {
            cells[newChosenPosition].innerHTML = '<p class="brown-piece" id="'+persistentBrownPieceId+'"></p>';
        }
        // -------------------------------------------------------------------------------------------------------------------------
        //cells[newChosenPosition].innerHTML = '<p class="brown-piece" id="'+persistentBrownPieceId+'"></p>';
        cells[persistentNewBoardIndex].innerHTML = '';
        if (newChosenPosition - persistentNewBoardIndex  === 18) {
            board[persistentNewBoardIndex + 9] = null;
            cells[persistentNewBoardIndex + 9].innerHTML = '';
        }
        if (newChosenPosition - persistentNewBoardIndex  === 14) {
            board[persistentNewBoardIndex + 7] = null;
            cells[persistentNewBoardIndex + 7].innerHTML = '';
        }
        // -------------------------------------------------------------------------------------------------------------------------
        if (newChosenPosition - persistentNewBoardIndex  === -18) {
            board[persistentNewBoardIndex - 9] = null;
            cells[persistentNewBoardIndex - 9].innerHTML = '';
        }
        if (newChosenPosition - persistentNewBoardIndex  === -14) {
            board[persistentNewBoardIndex - 7] = null;
            cells[persistentNewBoardIndex - 7].innerHTML = '';
        }
        // -------------------------------------------------------------------------------------------------------------------------
        persistentNewBoardIndex = newChosenPosition;
    } else {
        clearInterval(timer);
    }

}

function brownMove() {
    setTimeout(actionBrownMove,300);
}

// Brown Attack Moves
// -----------------------------------------------------------------------------------------------

function getAttackBrownSpots(boardIndex) {
    let attackSpots = [];
    if (boardIndex % 8 != 0 && (boardIndex - 1) % 8 != 0 && (boardIndex + 14) < 64 && board[boardIndex + 14] === null && board[boardIndex + 7] != null && board[boardIndex + 7] > 11) {
        attackSpots.push(boardIndex +14);
    }
    if ((boardIndex + 1) % 8 != 0 && (boardIndex + 2) % 8 != 0 && (boardIndex + 18) < 64 && board[boardIndex + 18] === null && board[boardIndex + 9] != null && board[boardIndex + 9] > 11) {
        attackSpots.push(boardIndex + 18);
    }
    // deal with brown kings
    //--------------------------------------------------------------------------------------------------------------
    if (kingList[board[boardIndex]]) {
        if (boardIndex % 8 != 0 && (boardIndex - 1) % 8 != 0 && (boardIndex - 18) < 64 && board[boardIndex - 18] === null && board[boardIndex - 9] != null && board[boardIndex - 9] > 11) {
            attackSpots.push(boardIndex - 18);
        }
        if ((boardIndex + 1) % 8 != 0 && (boardIndex + 2) % 8 != 0 && (boardIndex - 14) < 64 && board[boardIndex - 14] === null && board[boardIndex - 7] != null && board[boardIndex - 7] > 11) {
            attackSpots.push(boardIndex - 14);
        }
    }
    //--------------------------------------------------------------------------------------------------------------
    
    return attackSpots;
}

function brownAttackPossible() {
    for (let i=0; i < brownPieces.length; i++) {
        let boardIndex = board.indexOf(brownPieces[i].id);
        if (getAttackBrownSpots(boardIndex).length > 0) {
            return true;
        }
    }
    return false;
}

function brownPieceAttackPossible(boardIndex) {
    if (getAttackBrownSpots(boardIndex).length > 0) {
        return true;
    } else {
        return false;
    }
}

// -----------------------------------------------------------------------------------------------

/*
function sleep(milliseconds) {
    let date = Date.now();
    currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
*/

function countBrownPieces() {
    let pieceCount = 0;
    for (let i=0; i < board.length; i++) {
        if (board[i] != null && board[i] < 12) {
            pieceCount += 1;
        }      
    }
    return pieceCount;
}

function countGoldPieces() {
    let pieceCount = 0;
    for (let i=0; i < board.length; i++) {
        if (board[i] != null && board[i] > 11) {
            pieceCount += 1;
        }      
    }
    return pieceCount;
}

function brownCanMove() {
    let brownPieces = document.querySelectorAll("p");
    let boardIndex = -1;
    for (let i=0; i < brownPieces.length; i++) {
        boardIndex = board.indexOf(brownPieces[i].id);
        if (getAttackBrownSpots(boardIndex).length > 0) {
            return true;
        }
        if (getImmediateBrownSpots(boardIndex).length > 0) {
            return true;
        }
    }
    return false;
}


function goldCanMove() {
    let goldPieces = document.querySelectorAll("span");
    let boardIndex = -1;
    for (let i=0; i < goldPieces.length; i++) {
        boardIndex = board.indexOf(goldPieces[i].id);
        if (getAttackGoldSpots(boardIndex).length > 0) {
            return true;
        }
        if (getImmediateGoldSpots(boardIndex).length > 0) {
            return true;
        }
    }
    return false;
}

function winTest() {
    if (countBrownPieces() === 0) {
        return "You Won!";
    }
    if (countGoldPieces() === 0) {
        return "Jarvis Won!";
    }
    if ((turn === 'brown' && !brownCanMove()) || (turn === "gold" && !goldCanMove())) {
        return "It's a Tie!";
    }
    return false;
}

/// ---------------------------------------------------------------------------------------------------
/// Create Brown move choice

function createStateList() {
    return [];
}

function chooseBrownMove() {
    let stateList = createStateList();
    
}
}
