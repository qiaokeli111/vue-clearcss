<template>
  <div id="app" class="aw">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about/ee">About</router-link>
      <div>
          <a class="router-link-exact-active"></a>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
$width: 5em;
 #nav {
  a {
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

</style>
