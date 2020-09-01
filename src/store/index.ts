import Vue from 'vue'
import Vuex from 'vuex'
import Checker from "@/GameLogic/Checker";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        board: null,
        activeCell: {
            row: null,
            col: null
        },
        whoseMove: 'white'
    },
    getters: {
        allowedCells(state) {
            return {}
        },
    },
    mutations: {
        SET_BOARD_STATE: (state, payload) => {
            state.board = payload
        },
        REMOVE_CHECKER: ({board}, {row, col}): void => {
            Vue.set(board[row], col, null)
        },
        SET_ACTIVE_CELL: (state, {row, col}) => {
            state.activeCell = {
                row,
                col
            }
        },
        CLEAR_ACTIVE_CELL: (state) => {
            state.activeCell = {
                row: null,
                col: null
            }
        },
        SET_WHOSE_MOVE: (state, {whoseMove}) => {
            state.whoseMove = whoseMove
        }
    },
    actions: {
        getCheckerByCoords({state}, {row, col}): Checker | null {
            return state.board[row][col]
        },
        moveChecker({state, commit, dispatch}, {fromRow, fromCol, toRow, toCol}) {
            const checker = dispatch('getCheckerByCoords', fromRow, fromCol)
            if (checker == null) throw new Error(`There is no checker in coords ${fromRow}:${fromCol}`)
            commit('SET_CHECKER', {row: toRow, col: toCol, checker})
            dispatch('removeChecker', {row: fromRow, col: fromCol})
        },
        removeChecker({state, commit}, {row, col}) {
            if (!state.board[col][row]) throw new Error(`There is no checker in coords ${row}:${col}`)
            commit('REMOVE_CHECKER', {row, col})
        },
        setWhoseMove({commit}, {whoseMove}) {
            commit('SET_WHOSE_MOVE', {whoseMove})
        },
        setActiveCell({commit}, {row, col}) {
            commit('SET_ACTIVE_CELL', {row, col})
        },
        clearActiveCell({commit}) {
            commit('CLEAR_ACTIVE_CELL')
        }
    }
})
