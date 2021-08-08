<template>
  <div id="app" class="aw">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about/ee">About</router-link>
      <div>
          <a class="router-link-exact-active">
              <div>
                  <div id="ee">

                  </div>
              </div>
          </a>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
$width: 5em;
// .ff{
//     color: #5cd49e;
// }
// #app{
// color: #000;
// }
// .ff{
//     color: #42b983;
// }
 #nav {
  a {
    &.router-link-exact-active {
    //   color: #42b983;
        #ee{
            color: #000;
        }
    }
  }
}

</style>
