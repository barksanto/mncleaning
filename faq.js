// Modern FAQ Accordion Handler
document.addEventListener("DOMContentLoaded", function () {
	// Initialize Bootstrap accordion functionality
	const accordionItems = document.querySelectorAll(".accordion-item")

	accordionItems.forEach((item) => {
		const button = item.querySelector(".accordion-button")
		const content = item.querySelector(".accordion-collapse")

		if (button && content) {
			// Add smooth animation
			content.addEventListener("show.bs.collapse", function () {
				button.classList.add("active")
				button.setAttribute("aria-expanded", "true")
			})

			content.addEventListener("hide.bs.collapse", function () {
				button.classList.remove("active")
				button.setAttribute("aria-expanded", "false")
			})

			// Add hover effects
			button.addEventListener("mouseenter", function () {
				if (!this.classList.contains("active")) {
					this.style.backgroundColor = "rgba(217, 85, 49, 0.1)"
				}
			})

			button.addEventListener("mouseleave", function () {
				if (!this.classList.contains("active")) {
					this.style.backgroundColor = ""
				}
			})

			// Add keyboard navigation
			button.addEventListener("keydown", function (e) {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault()
					this.click()
				}
			})
		}
	})

	// Auto-expand first FAQ item on mobile
	if (window.innerWidth < 768) {
		const firstAccordionButton = document.querySelector(".accordion-button")
		if (firstAccordionButton) {
			setTimeout(() => {
				firstAccordionButton.click()
			}, 1000)
		}
	}

	// Add search functionality for FAQs
	const faqSection = document.getElementById("faq")
	if (faqSection) {
		// Create search input
		const searchContainer = document.createElement("div")
		searchContainer.className = "mb-4"
		searchContainer.innerHTML = `
            <div class="input-group">
                <span class="input-group-text">
                    <i class="fas fa-search"></i>
                </span>
                <input type="text" class="form-control" id="faqSearch" placeholder="Search frequently asked questions...">
                <button class="btn btn-outline-secondary" type="button" id="clearSearch">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `

		// Insert search before accordion
		const accordion = faqSection.querySelector(".accordion")
		if (accordion) {
			accordion.parentNode.insertBefore(searchContainer, accordion)
		}

		// Search functionality
		const searchInput = document.getElementById("faqSearch")
		const clearButton = document.getElementById("clearSearch")

		searchInput.addEventListener("input", function () {
			const searchTerm = this.value.toLowerCase()
			const accordionItems = document.querySelectorAll(".accordion-item")

			accordionItems.forEach((item) => {
				const question = item
					.querySelector(".accordion-button")
					.textContent.toLowerCase()
				const answer = item
					.querySelector(".accordion-body")
					.textContent.toLowerCase()
				const matches =
					question.includes(searchTerm) || answer.includes(searchTerm)

				if (searchTerm === "" || matches) {
					item.style.display = "block"
					if (matches && searchTerm !== "") {
						item.style.backgroundColor = "rgba(217, 85, 49, 0.05)"
						// Auto-expand matching items
						const button = item.querySelector(".accordion-button")
						const content = item.querySelector(".accordion-collapse")
						if (content && !content.classList.contains("show")) {
							const bsCollapse = new bootstrap.Collapse(content, { show: true })
						}
					} else {
						item.style.backgroundColor = ""
					}
				} else {
					item.style.display = "none"
				}
			})

			// Show/hide clear button
			clearButton.style.display = searchTerm ? "block" : "none"
		})

		clearButton.addEventListener("click", function () {
			searchInput.value = ""
			searchInput.dispatchEvent(new Event("input"))
		})

		// Add keyboard shortcuts
		searchInput.addEventListener("keydown", function (e) {
			if (e.key === "Escape") {
				this.value = ""
				this.dispatchEvent(new Event("input"))
				this.blur()
			}
		})
	}

	// Add FAQ analytics tracking
	const faqButtons = document.querySelectorAll(".accordion-button")
	faqButtons.forEach((button) => {
		button.addEventListener("click", function () {
			const question = this.textContent.trim()
			const isExpanded = this.getAttribute("aria-expanded") === "true"

			// Track FAQ interactions
			console.log("FAQ Interaction:", {
				question: question,
				action: isExpanded ? "closed" : "opened",
				timestamp: new Date().toISOString(),
			})

			// You can send this data to your analytics service
			// Example: gtag('event', 'faq_interaction', {
			//     'question': question,
			//     'action': isExpanded ? 'closed' : 'opened'
			// });
		})
	})

	// Add FAQ helpfulness tracking
	const helpfulnessContainer = document.createElement("div")
	helpfulnessContainer.className = "mt-4 p-3 bg-light rounded"
	helpfulnessContainer.innerHTML = `
        <p class="mb-2 fw-semibold">Was this FAQ section helpful?</p>
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-success btn-sm" id="helpfulYes">
                <i class="fas fa-thumbs-up me-1"></i>Yes
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm" id="helpfulNo">
                <i class="fas fa-thumbs-down me-1"></i>No
            </button>
        </div>
    `

	if (faqSection) {
		// faqSection.appendChild(helpfulnessContainer)

		// Helpfulness tracking
		document
			.getElementById("helpfulYes")
			.addEventListener("click", function () {
				trackHelpfulness("yes")
				showFeedback("Thank you for your feedback!")
			})

		document.getElementById("helpfulNo").addEventListener("click", function () {
			trackHelpfulness("no")
			showFeedback("We'll work on improving our FAQ section.")
		})
	}

	function trackHelpfulness(response) {
		console.log("FAQ Helpfulness:", {
			response: response,
			timestamp: new Date().toISOString(),
		})

		// You can send this data to your analytics service
		// Example: gtag('event', 'faq_helpfulness', {
		//     'response': response
		// });
	}

	function showFeedback(message) {
		const feedback = document.createElement("div")
		feedback.className = "alert alert-success mt-3"
		feedback.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>${message}
        `

		helpfulnessContainer.appendChild(feedback)

		setTimeout(() => {
			feedback.remove()
		}, 3000)
	}

	// Add FAQ print functionality
	const printButton = document.createElement("button")
	printButton.className = "btn btn-outline-primary btn-sm ms-2"
	printButton.innerHTML = '<i class="fas fa-print me-1"></i>Print FAQ'
	printButton.addEventListener("click", printFAQ)

	const faqTitle = document.querySelector("#faq h2")
	if (faqTitle) {
		faqTitle.parentNode.appendChild(printButton)
	}

	function printFAQ() {
		const printWindow = window.open("", "_blank")
		const faqContent = document.getElementById("faq").cloneNode(true)

		// Remove interactive elements for print
		const elementsToRemove = faqContent.querySelectorAll(
			".accordion-button, .btn, .input-group"
		)
		elementsToRemove.forEach((el) => el.remove())

		// Expand all FAQ items for print
		const accordionItems = faqContent.querySelectorAll(".accordion-collapse")
		accordionItems.forEach((item) => {
			item.classList.add("show")
			item.style.display = "block"
		})

		printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>M&N Cleaning - FAQ</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h2 { color: #d95531; }
                    .accordion-item { margin-bottom: 20px; }
                    .accordion-button { font-weight: bold; color: #d95531; }
                    .accordion-body { margin-top: 10px; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <h1>M&N Cleaning - Frequently Asked Questions</h1>
                ${faqContent.innerHTML}
            </body>
            </html>
        `)

		printWindow.document.close()
		printWindow.print()
	}

	// Add FAQ sharing functionality
	const shareButton = document.createElement("button")
	shareButton.className = "btn btn-outline-secondary btn-sm ms-2"
	shareButton.innerHTML = '<i class="fas fa-share me-1"></i>Share FAQ'
	shareButton.addEventListener("click", shareFAQ)

	if (faqTitle) {
		faqTitle.parentNode.appendChild(shareButton)
	}

	function shareFAQ() {
		if (navigator.share) {
			navigator.share({
				title: "M&N Cleaning - FAQ",
				text: "Check out our frequently asked questions about cleaning services.",
				url: window.location.href + "#faq",
			})
		} else {
			// Fallback: copy to clipboard
			const url = window.location.href + "#faq"
			navigator.clipboard.writeText(url).then(() => {
				showFeedback("FAQ link copied to clipboard!")
			})
		}
	}

	console.log("FAQ section initialized successfully!")
})
