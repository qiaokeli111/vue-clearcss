<template>
    <div >
        <div class="like-image" />
        <div class="rr">
            <div class="ff">

            </div>
        </div>
    </div>
</template>

<script></script>

<style lang="scss">
@import './scss/animation.scss';
@keyframes play {
    0% {
        background-position: left;
    }
    100% {
        background-position: right;
    }
}
.like-image {
    animation-name: play;
}
.rr {
    .ffe {
        animation: mymove 5s infinite;
    }
}
</style>
