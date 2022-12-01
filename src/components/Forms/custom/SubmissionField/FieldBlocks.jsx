import FieldBlock from './FieldBlock'

export default function FieldBlocks({ label, value, isInsideOfLayout }) {
	if(Array.isArray(value)) {
		if(value.every(val => Array.isArray(val))) {
			return (
				<div className="mb-[1rem]">
					<div className="mb-[.5rem]">{ label }</div>
					<div className="flex flex-col gap-[1rem]">
						{	value.map(arr => (
								<div className="flex relative">
									<div className="absolute top-0 left-[.5rem] w-[1.5px] h-full rounded-[1px] bg-lightBlue"></div>
									<div className="flex-1 flex flex-col gap-[.625rem] ml-[1.5rem]">
										{ arr.map(obj => (
											<FieldBlocks label={obj.label} value={obj.value} isInsideOfLayout={isInsideOfLayout} />
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
				<div className="mb-[1rem]">
					<div className="mb-[.5rem]">{ label }</div>
					<div className="flex relative">
						<div className="absolute top-0 left-[.5rem] w-[1.5px] h-full rounded-[1px] bg-lightBlue"></div>
						<div className="flex-1 flex flex-col gap-[.625rem] ml-[1.5rem]">
						{	value.map(obj => (
								<FieldBlocks label={obj.label} value={obj.value} isInsideOfLayout={isInsideOfLayout} />
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
			/>
		)
	}
}