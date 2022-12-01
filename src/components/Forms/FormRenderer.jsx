import { useState, useEffect, useRef } from 'react'
import { Form } from '@formio/react'
import Tab from '../Tab'
import FormViewer from './FormViewer'
import SubmissionViewer from './SubmissionViewer'
import _ from 'lodash'
import defaultSubmission from './data/submission'

const rendererViews = {
	Form: 'Form',
	Submission: 'Submission'
}

const tabTitles = Object.values(rendererViews)

export default function FormRenderer({ schema }) {
	const [submission, setSubmission] =  useState({})
	const [view, setView] = useState(rendererViews.Form)
	const [convertedSchema, setConvertedSchema] = useState(defaultSubmission)
	const submissionPassedRef = useRef(false) 

	useEffect(() => {
		setSubmission(prev => ({ ...prev, view }))

		if(view === rendererViews.Submission) {
			const schemaWithNoButton = { components: schema.components.filter(component => {
				if(component.type === 'button') return false
				return true
			}) }
			const submissionSchema = convertSchema(schemaWithNoButton)
			setConvertedSchema(submissionSchema)
		}
	}, [view])

	const onSubmissionChange = (change) => {
		setSubmission({ data: change.data })
	}

	return (
		<div className="">
			<div className="flex justify-end items-center mb-8">
				<div className="mr-4">View: </div>
				<Tab titles={tabTitles} currentTab={view} setCurrentTab={setView} />
			</div>
			{
				view === rendererViews.Form ? (
					<FormViewer
						form={schema}
						submission={submission}
						onChange={onSubmissionChange}
						view={view}
						submissionPassedRef={submissionPassedRef}
					/>
				) : (
					<SubmissionViewer
						form={convertedSchema}
						submission={submission}
						view={view}
					/>
				)
			}
		</div>
	)
}

const fieldsTypes = [
	{
		type: 'textfield',
		dataType: null,
	},
	{
		type: 'textarea',
		dataType: null,
	},
	{
		type: 'number',
		dataType: null,
	},
	{
		type: 'password',
		dataType: null,
	},
	{
		type: 'checkbox',
		dataType: 'checkbox',
	},
	{
		type: 'selectboxes',
		dataType: 'selectboxes',
	},
	{
		type: 'select',
		dataType: 'select',
	},
	{
		type: 'radio',
		dataType: null,
	},
	{
		type: 'datetime',
		dataType: null
	},
	{
		type: 'url',
		dataType: null
	},
	{
		type: 'datagrid',
		dataType: null
	},
	{
		type: 'datamap',
		dataType: null
	},
	{
		type: 'editgrid',
		dataType: null
	},
	{
		type: 'container',
		dataType: null
	}
]

const layouts = ['well', 'panel', 'tabs']
const expandDataTypes = ['container', 'datamap', 'datagrid', 'editgrid'];

const checkInsideOfLayout = (component) => {
	return layouts.includes(component.type)
}

const submissionFieldType = 'submissionField'

const convertSchema = (schema, hasParentLayout = false) => {
	let newSchema = {} 

	if(schema.components) {
		newSchema = schema.components.map((component) => {
			const match = fieldsTypes.find(field => 
				(field.type === component.type)
			)
			const isInsideOfLayout = hasParentLayout || checkInsideOfLayout(component)

			let newComponent = { ...component }

			if(!!match) {
				newComponent = {
					...component,
					type: submissionFieldType,
					hideLabel: true,
					isInsideOfLayout: hasParentLayout
				}

				if(match.dataType) {
					newComponent = {
						...newComponent,
						dataType: match.dataType
					}
				}
			} else {
				if(!!component.components) {
					const { components } = convertSchema({ components: component.components }, isInsideOfLayout)

					newComponent = {
						...newComponent,
						components,
					}
				}

				if(!!component.columns) {
					const { components } = convertSchema({ components: component.columns }, isInsideOfLayout)

					newComponent = {
						...newComponent,
						columns: components,
					}
				}
			}


			if(!!component.columns || !!component.components || !!match) {
				return newComponent
			} else {
				return component
			}
		})
	} else {
		newSchema = schema
	}

	return { components: newSchema }
}