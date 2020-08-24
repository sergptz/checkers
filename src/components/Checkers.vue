<template>
  <div>
    <board></board>
  </div>
</template>

<script>
import $ from 'jquery'
import Board from './Board'

export default {
    components: {
        Board
    },
    data() {
        return {
            /**
             *  0 - empty cell
             *  1 - first player's cheker
             *  2 - second's user checker
             **/
            checkersState: [
                [0, 2, 0, 2, 0, 2, 0, 2],
                [2, 0, 2, 0, 2, 0, 2, 0],
                [0, 2, 0, 2, 0, 2, 0, 2],

                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],

                [1, 0, 1, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0],

            ],
            activeCell: {
                row: null,
                column: null
            },
            whosTurn: 1
        }
    },
    methods: {
        onCellClick(e) {
            const cellData = $(e.currentTarget).data('id').split('_');
            const row = cellData[0];
            const col = cellData[1];
            const checker = this.checkersState[row][col];
            if (this.whosTurn === checker && checker !== 0 && !(this.allowedCells[row] && this.allowedCells[row][col])) {
                this.activeCell.row = row
                this.activeCell.column = col
            } else if (this.allowedCells[row] && this.allowedCells[row][col]) {
                let moveResult = this.moveTo(row, col);
            } else {
                this.activeCell = {
                    row: null,
                    column: null
                }
            }
        },
        moveTo(row, column) {
            const cell = this.activeCell;
            const player = this.checkersState[cell.row][cell.column];
            this.checkersState[cell.row][cell.column] = 0;
            this.checkersState[row][column] = player;
            this.activeCell = {
                row: null,
                column: null
            }
            if (this.canEat) {

            }
            this.toggleTurn();
        },
        setObjectValueByMultipleKeys(keys, value, object) {
            let objectLink = object;
            for (let i in keys) {
                // objectLink[] =
                if (i < keys.length - 1) {
                    if (!(objectLink[keys[i]] instanceof Object)) {
                        objectLink[keys[i]] = {};
                    }
                    objectLink = objectLink[keys[i]];
                }
                if (i == keys.length - 1) {
                    objectLink[keys[i]] = value;
                }
            }
            return object;
        },
        toggleTurn() {
            this.whosTurn = this.whosTurn == 1 ? 2 : 1
        },

        getValueByTwoKeysFromState(key1, key2) {
            return this.checkersState[key1] && this.checkersState[key1][key2] !== undefined ? this.checkersState[key1][key2] : false;
        }

    },
    computed: {
        // клетки, на которые можно ходить
        allowedCells() {
            const row = +this.activeCell.row;
            const column = +this.activeCell.column;
            let allowed = {};
            if (row !== null && column !== null && this.checkersState[row][column] !== 0) {
                const checker = this.checkersState[row][column];
                const rowOffset = checker === 1 ? -1 : 1;
                const state = Object.assign({}, this.checkersState);
                // if (checker === 1) {
                // если не в последней строке
                let cell1 = this.getValueByTwoKeysFromState(row + rowOffset, column + 1);
                let cell2 = this.getValueByTwoKeysFromState(row + rowOffset, column - 1)

                console.log(cell1, cell2);

                if (cell1 !== false && cell1 === 0) {
                    console.log('YEAH');
                    allowed = this.setObjectValueByMultipleKeys([row + rowOffset, column + 1], true, allowed);
                }

                // Проверка, может ли есть
                if (cell1 !== false && cell1 == this.opposite) {
                    let cell3 = this.getValueByTwoKeysFromState(row + rowOffset * 2, column + 2)
                    if (cell3 !== false && cell3 == 0) {
                        allowed = this.setObjectValueByMultipleKeys([row + rowOffset * 2, column + 2], true, allowed);
                    }
                }

                if (cell2 !== false && cell2 === 0) {
                    allowed = this.setObjectValueByMultipleKeys([row + rowOffset, column - 1], true, allowed);
                }

                if (cell2 !== false && cell2 == this.opposite) {
                    let cell4 = this.getValueByTwoKeysFromState(row + rowOffset * 2, column - 2)
                    if (cell4 !== false && cell4 == 0) {
                        allowed = this.setObjectValueByMultipleKeys([row + rowOffset * 2, column - 2], true, allowed);
                    }
                }

                // if (row !== (checker == 1 ? 0 : 7)) {
                // 	if (state[row + (checker === 1 ? -1 : 1)][column + 1] === 0 && column !== 7) {
                // 		allowed = this.setObjectValueByMultipleKeys([row + (checker === 1 ? -1 : 1), column + 1], true, allowed);
                // 	}
                // 	if (state[row + (checker === 1 ? -1 : 1)][column - 1] === 0 && column !== 0) {
                // 		allowed = this.setObjectValueByMultipleKeys([row + (checker === 1 ? -1 : 1), column - 1], true, allowed);
                // 	}
                // 	if (state[row + (checker === 1 ? -1 : 1)][column - 1] === checker === 1 ? 2 : 1) {}
                // } else {

                // }
                // }

            }
            return allowed;
        },

        /**
         *  Метод проверяет, может ли шашка есть другую
         *  @argument row - строка шашки
         *  @argument col - колонка шашки
         *  @argument justEated - скушали ли мы только шашку?
         *  @returns bool
         *  @or
         *  @returns
         */
        canEat(row, col, justEated) {
            let checker = this.checkersState[row][col]
            if (checker == 0 || checker != this.whosTurn) {
                return false;
            }
            let coords = {
                1: [
                    {
                        to: {row: row - 2, col: col + 2},
                        over: {row: row - 1, col: col + 1}
                    },
                    {
                        to: {row: row - 2, col: col - 2},
                        over: {row: row - 1, col: col - 1}
                    }
                ],
                2: [
                    {
                        to: {row: row + 2, col: col + 2},
                        over: {row: row + 1, col: col - 1}
                    },
                    {
                        to: {row: row + 2, col: col - 2},
                        over: {row: row + 1, col: col - 1}
                    }
                ]
            }
            if (justEated) {
                coords = Object.values(coors).flat();
            } else {
                // coords =
            }
            // for () {

            // }
        },
        // получаем номер соперника относительно текущего ходящего (1 или 2)
        opposite() {
            return this.whosTurn == 1 ? 2 : 1;
        }
    }
}
</script>

<style scoped>
body, html {
    height: 100%;
}

/*.checkers-table {*/
/*    table-layout: fixed;*/
/*}*/

/*tr td {*/
/*    background-color: rgb(128, 44, 44);*/
/*}*/

/*tr:nth-child(even) td:nth-child(odd),*/
/*tr:nth-child(odd) td:nth-child(even) {*/
/*    background-color: rgb(218, 206, 98);*/
/*}*/

/*.cell {*/
/*    width: 8vw;*/
/*    height: 8vw;*/
/*}*/

/*.checker {
    width: 70%;
    height: 70%;
    border-radius: 50%;
}

.checker.white {
    background-color: white;
    border: solid black 1px;
}

.checker.black {
    background-color: black;
    border: solid white 1px;
}*/

/*.cell.active {*/
/*    -webkit-box-shadow: 0px 0px 5px 3px rgb(82, 94, 255);*/
/*    -moz-box-shadow: 0px 0px 5px 3px rgb(82, 94, 255);*/
/*    box-shadow: 0px 0px 5px 3px rgb(82, 94, 255);*/
/*}*/

/*.cell.allowed {*/
/*    -webkit-box-shadow: 0px 0px 5px 3px rgb(20, 57, 116);*/
/*    -moz-box-shadow: 0px 0px 5px 3px rgb(20, 57, 116);*/
/*    box-shadow: 0px 0px 5px 3px rgb(38, 85, 53);*/
/*}*/

/*.cell.active > .checker {*/
/*    -webkit-box-shadow: 0px 0px 5px 3px rgb(82, 94, 255);*/
/*    -moz-box-shadow: 0px 0px 5px 3px rgb(82, 94, 255);*/
/*    box-shadow: 0px 0px 5px 3px rgb(82, 94, 255);*/

/*}*/
</style>