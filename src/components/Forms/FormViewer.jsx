import { useRef, useEffect } from 'react'
import { Form } from '@formio/react'
import defaultSubmission from './data/submission'

export default function FormViewer({ form, submission, onChange, view, submissionPassedRef }) {
	const readyRef = useRef(false)

	useEffect(() => {
		const timeout = setTimeout(() => {
			readyRef.current = true
			if(submissionPassedRef.current) {
				onChange(submission)
			} else {
				onChange(defaultSubmission)
			}
			submissionPassedRef.current = true
		}, 400)

		return () => clearTimeout(timeout)
	}, [])

	const onSubmissionChange = (change) => {
		if(readyRef.current) {
			onChange(change)
		}
	}

	return (
		<div className="">
			<Form
				form={form}
				submission={submission}
				onChange={onSubmissionChange}
			/>
		</div>
	)
}