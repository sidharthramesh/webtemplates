function handleInput(input) {
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
    let newInput = { ...input, type: typeMap[input.type], validation: undefined }
    if (newInput.type == "select") {
        newInput = { ...newInput, options: newInput.list, placeholder: "Select" }
    }
    return newInput
}

function extractInputs(tree, path = '', parentName) {
    let { max, children, id, inputs, name, rmType, inContext, annotations } = tree
    if (inContext) {
        return
    }
    let newPath = `${path}/${id}`
    name = name || id
    let inEvent = false
    if (['EVENT', 'POINT_EVENT'].includes(rmType)) {
        inEvent = true
        name = `${parentName} (${name})`
    }
    if (max > 1 || max == -1 || inEvent) {
        let repeatable = false
        let label
        if (max > 1 || max == -1) {
            repeatable = true
        }
        if (children) {
            children = children
                .map(child => extractInputs(child, path = '', parentName = name))
                .filter(i => i)
                .flat()
            label = name
        } else {
            tree.max = 0
            tree.id = ''
            children = extractInputs(tree, path='', parentName = name)
        }

        return {
            type: 'group',
            name: newPath,
            label,
            repeatable,
            children
        }
    }
    if (inputs) {
        inputs = inputs.map(input => handleInput(input))
        if (inputs.length > 1) {
            let children = inputs.map(input => ({
                ...input,
                name: input.suffix,
            }))
            return {
                type: 'group',
                name: newPath,
                label: name,
                children,
            }
        } else {
            return inputs.map(input => {
                let path = newPath
                if (input.suffix) {
                    path = `${newPath}|${input.suffix}`
                }
                return {
                    ...input,
                    label: name,
                    name: path
                }
            })
        }
    }
    if (children) {
        return children
            .map(child =>
                extractInputs(child, newPath, name))
            .filter(i => i)
            .flat()
    }
    if (annotations) {
        let { snomed } = annotations
        if (snomed) {
            return {
                type: "snomed",
                label: name,
                name: newPath,
                eql: snomed,
                options: [
                    { value: 1, label: 'Jon Doe' },
                    { value: 2, label: 'Jane Roe' },
                    { value: 3, label: 'Bob Foe' },
                    { value: 4, label: 'Ben Cho' },
                ]
            }
        }
    }
}

function generateSchema(template) {
    let { tree } = template
    let schema = extractInputs(tree)
    return schema
}

function flattenForm(schema, formValues) {
    let flatValues = {}
    // Walk through all elements in schema
    // Check for item in formValues
    // Check for children if group
    // Add path:0 if multiple
    // Add path|suffix if not multiple,
    // Push to flatform based on type
    schema.forEach(obj => {
        let { name, type, multiple } = obj
        let currentValue = formValues[name]
        if (currentValue) {
            if (type === 'group') {
                if (multiple) {
                    // let path = name + ':0'
                    formValues[name]
                }
            }
        }
    })

    return flatValues
}

export { generateSchema, flattenForm }