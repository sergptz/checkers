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
        const checker: Checker | null = this.gameSession.getCheckerByCoords(row, col)
        const board = this.getState();
        if (checker === null) {
            console.warn(`There is no checker in ${row}:${col}, but onCheckerClick method was called!`)
            return;
        }
        if (!this.isPlayerRightful(checker)) {
            console.warn(`Player has no rights to click on this checker`)
            return
        }
        if (!this.atLeastOneMoveIsPossibleForChecker(checker, row, col)) {
            console.warn(`Checker on ${row}:${col} is not movable`)
            return
        }
        this.gameSession.setActiveCell(row, col)
        this.gameSession.setAllowedCells(this.getAllPossibleMoves(checker, row, col))
    }

    public isPlayerRightful(checker: Checker): boolean {
        return this.gameSession.getWhoseMove() === checker.color
    }

    public atLeastOneMoveIsPossibleForChecker(checker: Checker, fromRow: number, fromCol: number): boolean {
        console.log(this.getAllPossibleMoves(checker, fromRow, fromCol))
        return this.getAllPossibleMoves(checker, fromRow, fromCol).length > 0
    }

    public getAllPossibleMoves(checker: Checker, fromRow: number, fromCol: number): Array<Object> {
        let possibleMoves: Array<any> = []
        if (checker.isKing)
            possibleMoves = possibleMoves
                .concat(this.getPossibleCellsToMoveToForKing(checker, fromRow, fromCol))
                .concat(this.getPossibleCellsToEatForKing(checker, fromRow, fromCol))
        else
            possibleMoves = possibleMoves
                .concat(this.getPossibleCellsToMoveToForUsualChecker(checker, fromRow, fromCol))
                .concat(this.getPossibleCellsToEatForUsualChecker(checker, fromRow, fromCol))

        console.log(this.getPossibleCellsToMoveToForUsualChecker(checker, fromRow, fromCol))

        return possibleMoves
    }

    public getPossibleCellsToMoveToForKing(checker: Checker, fromRow: number, fromCol: number): Array<Object> {
        const board = this.getState();
        let possibleMoves = []

        for (let row = fromRow; row <= 7; row++) {
            for (let col = fromCol; col <= 7; col++) {
                let checkerOnCell: Checker | null = board?.[row]?.[col]
                if (checkerOnCell === null) {
                    possibleMoves.push({row, col})
                }
            }
        }

        for (let row = fromRow; row <= 7; row++) {
            for (let col = fromCol; col >= 0; col--) {
                let checkerOnCell: Checker | null = board?.[row]?.[col]
                if (checkerOnCell === null) {
                    possibleMoves.push({row, col})
                }
            }
        }

        for (let row = fromRow; row >= 0; row--) {
            for (let col = fromCol; col <= 7; col++) {
                let checkerOnCell: Checker | null = board?.[row]?.[col]
                if (checkerOnCell === null) {
                    possibleMoves.push({row, col})
                }
            }
        }

        for (let row = fromRow; row >= 0; row--) {
            for (let col = fromCol; col >= 0; col--) {
                let checkerOnCell: Checker | null = board?.[row]?.[col]
                if (checkerOnCell === null) {
                    possibleMoves.push({row, col})
                }
            }
        }
        return possibleMoves
    }

    public getPossibleCellsToEatForKing(checker: Checker, fromRow: number, fromCol: number): Array<Object> {
        const board = this.getState();
        let possibleMoves = []
        const enemyColor = this.getEnemyColor(checker)

        for (let rowThatCanBeEaten = fromRow; rowThatCanBeEaten <= 7; rowThatCanBeEaten++) {
            for (let colThatCanBeEaten = fromCol; colThatCanBeEaten <= 7; colThatCanBeEaten++) {
                let checkerOnCellToBeEaten: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
                /** Если на пути нашлась вражеская шашка, смотрим какие свободны дальше клетки */
                if (checkerOnCellToBeEaten !== null && checkerOnCellToBeEaten.color === enemyColor) {
                    let stopCheckingCellsToMoveTo = false;
                    for (let row = rowThatCanBeEaten; row <= 7 && !stopCheckingCellsToMoveTo; row++) {
                        for (let col = colThatCanBeEaten; col <= 7 && !stopCheckingCellsToMoveTo; col++) {
                            let cellToMoveTo = board?.[row]?.[col]
                            if (cellToMoveTo === null) {
                                possibleMoves.push({row, col})
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
                let checkerOnCellToBeEaten: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
                /** Если на пути нашлась вражеская шашка, смотрим какие свободны дальше клетки */
                if (checkerOnCellToBeEaten !== null && checkerOnCellToBeEaten.color === enemyColor) {
                    let stopCheckingCellsToMoveTo = false;
                    for (let row = rowThatCanBeEaten; row <= 7 && !stopCheckingCellsToMoveTo; row++) {
                        for (let col = colThatCanBeEaten; col >= 0 && !stopCheckingCellsToMoveTo; col--) {
                            let cellToMoveTo = board?.[row]?.[col]
                            if (cellToMoveTo === null) {
                                possibleMoves.push({row, col})
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
                let checkerOnCellToBeEaten: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
                /** Если на пути нашлась вражеская шашка, смотрим какие свободны дальше клетки */
                if (checkerOnCellToBeEaten !== null && checkerOnCellToBeEaten.color === enemyColor) {
                    let stopCheckingCellsToMoveTo = false;
                    for (let row = rowThatCanBeEaten; row >= 0 && !stopCheckingCellsToMoveTo; row--) {
                        for (let col = colThatCanBeEaten; col <= 7 && !stopCheckingCellsToMoveTo; col++) {
                            let cellToMoveTo = board?.[row]?.[col]
                            if (cellToMoveTo === null) {
                                possibleMoves.push({row, col})
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
                let checkerOnCellToBeEaten: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
                /** Если на пути нашлась вражеская шашка, смотрим какие свободны дальше клетки */
                if (checkerOnCellToBeEaten !== null && checkerOnCellToBeEaten.color === enemyColor) {
                    let stopCheckingCellsToMoveTo = false;
                    for (let row = rowThatCanBeEaten; row >= 0 && !stopCheckingCellsToMoveTo; row--) {
                        for (let col = colThatCanBeEaten; col >= 0 && !stopCheckingCellsToMoveTo; col--) {
                            let cellToMoveTo = board?.[row]?.[col]
                            if (cellToMoveTo === null) {
                                possibleMoves.push({row, col})
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
                col: possibleCol1
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
        let possibleRows = [
            fromRow + 2,
            fromRow - 2
        ]
        let possibleCols = [
            fromCol + 2,
            fromCol - 2
        ]
        const enemyColor = this.getEnemyColor(checker)
        possibleRows.forEach(row => {
            possibleCols.forEach(col => {
                if (board?.[fromRow + (row - fromRow) / 2]?.[fromCol + (col - fromCol) / 2] === enemyColor
                    && board?.[row]?.[col] === null) {
                    possibleMoves.push({
                        row,
                        col
                    })
                }
            })
        })
        return possibleMoves
    }

    public onCellClick(row: number, col: number) {
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
            return
        }

    }

    public getEnemyColor(checker: Checker): String {
        return checker.color === 'white' ? 'black' : 'white'
    }
}