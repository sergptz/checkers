<template>
    <div id="app">
        <h1>Checkers by Serega</h1>
        <Checkers/>
    </div>
</template>

<script>
import Checkers from './components/Checkers.vue'

export default {
    components: {
        Checkers
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

html {
    width: 100%;
    background: linear-gradient(244deg, #38bf9c, #ec431d, #341dec, #a49ce1);
    background-size: 800% 800%;

    animation: BackgroundGradientAnimation 60s ease infinite;
}

@keyframes BackgroundGradientAnimation {
    0%{background-position:33% 0%}
    50%{background-position:68% 0%}
    100%{background-position:33% 0%}
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
