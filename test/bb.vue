<template>
    <div
        id="app"
        class="aw"
        :sf="er"
       :class="oo"
       
    >
        <div id="nav"  :class="['main-container',isNewYearTheme?'newYear-theme':'']"
        >
            <router-link to="/">Home</router-link> |
            <router-link to="/about/ee">About</router-link>
            <div class="tt ss">
                <a class="router-link-exact-active">
                    <div>
                        <div id="ee"></div>
                    </div>
                </a>
            </div>
        </div>
        <router-view />
    </div>
</template>
<script>
export default {
mounted() {

},
data() {
 return {
    isNewYearTheme:true,
    oo:['main-container',isNewYearTheme?'newYear-theme':'']
 };
},
methods: {

},
}
</script>

<style lang="scss">
$width: 5em;
[sf=44]{
    color: #000;
}
// #nav {
//     .ss {
//         .router-link-exact-active {
//             color: #42b983;
//         }
//     }
// }
</style>
