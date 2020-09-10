export default class Checker {
    public color: String
    public isKing: Boolean
    public isGoingToBeEatenAtTheEndOfTheMove: Boolean = false

    constructor(color: String, isKing: Boolean = false) {
        this.color = color
        this.isKing = isKing
    }

    public becomeKing():void {
        this.isKing = true
    }
}