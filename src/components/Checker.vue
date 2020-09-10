<template>
  <div :class="checkerClasses"></div>
</template>

<script>
export default {
    props: {
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
    background-color: #ffc66e;
    border: dashed black 3px;
}

.checker.king.black {
    background-color: #5d3900;
    border: dashed white 3px;
}

.is-going-to-be-eaten {
    opacity: 30%;
}
</style>