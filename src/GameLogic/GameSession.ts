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
        this.store.dispatch('setWhoseMove', this.store.state.whosMove === 'white' ? 'black' : 'white')
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

    public getWhoseMove(): String {
        return this.store.state.whoseMove;
    }

    public getCheckerByCoords(row: number, col: number): Checker | null {
        return this.getCurrentBoardState()[row][col]
    }

    public getCurrentBoardState(): Array<any> {
        return this.store.state.board;
    }

    public removeCheckerByCoord(row: number, col: number): void {
        this.store.dispatch('removeChecker', {row, col})
    }
}