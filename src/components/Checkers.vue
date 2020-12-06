<template>
    <div>
        <h3>Current player: <span class="player-color">{{currentPlayerColor}}</span></h3>
        <div class="user-message-block">
            <h3>{{message}}</h3>
        </div>
        <board/>
    </div>
</template>

<script>
import Board from './Board'
import {mapState} from 'vuex'

export default {
    components: {
        Board
    },
    computed: {
        currentPlayerColor() {
            let color = this.whoseMove
            return color = color[0].toUpperCase() + color.slice(1)
        },
        ...mapState(['whoseMove', 'message'])
    }
}
</script>

<style>
.player-color {
    border-bottom: 4px solid #ffc66e;
}

.user-message-block {
    min-height: 2.5rem;
}
</style>