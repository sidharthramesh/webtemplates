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
<!-- <pre>{{ formValues }}</pre> -->
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
	},
};
</script>

<style>
</style>