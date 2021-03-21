/// now:
/// add change of kings (potentially sorted)
/// create human player functionality
// integrate the two player moves and create gameplay

class State {
    constructor(board, kingList, player, depth=0, children = [], parent=null) {
        this.board = board;
        this.kingList = kingList;
        this.player = player;
        this.depth = depth;
        this.score = -10000;
        this.parent = parent;
        this.children = children;
        if (player == "Jarvis") {
            this.score = 10000;
        }
    }
}

class Piece {
    constructor(id, boardIndex, isKing) {
        this.id = id;
        this.boardIndex = boardIndex;
        this.isKing = isKing;
    }
}

/// fundamental function
function createInitialBoard() {
    
    /*return [null, "0", null, "1", null, "2", null, "3",
    "4", null, "5", null, "6", null, "7", null,
    null, "8", null, "9", null, "10", null, "11",
    null, null, null, null, null, null, "15", null,
    null, null, null, null, null, null, null, null,
    "12", null, "13", null, "14", null, "18", null,
    null, "16", null, "17", null, null, null, "19",
    "20", null, "21", null, "22", null, "23", null];
    
    return [null, "0", null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, "22", null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, "23", null];*/
    
    return [null, "0", null, "1", null, "2", null, "3",
    "4", null, "5", null, "6", null, "7", null,
    null, "8", null, "9", null, "10", null, "11",
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    "12", null, "13", null, "14", null, "15", null,
    null, "16", null, "17", null, "18", null, "19",
    "20", null, "21", null, "22", null, "23", null];
}

/// fundamental function
function createInitialKingList() {
    return {"0": false,"1": false, "2": false, "3": false, "4": false, "5": false, "6": false, "7": false, "8": false, "9": false, "9": false, "10": false, "11": false, "12": false, "13": false, "14": false, "15": false, "16": false, "17": false, "18": false, "19": false, "20": false, "21": false, "22": false, "23": false};
}

/// fundamental function
function displayState(state) {
    const cells = document.querySelectorAll("td");

    for (let i=0; i < state.board.length; i++) {
        let p = state.board[i];
        let k = state.kingList[p];
        if (p == null) {
            cells[i].innerHTML = '';
        } else if (p < 12 && k == true) {
            cells[i].innerHTML = '<p class="brown-king" id="'+p+'"></p>';
        } else if (p < 12 && k == false) {
            cells[i].innerHTML = '<p class="brown-piece" id="'+p+'"></p>';
        } else if (p >= 12 && k == true) {
            cells[i].innerHTML = '<span class="gold-king" id="'+p+'"></span>';
        } else if (p >= 12 && k == false) {
            cells[i].innerHTML = '<span class="gold-piece" id="'+p+'"></span>';
        }
    }
}

//helper attributes
const cells = document.querySelectorAll("td");
let persistentGoldDestination = -1;
let selectedPieceId = -1;
let selectedPieceIndex = -1;
let board = createInitialBoard(); 
let newSpotIndex = -1;
let goldPieces = document.querySelectorAll("span");
let turn = "gold";
let kingList = createInitialKingList();

/// fundamental function
function collectHumanMove(state) {
    ///goldPieces = document.querySelectorAll("span");
    recalibrateVariables();
    board = state.board;
    kingList = state.kingList;
    let goldPieces = document.querySelectorAll("span");
    for (let i = 0; i < goldPieces.length; i++) {
        goldPieces[i].addEventListener("click", addGoldEventListenersFunction);
    }
}

function recalibrateVariables() {
    goldPieces = document.querySelectorAll("span");
}

// helper functions
function addGoldEventListenersFunction() {
    resetGoldBorders();
    resetGreenSpots();
    addGreenBorder(this);
    let index = board.indexOf(this.id)
    selectedPieceIndex = index;
    selectedPieceId = this.id;
    addGreenSpots(index);
}

function resetGoldBorders() {
    for (let i = 0; i < goldPieces.length; i++) {
        goldPieces[i].style.border = "1px solid goldenrod";
    }
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
    // remove piece from previous location
    if (kingList[selectedPieceId]) {
        this.innerHTML = '<span class="gold-king" id="'+selectedPieceId+'"></span>';
    } else {
        if (persistentGoldDestination < 8) {
            ///alert("persistentGoldDestination: "+persistentGoldDestination);
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
    if (((selectedPieceIndex - newSpotIndex === 18) || (selectedPieceIndex - newSpotIndex === 14) || (selectedPieceIndex - newSpotIndex === -14) || (selectedPieceIndex - newSpotIndex === -18)) && goldPieceAttackPossible(newSpotIndex)) {
        selectedPieceIndex = newSpotIndex;
        findNewIndex();
        addGreenSpots(selectedPieceIndex);
    } else {
        turn = 'brown';
        currentState = new State(board, kingList, "Jarvis");
        currentState = collectJarvisMove(currentState);
        displayState(currentState);
        if (winTest()) {
            alert(winTest());
        } else {
            collectHumanMove(currentState);
        }
        ///if (winTest()) {
        ///    alert(winTest());
        ///} ///else {
            ///brownMove();
            ///collectJarvisMove();
        ///}
        ///---------------------------------------------------------------------------
        /*turn = "brown";
        if (winTest()) {
            alert(winTest);
            ///break;
        } else {
            currentState = new State(board, kingList, "Jarvis");
            currentState = collectJarvisMove(currentState);
            displayState(currentState);
            turn = "gold";
            ///if (winTest()) {
            ///    alert(winTest());
            ///    ///break;
            ///}
        }
        ///---------------------------------------------------------------------------*/
    }
}

function goldPieceAttackPossible(boardIndex) {
    if (getAttackGoldSpots(boardIndex).length > 0) {
        return true;
    } else {
        return false;
    }
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

function findNewIndex() {
    for (let i=0;i < cells.length; i++) {
        if ((cells[i].innerHTML === '<span class="gold-piece" id="'+selectedPieceId+'"></span>') || (cells[i].innerHTML === '<span class="gold-king" id="'+selectedPieceId+'"></span>')) {
            newSpotIndex = i;
            break;
        }
    }
}

function removeEventListeners() {
    for (let i=0; i < goldPieces.length; i++) {
        goldPieces[i].removeEventListener("click", addGoldEventListenersFunction);
    }
}

function winTest() {
    if (countBrownPieces() === 0) {
        return "You Won!";
    }
    if (countGoldPieces() === 0) {
        return "Jarvis Won!";
    }
    if ((turn === 'brown' && !hbrownCanMove()) || (turn === "gold" && !hgoldCanMove())) {
        return "It's a Tie!";
    }
    return false;
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

function hbrownCanMove() {
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

function hgoldCanMove() {
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

/// fundamental function
function collectJarvisMove(state) {
    let maxDepth = 4;

    /// create empty state list
    let stateList = [];
    let tempStateList = [];
    let x = 13;
    /// add to state list
    stateList.push(state);
    tempStateList.push(state);
    tempStateList.push(state);
    let newState = tempStateList.pop();
    while (tempStateList.length > 0) {
        newState = tempStateList.pop();
        if (newState.depth < maxDepth) {
            processAttackMoves(newState, stateList, tempStateList);
            let attackMoves = collectPlayerAttackMoves(newState);
            if (typeof(attackMoves) == "object") {
                if (attackMoves.length == 0) {
                    processImmediateMoves(newState, stateList, tempStateList);
                    let immediateMoves = collectPlayerImmediateMoves(newState);
                    if (immediateMoves.length == 0) {
                        evaluateStateScore(newState);
                        backPropogateScore(newState);
                    }
                }
            }
        }
    }

    for (let i=0; i < stateList.length; i++) {
        if (stateList[i].depth == maxDepth) {
            evaluateStateScore(stateList[i]);
            backPropogateScore(stateList[i]);
        }
    }


    
    ///----------------------------------------------------------------------------------------------
    /// timer
    /*
    const task = async () => {
        for (let i=0; i < stateList.length; i++) {
            if (stateList[i].depth >= 0) {    ///maxDepth) {
                displayState(stateList[i]);
                console.log(stateList[i]);
                await new Promise(r => setTimeout(r, 1000));
                alert("");
                displayState(stateList[i]);
                console.log(stateList[i]);

                evaluateStateScore(stateList[i]);
                
                console.log("evaluation");
                console.log("brown score");
                console.log(countBrownScore(stateList[i]));
                console.log("gold score");
                console.log(countGoldScore(stateList[i]));
                console.log("score");
                console.log(stateList[i].score);
                console.log(stateList[i]);
                console.log("-----------------------------");
                
                backPropogateScore(stateList[i]);
            }
        }
    }
    
    task();
    */
    


    const filters = { depth: 1 };
    let filteredList = stateList.filter(state =>
        Object.keys(filters).every(key => state[key] === filters[key])
    );

    filteredList = filteredList.sort(function(a, b){return a.score - b.score});
    
    
    return filteredList.pop();
}

/// helper functions
function processAttackMovesHelper(state, stateList, tempStateList, attackMoves) {
    if (attackMoves.length > 0) {
        for (let i=0; i < attackMoves.length; i++) {
            if (typeof(attackMoves[i]) == "object") {
                let tempState1 = JSON.parse(JSON.stringify(state));
                tempState1 = transformState(tempState1, attackMoves[i], state, changePlayer=true);
                stateList.push(tempState1);
                tempStateList.push(tempState1);
                let tempState2 = JSON.parse(JSON.stringify(state));
                tempState2 = transformState(tempState2, attackMoves[i], state, changePlayer=false);
                let piece = attackMoves[i][0];
                let newPiece = JSON.parse(JSON.stringify(piece));
                newPiece.boardIndex = attackMoves[i][1];
                let furtherAttackMoves = createPlayerPieceAttackMoves(newPiece, tempState2);
                if (furtherAttackMoves.length > 0) {
                    processAttackMovesHelper(tempState2, stateList, tempStateList, furtherAttackMoves);
                }
            }
        }
    }
}

function processAttackMoves(state, stateList, tempStateList) {
    let attackMoves = collectPlayerAttackMoves(state);
    processAttackMovesHelper(state, stateList, tempStateList, attackMoves);
}

function processImmediateMoves(state, stateList, tempStateList) {
    let immediateMoves = collectPlayerImmediateMoves(state);
    if (immediateMoves.length > 0) {
        for (let i=0; i < immediateMoves.length; i++) {
            if (typeof(immediateMoves[i]) == "object") {
                let tempState = JSON.parse(JSON.stringify(state));
                tempState = transformState(tempState, immediateMoves[i], parent=state, changePlayer=true);
                stateList.push(tempState);
                tempStateList.push(tempState);
            }
        }
    }
}

function countBrownScore(state) {
    let count = 0;
    for (let i=0; i < state.board.length; i++) {
        if (state.board[i] != null && state.board[i] < 12) {
            count ++;
            if (state.kingList[state.board[i]]) {
                count += 1;
            }
        }
    }
    return count;
}

function countGoldScore(state) {
    let count = 0;
    for (let i=0; i < state.board.length; i++) {
        if (state.board[i] != null && state.board[i] >= 12) {
            count ++;
            if (state.kingList[state.board[i]]) {
                count += 1;
            }
        }
    }
    return count;
}

function evaluateStateScore(state) {
    let winner = dertermineWinState(state);
    if (winner == "Jarvis") {
        state.score = 999;
    } else if (winner == "Human") {
        state.score = -999;
    } else if (winner == "Tie") {
        state.score = 0;
    } else {
        state.score = countBrownScore(state) - countGoldScore(state);
        ///alert('gold count:   ' + countGoldScore(state) + '\n' + 'brown count:   ' + countBrownScore(state) + '\n' + 'score:   ' + state.score);
    }

}

function backPropogateScore(state) {
    while (state.parent != null) {
        if (state.parent.player == "Human") {
            if (state.score > state.parent.score) {
                state.parent.score = state.score;
            } else {
                break;
            }
        } else {
            if (state.score < state.parent.score) {
                state.parent.score = state.score;
            } else {
                break;
            }
        }
        state = state.parent;
    }
}

/// fundamental function
function dertermineWinState(state) {
    let brownPieces = collectBrownPieces(state);
    let goldPieceList = collectGoldPieces(state);
    let winner;

    if (brownPieces.length == 0) {
        winner = 'Human'
    }

    if (goldPieceList.length == 0) {
        winner = 'Jarvis'
    }

    if ((state.player == 'Jarvis' && !goldCanMove(state)) || (state.player == 'Human' && !brownCanMove(state))) {
        winner = "Tie";
    }

    return winner;
}
/// helper functions
function playerCanMove(state) {
    let result;
    if (state.player == 'Jarvis'){
        result = brownCanMove(state);
    } else {
        result = goldCanMove(state);
    }
    return result;
}

function brownCanMove(state) {
    let brownImmediateMoves = collectBrownImmediateMoves(state);
    let brownAttackMoves = collectBrownAttackMoves(state);
    if (brownImmediateMoves.length > 0 || brownAttackMoves.length > 0) {
        return true;
    }
    return false;
}

function goldCanMove(state) {
    let goldImmediateMoves = collectGoldImmediateMoves(state);
    let goldAttackMoves = collectGoldAttackMoves(state);
    if (goldImmediateMoves.length > 0 || goldAttackMoves.length > 0) {
        return true;
    }
    return false;
}

function collectPlayerPieces(state) {
    let result;
    if (state.player == 'Jarvis'){
        result = collectBrownPieces(state);
    } else {
        result = collectGoldPieces(state);
    }
    return result;
}

function collectBrownPieces(state) {
    let brownPieces = [];
    for (let i=0; i < state.board.length; i++) {
        if (state.board[i] != null && state.board[i] < 12) {
            let k = state.kingList[state.board[i]];
            let id = state.board[i];
            brownPieces.push(new Piece(id, i, k));
        }
    }
    return brownPieces;
}

function collectGoldPieces(state) {
    let goldPieceList = [];
    for (let i=0; i < state.board.length; i++) {
        if (state.board[i] != null && state.board[i] >= 12) {
            let k = state.kingList[state.board[i]];
            let id = state.board[i];
            goldPieceList.push(new Piece(id, i, k));
        }
    }
    return goldPieceList;
}

function createPlayerPieceAttackMoves(piece, state) {
    let result;
    if (state.player == 'Jarvis'){
        result = collectBrownPieceAttackMoves(piece, state);
    } else {
        result = collectGoldPieceAttackMoves(piece, state);
    }
    return result;
}

function collectBrownPieceAttackMoves(piece, state) {
    let attackSpots = [];
    let bi = piece.boardIndex;
    let b = state.board;
    let p = piece;
    if (bi % 8 != 0 && (bi - 1) % 8 != 0 && (bi + 14) < 64 && b[bi + 14] == null && b[bi + 7] != null && b[bi + 7] > 11) {
        attackSpots.push([p, bi +14]);
    }
    if ((bi + 1) % 8 != 0 && (bi + 2) % 8 != 0 && (bi + 18) < 64 && b[bi + 18] == null && b[bi + 9] != null && b[bi + 9] > 11) {
        attackSpots.push([p, bi + 18]);
    }
    if (p.isKing) {
        if (bi % 8 != 0 && (bi - 1) % 8 != 0 && (bi - 18) < 64 && b[bi - 18] == null && b[bi - 9] != null && b[bi - 9] > 11) {
            attackSpots.push([p, bi - 18]);
        }
        if ((bi + 1) % 8 != 0 && (bi + 2) % 8 != 0 && (bi - 14) < 64 && b[bi - 14] == null && b[bi - 7] != null && b[bi - 7] > 11) {
            attackSpots.push([p, bi - 14]);
        }
    }
    return attackSpots;
}

function collectPlayerAttackMoves(state) {
    let result;
    if (typeof(state) == "object") {
        if (state.player == 'Jarvis'){
            result = collectBrownAttackMoves(state);
        } else {
            result = collectGoldAttackMoves(state);
        }
        return result;
    }
}

function collectBrownAttackMoves(state) {
    let attackSpots = [];
    let brownPieces = collectBrownPieces(state);
    for (let i=0; i < brownPieces.length; i++) {
        let moves = collectBrownPieceAttackMoves(brownPieces[i], state);
        if (moves.length > 0) {
            for (let i = 0; i < moves.length; i++) {
                attackSpots.push(moves[i]);
            }
        }
    }
    return attackSpots;
}

function collectGoldPieceAttackMoves(piece, state) {
    let attackSpots = [];
    let bi = piece.boardIndex;
    let b = state.board;
    let p = piece;
    if (bi % 8 != 0 && (bi - 1) % 8 != 0 && (bi - 18) > 0 && b[bi - 18] === null && b[bi - 9] != null && b[bi - 9] < 12) {
        attackSpots.push([p, bi - 18]);
    }
    if ((bi + 1) % 8 != 0 && (bi + 2) % 8 != 0 && (bi - 14) > 0 && b[bi - 14] === null && b[bi - 7] != null && b[bi - 7] < 12) {
        attackSpots.push([p, bi - 14]);
    }
    if (p.isKing) {
        if (bi % 8 != 0 && (bi - 1) % 8 != 0 && (bi + 14) > 0 && b[bi + 14] === null && b[bi + 7] != null && b[bi + 7] < 12) {
            attackSpots.push([p, bi + 14]);
        }
        if ((bi + 1) % 8 != 0 && (bi + 2) % 8 != 0 && (bi + 18) > 0 && b[bi + 18] === null && b[bi + 9] != null && b[bi + 9] < 12) {
            attackSpots.push([p, bi + 18]);
        }
    }
    return attackSpots;
}

function collectGoldAttackMoves(state) {
    let attackSpots = [];
    let goldPieceList = collectGoldPieces(state);
    for (let i=0; i < goldPieceList.length; i++) {
        let moves = collectGoldPieceAttackMoves(goldPieceList[i], state);
        if (moves.length > 0) {
            for (let j = 0; j < moves.length; j++) {
                attackSpots.push(moves[j]);
            }
        }
    }
    return attackSpots;
}

function collectPlayerPieceImmediateMoves(piece, state) {
    let result;
    if (state.player == 'Jarvis'){
        result = collectBrownPieceImmediateMoves(piece, state);
    } else {
        result = collectGoldPieceImmediateMoves(piece, state);
    }
    return result;
}

function collectBrownPieceImmediateMoves(piece, state) {
    let immediateSpots = [];
    let bi = piece.boardIndex;
    let b = state.board;
    let p = piece;

    if (bi % 8 != 0 && (bi + 7) < 64 && b[bi + 7] === null) {
        immediateSpots.push([p, bi + 7]);
    }
    if ((bi + 1) % 8 != 0 && (bi + 9) < 64 && b[bi + 9] === null) {
        immediateSpots.push([p, bi + 9]);
    }
    if (p.isKing) {
        if (bi % 8 != 0 && (bi - 9) < 64 && b[bi - 9] === null) {
            immediateSpots.push([p, bi - 9]);
        }
        if ((bi + 1) % 8 != 0 && (bi - 7) < 64 && b[bi - 7] === null) {
            immediateSpots.push([p, bi - 7]);
        }
    }
    return immediateSpots;
}

function collectPlayerImmediateMoves(state) {
    let result;
    if (state.player == 'Jarvis'){
        result = collectBrownImmediateMoves(state);
    } else {
        result = collectGoldImmediateMoves(state);
    }
    return result;
}

function collectBrownImmediateMoves(state) {
    let immediateSpots = [];
    let brownPieces = collectBrownPieces(state);
    for (let i=0; i < brownPieces.length; i++) {
        let moves = collectBrownPieceImmediateMoves(brownPieces[i], state);
        if (moves.length > 0) {
            for (let i = 0; i < moves.length; i++) {
                immediateSpots.push(moves[i]);
            }
        }
    }
    return immediateSpots;
}

function collectGoldPieceImmediateMoves(piece, state) {
    let immediateSpots = [];
    let bi = piece.boardIndex;
    let b = state.board;
    let p = piece;

    if (bi % 8 != 0 && (bi - 9) > 0 && b[bi - 9] === null) {
        immediateSpots.push([p, bi - 9]);
    }
    if ((bi + 1) % 8 != 0 && (bi - 7) > 0 && b[bi - 7] === null) {
        immediateSpots.push([p, bi - 7]);
    }
    if (p.isKing) {
        if (bi % 8 != 0 && (bi + 7) > 0 && b[bi + 7] === null) {
            immediateSpots.push([p, bi + 7]);
        }
        if ((bi+ 1) % 8 != 0 && (bi + 9) > 0 && b[bi+ 9] === null) {
            immediateSpots.push([p, bi + 9]);
        }
    }
    return immediateSpots;
}

function collectGoldImmediateMoves(state) {
    let immediateSpots = [];
    let goldPieceList = collectGoldPieces(state);
    for (let i=0; i < goldPieceList.length; i++) {
        let moves = collectGoldPieceImmediateMoves(goldPieceList[i], state);
        if (moves.length > 0) {
            for (let i = 0; i < moves.length; i++) {
                immediateSpots.push(moves[i]);
            }
        }
    }
    return immediateSpots;
}

/// fundamental function
function transformState(state, move, parent, changePlayer) {
    if (typeof(move) == "object") {
        let piece = move[0];
        let dest = move[1];
        if (Math.abs(piece.boardIndex - dest) < 10) {
            state.board[piece.boardIndex] = null;
            state.board[dest] = piece.id;
        } else {
            state.board[piece.boardIndex] = null;
            state.board[dest] = piece.id;
            state.board[((dest - piece.boardIndex)/2) + piece.boardIndex] = null;
        }
        if (changePlayer) {
            if (state.player == 'Jarvis') {
                state.player = 'Human';
                state.score = -10000;
                if (dest > 55) {
                    state.kingList[piece.id] = true;
                }
            } else {
                state.player = 'Jarvis';
                state.score = 10000;
                if (dest < 8) {
                    state.kingList[piece.id] = true;
                }
            }
            state.depth = state.depth + 1;
        }
        state.parent = parent;
        return state;
    }
}

/// fundamental function
function displayWinner(state) {
    if (dertermineWinState(state) == "Jarvis") {
        alert("Jarvis won!");
    } else if (dertermineWinState(state) == "Human") {
        alert("You won!");
    } else {
        alert("It's a Tie!");
    }
}


/// game function
function playDraughts(initialPlayer) {
    let initialBoard = createInitialBoard();
    let initialKingList = createInitialKingList();
    let currentState = new State(initialBoard, initialKingList, initialPlayer);
    collectHumanMove(currentState);
    ///currentState = new State(board, kingList, "Jarvis");
    ///currentState = collectJarvisMove(currentState);
    /*turn = "brown";
    if (winTest()) {
        alert(winTest);
        ///break;
    } else {
        currentState = new State(board, kingList, "Jarvis");
        currentState = collectJarvisMove(currentState);
        displayState(currentState);
        turn = "gold";
        if (winTest()) {
            alert(winTest());
            ///break;
        }
    }*/
    ///displayState(currentState);
    ///processAttackMoves(currentState, [currentState], [currentState]);
    /*while (true) {
        collectHumanMove(currentState);
        turn = "brown";
        if (winTest()) {
            alert(winTest);
            break;
        } else {
            currentState = new State(board, kingList, "Jarvis");
            currentState = collectJarvisMove(currentState);
            displayState(currentState);
            turn = "gold";
            if (winTest()) {
                alert(winTest());
                break;
            }
        }
    }*/
     
    /*
    while (!dertermineWinState(currentState)) {
        if (currentState.player == 'Human') {
            move = collectHumanMove(currentState);
        } else {
            move = collectJarvisMove(currentState);
        }
        currentState = transformState(currentState, move);
        ///displayState(currentState);
    }
    ///displayWinner(currentState);
    */
}

/// run functions
playDraughts("Jarvis");
