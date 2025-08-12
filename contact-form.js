// Modern Contact Form Handler
document.addEventListener("DOMContentLoaded", function () {
	const contactForm = document.getElementById("contact-form")

	// Check if contact form exists before proceeding
	if (!contactForm) {
		console.log("Contact form not found, skipping contact form initialization")
		return
	}

	// Form validation and submission
	contactForm.addEventListener("submit", async function (e) {
		e.preventDefault()

		if (validateContactForm()) {
			await submitContactForm()
		}
	})

	// Real-time validation
	setupContactFormValidation()

	// Phone number formatting
	const phoneField = contactForm.querySelector('input[name="phone-number"]')
	if (phoneField) {
		phoneField.addEventListener("input", function (e) {
			formatPhoneNumber(e.target)
		})
	}

	function validateContactForm() {
		let isValid = true
		const requiredFields = contactForm.querySelectorAll("[required]")

		// Clear previous validation states
		clearContactFormValidation()

		// Validate required fields
		requiredFields.forEach((field) => {
			if (!field.value.trim()) {
				showFieldError(field, "This field is required")
				isValid = false
			}
		})

		// Validate email
		const emailField = contactForm.querySelector('input[name="email"]')
		if (emailField && emailField.value.trim()) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(emailField.value.trim())) {
				showFieldError(emailField, "Please enter a valid email address")
				isValid = false
			}
		}

		// Validate phone number
		const phoneField = contactForm.querySelector('input[name="phone-number"]')
		if (phoneField && phoneField.value.trim()) {
			const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
			if (!phoneRegex.test(phoneField.value.trim())) {
				showFieldError(phoneField, "Please enter a valid phone number")
				isValid = false
			}
		}

		return isValid
	}

	function setupContactFormValidation() {
		const fields = contactForm.querySelectorAll("input, textarea")

		fields.forEach((field) => {
			// Real-time validation on blur
			field.addEventListener("blur", function () {
				validateField(this)
			})

			// Clear errors on input
			field.addEventListener("input", function () {
				clearFieldError(this)
			})
		})
	}

	function validateField(field) {
		const value = field.value.trim()

		// Required field validation
		if (field.hasAttribute("required") && !value) {
			showFieldError(field, "This field is required")
			return false
		}

		// Email validation
		if (field.type === "email" && value) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(value)) {
				showFieldError(field, "Please enter a valid email address")
				return false
			}
		}

		// Phone validation
		if (field.name === "phone-number" && value) {
			const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
			if (!phoneRegex.test(value)) {
				showFieldError(field, "Please enter a valid phone number")
				return false
			}
		}

		// Clear error if validation passes
		clearFieldError(field)
		return true
	}

	function showFieldError(field, message) {
		// Remove existing error
		clearFieldError(field)

		// Add error styling
		field.classList.add("is-invalid")

		// Create error message
		const errorDiv = document.createElement("div")
		errorDiv.className = "invalid-feedback"
		errorDiv.textContent = message

		// Insert error message after field
		field.parentNode.appendChild(errorDiv)
	}

	function clearFieldError(field) {
		field.classList.remove("is-invalid")
		const existingError = field.parentNode.querySelector(".invalid-feedback")
		if (existingError) {
			existingError.remove()
		}
	}

	function clearContactFormValidation() {
		const fields = contactForm.querySelectorAll("input, textarea")
		fields.forEach((field) => {
			clearFieldError(field)
		})
	}

	function formatPhoneNumber(input) {
		let value = input.value.replace(/\D/g, "")

		if (value.length >= 6) {
			value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
				6,
				10
			)}`
		} else if (value.length >= 3) {
			value = `(${value.slice(0, 3)}) ${value.slice(3)}`
		}

		input.value = value
	}

	async function submitContactForm() {
		const submitButton = contactForm.querySelector('button[type="submit"]')
		const originalText = submitButton.innerHTML

		// Show loading state
		submitButton.disabled = true
		submitButton.innerHTML =
			'<i class="fas fa-spinner fa-spin me-2"></i>Sending...'

		try {
			const formData = new FormData(contactForm)
			const response = await fetch(contactForm.action, {
				method: "POST",
				body: formData,
				headers: {
					Accept: "application/json",
				},
			})

			if (response.ok) {
				showContactSuccess()
				contactForm.reset()
			} else {
				throw new Error("Form submission failed")
			}
		} catch (error) {
			console.error("Contact form error:", error)
			showContactError()
		} finally {
			// Reset button state
			submitButton.disabled = false
			submitButton.innerHTML = originalText
		}
	}

	function showContactSuccess() {
		// Create success message
		const successMessage = document.createElement("div")
		successMessage.className = "alert alert-success mt-3"
		successMessage.innerHTML = `
			<i class="fas fa-check-circle me-2"></i>
			Thank you for your message! We'll get back to you within 24 hours.
		`

		// Insert after form
		contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling)

		// Remove after 5 seconds
		setTimeout(() => {
			successMessage.remove()
		}, 5000)
	}

	function showContactError() {
		// Create error message
		const errorMessage = document.createElement("div")
		errorMessage.className = "alert alert-danger mt-3"
		errorMessage.innerHTML = `
			<i class="fas fa-exclamation-circle me-2"></i>
			Sorry, there was an error sending your message. Please try again or call us directly.
		`

		// Insert after form
		contactForm.parentNode.insertBefore(errorMessage, contactForm.nextSibling)

		// Remove after 5 seconds
		setTimeout(() => {
			errorMessage.remove()
		}, 5000)
	}

	// Character counter for message field
	const messageField = contactForm.querySelector('textarea[name="message"]')
	if (messageField) {
		const counter = document.createElement("small")
		counter.className = "text-muted mt-1 d-block"
		counter.textContent = "0/500 characters"

		messageField.parentNode.appendChild(counter)

		messageField.addEventListener("input", function () {
			const length = this.value.length
			counter.textContent = `${length}/500 characters`

			if (length > 450) {
				counter.className = "text-warning mt-1 d-block"
			} else {
				counter.className = "text-muted mt-1 d-block"
			}
		})
	}

	// Form abandonment tracking
	let formStartTime = Date.now()
	let hasInteracted = false

	contactForm.addEventListener("focusin", function () {
		if (!hasInteracted) {
			hasInteracted = true
			console.log("Contact form interaction started")
		}
	})

	window.addEventListener("beforeunload", function () {
		if (hasInteracted && !contactForm.checkValidity()) {
			const timeSpent = Math.round((Date.now() - formStartTime) / 1000)
			console.log("Contact form abandoned after", timeSpent, "seconds")
			// You can send this data to your analytics service
		}
	})
})
