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
        <tr v-for="(rowState, i) in boardState">
            <td @click="onCellClick"
                v-for="(cellValue, j) in rowState" :data-id="i + '_' + j" :key="'cell:' + i + '_' + j" align="center" :class="getCellClasses(i, j)">
<!--                                :class="{'cell': 1, 'active': (i == activeCell.row && j == activeCell.column), 'allowed': allowedCells[i] && allowedCells[i][j] === true}"-->
                <Checker v-if="cellValue" :color="cellValue.color" :is-king="cellValue.isKing" @click="onCheckerClick"/>
                <!--                <div v-if="cell!=0" :class="{'checker': 1, 'white': cell == 1, 'black': cell == 2}"></div>-->
            </td>
        </tr>
    </table>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import Checker from "@/components/Checker";

export default {
    components: {
        Checker
    },
    data() {
        return {
            activeCell: {
                row: 1,
                column: 2
            },
            // TODO Надо переводить это в хранилище, шоб это было реактивно. То же и с activeCell
            allowedCells: {3: {3: true, 0: true}}
        }
    },
    methods: {
        onCellClick() {
            alert(456)
        },
        onCheckerClick() {

        },
        getCellClasses(i, j) {
            return `cell ${i == this.activeCell.row && j == this.activeCell.column ? 'active' : ''} ${this.allowedCells[i] && this.allowedCells[i][j] === true ? 'allowed' : ''}`
        }
    },
    computed: {
        boardState() {
            return this.$store.state.board
        },
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