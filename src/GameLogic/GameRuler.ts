import GameSession from "./GameSession";
import Checker from "@/GameLogic/Checker";
export default class GameRuler {

    public gameSession: GameSession; 

    constructor(gs: GameSession) {
        this.gameSession = gs
    }

    public getState() : Array<any> {
        return this.gameSession.getCurrentBoardState()
    }

    public toggleMove(): void
    {
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
        if (!this.atLeastOneMoveIsPossible(checker, row, col)) {
            console.warn(`Checker on ${row}:${col} is not movable`)
        }
        this.gameSession.setActiveCell(row, col)
    }

    public isPlayerRightful(checker: Checker) : boolean {
        return this.gameSession.getWhoseMove() === checker.color
    }

    public atLeastOneMoveIsPossible(checker: Checker, fromRow: number, fromCol: number): boolean {
        // TODO запилить проверки на возможность ходить и кушать,
        //  причём походу для каждого игрока будет немного отличаться алгоритм (в противоположные стороны будем смотреть).
        //  Плюс еще надо запилить всё то же и для дамок.
        //  ИТОГО: 8 вариантов развития событий
        //  дамка или нет - 2 варианта
        //  Чёрный или белый - 2 варианта
        //  и
        //  Может ли ходить и может ли кушать (2 независимых варианта)
        //  хммм надо сделать так, чтобы это было компактно и использовалось бы в расчёте allowedCells
        const board = this.getState();
        if (checker.isKing)
            return this.canKingCheckerMove(checker, fromRow, fromCol) || this.canKingCheckerEat(checker, fromRow, fromCol)
        else
            return this.canUsualCheckerMove(checker, fromRow, fromCol) || this.canUsualCheckerEat(checker, fromRow, fromCol)

    }

    public getPossibleCellsToMoveForKing(checker: Checker, fromRow: number, fromCol: number): boolean {
        const board = this.getState();
        if (1) {

        }
    }

    public getPossibleCellsToEatForKing(checker: Checker, fromRow: number, fromCol: number): boolean {
        const board = this.getState();
        if (1) {

        }
    }

    public getPossibleCellsToMoveForUsualChecker(checker: Checker, fromRow: number, fromCol: number): Array<any> {
        const board = this.getState();
        let possibleMoves: Array<any> = [];
        /** TODO эта концепция, возможно, требует переработки
         *  Надо подумать над тем, как хранить данные о местоположении шашек на доске
         *  */
        const possibleRow = checker.color === 'white' ? fromRow + 1 : fromRow - 1;
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
        possibleRows.forEach(row => {
            possibleCols.forEach(col => {
                if (board?.[fromRow + (row - fromRow) / 2]?.[fromCol + (col - fromCol) / 2] === (checker.color === 'white' ? 'black' : 'white')
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
        const activeCell = this.gameSession.getActiveCell()
        if (activeCell.row === null || activeCell.col === null) {
            console.warn('Cell is clicked, but there is no active cell chosen, so it is pointless')
            return
        }
    }
}