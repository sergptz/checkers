export default class Checker {
    public color: String
    public isKing: Boolean

    constructor(color: String, isKing: Boolean = false) {
        this.color = color
        this.isKing = isKing
    }

    public becomeKing():void {
        this.isKing = true
    }
}