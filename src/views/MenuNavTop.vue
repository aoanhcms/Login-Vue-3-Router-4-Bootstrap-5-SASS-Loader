<template>
  <router-view />
</template>

<script>
export default {
  name: 'MenuNavTop',
  components: {
  },
  methods: {
    isLoggedIn: () => {
      return localStorage.getItem("authOnly");
    },
    logout() {
      localStorage.clear();
      this.$router.push({ path: '/logout' });
    }
  },
}
</script>