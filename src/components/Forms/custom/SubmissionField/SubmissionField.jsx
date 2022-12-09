import React, { useState, useEffect } from "react";
import FieldBlocks from './FieldBlocks'
import _ from 'lodash'

export default class SubmisssioField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  convertData(components = [], data) {
    let pickedComponentKeys = []

    if(!data) return data

    let newData = Object.keys(data).map(key => {
      const value = data[key]

      const matchComp = (components || []).find(comp => comp.key === key)

      if(!!matchComp) {
        pickedComponentKeys.push(matchComp.key)

        const convertedData = this.convertValue(matchComp, value)

        if(Array.isArray(value)) {
          return { 
            label: matchComp.label, 
            value: convertedData.converted ? convertedData.value : value.map(val => this.convertData(components, val)),
            index: components.indexOf(matchComp),
            dataType: matchComp.dataType || matchComp.type
          }
        } else if(typeof value === 'object') {
          return { 
            label: matchComp.label,
            value: convertedData.converted ? convertedData.value : this.convertData(components, value),
            index: components.indexOf(matchComp),
            dataType: matchComp.dataType || matchComp.type
          } 
        } else {
          return {
            label: matchComp.label,
            value: convertedData.value,
            index: components.indexOf(matchComp),
            dataType: matchComp.dataType || matchComp.type,
          }
        }
      } else {
        const compWithComps = (components || []).filter(comp => ((comp.components && comp.components.length > 0) || (comp.columns && comp.columns.length > 0)) && !pickedComponentKeys.includes(comp.key))

        if(compWithComps.length > 0) {
          const childrenMatch = compWithComps.map(comp => this.convertData(comp.components || comp.columns, { [key]: value })[0] )

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
            const parentComp = compWithComps[matchIndex]

            const parentCompIndex = components.indexOf(parentComp)
            const childrenLength = (compWithComps[matchIndex].components || compWithComps[matchIndex].columns)?.length
            const columnIndex = parentComp.size && parentComp.width ? parentCompIndex : false

            let returnedMatch =  { 
              ...match,
              index: parentCompIndex + match.index / childrenLength,
            }

            if(typeof columnIndex === 'number' || typeof match.columnIndex === 'number') {
              returnedMatch =  { 
                ...returnedMatch,
                columnIndex: typeof match.columnIndex === 'number' ? match.columnIndex :  columnIndex,
                columnKey: !!match.columnKey ? match.columnKey : (typeof match.columnIndex === 'number' ? parentComp.key : false)
              }
            }

            if(typeof returnedMatch.columnIndex === 'number') {
              returnedMatch = {
                ...returnedMatch,
                columnSize: typeof match.columnSize === 'string' ? match.columnSize : parentComp.size,
                columnWidth: typeof match.columnWidth === 'number' ? match.columnWidth : parentComp.width,
              }
            }

            return returnedMatch
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

    const columnComponents = newData.filter(comp => comp.columnKey)
    const columns = []

    if(columnComponents.length > 1) {
      columnComponents.forEach((comp) => {
        let column

        if(columns.every(col => col.key !== comp.columnKey)) {
          columns.push({
            dataType: 'column',
            key: comp.columnKey,
            value: [],
            index: comp.index
          })

          columns[columns.length - 1].value[comp.columnIndex] = {
            width: comp.columnWidth,
            size: comp.columnSize,
            value: [_.omit(comp, 'columnSize', 'columnWidth', 'columnIndex', 'columnKey')]
          }

        } else if(column = columns.find(col => col.key === comp.columnKey)) {
          if(!!column.value[comp.columnIndex]) {
            column.value[comp.columnIndex].value.push(_.omit(comp, 'columnSize', 'columnWidth', 'columnIndex', 'columnKey'))
          } else {
            column.value[comp.columnIndex] = {
              width: comp.columnWidth,
              size: comp.columnSize,
              value: [_.omit(comp, 'columnSize', 'columnWidth', 'columnIndex', 'columnKey')]
            }
          }

          column.index = Math.min(column.index, comp.index)
        }
      })

      columns.forEach((column, columnIndex) => {
        column.value.forEach(innerCol => {
          innerCol.value = innerCol.value.sort((compA, compB) => compA.index - compB.index).map(comp => _.omit(comp, 'index'))
        })
      })

      newData = newData.filter(comp => !columnComponents.includes(comp))

      columns.forEach(column => {
        newData.push(column)
      })
    } 

    if(newData.length > 1) {
      newData = newData.sort((compA, compB) => compA.index - compB.index).map(comp => _.omit(comp, 'index'))
    }

    return newData
  }

  convertValue(component, value) {
    const type = component.dataType || component.type
    let newValue = value
    let converted = false

    if(type === 'checkbox') {
        converted = true
        newValue = value ? 'True' : 'False'
    } else if(type === 'selectboxes') {
        converted = true
        newValue = (Object.keys(value) || []).filter(key => !!value[key])
                .map(key => {
                  const match = component.values.find(value => value.value === key)

                  return !!match ? match.label : ''
                })
                .join(', ')
    } else if(type === 'file') {
      converted = true
      newValue = value
    } else if(type === 'select') {
      converted = true
      if(Array.isArray(value) && value.every(val => typeof val !== 'object')) {
        let str = ''

        console.log(value)

        value.forEach((val, valIndex) => {
          if(value.length === 1) {
            str = str
          } else {
            str = str + ' ' + val + (valIndex >= value.length - 1 ? '' : ', ')
          }
        })

        console.log(str)

        newValue = str
      }
    }

    return { value: newValue, converted }
  }

  render() {
    const component = this.props.component;

    const isInsideOfLayout = component.isInsideOfLayout

    let value = this.state.value
    let data = this.convertData([component], { [component.key]: value })[0]
    component.label === 'Access Type' && console.log(value)

    return (
      <FieldBlocks label={data.label} value={data.value} type={data.dataType} isInsideOfLayout={isInsideOfLayout} isRoot={true}/>
    );
  }
}