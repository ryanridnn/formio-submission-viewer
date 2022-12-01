import { Form } from '@formio/react'

export default function SubmissionViewer({ form, submission, view }) {

	return (
		<div className="">
			<Form
				form={form}
				submission={submission}
			/>
		</div>
	)
}