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
        whoseMove: 'white',
        justAte: false,
        message: ''
    },
    getters: {
        allowedCellsToMoveAndEat({allowedCellsToMove, allowedCellsToEat}) {
            return allowedCellsToMove.concat(allowedCellsToEat)
        },
        getCheckersOfCurrentPlayer: ({board, whoseMove}) => {
            return board.flat().filter(checker => checker && checker.color === whoseMove)
        },
        getCheckersOfEnemyPlayer: ({board, whoseMove}) => {
            return board.flat().filter(checker => checker && checker.color !== whoseMove)
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
        SET_JUST_ATE: (state, justAte) => {
            state.justAte = justAte
        },
        SET_ALLOWED_CELLS_TO_MOVE: (state, cells) => {
            state.allowedCellsToMove = cells
        },
        SET_ALLOWED_CELLS_TO_EAT: (state, cells) => {
            state.allowedCellsToEat = cells
        },
        SET_MESSAGE: (state, message) => {
            state.message = message
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
        setJustAte({commit}, {justAte}) {
            commit('SET_JUST_ATE', justAte)
        },
        clearAllowedCellsToMoveAndEat({commit}) {
            commit('SET_ALLOWED_CELLS_TO_MOVE', [])
            commit('SET_ALLOWED_CELLS_TO_EAT', [])
        },
        setMessage({commit}, {message}) {
            commit('SET_MESSAGE', message);
        }
    }
})
