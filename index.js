// Modern Website Interactions
document.addEventListener("DOMContentLoaded", function () {
	// Navbar scroll effect
	const navbar = document.querySelector(".navbar")
	let lastScrollTop = 0

	window.addEventListener("scroll", function () {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop

		if (scrollTop > 100) {
			navbar.classList.add("scrolled")
		} else {
			// navbar.classList.remove("scrolled")
		}

		lastScrollTop = scrollTop
	})

	// Smooth scrolling for all anchor links
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault()
			const target = document.querySelector(this.getAttribute("href"))
			if (target) {
				const offsetTop = target.offsetTop - 80 // Account for fixed navbar
				window.scrollTo({
					top: offsetTop,
					behavior: "smooth",
				})
			}
		})
	})

	// Intersection Observer for animations
	const observerOptions = {
		threshold: 0.1,
		rootMargin: "0px 0px -50px 0px",
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("fade-in-up")
			}
		})
	}, observerOptions)

	// Observe elements for animation
	const animateElements = document.querySelectorAll(
		".card, .hero-content, .form-step, .testimonial-card"
	)
	animateElements.forEach((el) => {
		observer.observe(el)
	})

	// Phone number click handler
	document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
		link.addEventListener("click", function (e) {
			// Add click tracking if needed
			console.log("Phone number clicked:", this.href)
		})
	})

	// Email click handler
	document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
		link.addEventListener("click", function (e) {
			// Add click tracking if needed
			console.log("Email clicked:", this.href)
		})
	})

	// Review button click handler
	const reviewButton = document.querySelector('a[href*="google.com/maps"]')
	if (reviewButton) {
		reviewButton.addEventListener("click", function (e) {
			// Add click tracking if needed
			console.log("Review button clicked")
		})
	}

	// Form scroll to top when submitted
	const forms = document.querySelectorAll("form")
	forms.forEach((form) => {
		form.addEventListener("submit", function () {
			// Scroll to top after form submission
			setTimeout(() => {
				window.scrollTo({
					top: 0,
					behavior: "smooth",
				})
			}, 1000)
		})
	})

	// Add loading states to buttons
	const buttons = document.querySelectorAll(".btn")
	buttons.forEach((button) => {
		button.addEventListener("click", function () {
			if (!this.classList.contains("loading") && !this.disabled) {
				this.classList.add("loading")
				setTimeout(() => {
					this.classList.remove("loading")
				}, 2000)
			}
		})
	})

	// Parallax effect for hero section
	const heroSection = document.querySelector(".hero-section")
	if (heroSection) {
		window.addEventListener("scroll", function () {
			const scrolled = window.pageYOffset
			const rate = scrolled * -0.5
			heroSection.style.transform = `translateY(${rate}px)`
		})
	}

	// Add active state to navigation links
	const navLinks = document.querySelectorAll(".nav-link")
	const sections = document.querySelectorAll("section[id]")

	window.addEventListener("scroll", function () {
		let current = ""
		sections.forEach((section) => {
			const sectionTop = section.offsetTop
			const sectionHeight = section.clientHeight
			if (window.pageYOffset >= sectionTop - 200) {
				current = section.getAttribute("id")
			}
		})

		navLinks.forEach((link) => {
			link.classList.remove("active")
			if (link.getAttribute("href") === `#${current}`) {
				link.classList.add("active")
			}
		})
	})

	// Mobile menu close on link click
	const mobileMenuLinks = document.querySelectorAll(".navbar-nav .nav-link")
	const navbarCollapse = document.querySelector(".navbar-collapse")
	// Check if Bootstrap is loaded before using it
	if (typeof bootstrap !== "undefined" && navbarCollapse) {
		const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false })

		mobileMenuLinks.forEach((link) => {
			link.addEventListener("click", function () {
				if (window.innerWidth < 992) {
					bsCollapse.hide()
				}
			})
		})
	}

	// Add hover effects to cards
	const cards = document.querySelectorAll(".card")
	cards.forEach((card) => {
		card.addEventListener("mouseenter", function () {
			this.style.transform = "translateY(-10px)"
		})

		card.addEventListener("mouseleave", function () {
			this.style.transform = "translateY(0)"
		})
	})

	// Lazy loading for images
	const images = document.querySelectorAll("img[data-src]")
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const img = entry.target
				img.src = img.dataset.src
				img.classList.remove("lazy")
				imageObserver.unobserve(img)
			}
		})
	})

	images.forEach((img) => imageObserver.observe(img))

	// Add success animation to form submissions
	const successModal = document.getElementById("successModal")
	if (successModal) {
		successModal.addEventListener("shown.bs.modal", function () {
			const modalContent = this.querySelector(".modal-content")
			modalContent.classList.add("success-animation")
		})
	}

	// Keyboard navigation support
	document.addEventListener("keydown", function (e) {
		// Escape key to close modals
		if (e.key === "Escape" && typeof bootstrap !== "undefined") {
			const openModals = document.querySelectorAll(".modal.show")
			openModals.forEach((modal) => {
				const bsModal = bootstrap.Modal.getInstance(modal)
				if (bsModal) {
					bsModal.hide()
				}
			})
		}
	})

	// Add focus management for accessibility
	const focusableElements = document.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	)

	focusableElements.forEach((element) => {
		element.addEventListener("focus", function () {
			this.style.outline = "2px solid var(--primary-color)"
			this.style.outlineOffset = "2px"
		})

		element.addEventListener("blur", function () {
			this.style.outline = ""
			this.style.outlineOffset = ""
		})
	})

	// Performance optimization: Debounce scroll events
	function debounce(func, wait) {
		let timeout
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout)
				func(...args)
			}
			clearTimeout(timeout)
			timeout = setTimeout(later, wait)
		}
	}

	// Apply debouncing to scroll events
	const debouncedScrollHandler = debounce(function () {
		// Scroll-based animations and effects
		const scrolled = window.pageYOffset
		const parallax = document.querySelector(".hero-background")

		if (parallax) {
			const speed = scrolled * 0.5
			parallax.style.transform = `translateY(${speed}px)`
		}
	}, 10)

	window.addEventListener("scroll", debouncedScrollHandler)

	// Add touch support for mobile devices
	let touchStartY = 0
	let touchEndY = 0

	document.addEventListener("touchstart", function (e) {
		touchStartY = e.changedTouches[0].screenY
	})

	document.addEventListener("touchend", function (e) {
		touchEndY = e.changedTouches[0].screenY
		handleSwipe()
	})

	function handleSwipe() {
		const swipeThreshold = 50
		const diff = touchStartY - touchEndY

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swipe up
				console.log("Swipe up detected")
			} else {
				// Swipe down
				console.log("Swipe down detected")
			}
		}
	}

	// Initialize tooltips if Bootstrap is available
	if (typeof bootstrap !== "undefined") {
		const tooltipTriggerList = [].slice.call(
			document.querySelectorAll('[data-bs-toggle="tooltip"]')
		)
		tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl)
		})
	}

	// Add error handling for failed image loads
	const allImages = document.querySelectorAll("img")
	allImages.forEach((img) => {
		img.addEventListener("error", function () {
			this.src =
				"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBsb2FkIGVycm9yPC90ZXh0Pjwvc3ZnPg=="
			this.alt = "Image failed to load"
		})
	})

	console.log("M&N Cleaning website initialized successfully!")
})
