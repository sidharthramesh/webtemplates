<template>
  <div id="app">
    <Form :template="webtemplate"/>
  </div>
</template>

<script>
import Form from './components/Form.vue'
import webtemplate from './../Blood pressure template.json'
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
