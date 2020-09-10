import Checker from "@/GameLogic/Checker";

export default class GameSession {
    private store: any;
    private initialCoordinates: Array<Array<number>> = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],

        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],

        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
    ]

    constructor(store: Object) {
        this.store = store
    }

    public initializeSession(): void {
        let initBoardState: Array<Array<any>> = []
        for (let y in this.initialCoordinates) {
            initBoardState[y] = []
            for (let x in this.initialCoordinates[y]) {
                let colorId = this.initialCoordinates[y][x]
                if (colorId) initBoardState[y][x] = new Checker(colorId === 1 ? 'white' : 'black')
                else initBoardState[y][x] = null
            }
        }
        this.store.commit('SET_BOARD_STATE', initBoardState)
    }

    public toggleMove(): void {
        this.store.dispatch('setWhoseMove', this.store.state.whoseMove === 'white' ? 'black' : 'white')
    }

    public getActiveCell(): Object {
        return this.store.state.activeCell
    }

    public setActiveCell(row: number, col: number): void {
        this.store.dispatch('setActiveCell', {row, col})
    }

    public clearActiveCell(): void {
        this.store.dispatch('clearActiveCell');
    }

    public getActiveChecker(): Checker | null {
        const {row, col} = this.store.state.activeCell
        const checker = this.getCheckerByCoords(row, col)
        if (row === null || col === null || checker === null)
            throw new Error('No cell is active, but you are trying to get the active checker')
        return checker
    }

    public getWhoseMove(): String {
        return this.store.state.whoseMove;
    }

    public getCheckerByCoords(row: number, col: number): Checker | null {
        const state = this.getCurrentBoardState()
        return state?.[row]?.[col]
    }

    public getCurrentBoardState(): Array<any> {
        return this.store.state.board;
    }

    public removeCheckerByCoord(row: number, col: number): void {
        this.store.dispatch('removeChecker', {row, col})
    }

    public setAllowedCellsToMove(cells: Array<Object>) {
        this.store.dispatch('setAllowedCellsToMove', {cells})
    }

    public setAllowedCellsToEat(cells: Array<Object>) {
        this.store.dispatch('setAllowedCellsToEat', {cells})
    }

    public getJustAte(): boolean {
        return this.store.state.justAte
    }

    public setJustAte(justAte: boolean) {
        this.store.dispatch('setJustAte', {justAte})
    }

    public getAllowedCells(): Array<Object> {
        return this.store.state.allowedCells
    }

    public clearAllowedCellsToMoveAndEat() {
        this.store.dispatch('clearAllowedCellsToMoveAndEat')
    }

    public eatChecker(fromRow: number, fromCol: number, toRow: number, toCol: number, eatableCheckerCoords: Object) {
        this.moveChecker(fromRow, fromCol, toRow, toCol)
        this.removeCheckerByCoord(eatableCheckerCoords.row, eatableCheckerCoords.col)
    }

    public moveChecker(fromRow: number, fromCol: number, toRow: number, toCol: number) {
        this.store.dispatch('moveChecker', {fromRow, fromCol, toRow, toCol})
    }
}