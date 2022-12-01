import { FormBuilder } from '@formio/react'

export default function Builder({ schema, setSchema }) {
	return (
		<div className="text-black">
			<FormBuilder 
				form={schema}
				onChange={schema => {
					setSchema(schema)
				}}
				options={{
					builder: {
						basic: {
							components: {
								submissionField: true
							}
						}
					}
				}}
			/>
		</div>
	)
}