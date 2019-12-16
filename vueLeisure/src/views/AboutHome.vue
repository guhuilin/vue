<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.console();
  },
  methods: {
    console() {
      console.log(process.env, '.....');
    },
  },
};
</script>
