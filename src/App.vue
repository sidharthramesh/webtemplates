<template>
  <div id="app">
    <Form :template="webtemplate"/>
  </div>
</template>

<script>
import Form from './components/Form.vue'
import webtemplate from './webtemplate.json'
export default {
  name: 'App',
  components: {
    Form
  },
  data(){
    return {
      webtemplate
    }
  }
}
</script>
