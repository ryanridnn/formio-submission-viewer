export default function Tab({ titles, currentTab, setCurrentTab}) {
	return (
		<div className="flex items-center bg-[#302f89] rounded-md">
			{ titles.map(title => (
				<button key={title} onClick={() => setCurrentTab(title)} className={`py-2 px-4 rounded-md outline-transparent ${currentTab === title ? 'bg-lightBlue' : ''}`}>{title}</button>
			))}
		</div>
	)
}