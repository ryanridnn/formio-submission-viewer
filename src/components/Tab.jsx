export default function Tab({ titles, currentTab, setCurrentTab}) {
	return (
		<div className="flex items-center bg-[#302f89] !text-white rounded-md">
			{ titles.map(title => (
				<button key={title} onClick={() => setCurrentTab(title)} className={`py-2 px-4 rounded-md outline-transparent text-white ${currentTab === title ? 'bg-lightBlue' : 'bg-[#302f89]'}`}>{title}</button>
			))}
		</div>
	)
}