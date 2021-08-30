<template>
    <div>
        <div class="like-image" />
        <div class="rr">
            <div class="ff"></div>
        </div>
    </div>
</template>

<script></script>

<style lang="css">
@import url("./animation.css");
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
.ff {
    animation: mymove 5s infinite;
}
</style>
