<template>
  <TemplateTop />
  <div class="container pb-3">
    <slot name="slotPageComponet"></slot>
  </div>
  <div class="container">
    <TemplateRodape />
  </div>
</template>
  
<script>
// @ is an alias to /src
import TemplateTop from '@/views/TemplateTop.vue'
import TemplateRodape from '@/views/TemplateRodape.vue'

export default {
  name: 'templateView',
  components: {
    TemplateRodape,
    TemplateTop,
  },
  data() {
    return {
      isLoading: false
    }
  },

}
</script>
