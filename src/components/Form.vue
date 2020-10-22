<template>
	<section class="section">
		<div class="columns">
			<div class="column">
				<div class="box">
					<h2 class="subtitle">{{ template.tree.name }}</h2>
					<FormulateForm v-model="formValues" :schema="formulateSchema">
						<FormulateInput type="submit" input-class="button is-success is-fullwidth">
							Submit
						</FormulateInput>
					</FormulateForm>
				</div>
			</div>
		</div>
		<pre>{{ formValues }}</pre>
	</section>
</template>

<script>
export default {
	props: ["template"],
	data() {
		return {
			formValues: {},
		};
	},
	computed: {
		visibleInputs() {
			let visibleInputs = [];
			if (!this.template) {
				return visibleInputs;
			}
			function treeWalk(tree) {
				if (tree.inputs) {
					let { inputs, aqlPath, inContext, name } = tree;

					if (!inContext) {
						visibleInputs = [...visibleInputs, { inputs, aqlPath, name }];
					}
				}
				if (tree.children) {
					tree.children.forEach((t) => treeWalk(t));
				} else {
					return;
				}
			}
			treeWalk(this.template.tree);
			return visibleInputs;
		},
		formulateSchema() {
			let typeMap = {
				TEXT: "text",
				CODED_TEXT: "select",
				DECIMAL: "number",
				INTEGER: "number",
				DATETIME: "datetime-local",
				DATE: "date",
				TIME: "time",
				BOOLEAN: "checkbox"
			};
			let schema = this.visibleInputs.map((visibleInput) => {
				let { inputs, name, aqlPath } = visibleInput;
				// Type transformation
				inputs = inputs.map((input) => ({
					...input,
					type: typeMap[input.type],
				}));
				// Specific transformations
				inputs = inputs.map((input) => {
					let { type, list } = input;
					if (type === "select") {
						input = { ...input, options: list };
					}
					return input;
				});
				// Styling transformations
				inputs = inputs.map((input) => {
					let elementClass;
					if (input.type === "select") {
						elementClass = "select";
					} else {
						elementClass = "control";
					}
					return {
						...input,
						"outer-class": "field",
						"label-class": "label",
						"input-class": "input",
						"element-class": elementClass,
					};
				});
				if (inputs.length > 1) {
					// Some styling changes for groups
					inputs = inputs.map((input) => ({
						...input,
						name: input.suffix,
						"wrapper-class": "field",
						"outer-class": "column",
					}));
					inputs = inputs.map(input=>{
						if (input.type != "select") {
							return {...input, placeholder: input.suffix}
						} else {
							return input
						}
					})
					let group = {
						type: "group",
						children: inputs,
						label: name,
						name: aqlPath,
						"outer-class": "field",
						"label-class": "label",
						"groupRepeatable-class": "columns",
					};
					return group;
				} else {
					return { ...inputs[0], label: name, name: aqlPath };
				}
			});
			return schema;
		},
	},
};
</script>

<style>
</style>