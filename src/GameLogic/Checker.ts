export default class Checker {
    public id: number
    public color: String
    public isKing: Boolean
    public isGoingToBeEatenAtTheEndOfTheMove: Boolean = false

    constructor(color: String, id: number, isKing: Boolean = false) {
        this.color = color
        this.isKing = isKing
        this.id = id
    }

    public becomeKing():void {
        this.isKing = true
    }
}