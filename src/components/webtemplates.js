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
    let newInput = {...input, type: typeMap[input.type], validation: undefined}
    if (newInput.type == "select"){
        newInput = {...newInput, options: newInput.list}
    }
    return newInput
}

function extractInputs(tree, path = '', parentName = null) {
    let { max, children, id, inputs, name, rmType, inContext } = tree
    if (inContext){
        return
    }
    name = name || id
    let newPath = `${path}/${id}`
    if (max > 1 || max == -1) {
        if (['EVENT', 'POINT_EVENT'].includes(rmType)) {
            name = parentName
        }
        return {
            type: 'group',
            // repeatable: true,    
            multiple: true,
            name: newPath,
            label: name,
            children: children
                .map(child => extractInputs(child, path='', parentName=name))
                .filter(i => i)
                .flat(),
        }
    }
    if (inputs) {
        inputs = inputs.map(input=>handleInput(input))
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
}

function generateSchema(template) {
    let { tree } = template
    let schema = extractInputs(tree)
    return schema
}

function flattenForm(schema, formValues){
    let flatValues = {}
    // Walk through all elements in schema
    // Check for item in formValues
    // Check for children if group
    // Add path:0 if multiple
    // Add path|suffix if not multiple,
    // Push to flatform based on type
    schema.forEach(obj=>{
        let {name, type, multiple} = obj
        let currentValue = formValues[name]
        if (currentValue){
            if (type === 'group'){
                if (multiple) {
                    let path = name + ':0'
                    formValues[name]
                }
            }
        }
    })
    
    return flatValues
}

export { generateSchema, flattenForm }