// Modern Multi-Step Form Handler
class QuoteForm {
	constructor() {
		this.currentStep = 1
		this.totalSteps = 3
		this.form = document.getElementById("quote-form-element")
		this.progressBar = document.getElementById("form-progress")
		this.nextBtn = document.getElementById("next-btn")
		this.prevBtn = document.getElementById("prev-btn")
		this.submitBtn = document.getElementById("submit-btn")

		this.init()
	}

	init() {
		this.setupEventListeners()
		this.updateProgress()
		this.showStep(1)
	}

	setupEventListeners() {
		// Navigation buttons
		this.nextBtn.addEventListener("click", () => this.nextStep())
		this.prevBtn.addEventListener("click", () => this.prevStep())
		this.submitBtn.addEventListener("click", (e) => this.handleSubmit(e))

		// Form submission
		this.form.addEventListener("submit", (e) => this.handleSubmit(e))

		// Real-time validation
		this.setupValidation()

		// Smooth scrolling for anchor links
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener("click", function (e) {
				e.preventDefault()
				const target = document.querySelector(this.getAttribute("href"))
				if (target) {
					target.scrollIntoView({
						behavior: "smooth",
						block: "start",
					})
				}
			})
		})
	}

	setupValidation() {
		// Real-time validation for required fields
		const requiredFields = this.form.querySelectorAll("[required]")
		requiredFields.forEach((field) => {
			field.addEventListener("blur", () => this.validateField(field))
			field.addEventListener("input", () => this.clearFieldError(field))
		})

		// Email validation
		const emailField = this.form.querySelector('input[type="email"]')
		if (emailField) {
			emailField.addEventListener("blur", () => this.validateEmail(emailField))
		}

		// Phone number formatting
		const phoneField = this.form.querySelector('input[name="phone"]')
		if (phoneField) {
			phoneField.addEventListener("input", (e) =>
				this.formatPhoneNumber(e.target)
			)
		}

		// Zip code validation
		const zipField = this.form.querySelector('input[name="zip"]')
		if (zipField) {
			zipField.addEventListener("input", (e) => this.formatZipCode(e.target))
		}
	}

	validateField(field) {
		const value = field.value.trim()
		const isValid = value.length > 0

		this.toggleFieldValidation(field, isValid)
		return isValid
	}

	validateEmail(field) {
		const email = field.value.trim()
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		const isValid = emailRegex.test(email)

		this.toggleFieldValidation(field, isValid)
		return isValid
	}

	toggleFieldValidation(field, isValid) {
		field.classList.remove("is-valid", "is-invalid")
		field.classList.add(isValid ? "is-valid" : "is-invalid")

		// Remove existing feedback
		const existingFeedback = field.parentNode.querySelector(
			".invalid-feedback, .valid-feedback"
		)
		if (existingFeedback) {
			existingFeedback.remove()
		}

		// Add feedback message
		const feedback = document.createElement("div")
		feedback.className = isValid ? "valid-feedback" : "invalid-feedback"
		feedback.textContent = isValid ? "Looks good!" : this.getErrorMessage(field)
		field.parentNode.appendChild(feedback)
	}

	clearFieldError(field) {
		field.classList.remove("is-invalid")
		const feedback = field.parentNode.querySelector(".invalid-feedback")
		if (feedback) {
			feedback.remove()
		}
	}

	getErrorMessage(field) {
		const fieldName = field.name || field.type
		const messages = {
			"first-name": "Please enter your first name",
			"last-name": "Please enter your last name",
			email: "Please enter a valid email address",
			zip: "Please enter a valid zip code",
			phone: "Please enter a valid phone number",
		}
		return messages[fieldName] || "This field is required"
	}

	formatPhoneNumber(field) {
		let value = field.value.replace(/\D/g, "")
		if (value.length > 10) value = value.slice(0, 10)

		if (value.length >= 6) {
			value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
		} else if (value.length >= 3) {
			value = value.replace(/(\d{3})(\d{0,3})/, "($1) $2")
		}

		field.value = value
	}

	formatZipCode(field) {
		let value = field.value.replace(/\D/g, "")
		if (value.length > 5) value = value.slice(0, 5)
		field.value = value
	}

	validateStep(step) {
		const stepElement = document.getElementById(`step-${step}`)
		const requiredFields = stepElement.querySelectorAll("[required]")
		let isValid = true

		requiredFields.forEach((field) => {
			if (field.type === "email") {
				if (!this.validateEmail(field)) isValid = false
			} else {
				if (!this.validateField(field)) isValid = false
			}
		})

		// Special validation for step 2 (radio buttons)
		if (step === 2) {
			const cleanType = stepElement.querySelector(
				'input[name="clean-type"]:checked'
			)
			const frequency = stepElement.querySelector(
				'input[name="frequency"]:checked'
			)

			if (!cleanType) {
				this.showStepError("Please select a cleaning type")
				isValid = false
			}
			if (!frequency) {
				this.showStepError("Please select a frequency")
				isValid = false
			}
		}

		return isValid
	}

	showStepError(message) {
		// Remove existing error
		const existingError = document.querySelector(".step-error")
		if (existingError) existingError.remove()

		// Create error message
		const error = document.createElement("div")
		error.className = "alert alert-danger step-error mt-3"
		error.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>${message}`

		const currentStep = document.getElementById(`step-${this.currentStep}`)
		currentStep.appendChild(error)

		// Auto-remove after 5 seconds
		setTimeout(() => {
			if (error.parentNode) {
				error.remove()
			}
		}, 5000)
	}

	nextStep() {
		if (this.validateStep(this.currentStep)) {
			if (this.currentStep < this.totalSteps) {
				this.currentStep++
				this.showStep(this.currentStep)
				this.updateProgress()
			}
		}
	}

	prevStep() {
		if (this.currentStep > 1) {
			this.currentStep--
			this.showStep(this.currentStep)
			this.updateProgress()
		}
	}

	showStep(step) {
		// Hide all steps
		for (let i = 1; i <= this.totalSteps; i++) {
			const stepElement = document.getElementById(`step-${i}`)
			if (stepElement) {
				stepElement.classList.remove("active")
				stepElement.classList.add("d-none")
			}
		}

		// Show current step
		const currentStepElement = document.getElementById(`step-${step}`)
		if (currentStepElement) {
			currentStepElement.classList.remove("d-none")
			setTimeout(() => {
				currentStepElement.classList.add("active")
			}, 10)
		}

		// Update button visibility
		this.prevBtn.style.display = step === 1 ? "none" : "inline-flex"
		this.nextBtn.style.display =
			step === this.totalSteps ? "none" : "inline-flex"
		this.submitBtn.style.display =
			step === this.totalSteps ? "inline-flex" : "none"

		// Scroll to form
		this.scrollToForm()
	}

	updateProgress() {
		const progress = (this.currentStep / this.totalSteps) * 100
		this.progressBar.style.width = `${progress}%`
	}

	scrollToForm() {
		const formSection = document.getElementById("quote-form")
		if (formSection) {
			formSection.scrollIntoView({
				behavior: "smooth",
				block: "start",
			})
		}
	}

	async handleSubmit(e) {
		e.preventDefault()

		if (!this.validateStep(this.currentStep)) {
			return
		}

		// Show loading state
		this.submitBtn.classList.add("loading")
		this.submitBtn.disabled = true

		try {
			const formData = new FormData(this.form)

			// Add step information
			formData.append("form_step", this.currentStep)
			formData.append("submission_time", new Date().toISOString())

			const response = await fetch(this.form.action, {
				method: "POST",
				body: formData,
				headers: {
					Accept: "application/json",
				},
			})

			if (response.ok) {
				this.showSuccessModal()
				this.form.reset()
				this.resetForm()
			} else {
				throw new Error("Submission failed")
			}
		} catch (error) {
			console.error("Form submission error:", error)
			this.showErrorModal()
		} finally {
			this.submitBtn.classList.remove("loading")
			this.submitBtn.disabled = false
		}
	}

	showSuccessModal() {
		const modal = new bootstrap.Modal(document.getElementById("successModal"))
		modal.show()
	}

	showErrorModal() {
		// Create error modal if it doesn't exist
		let errorModal = document.getElementById("errorModal")
		if (!errorModal) {
			errorModal = document.createElement("div")
			errorModal.className = "modal fade"
			errorModal.id = "errorModal"
			errorModal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center p-5">
                            <div class="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                                <i class="fas fa-exclamation-triangle fa-3x text-danger"></i>
                            </div>
                            <h4 class="fw-bold text-danger mb-3">Oops! Something went wrong</h4>
                            <p class="mb-4">There was an error submitting your form. Please try again or contact us directly.</p>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            `
			document.body.appendChild(errorModal)
		}

		const modal = new bootstrap.Modal(errorModal)
		modal.show()
	}

	resetForm() {
		this.currentStep = 1
		this.showStep(1)
		this.updateProgress()

		// Clear all validation states
		this.form.querySelectorAll(".is-valid, .is-invalid").forEach((field) => {
			field.classList.remove("is-valid", "is-invalid")
		})

		// Remove feedback messages
		this.form
			.querySelectorAll(".invalid-feedback, .valid-feedback")
			.forEach((feedback) => {
				feedback.remove()
			})
	}
}

// Initialize form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	new QuoteForm()
})

// Smooth scrolling for all internal links
document.addEventListener("DOMContentLoaded", () => {
	// Add smooth scrolling to all anchor links
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault()
			const target = document.querySelector(this.getAttribute("href"))
			if (target) {
				target.scrollIntoView({
					behavior: "smooth",
					block: "start",
				})
			}
		})
	})

	// Add scroll animations
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
	document
		.querySelectorAll(".card, .hero-content, .form-step")
		.forEach((el) => {
			observer.observe(el)
		})
})

// Contact form handler
document.addEventListener("DOMContentLoaded", () => {
	const contactForm = document.getElementById("contact-form")
	if (contactForm) {
		contactForm.addEventListener("submit", async (e) => {
			e.preventDefault()

			const submitBtn = contactForm.querySelector('button[type="submit"]')
			const originalText = submitBtn.innerHTML

			// Show loading state
			submitBtn.innerHTML =
				'<i class="fas fa-spinner fa-spin me-2"></i>Sending...'
			submitBtn.disabled = true

			try {
				const formData = new FormData(contactForm)
				const response = await fetch(contactForm.action, {
					method: "POST",
					body: formData,
				})

				if (response.ok) {
					submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!'
					contactForm.reset()
					setTimeout(() => {
						submitBtn.innerHTML = originalText
						submitBtn.disabled = false
					}, 3000)
				} else {
					throw new Error("Failed to send message")
				}
			} catch (error) {
				submitBtn.innerHTML =
					'<i class="fas fa-exclamation-triangle me-2"></i>Error - Try Again'
				setTimeout(() => {
					submitBtn.innerHTML = originalText
					submitBtn.disabled = false
				}, 3000)
			}
		})
	}
})
