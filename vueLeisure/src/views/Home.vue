<template>
  <div class="home">
    <App msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import App from '@/components/App.vue';

export default {
  name: 'home',
  components: {
    App,
  },
};
</script>
