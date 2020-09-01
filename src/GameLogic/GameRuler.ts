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
        if (!this.atLeastOneMoveIsPossible(checker, board, row, col)) {
            console.warn(`Checker on ${row}:${col} is not movable`)
        }
        this.gameSession.setActiveCell(row, col)
    }

    public isPlayerRightful(checker: Checker) : boolean {
        return this.gameSession.getWhoseMove() === checker.color
    }

    public atLeastOneMoveIsPossible(checker: Checker, board: Array<any>, fromRow: number, fromCol: number): boolean {
        // TODO запилить проверки на возможность ходить и кушать,
        //  причём походу для каждого игрока будет немного отличаться алгоритм (в противоположные стороны будем смотреть).
        //  Плюс еще надо запилить всё то же и для дамок.
        //  ИТОГО: 8 вариантов развития событий
        //  дамка или нет - 2 варианта
        //  Чёрный или белый - 2 варианта
        //  и
        //  Может ли ходить и может ли кушать (2 независимых варианта)
        //  хммм надо сделать так, чтобы это было компактно и использовалось бы в расчёте allowedCells
        let tempResult = false;
        if (checker.isKing) tempResult = this.canKingCheckerMove(checker, board, fromRow, fromCol)
        else tempResult || this.canCheckerMove(checker, board, fromRow, fromCol)

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