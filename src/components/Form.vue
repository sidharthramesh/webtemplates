<template>
	<div>
		<h1>Tree</h1>
		<p>{{ template.tree }}</p>
		<h1>Visible Input</h1>
		<p>{{ visibleInputs[3] }}</p>
		<FormulateForm v-model="formValues" :schema="formulateSchema">
		</FormulateForm>
		<p>{{ formValues }}</p>
	</div>
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
				DATETIME: "datetime-local",
			};
			let inputs = this.visibleInputs.map((visibleInput) => {
				let { inputs } = visibleInput;
				inputs = inputs.map((input) => {
					input = { ...input, type: typeMap[input.type] };
					if (input.type == "select") {
						return { ...input, options: input.list };
					} else {
						return input;
					}
				});
				return { ...visibleInput, inputs: inputs };
			});
			let schema = inputs.map((input) => {
				if (input.inputs.length > 1) {
					return {
						type: "group",
						label: input.name,
						name: input.aqlPath,
						children: input.inputs.map((i) => ({ ...i, name: i.suffix })),
					};
				} else {
					let i = input.inputs[0];
					return { ...i, label: input.name, name: input.aqlPath };
				}
			});
			return schema;
		},
	},
};
</script>

<style>
</style>