export default function FieldBlock({ label, value, isInsideOfLayout, type }) {
	const bgColor = isInsideOfLayout ? '#5046E626' : '#263145';
	const labelBgColor = isInsideOfLayout ? '#5046E61A' : '#2B3851';

	if(type === 'file') {
		if(value.length > 0) {
			const files = value.map(file => {
				const fileType = file.type.split('/')[0]

				if(fileType === 'image') {
					return {
						type: 'image',
						url: file.url,
						name: file.originalName
					}
				} else {
					return {
						type: 'other',
						url: file.url,
						name: file.originalName
					}
				}
			})

			return (
				<div className={`file-submission-block ${isInsideOfLayout ? 'inside-of-layout' : ''}`}>
				  <div className="file-submission-block__label">{ label }</div>
				  <div className="file-submission-block__value">
				  	{ files.map(file => {
				  		if(file.type === 'image') {
				  			return (
				  				<img src={file.url} alt={file.name} className="file-submission-block__image" />
				  			)
				  		} else {
				  			return (
				  				<div className="file-submission-block__image">
				  					{ file.name }
				  				</div>
				  			)
				  		}
				  	})}
				  </div>
				</div>
			)
		} else {
			return <></>
		}
	} else {
		return (
			<div className={`submission-block ${isInsideOfLayout ? 'inside-of-layout' : ''}`}>
			  <div className="submission-block__label">{ label }</div>
			  <div className="submission-block__value">{ value }</div>
			</div>
		)
	}
}