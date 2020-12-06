<template>
    <table class="checkers-table">
        <tr>
            <th>A</th>
            <th>B</th>
            <th>C</th>
            <th>D</th>
            <th>E</th>
            <th>F</th>
            <th>G</th>
            <th>H</th>
        </tr>
        <tr v-for="(rowState, row) in boardState">
            <td @click="onCellClick(row, col)"
                v-for="(cellValue, col) in rowState" :data-id="row + '_' + col" :key="'cell:' + row + '_' + col"
                align="center" :class="getCellClasses(row, col)">
                <Checker v-if="cellValue" :id="cellValue.id" :color="cellValue.color" :is-king="cellValue.isKing" @click.native.stop="onCheckerClick(row, col)"/>
            </td>
        </tr>
    </table>
</template>

<script>
import {mapActions, mapState, mapGetters} from 'vuex'
import Checker from "@/components/Checker";

export default {
    components: {
        Checker
    },
    data() {
        return {
        }
    },
    methods: {
        onCellClick(row, col) {
            this.$root.gameRuler.onCellClick(row, col);
        },
        onCheckerClick(row, col) {
            this.$root.gameRuler.onCheckerClick(row, col);
        },
        getCellClasses(row, col) {
            return `cell ${row == this.activeCell.row && col == this.activeCell.col ? 'active' : ''}
                ${this.allowedCellsToMoveGroupedIntoObject?.[row]?.[col] === true ? 'allowed-to-move ' : ''}
                ${this.allowedCellsToEatGroupedIntoObject?.[row]?.[col] === true ? 'allowed-to-eat' : ''}`
        }
    },
    computed: {
        boardState() {
            return this.$store.state.board
        },
        allowedCellsToMoveGroupedIntoObject() {
            let result = {}
            this.allowedCellsToMove.map(({row, col}) => {
                if (!result[row]) result[row] = {}
                result[row][col] = true
            })
            return result
        },
        allowedCellsToEatGroupedIntoObject() {
            let result = {}
            this.allowedCellsToEat.map(({row, col}) => {
                if (!result[row]) result[row] = {}
                result[row][col] = true
            })
            return result
        },
        ...mapState(['activeCell', 'allowedCellsToMove', 'allowedCellsToEat']),
        ...mapGetters({allowedCells: 'allowedCellsToMoveAndEat'})
    },
}
</script>

<style>
.checkers-table {
    table-layout: fixed;
    margin: auto;
    border: 4px double #ffc66e;
    min-width: 68vh;
    min-height: 68vh;
}

tr td.cell {
    background-color: rgb(128, 44, 44);
}

tr:nth-child(even) td:nth-child(odd).cell,
tr:nth-child(odd) td:nth-child(even).cell {
    background-color: rgb(218, 206, 98);
}

.cell {
    width: 8vh;
    height: 8vh;
}
.cell.active {
    z-index: 2;
    position:relative;
    -webkit-box-shadow: 0 0 5px 3px rgb(82, 94, 255);
    -moz-box-shadow: 0 0 5px 3px rgb(82, 94, 255);
    box-shadow: 0 0 5px 3px rgb(82, 94, 255);
}

.cell.allowed-to-move {
    z-index: 2;
    position:relative;
    -webkit-box-shadow: 0 0 5px 5px rgb(38, 85, 53);
    -moz-box-shadow: 0 0 5px 5px rgb(38, 85, 53);
    box-shadow: 0 0 7px 7px rgb(212, 229, 223);
}

.cell.allowed-to-eat {
    z-index: 2;
    position:relative;
    -webkit-box-shadow: 0 0 5px 5px rgb(241, 5, 70);
    -moz-box-shadow: 0 0 5px 5px rgb(241, 5, 70);
    box-shadow: 0 0 7px 7px rgb(241, 5, 70);
}

.cell.active > .checker {
    -webkit-box-shadow: 0 0 5px 3px rgb(82, 94, 255);
    -moz-box-shadow: 0 0 5px 3px rgb(82, 94, 255);
    box-shadow: 0 0 5px 3px rgb(82, 94, 255);

}
</style>