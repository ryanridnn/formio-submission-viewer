import FieldBlock from './FieldBlock'

export default function FieldBlocks({ label, value, isInsideOfLayout, type, isRoot = false}) {
	if(type === 'column') {
		return (
			<div className="submission-blocks-columns flex box-border" style={{ marginBottom: isRoot ? '.625rem' : ''}}>
				{ value.map((val, valIndex) => (
					<div className={`submission-blocks-column col-${val.size}-${val.width} px-[0rem] flex flex-col gap-[.625rem]`}
						style={{
							paddingLeft: valIndex === 0 ? 0 : '.625rem',
							paddingRight: valIndex === value.length - 1 ? 0 : '.625rem' 
						}}
					>
						{ val.value.map(comp => (
							<FieldBlock 
								label={comp.label} 
								value={comp.value} 
								isInsideOfLayout={isInsideOfLayout}
								type={comp.dataType}
							/>
						))}
					</div>
				))}
			</div>
		)
	} else if(type === 'file') {
		return (
			<FieldBlock 
				label={label} 
				value={value} 
				isInsideOfLayout={isInsideOfLayout}
				type={type}
			/>
		)
	} else if(Array.isArray(value)) {
		if(value.every(val => Array.isArray(val))) {
			return (
				<div className="submission-blocks-array" style={{ marginBottom: isRoot ? '.625rem' : ''}}>
					<div className="submission-blocks-title mb-[.625rem]">{ label }</div>
					<div className="flex flex-col gap-[1rem]">
						{	value.map(arr => (
								<div className="submission-block-group flex relative">
									<div className="absolute top-0 left-[.5rem] w-[1.5px] h-full rounded-[1px] bg-lightBlue"></div>
									<div className="flex-1 flex flex-col gap-[.625rem] ml-[1.5rem]">
										{ arr.map(obj => (
											<FieldBlocks label={obj.label} value={obj.value} type={obj.dataType} isInsideOfLayout={isInsideOfLayout} />
										)) }
									</div>
								</div>
							))
						}
					</div>
				</div>
			)
		} else if(value.every(val => typeof value === 'object')) {
			return (
				<div className="submission-blocks-object" style={{ marginBottom: isRoot ? '.625rem' : ''}}>
					<div className="submission-blocks-title mb-[.625rem]">{ label }</div>
					<div className="submission-block-group flex relative">
						<div className="absolute top-0 left-[.5rem] w-[1.5px] h-full rounded-[1px] bg-lightBlue"></div>
						<div className="flex-1 flex flex-col gap-[.625rem] ml-[1.5rem] submission-obj-blocks">
						{	value.map(obj => (
								<FieldBlocks label={obj.label} value={obj.value} type={obj.dataType} isInsideOfLayout={isInsideOfLayout} />
							))
						}
						</div>
					</div>
				</div>
			)
		}
	} else {
		return (
			<FieldBlock 
				label={label} 
				value={value} 
				isInsideOfLayout={isInsideOfLayout}
				type={type}
			/>
		)
	}
}