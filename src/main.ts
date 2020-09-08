import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import GameRuler from './GameLogic/GameRuler'
import GameSession from './GameLogic/GameSession'

Vue.config.productionTip = false

const gameSession = new GameSession(store);
gameSession.initializeSession();
const checkersGame = new GameRuler(gameSession);

new Vue({
    router,
    store,
    render: h => h(App),
    data() {
        return {
            gameRuler: checkersGame
        }
    }
}).$mount('#app')