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
        allowedCellsToMove: [],
        allowedCellsToEat: [],
        whoseMove: 'white'
    },
    getters: {
        allowedCellsToMoveAndEat({allowedCellsToMove, allowedCellsToEat}) {
            return allowedCellsToMove.concat(allowedCellsToEat)
        }
    },
    mutations: {
        SET_BOARD_STATE: (state, payload) => {
            state.board = payload
        },
        SET_CHECKER: (state, {row, col, checker}) => {
            state.board[row][col] = checker
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
        SET_WHOSE_MOVE: (state, {color}) => {
            state.whoseMove = color
        },
        SET_ALLOWED_CELLS_TO_MOVE: (state, cells) => {
            state.allowedCellsToMove = cells
        },
        SET_ALLOWED_CELLS_TO_EAT: (state, cells) => {
            state.allowedCellsToEat = cells
        }
    },
    actions: {
        getCheckerByCoords({state}, {row, col}): Checker | null {
            return state?.board?.[row]?.[col] || null
        },
        moveChecker({state, commit, dispatch}, {fromRow, fromCol, toRow, toCol}) {
            const checker = state.board[fromRow][fromCol]
            if (checker == null) throw new Error(`There is no checker in coords ${fromRow}:${fromCol}`)
            commit('SET_CHECKER', {row: toRow, col: toCol, checker})
            dispatch('removeChecker', {row: fromRow, col: fromCol})
        },
        removeChecker({state, commit}, {row, col}) {
            if (!state.board[row][col]) throw new Error(`There is no checker in coords ${row}:${col}`)
            commit('REMOVE_CHECKER', {row, col})
        },
        setWhoseMove({commit}, color) {
            commit('SET_WHOSE_MOVE', {color})
        },
        setActiveCell({commit}, {row, col}) {
            commit('SET_ACTIVE_CELL', {row, col})
        },
        clearActiveCell({commit}) {
            commit('CLEAR_ACTIVE_CELL')
        },
        setAllowedCellsToMove({commit}, {cells}) {
            commit('SET_ALLOWED_CELLS_TO_MOVE', cells)
        },
        setAllowedCellsToEat({commit}, {cells}) {
            commit('SET_ALLOWED_CELLS_TO_EAT', cells)
        },
        clearAllowedCellsToMoveAndEat({commit}) {
            commit('SET_ALLOWED_CELLS_TO_MOVE', [])
            commit('SET_ALLOWED_CELLS_TO_EAT', [])
        }
    }
})
