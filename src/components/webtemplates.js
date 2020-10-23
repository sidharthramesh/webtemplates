function getVisibleInputs(template){
    let visibleInputs = [];
    if (!template) {
        return visibleInputs;
    }
    let group
    function treeWalk(tree) {
        if (tree.rmType === 'OBSERVATION') {
            group = { name: tree.name, id: tree.id }
        }
        if (tree.inputs) {
            let { inputs, aqlPath, inContext, name } = tree;

            if (!inContext) {
                visibleInputs = [...visibleInputs, { inputs, aqlPath, name, group }];
            }
        }
        if (tree.children) {
            tree.children.forEach((t) => treeWalk(t));
        } else {
            return;
        }
    }
    treeWalk(template.tree);
    return visibleInputs;
}

function getFormulateSchema(template, defaultFirstSelect=false){
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
    let visibleInputs = getVisibleInputs(template)
    let schema = visibleInputs.map((visibleInput) => {
        let { inputs, name, aqlPath, group } = visibleInput;
        // Type transformation
        inputs = inputs.map((input) => ({
            ...input,
            validation: null,
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
        // Default first option in selection input
        if (!defaultFirstSelect){
            inputs = inputs.map(input => {
                if (input.type == "select") {
                    let placeholder
                    if (input.suffix) {
                        placeholder = input.suffix 
                    } else {
                        placeholder = 'Select'
                    }
                    return {...input, placeholder}
                } else {
                    return input
                }
            })
        }
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
            let inputGroup = {
                type: "group",
                children: inputs,
                label: name,
                name: aqlPath,
                group,
                "outer-class": "field",
                "label-class": "label",
                "groupRepeatable-class": "columns",
            };
            return inputGroup;
        } else {
            let input = inputs[0]
            let path = aqlPath
            if (input.suffix){
                path = `${aqlPath}|${input.suffix}`
            }
            return { ...input, label: name, name: path, group };
        }
    });
    let groupedSchema = {}
    let groupNames = {}
    schema.forEach(groupedField => {
        let { group, ...field } = groupedField
        if (groupedSchema[group.id]) {
            groupedSchema[group.id].push(field)
        } else {
            groupedSchema[group.id] = [field]
            groupNames[group.id] = group.name
        }
    })
    console.log(groupedSchema)
    groupedSchema = Object.keys(groupedSchema).map(group => {
        return {
            type: 'group',
            name: group,
            label: groupNames[group],
            "outer-class": "field",
            "label-class": "has-text-grey has-text-weight-semibold",
            children: groupedSchema[group]
        }
    })
    return groupedSchema
}

export {getFormulateSchema}