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

    public onCheckerClick(row: number, col: number, id: number | false = false) {
        const justAte = this.gameSession.getJustAte()
        if (justAte) {
            console.error(`Current player must eat all the available checkers by current active checker!`)
            return
        }

        this.gameSession.clearMessageForUser()

        const whoseMove = this.gameSession.getWhoseMove()
        const coordsOfCheckersWhoCanEat = this.getCoordsOfCheckersWhoCanEat(whoseMove)
        let clickedCheckerCanEat = false
        if (coordsOfCheckersWhoCanEat.length !== 0) {
            for (let coords of coordsOfCheckersWhoCanEat) {
                if (row === coords.row && col === coords.col) {
                    clickedCheckerCanEat = true
                    break
                }
            }
            if (!clickedCheckerCanEat) {
                this.gameSession.setMessageForUser('You should eat a checker')
                console.warn('This checker cannot eat, but others can, so dont do anything')
                return
            }
        }

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
        if (checker.isGoingToBeEatenAtTheEndOfTheMove) {
            console.warn(`Checker on ${row}:${col} is about to be eaten at the end of the move, don't bother it`)
            return
        }

        // this.gameSession.clearAllowedCellsToMoveAndEat()
        this.gameSession.setActiveCell(row, col)
        this.updateAllPossibleMoves(checker, row, col)
    }

    private getCoordsOfCheckersWhoCanEat(color: String) {
        const board = this.gameSession.getCurrentBoardState()
        let checkerCoords: Array<Object> = []
        for (let row in board) {
            for (let col in board[row]) {
                const checker: Checker | null = board[+row][+col]
                if (checker?.color === color && this.canCheckerEatAtAll(checker, +row, +col)) {
                    checkerCoords.push({
                        row: +row, col: +col
                    })
                }
            }
        }
        return checkerCoords
    }

    public onCellClick(row: number, col: number) {
        console.info(`${row}:${col} is clicked!`)
        this.gameSession.clearMessageForUser()
        const checker: Checker | null = this.gameSession.getCheckerByCoords(row, col)
        const justAte = this.gameSession.getJustAte()

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

        if (this.canCheckerMoveToCellFromCoords(activeChecker, fromRow, fromCol, row, col)
            && !this.canCheckerEatAtAll(activeChecker, fromRow, fromCol) && !justAte) {
            this.gameSession.moveChecker(fromRow, fromCol, row, col)
            this.gameSession.clearActiveCell()
            this.gameSession.clearAllowedCellsToMoveAndEat()
            this.toggleMove()
        } else if (this.canCheckerEatToCellFromCoords(activeChecker, fromRow, fromCol, row, col)) {
            // TODO тестировать цикличное кушание
            let {row: eatableRow, col: eatableCol} = this.getEatableCheckerCoords(activeChecker, fromRow, fromCol, row, col)
            // this.eatChecker(fromRow, fromCol, row, col, eatableCheckerCoords)
            this.gameSession.moveChecker(fromRow, fromCol, row, col)
            this.gameSession.makeCheckerAlmostEaten(eatableRow, eatableCol)
            /** Если скушав, шашка всё ещё может есть, значит не передаём ход другому игроку и думаем дальше*/
            if (this.canCheckerEatAtAll(activeChecker, row, col)) {
                this.gameSession.setJustAte(true)
                this.gameSession.setActiveCell(row, col)
                this.updateAllPossibleMoves(activeChecker, row, col)
                return
            } else {
                this.gameSession.setJustAte(false)
                this.gameSession.clearAllowedCellsToMoveAndEat()
                this.gameSession.clearActiveCell()
                this.gameSession.eatCheckersThatAreAlmostEaten()
                this.toggleMove()
            }
        } else {
            console.error(`Checker on ${fromRow}:${fromCol} cannot move to ${row}:${col}`)
        }
    }

    private updateAllPossibleMoves(checker: Checker, row: number, col: number) {
        const possibleEats = this.getAllPossibleEats(checker, row, col)
        this.gameSession.setAllowedCellsToEat(possibleEats)
        if (possibleEats.length === 0)
            this.gameSession.setAllowedCellsToMove(this.getAllPossibleMoves(checker, row, col))
    }

    private isPlayerRightful(checker: Checker): boolean {
        return this.gameSession.getWhoseMove() === checker.color
    }

    private atLeastOneMoveIsPossibleForChecker(checker: Checker, fromRow: number, fromCol: number): boolean {
        return this.canCheckerMoveAtAll(checker, fromRow, fromCol) ||
            this.canCheckerEatAtAll(checker, fromRow, fromCol)
    }

    private canCheckerMoveAtAll(checker: Checker, fromRow: number, fromCol: number): boolean {
        return this.getAllPossibleMoves(checker, fromRow, fromCol).length > 0
    }

    private canCheckerEatAtAll(checker: Checker, fromRow: number, fromCol: number): boolean {
        return this.getAllPossibleEats(checker, fromRow, fromCol).length > 0
    }

    private canCheckerMoveToCellFromCoords(checker: Checker, fromRow: number, fromCol: number, toRow: number, toCol: number) {
        const possibleMoves = this.getAllPossibleMoves(checker, fromRow, fromCol)
        let answer = false;
        possibleMoves.forEach(({row, col}) => {
            if (row == toRow && toCol == col) answer = true
        })
        return answer
    }

    private canCheckerEatToCellFromCoords(checker: Checker, fromRow: number, fromCol: number, toRow: number, toCol: number) {
        const possibleEats = this.getAllPossibleEats(checker, fromRow, fromCol);
        let answer = false;
        possibleEats.forEach(({row, col}) => {
            if (row == toRow && toCol == col) answer = true
        })
        return answer
    }

    private getEatableCheckerCoords(checker: Checker, fromRow: number, fromCol: number, toRow: number, toCol: number): Object {
        const possibleEats = this.getAllPossibleEats(checker, fromRow, fromCol);
        for (let {row, col, eatableCheckerCoords} of possibleEats) {
            if (row == toRow && col == toCol) {
                return eatableCheckerCoords
            }
        }
        throw new Error(`No eatable checker found that can be eaten from ${fromRow}:${fromCol} moving to ${toRow}:${toCol}`)
    }

    private eatChecker(fromRow: number, fromCol: number, toRow: number, toCol: number, eatableCheckerCoords: Object) {
        this.gameSession.moveChecker(fromRow, fromCol, toRow, toCol)
        this.gameSession.removeCheckerByCoord(eatableCheckerCoords.row, eatableCheckerCoords.col)
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

        let row = fromRow + 1
        let col = fromCol + 1
        while (row <= 7 && col <= 7) {
            let checkerOnCell: Checker | null = board?.[row]?.[col]
            if (checkerOnCell === null) {
                possibleMoves.push({row, col})
            } else break
            row++;
            col++;
        }

        row = fromRow + 1
        col = fromCol - 1
        while (row <= 7 && col >= 0) {
            let checkerOnCell: Checker | null = board?.[row]?.[col]
            if (checkerOnCell === null) {
                possibleMoves.push({row, col})
            } else break
            row++;
            col--;
        }

        row = fromRow - 1
        col = fromCol + 1
        while (row >= 0 && col <= 7) {
            let checkerOnCell: Checker | null = board?.[row]?.[col]
            if (checkerOnCell === null) {
                possibleMoves.push({row, col})
            } else break
            row--;
            col++;
        }

        row = fromRow - 1
        col = fromCol - 1
        while (row >= 0 && col >= 0) {
            let checkerOnCell: Checker | null = board?.[row]?.[col]
            if (checkerOnCell === null) {
                possibleMoves.push({row, col})
            } else break
            row--;
            col--;
        }

        return possibleMoves
    }

    public getPossibleCellsToEatForKing(checker: Checker, fromRow: number, fromCol: number): Array<Object> {
        const board = this.getState();
        let possibleMoves = []
        const enemyColor = this.gameSession.getEnemyColor(checker.color)
        const currentColor = this.gameSession.getWhoseMove()

        let rowThatCanBeEaten = fromRow + 1;
        let colThatCanBeEaten = fromCol + 1;

        let breakMainLoop = false;

        while (rowThatCanBeEaten <= 7 && colThatCanBeEaten <= 7 && !breakMainLoop) {
            const eatableChecker: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
            const eatableCheckerCoords: Object = {
                row: rowThatCanBeEaten,
                col: colThatCanBeEaten
            }
            /** Если на пути нашлась вражеская шашка, то
             * если это дружественная, то выходим
             * если вражеская, то смотрим какие свободны дальше клетки */
            if (eatableChecker?.color === currentColor) break
            if (eatableChecker !== null && eatableChecker.color === enemyColor) {
                let row = rowThatCanBeEaten + 1
                let col = colThatCanBeEaten + 1
                while (row <= 7 && col <= 7) {
                    let cellToMoveTo = board?.[row]?.[col]
                    if (cellToMoveTo === null) {
                        possibleMoves.push({row, col, eatableCheckerCoords})
                    } else {
                        breakMainLoop = true
                        break
                    }
                    row++;
                    col++;
                }
            }
            rowThatCanBeEaten++
            colThatCanBeEaten++
        }

        rowThatCanBeEaten = fromRow + 1;
        colThatCanBeEaten = fromCol - 1;

        while (rowThatCanBeEaten <= 7 && colThatCanBeEaten >= 0) {
            const eatableChecker: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
            const eatableCheckerCoords: Object = {
                row: rowThatCanBeEaten,
                col: colThatCanBeEaten
            }
            if (eatableChecker?.color === currentColor) break
            if (eatableChecker !== null && eatableChecker.color === enemyColor) {
                let row = rowThatCanBeEaten + 1
                let col = colThatCanBeEaten - 1
                while (row <= 7 && col >= 0) {
                    let cellToMoveTo = board?.[row]?.[col]
                    if (cellToMoveTo === null) {
                        possibleMoves.push({row, col, eatableCheckerCoords})
                    } else break;
                    row++;
                    col--
                }
            }
            rowThatCanBeEaten++
            colThatCanBeEaten--
        }

        rowThatCanBeEaten = fromRow - 1;
        colThatCanBeEaten = fromCol + 1;

        while (rowThatCanBeEaten >= 0 && colThatCanBeEaten <= 7) {
            const eatableChecker: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
            const eatableCheckerCoords: Object = {
                row: rowThatCanBeEaten,
                col: colThatCanBeEaten
            }
            if (eatableChecker?.color === currentColor) break
            if (eatableChecker !== null && eatableChecker.color === enemyColor) {
                let row = rowThatCanBeEaten - 1
                let col = colThatCanBeEaten + 1
                while (row >= 0 && col <= 7) {
                    let cellToMoveTo = board?.[row]?.[col]
                    if (cellToMoveTo === null) {
                        possibleMoves.push({row, col, eatableCheckerCoords})
                    } else break
                    row--;
                    col++;
                }
            }
            rowThatCanBeEaten--
            colThatCanBeEaten++
        }

        rowThatCanBeEaten = fromRow - 1;
        colThatCanBeEaten = fromCol - 1;
        breakMainLoop = false;
        while (rowThatCanBeEaten >= 0 && colThatCanBeEaten >= 0 && !breakMainLoop) {
            const eatableChecker: Checker | null = board?.[rowThatCanBeEaten]?.[colThatCanBeEaten]
            const eatableCheckerCoords: Object = {
                row: rowThatCanBeEaten,
                col: colThatCanBeEaten
            }
            if (eatableChecker?.color === currentColor) break
            if (eatableChecker !== null && eatableChecker.color === enemyColor) {
                let row = rowThatCanBeEaten - 1;
                let col = colThatCanBeEaten - 1;
                while (row >= 0 && col >= 0) {
                    let cellToMoveTo = board?.[row]?.[col]
                    if (cellToMoveTo === null) {
                        possibleMoves.push({row, col, eatableCheckerCoords})
                    } else {
                        breakMainLoop = true
                        break
                    }
                    row--;
                    col--
                }
            }
            rowThatCanBeEaten--
            colThatCanBeEaten--
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
        /**
         * TODO Запилить выполнение следующих правил:
         *  2. Побитые шашки и дамки снимаются только после завершения хода
         *  4. За один ход шашку противника можно побить только один раз
         * */

        const board = this.getState();
        let possibleMoves: Array<any> = []
        let possibleRowsDeltas = [2, -2]
        let possibleColsDeltas = [2, -2]
        const enemyColor = this.gameSession.getEnemyColor(checker.color)
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
}