

function recalibrateVariables() {
    brownPieces = document.querySelectorAll("p");
    goldPieces = document.querySelectorAll("span");
}

export function goldMove() {
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
