<template>
	<section class="section">
		<div class="columns">
			<div class="column is-4">
				<div class="box">
					<h2 class="is-size-5 has-text-weight-bold">{{ template.tree.name }}</h2>
					<hr>
					<FormulateForm v-model="formValues" :schema="schema" name="composition" @submit="submit">
							<div class="buttons">
								<button class="button is-success" type="submit">Submit</button>
								<button class="button" type="button">Reset</button>
							</div>
					</FormulateForm>
				</div>
			</div>
		</div>
		<div class="columns">
			<div class="column">
<pre>{{ formValues }}</pre>
			</div>
			<div class="column">
<pre>{{schema}}</pre>
			</div>
		</div>
		
	</section>
</template>

<script>
import {generateSchema} from './webtemplates'
export default {
	props: ["template"],
	data() {
		return {
			formValues: {},
			schema: generateSchema(this.template),
		};
	},
	methods: {
		submit(){
			console.log(this.flattened)
		}
	},
	computed: {
		// flattened(){
		// 	let aqlValues = {}
		// 	Object.values(this.formValues).forEach(values => {
		// 		let value = values[0]
		// 		Object.keys(value).forEach(aqlPath=>{
		// 			let result = value[aqlPath]
		// 			if (typeof result == 'object') {
		// 				let r = result[0]
		// 				Object.keys(r).forEach(suffix=>{
		// 					aqlValues[`${aqlPath}|${suffix}`] = r[suffix]
		// 				})
		// 			} else {
		// 				aqlValues[aqlPath] = result
		// 			}
		// 		})
		// 		})
		// 	return aqlValues
		// }
	},
};
</script>

<style>
</style>