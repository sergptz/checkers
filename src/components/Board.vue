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
                v-for="(cellValue, col) in rowState" :data-id="row + '_' + col" :key="'cell:' + row + '_' + col" align="center" :class="getCellClasses(row, col)">
<!--                                :class="{'cell': 1, 'active': (row == activeCell.row && col == activeCell.column), 'allowed': allowedCells[row] && allowedCells[row][col] === true}"-->
                <Checker v-if="cellValue" :color="cellValue.color" :is-king="cellValue.isKing" @click.native.stop="onCheckerClick(row, col)"/>
                <!--                <div v-if="cell!=0" :class="{'checker': 1, 'white': cell == 1, 'black': cell == 2}"></div>-->
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
                ${this.allowedCells[row] && this.allowedCells[row][col] === true ? 'allowed' : ''}`
        }
    },
    computed: {
        boardState() {
            return this.$store.state.board
        },
        ...mapState(['activeCell']),
        ...mapGetters(['allowedCells'])
    },
}
</script>

<style>
.checkers-table {
    table-layout: fixed;
}

tr td {
    background-color: rgb(128, 44, 44);
}

tr:nth-child(even) td:nth-child(odd),
tr:nth-child(odd) td:nth-child(even) {
    background-color: rgb(218, 206, 98);
}

.cell {
    width: 8vw;
    height: 8vw;
}
.cell.active {
    z-index: 2;
    position:relative;
    -webkit-box-shadow: 0 0 5px 3px rgb(82, 94, 255);
    -moz-box-shadow: 0 0 5px 3px rgb(82, 94, 255);
    box-shadow: 0 0 5px 3px rgb(82, 94, 255);
}

.cell.allowed {
    z-index: 2;
    position:relative;
    -webkit-box-shadow: 0 0 5px 5px rgb(38, 85, 53);
    -moz-box-shadow: 0 0 5px 5px rgb(38, 85, 53);
    box-shadow: 0 0 7px 7px rgb(212, 229, 223);
}

.cell.active > .checker {
    -webkit-box-shadow: 0 0 5px 3px rgb(82, 94, 255);
    -moz-box-shadow: 0 0 5px 3px rgb(82, 94, 255);
    box-shadow: 0 0 5px 3px rgb(82, 94, 255);

}
</style>