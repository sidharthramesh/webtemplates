<template>
	<section class="section">
		<div class="columns">
			<div class="column is-4">
				<div class="box">
					<h2 class="subtitle">{{ template.tree.name }}</h2>
					<FormulateForm v-model="formValues" :schema="schema">
						<FormulateInput type="submit" input-class="button is-success is-fullwidth">
							Submit
						</FormulateInput>
					</FormulateForm>
				</div>
			</div>
		</div>
		<pre>{{ flattened }}</pre>
	</section>
</template>

<script>
import {getFormulateSchema} from './webtemplates'
export default {
	props: ["template"],
	data() {
		return {
			formValues: {},
			schema: getFormulateSchema(this.template)
		};
	},
	methods:{
		
	},
	computed: {
		flattened(){
			console.log("hello")
			let aqlValues = {}
			Object.values(this.formValues).forEach(values => {
				let value = values[0]
				Object.keys(value).forEach(aqlPath=>{
					let result = value[aqlPath]
					if (typeof result == 'object') {
						let r = result[0]
						Object.keys(r).forEach(suffix=>{
							aqlValues[`${aqlPath}|${suffix}`] = r[suffix]
						})
					} else {
						aqlValues[aqlPath] = result
					}
				})
				})
			return aqlValues
		}
	},
};
</script>

<style>
</style>