import Checker from "@/GameLogic/Checker";

export default class GameSession {
    private store: Object
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

    public getCheckerByCoords(x: number, y: number): Checker | null {
        return this.getCurrentBoardState()[y][x]
    }

    public getCurrentBoardState(): Object {
        return this.store.state.board;
    }

    public removeCheckerByCoord(x: number, y: number): void {
        this.store.dispatch('removeChecker', {x, y})
    }
}