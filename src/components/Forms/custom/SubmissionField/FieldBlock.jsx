export default function FieldBlock({ label, value, isInsideOfLayout }) {
	const bgColor = isInsideOfLayout ? '#5046E626' : '#263145';
	const labelBgColor = isInsideOfLayout ? '#5046E61A' : '#2B3851';

	return (
		<div className={`flex items-center gap-[.25rem] text-[1rem] rounded-[.375rem] overflow-hidden`} style={{backgroundColor: bgColor}}>
		  <div className={`flex-1 py-[.5rem] px-[.625rem]`} style={{backgroundColor: labelBgColor}}>{ label }</div>
		  <div className="flex-1 pl-[.625rem]">{ value }</div>
		</div>
	)
}