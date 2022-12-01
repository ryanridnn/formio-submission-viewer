import React, { useState, useEffect } from "react";
import FieldBlocks from './FieldBlocks'

export default class SubmisssioField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  processValue(type, value) {
      let newValue = value

      if(type === 'checkbox') {
          newValue = value ? 'True' : 'False'
      } else if(type === 'selectboxes') {
        newValue = (Object.keys(value) || []).filter(key => !!value[key])
                .map(key => {
                  const match = component.values.find(value => value.value === key)

                  return !!match ? match.label : ''
                })
                .join(', ')
      }

        return newValue
  }

  getObjectValue(components, value) {
    return Object.keys(value).map(key => {
      const match = components.find(comp => comp.key === key)

      if(Array.isArray(value[key])) {
        return value[key].map(val => this.getObjectValue(components, val))
      } else if(typeof value[key] === 'object') {
        return this.getObjectValue(components, value[key])
      } else {
        if(!!match) {
          return {
            label: match.label,
            value: this.processValue(match.type, value[key]) 
          }
        } else {
          return {
            label: key,
            value: value[key]
          }
        }
      }
    })
  }

  getAllInputComponents(components) {
    let inputComponents = []

    if(components) {
      components.forEach(component => {
        if(component.input) {
          inputComponents.push(component)
        }

        const childrenComponents = component.components || component.columns

        const allChildrenComponents = this.getAllInputComponents(childrenComponents)

        if(allChildrenComponents.length > 0) {
          inputComponents = [...inputComponents, ...allChildrenComponents]
        }
      })
    }

    return inputComponents
  }

  render() {
    const component = this.props.component;

    let value = this.processValue(component.dataType, component.fieldValue)

    const bgColor = component.isInsideOfLayout ? '#5046E626' : '#263145';
    const labelBgColor = component.isInsideOfLayout ? '#5046E61A' : '#2B3851';
    const isInsideOfLayout = component.isInsideOfLayout

    const inputComponents = this.getAllInputComponents(component.components)

    if(Array.isArray(value)) {
        value = value.map(val => this.getObjectValue(inputComponents, val))
    } else if(typeof value === 'object') {
        value = this.getObjectValue(inputComponents, value)
    }

    return (
      <FieldBlocks label={component.label} value={value} isInsideOfLayout={isInsideOfLayout} />
    );
  }
}