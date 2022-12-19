import { useState, useRef } from 'react'
import { Form } from '@formio/react'
import Tab from '../Tab'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
import jsPdf from 'jspdf'

const submissionViews = {
	Default: 'Default',
	Print: 'Print'
}

const convertImgUrlToBase64 = (url) => {
	return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest();
          xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
              resolve(reader.result);
            };
            reader.readAsDataURL(xhr.response);
          };
          xhr.onerror = () => {
            reject({
              status: this.status,
              statusText: xhr.statusText,
            });
          };
          xhr.open("GET", url);
          xhr.responseType = "blob";
          xhr.send();
        });
}

const tabTitles = Object.values(submissionViews)

export default function SubmissionViewer({ form, submission, view }) {
	const [submissionView, setSubmissionView] = useState(submissionViews.Default)
	const formContainerRef = useRef(null)
	const printContainerRef = useRef(null)

	const headerRef = useRef(null)
	const footerRef = useRef(null)

	const convertImages = (onCompleted) => {
    const imageEls = formContainerRef.current.querySelectorAll('img')

		const promises = [...imageEls].map(imageEl => convertImgUrlToBase64(imageEl.src))
		Promise.all(promises)
			.then(base64s => {
				[...imageEls].map((imageEl, i) => {
					imageEl.src = base64s[i]
				})
				setTimeout(() => {
					console.log([...imageEls].map(imageEl => imageEl.src))
					onCompleted()
				}, 200)
			})

			if(imageEls.length === 0) {
				onCompleted()
			}
	}

	const getChildrenComponents = (component) => {
		const filterRootLevelChildren = (children) => {
			let filteredChildren = []

			children.forEach(child => {
				if(children.every(parent => !parent.contains(child) || parent === child)) {
					filteredChildren.push(child)
				}
			})

			return filteredChildren
		}

		if(component?.children[0]?.children[0]?.classList?.contains('submission-blocks-array') || component.classList.contains('submission-block-array')) {
			let children = [...component.querySelectorAll('.submission-block-group')]

			children = filterRootLevelChildren(children)

			return children
		} else if(component?.children[0]?.children[0]?.classList?.contains('submission-blocks-object') || component.classList.contains('submission-block-group')) {
			let children = [...component.querySelectorAll('.flex-1 > *')]

			children = filterRootLevelChildren(children)

			return children
		} else {
			return []
		}
	}

	const exportForm = () => {
			const margin = {
				x: 16,
				y: 10
			}

			const elGap = 10

    	const doc = new jsPdf({
    		orientation: 'p',
    		unit: 'pt',
    		format: 'a4'
    	});

    	const element = formContainerRef.current.cloneNode(true);
    	element.classList.add('print-view')
    	printContainerRef.current.append(element)
    	const components = [...element.querySelectorAll('.formio-form > *')]

    	const docWidth = doc.internal.pageSize.getWidth()
    	const docHeight = doc.internal.pageSize.getHeight()

    	const availableWidth = docWidth - margin.x * 2

    	const elWidth = element.offsetWidth 

			const convertWithRatio = size => size * availableWidth / elWidth    	

			const headerHeight = !!headerRef.current ? convertWithRatio(headerRef.current.offsetHeight) : 0
			const footerHeight = !!footerRef.current ? convertWithRatio(footerRef.current.offsetHeight) : 0

			let elementCurrentHeight = 10 + headerHeight

			let minElementSize = convertWithRatio(175)
			let minElementFromBottom = convertWithRatio(140)

			if(headerHeight) {
				components[0].style.marginTop = headerHeight * elWidth / availableWidth + 10 + 'px'
			}

			const setupPdfLayout = (components, height, returnMargin = false, elGap = 10) => {
				let currentComponentsHeight = height
				let margins = [0, 0]

				components.forEach((component, componentIndex) => {
					let componentHeight = convertWithRatio(component.offsetHeight + elGap)

					if(currentComponentsHeight % docHeight + componentHeight > docHeight - margin.y - footerHeight) {
						const childrenComponents = getChildrenComponents(component)

						const checkBelowElementFromBottom = docHeight - ((currentComponentsHeight) % docHeight) - margin.y < minElementFromBottom + margin.y + footerHeight 

						if(
							checkBelowElementFromBottom && !childrenComponents.length
							|| componentHeight <= minElementSize
							|| (!childrenComponents.length && componentHeight < docHeight - margin.y * 2 - headerHeight - footerHeight)
						) {
							let childrenMargin = 0

							// if(componentHeight >= docHeight - margin.y * 2 - headerHeight - footerHeight
							// 	&& childrenComponents?.length > 0
							// ) {
							// 	childrenMargin = 
							// }

							const marginTop = (docHeight - ((currentComponentsHeight) % docHeight)) + headerHeight + margin.y 

							component.style.marginTop = marginTop * elWidth / availableWidth + 'px'

							currentComponentsHeight += marginTop + childrenMargin
							margins.push(marginTop + childrenMargin)
						} else if(childrenComponents.length > 0 && componentHeight > minElementSize) {
							let startingPoint = 0

							let startingElement
							let childrenGap = 10

							if(component?.children[0]?.children[0]?.classList?.contains('submission-blocks-array')) {
								startingElement = component.querySelector('.submission-blocks-title') 
								startingPoint = convertWithRatio(startingElement.offsetHeight + 10)
								childrenGap = 16
							} else if(component?.children[0]?.children[0]?.classList?.contains('submission-blocks-object')) {
								startingElement = component.querySelector('.submission-blocks-title') 
								startingPoint = convertWithRatio(startingElement.offsetHeight + 10)
								childrenGap = 10
							}

							const returnedMargin = setupPdfLayout(childrenComponents, currentComponentsHeight + startingPoint, true, childrenGap)

							currentComponentsHeight += returnedMargin
							if(returnMargin) {
								margins.push(returnedMargin)
							}
						} 
					}

					currentComponentsHeight += componentHeight
				})

				if(returnMargin) return margins.reduce((a, b) => a + b)
				else return currentComponentsHeight
			}

			// components.forEach(component => {
   //  		let componentHeight = convertWithRatio(component.offsetHeight + elGap)

   //  		if(elementCurrentHeight % docHeight + componentHeight > docHeight) {
   //  			let currentCompHeight = convertWithRatio(34)

   //  			const blockGroups = [...component.querySelectorAll('.submission-block-group')]

   //  			blockGroups.forEach((blockGroup, i) => {
   //  				let blockGroupHeight = convertWithRatio(blockGroup.offsetHeight + (i === blockGroups.length - 1 ? 0 : 16))

   //  				if((elementCurrentHeight + currentCompHeight) % docHeight + blockGroupHeight > docHeight - margin.y) {
   //  					const marginTop = (docHeight - (elementCurrentHeight % docHeight + currentCompHeight % docHeight)) + margin.y

   //  					blockGroup.style.marginTop = marginTop * elWidth / availableWidth + 'px'

	  //   				blockGroupHeight += marginTop
   //  				}

   //  				currentCompHeight += blockGroupHeight
   //  			})

   //  			componentHeight = currentCompHeight
   //  		}

   //  		elementCurrentHeight += componentHeight

   //  		// console.log(component, elementCurrentHeight, docHeight)
   //  	})

	   	let totalHeight = setupPdfLayout(components, elementCurrentHeight)
	   	const totalPage = Math.ceil(totalHeight / docHeight)

	   	const getFooterPagingContent = (page) => {
	   		let pageText = 'pages'

	   		if(totalPage === 1) {
	   			pageText = 'page'
	   		}

	   		return `${page} of ${totalPage} ${pageText}`
	   	}

	   	const setElementPosition = (element, top) => {
	   		element.style.display = 'flex'
	   		element.style.position = 'absolute'
	   		element.style.top = top * elWidth / availableWidth  + 'px'
	   	}

	   	Array.from({ length: totalPage }).forEach((_, pageIndex) => {
	   		const headerClone = headerRef.current.cloneNode(true)
	   		const footerClone = footerRef.current.cloneNode(true)

	   		const footerPagingEl = footerClone.querySelector('.pdf-page')
	   		footerPagingEl.innerText = getFooterPagingContent(pageIndex + 1)

	   		setElementPosition(headerClone, pageIndex * docHeight - headerHeight - 6)
	   		setElementPosition(footerClone, (pageIndex + 1) * docHeight - footerHeight - headerHeight - 10)
	   		headerClone.style.paddingBottom = `calc(1.5rem + ${4 * elWidth / availableWidth}px)`
	   		footerClone.style.paddingTop = `calc(1rem + ${4 * elWidth / availableWidth}px)`
	   		element.append(headerClone)
	   		element.append(footerClone)
	   	})

    	doc.html(element, {
    		callback: function(doc) {
    			doc.save("output.pdf", { returnPromise: true })
    				.then(() => {
    					printContainerRef.current.removeChild(element)
    				})
    		},
    		x: margin.x,
    		y: 0,
    		windowWidth: elWidth,
    		autoPaging: true,
    		width: availableWidth,
    		html2canvas: {
    			letterRendering: true
    		}
    	});
	}

	return (
		<div class="relative">
			<div ref={printContainerRef} className="absolute top-[0] left-[-1920px] w-[1560px] bg-black z-999">
				<div ref={headerRef} className="pdf-header">
					<div className="pdf-logo">
						<img src="/imgs/logo.png" alt="Logo" />
					</div>
					<div className="pdf-title">
						Chlorination Test Operation
					</div>
					<div className="pdf-date">{ 
						new Date().toLocaleDateString('en-US', { month: 'short'})
						+ ', ' + 
						new Date().toLocaleDateString('en-US', { day: '2-digit'})
						+ ' ' +
						new Date().toLocaleDateString('en-US', { year: 'numeric'})
					}</div>
				</div>
				<div ref={footerRef} className="pdf-footer">
					<div className="pdf-path">
						Testing Network > Main Site > Main Department > Cold Larder Kitchen
					</div>
					<div className="pdf-page">
						1 of 5 pages
					</div>
				</div>
			</div>
			<div className="flex justify-end items-center gap-[1rem] mb-8">
				<button onClick={exportForm} className="py-2 px-4 rounded-md outline-transparent bg-lightBlue">Export as PDF</button>
				<div className="flex justify-end items-center">
					<div className="mr-4">Submission View: </div>
					<Tab titles={tabTitles} currentTab={submissionView} setCurrentTab={setSubmissionView} />
				</div>
			</div>
			<div ref={formContainerRef} className={submissionView === submissionViews.Print ? 'print-view' : ''}>
				<Form
					form={form}
					submission={submission}
				/>
			</div>
		</div>
	)
}