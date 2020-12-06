<template>
  <div :class="checkerClasses"></div>
</template>

<script>
export default {
    props: {
        id: {
            type: Number
        },
        color: {
            type: String,
            validator: function(value) {
                return ['white', 'black'].includes(value)
            }
        },
        isKing: {
            type: Boolean,
            default: false
        },
        isGoingToBeEatenAtTheEndOfTheMove: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        checkerClasses() {
            return `checker ${this.color} ${this.isKing ? 'king' : ''} ${this.isGoingToBeEatenAtTheEndOfTheMove ? 'is-going-to-be-eaten' : ''}`
        }
    }
}
</script>

<style>
.checker {
    width:  70%;
    height: 70%;
    border-radius: 50%;
}
.checker.white {
    background-color: white;
    border: solid black 1px;
}

.checker.black {
    background-color: black;
    border: solid white 1px;
}

.checker.king.white {
    border: inset black 3px;
    background: linear-gradient(36deg, rgba(147,194,255,1) 0%, rgba(255,255,255,0.9836309523809523) 100%);
}

.checker.king.black {
    border: outset white 3px;
    background: linear-gradient(36deg, rgba(251,85,67,1) 0%, rgba(0,0,0,0.9836309523809523) 100%);
}

.is-going-to-be-eaten {
    opacity: 30%;
}
</style>