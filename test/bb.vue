<template>
    <div
        id="app"
        class="aw"
        :class="{
            'main-container': true,
            'newYear-theme': isNewYearTheme,
            'year-100-party': is100YearsParty,
        }"
        
    >
        <div id="nav">
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

<style lang="scss">
$width: 5em;
#nav {
    .ss {
        .router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
