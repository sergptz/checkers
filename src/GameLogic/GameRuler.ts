import GameSession from "./GameSession";
export default class GameRuler {

    public gameSession: GameSession; 

    constructor(gs: GameSession) {
        this.gameSession = gs
    }

    public getState() : Object {
        return this.gameSession.getCurrentBoardState()
    }
}