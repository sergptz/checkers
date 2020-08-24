import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        board: null
    },
    getters: {},
    mutations: {
        SET_BOARD_STATE: (state, payload) => {
            state.board = payload
        },
        REMOVE_CHECKER: ({board}, {x, y}): void => {
            Vue.set(board[y], x, null)
        }
    },
    actions: {
        removeChecker({state, commit}, {x, y}) {
            if (!state.board[y][x]) throw new Error(`There is no checker in coords ${x}:${y}`)
            this.commit('REMOVE_CHECKER', {x, y})
        }
    }
})
