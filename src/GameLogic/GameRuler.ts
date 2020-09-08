import GameSession from "./GameSession";
import Checker from "@/GameLogic/Checker";

export default class GameRuler {

    public gameSession: GameSession;

    constructor(gs: GameSession) {
        this.gameSession = gs
    }

    public getState(): Array<any> {
        return this.gameSession.getCurrentBoardState()
    }

    public toggleMove(): void {
        this.gameSession.toggleMove();
    }

    public onCheckerClick(row: number, col: number) {
        this.gameSession.clearActiveCell()
        this.gameSession.clearAllowedCellsToMoveAndEat()
        const checker: Checker | null = this.gameSession.getCheckerByCoords(row, col)
        if (checker === null) {
            console.warn(`There is no checker in ${row}:${col}, but onCheckerClick method was called!`)
            return;
        }
        if (!this.isPlayerRightful(checker)) {
            console.warn(`Current player has no rights to click on this checker`)
            return
        }
        if (!this.atLeastOneMoveIsPossibleForChecker(checker, row, col)) {
            console.warn(`Checker on ${row}:${col} is not movable`)
            return
        }
        // this.gameSession.clearAllowedCellsToMoveAndEat()
        this.gameSession.setActiveCell(row, col)
        this.gameSession.setAllowedCellsToMove(this.getAllPossibleMoves(checker, row, col))
        this.gameSession.setAllowedCellsToEat(this.getAllPossibleEats(checker, row, col))
    }

    public onCellClick(row: number, col: number) {
        console.info(`${row}:${col} is clicked!`)
        const checker: Checker | null = this.gameSession.getCheckerByCoords(row, col)

        /** Если на нажатой клетке стоит шашка, то расцениваем это как нажатие на шашку */
        if (checker !== null) {
            console.warn('Cell is clicked on, but we assume that it was a click on checker')
            this.onCheckerClick(row, col)
            return;
        }
        const activeCell: Object = this.gameSession.getActiveCell()
        if (activeCell.row === null || activeCell.col === null) {
            console.warn('Cell is clicked, but there is no active cell chosen, so it is pointless')
            this.gameSession.clearAllowedCellsToMoveAndEat()
            return
        }
        const activeChecker: Checker | null = this.gameSession.getActiveChecker()

        if (activeChecker === null) {
            console.error(`No active checker is found on ${activeCell.row}:${activeCell.col}`)
            return
        }

        let fromRow = activeCell.row
        let fromCol = activeCell.col

        if (this.canCheckerMoveToCellFromCoords(activeChecker, fromRow, fromCol, row, col)) {
            this.gameSession.moveChecker(fromRow, fromCol, row, col)
            this.toggleMove()
        } else if (this.canCheckerEatToCellFromCoords(activeChecker, fromRow, fromCol, row, col)) {
            const eatableCheckerCoords = this.getEatableCheckerCoords(activeChecker, fromRow, fromCol, row, col)
            this.gameSession.eatChecker(fromRow, fromCol, row, col, eatableCheckerCoords)
            this.toggleMove()
        } else {
            console.error(`Checker on ${fromRow}:${fromCol} cannot move to ${row}:${col}`)
        }
        this.gameSession.clearActiveCell()
        this.gameSession.clearAllowedCellsToMoveAndEat()
    }

    public isPlayerRightful(checker: Checker): boolean {
        return this.gameSession.getWhoseMove() === checker.color
    }

    public atLeastOneMoveIsPossibleForChecker(checker: Checker, fromRow: number, fromCol: number): boolean {
        return this.getAllPossibleMoves(checker, fromRow, fromCol).length > 0 ||
            this.getAllPossibleEats(checker, fromRow, fromCol).length > 0
    }

    public canCheckerMoveToCellFromCoords(checker: Checker, fromRow: number, fromCol: number, toRow: number, toCol: number) {
        const possibleMoves = this.getAllPossibleMoves(checker, fromRow, fromCol)
        let answer = false;
        possibleMoves.forEach(({row, col}) => {
            if (row == toRow && toCol == col) answer = true
        })
        return answer
    }

    public canCheckerEatToCellFromCoords(checker: Checker, fromRow: number, fromCol: number, toRow: number, toCol: number) {
        const possibleEats = this.getAllPossibleEats(checker, fromRow, fromCol);
        let answer = false;
        possibleEats.forEach(({row, col}) => {
            if (row == toRow && toCol == col) answer = true
        })
        return answer
    }

    public getEatableCheckerCoords(checker: Checker, fromRow: number, fromCol: number, toRow: number, toCol: number): Object {
        const possibleEats = this.getAllPossibleEats(checker, fromRow, fromCol);
        for (let {row, col, eatableCheckerCoords} of possibleEats) {
            if (row == toRow && col == toCol) {
                return eatableCheckerCoords
            }
        }
        throw new Error(`No eatable checker found that can be eaten from ${fromRow}:${fromCol} moving to ${toRow}:${toCol}`)
    }

    public getAllPossibleMoves(checker: Checker, fromRow: number, fromCol: number): Array<Object> {
        let possibleMoves: Array<any> = []
        if (checker.isKing)
            possibleMoves = this.getPossibleCellsToMoveToForKing(checker, fromRow, fromCol)
        else
            possibleMoves = this.getPossibleCellsToMoveToForUsualChecker(checker, fromRow, fromCol)

        return possibleMoves
    }

    public getAllPossibleEats(checker: Checker, fromRow: number, fromCol: number): Array<Object> {
        let possibleEats: Array<Object> = []
        if (checker.isKing)
            possibleEats = this.getPossibleCellsToEatForKing(checker, fromRow, fromCol)
        else
            possibleEats = this.getPossibleCellsToEatForUsualChecker(checker, fromRow, fromCol)

        return possibleEats

    }

    public getPossibleCellsToMoveToForKing(checker: Checker, fromRow: number, fromCol: number): Array<Object> {
        const board = this.getState();
        let possibleMoves = []

        let row = fromRow
        let col = fromCol
        while (row <= 7 && col <= 7) {
            let checkerOnCell: Checker | null = board?.[row]?.[col]
            if (checkerOnCell === null) {
                possibleMoves.push({row, col})
            }
            row++; col++;
        }

        row = fromRow
        col = fromCol
        while (row <= 7 && col >= 0) {
            let checkerOnCell: Checker | null = board?.[row]?.[col]
            if (checkerOnCell === null) {
                possibleMoves.push({row, col})
            }
            row++; col--;
        }

        row = fromRow
        col = fromCol
        while (row >= 0 && col <= 7) {
            let checkerOnCell: Checker | null = board?.[row]?.[col]
            if (checkerOnCell === null) {
                possibleMoves.push({row, col})
            }
            row--; col++;
        }

        row = fromRow
        col = fromCol
        while (row >= 0 && col >= 0) {
            let checkerOnCell: Checker | null = board?.[row]?.[col]
            if (checkerOnCell === null) {
                possibleMoves.push({row, col})
            }
            row--; col--;
        }

        return possibleMoves
    }

    public getPossibleCellsToEatForKing(checker: Checker, fromRow: number, fromCol: number): Array<Object> {
        const board = this.getState();
        let possibleMoves = []
        const enemyColor = this.getEnemyColor(checker)

        for (let rowThatCanBeEaten = fromRow; rowThatCanBeEaten <= 7; rowThatCanBeEaten++) {
            for (let colThatCanBeEaten = fromCol; colThatCanBeEaten <= 7; colThatCanBeEaten++) {
                const eatableChecker: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
                const eatableCheckerCoors: Object =  {
                    row: rowThatCanBeEaten,
                    col: colThatCanBeEaten
                }
                /** Если на пути нашлась вражеская шашка, смотрим какие свободны дальше клетки */
                if (eatableChecker !== null && eatableChecker.color === enemyColor) {
                    let stopCheckingCellsToMoveTo = false;
                    for (let row = rowThatCanBeEaten; row <= 7 && !stopCheckingCellsToMoveTo; row++) {
                        for (let col = colThatCanBeEaten; col <= 7 && !stopCheckingCellsToMoveTo; col++) {
                            let cellToMoveTo = board?.[row]?.[col]
                            if (cellToMoveTo === null) {
                                possibleMoves.push({row, col, eatableCheckerCoors})
                            } else {
                                stopCheckingCellsToMoveTo = true;
                            }
                        }
                    }
                }
            }
        }
        for (let rowThatCanBeEaten = fromRow; rowThatCanBeEaten <= 7; rowThatCanBeEaten++) {
            for (let colThatCanBeEaten = fromCol; colThatCanBeEaten >= 0; colThatCanBeEaten--) {
                const eatableChecker: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
                const eatableCheckerCoords: Object =  {
                    row: rowThatCanBeEaten,
                    col: colThatCanBeEaten
                }
                /** Если на пути нашлась вражеская шашка, смотрим какие свободны дальше клетки */
                if (eatableChecker !== null && eatableChecker.color === enemyColor) {
                    let stopCheckingCellsToMoveTo = false;
                    for (let row = rowThatCanBeEaten; row <= 7 && !stopCheckingCellsToMoveTo; row++) {
                        for (let col = colThatCanBeEaten; col >= 0 && !stopCheckingCellsToMoveTo; col--) {
                            let cellToMoveTo = board?.[row]?.[col]
                            if (cellToMoveTo === null) {
                                possibleMoves.push({row, col, eatableCheckerCoords})
                            } else {
                                stopCheckingCellsToMoveTo = true;
                            }
                        }
                    }
                }
            }
        }

        for (let rowThatCanBeEaten = fromRow; rowThatCanBeEaten >= 0; rowThatCanBeEaten--) {
            for (let colThatCanBeEaten = fromCol; colThatCanBeEaten <= 7; colThatCanBeEaten++) {
                const eatableChecker: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
                const eatableCheckerCoords: Object =  {
                    row: rowThatCanBeEaten,
                    col: colThatCanBeEaten
                }
                /** Если на пути нашлась вражеская шашка, смотрим какие свободны дальше клетки */
                if (eatableChecker !== null && eatableChecker.color === enemyColor) {
                    let stopCheckingCellsToMoveTo = false;
                    for (let row = rowThatCanBeEaten; row >= 0 && !stopCheckingCellsToMoveTo; row--) {
                        for (let col = colThatCanBeEaten; col <= 7 && !stopCheckingCellsToMoveTo; col++) {
                            let cellToMoveTo = board?.[row]?.[col]
                            if (cellToMoveTo === null) {
                                possibleMoves.push({row, col, eatableCheckerCoords})
                            } else {
                                stopCheckingCellsToMoveTo = true;
                            }
                        }
                    }
                }
            }
        }

        for (let rowThatCanBeEaten = fromRow; rowThatCanBeEaten >= 0; rowThatCanBeEaten--) {
            for (let colThatCanBeEaten = fromCol; colThatCanBeEaten >= 0; colThatCanBeEaten--) {
                const eatableChecker: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
                const eatableCheckerCoords: Object =  {
                    row: rowThatCanBeEaten,
                    col: colThatCanBeEaten
                }
                /** Если на пути нашлась вражеская шашка, смотрим какие свободны дальше клетки */
                if (eatableChecker !== null && eatableChecker.color === enemyColor) {
                    let stopCheckingCellsToMoveTo = false;
                    for (let row = rowThatCanBeEaten; row >= 0 && !stopCheckingCellsToMoveTo; row--) {
                        for (let col = colThatCanBeEaten; col >= 0 && !stopCheckingCellsToMoveTo; col--) {
                            let cellToMoveTo = board?.[row]?.[col]
                            if (cellToMoveTo === null) {
                                possibleMoves.push({row, col, eatableCheckerCoords})
                            } else {
                                stopCheckingCellsToMoveTo = true;
                            }
                        }
                    }
                }
            }
        }

        return possibleMoves
    }

    public getPossibleCellsToMoveToForUsualChecker(checker: Checker, fromRow: number, fromCol: number): Array<any> {
        const board = this.getState();
        let possibleMoves: Array<any> = [];
        /** TODO эта концепция, возможно, требует переработки
         *  Надо подумать над тем, как хранить данные о местоположении шашек на доске
         *  */
        const possibleRow = checker.color === 'white' ? fromRow - 1 : fromRow + 1;
        const possibleCol1 = fromCol + 1;
        const possibleCol2 = fromCol - 1;
        const possibleMove1 = board?.[possibleRow]?.[possibleCol1] === null;
        const possibleMove2 = board?.[possibleRow]?.[possibleCol2] === null;

        if (possibleMove1) {
            possibleMoves.push({
                row: possibleRow,
                col: possibleCol1,
            })
        }
        if (possibleMove2) {
            possibleMoves.push({
                row: possibleRow,
                col: possibleCol2
            })
        }
        return possibleMoves
    }

    public getPossibleCellsToEatForUsualChecker(checker: Checker, fromRow: number, fromCol: number): Array<any> {
        const board = this.getState();
        let possibleMoves: Array<any> = []
        let possibleRowsDeltas = [2, -2]
        let possibleColsDeltas = [2, -2]
        const enemyColor = this.getEnemyColor(checker)
        possibleRowsDeltas.forEach(rowDelta => {
            const finalRow = fromRow + rowDelta
            const eatableCheckerRow = finalRow - rowDelta / 2
            possibleColsDeltas.forEach(colDelta => {
                const finalCol = fromCol + colDelta
                const eatableCheckerCol = finalCol - colDelta / 2
                const eatableChecker = board?.[finalRow - rowDelta / 2]?.[finalCol - colDelta / 2]
                const eatableCheckerCoords = {
                    row: eatableCheckerRow,
                    col: eatableCheckerCol
                }
                if (eatableChecker?.color === enemyColor && board?.[finalRow]?.[finalCol] === null) {
                    possibleMoves.push({
                        row: finalRow,
                        col: finalCol,
                        eatableCheckerCoords
                    })
                }
            })
        })
        return possibleMoves
    }

    public getEnemyColor(checker: Checker): String {
        return checker.color === 'white' ? 'black' : 'white'
    }
}