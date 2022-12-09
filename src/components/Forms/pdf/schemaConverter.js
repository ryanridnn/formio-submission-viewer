import _ from 'lodash'

function valueConverter(component, value) {
	let newValue = value

    if(component.type === 'checkbox') {
        newValue = value ? 'True' : 'False'
    } else if(component.type === 'selectboxes') {
      newValue = (Object.keys(value) || []).filter(key => !!value[key])
              .map(key => {
                const match = component.values.find(value => value.value === key)

                return !!match ? match.label : ''
              })
              .join(', ')
    }

    return newValue
}

const checkSpecialCompType = (component) => {
	return ['selectboxes', 'checkbox'].includes(component.type)
}

export default function schemaConverter(components, data) {
	let pickedComponentKeys = []

	let convertedSchema = Object.keys(data).map(key => {
		const value = data[key]

		const matchComp = (components || []).find(comp => comp.key === key)

		if(!!matchComp) {
			pickedComponentKeys.push(matchComp.key)

			if(Array.isArray(value)) {
				return {
					label: matchComp.label,
					value: checkSpecialCompType(matchComp) ? valueConverter(matchComp, value) : value.map(val => schemaConverter(matchComp.components, val)),
					index: components.indexOf(matchComp)
				}
			} else if(typeof value === 'object') {
				return {
					label: matchComp.label,
					value: checkSpecialCompType(matchComp) ? valueConverter(matchComp, value) : schemaConverter(matchComp.components, value),
					index: components.indexOf(matchComp)
				}
			} else {
				return {
					label: matchComp.label,
					value: valueConverter(matchComp, value),
					index: components.indexOf(matchComp)
				}
			}
		} else {
			const compWithComps = (components || []).filter(comp => ((comp.components && comp.components.length > 0) || (comp.columns && comp.columns.length > 0)) && !pickedComponentKeys.includes(comp.key))

			if(compWithComps.length > 0) {
				const childrenMatch = compWithComps.map(comp => schemaConverter(comp.components || comp.columns, { [key]: value })[0] )

				let match
				let matchIndex

				if(match = childrenMatch.find((child, childIndex) => {
					if(!child.noMatch) {
						matchIndex = childIndex
						return true
					} else {
						return false
					}
				})) {
					const parentCompIndex = components.indexOf(compWithComps[matchIndex])

					return { 
						...match,
						index: parentCompIndex + match.index / compWithComps[matchIndex].components.length
					}
				} else {
					return childrenMatch[0]
				}
			} else {
				return {
					label: key,
					value: value,
					noMatch: true,
				}
			}
		}
	})

	convertedSchema = convertedSchema.sort((compA, compB) => compA.index - compB.index).map(comp => _.omit(comp, 'index'))

	return convertedSchema
}