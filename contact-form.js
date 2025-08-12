// Modern Contact Form Handler
document.addEventListener("DOMContentLoaded", function () {
	const contactForm = document.getElementById("contact-form")

	if (contactForm) {
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

		// Show success state
		showFieldSuccess(field)
		return true
	}

	function showFieldError(field, message) {
		field.classList.remove("is-valid")
		field.classList.add("is-invalid")

		// Remove existing error message
		const existingError = field.parentNode.querySelector(".invalid-feedback")
		if (existingError) {
			existingError.remove()
		}

		// Add error message
		const errorDiv = document.createElement("div")
		errorDiv.className = "invalid-feedback"
		errorDiv.textContent = message
		field.parentNode.appendChild(errorDiv)
	}

	function showFieldSuccess(field) {
		field.classList.remove("is-invalid")
		field.classList.add("is-valid")

		// Remove existing feedback
		const existingFeedback = field.parentNode.querySelector(
			".invalid-feedback, .valid-feedback"
		)
		if (existingFeedback) {
			existingFeedback.remove()
		}

		// Add success message
		const successDiv = document.createElement("div")
		successDiv.className = "valid-feedback"
		successDiv.textContent = "Looks good!"
		field.parentNode.appendChild(successDiv)
	}

	function clearFieldError(field) {
		field.classList.remove("is-invalid")
		const errorDiv = field.parentNode.querySelector(".invalid-feedback")
		if (errorDiv) {
			errorDiv.remove()
		}
	}

	function clearContactFormValidation() {
		const fields = contactForm.querySelectorAll(".is-valid, .is-invalid")
		fields.forEach((field) => {
			field.classList.remove("is-valid", "is-invalid")
		})

		const feedbacks = contactForm.querySelectorAll(
			".invalid-feedback, .valid-feedback"
		)
		feedbacks.forEach((feedback) => {
			feedback.remove()
		})
	}

	function formatPhoneNumber(field) {
		let value = field.value.replace(/\D/g, "")
		if (value.length > 10) value = value.slice(0, 10)

		if (value.length >= 6) {
			value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
		} else if (value.length >= 3) {
			value = value.replace(/(\d{3})(\d{0,3})/, "($1) $2")
		}

		field.value = value
	}

	async function submitContactForm() {
		const submitBtn = contactForm.querySelector('button[type="submit"]')
		const originalText = submitBtn.innerHTML

		// Show loading state
		submitBtn.innerHTML =
			'<i class="fas fa-spinner fa-spin me-2"></i>Sending...'
		submitBtn.disabled = true

		try {
			const formData = new FormData(contactForm)

			// Add timestamp
			formData.append("submission_time", new Date().toISOString())

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
				clearContactFormValidation()
			} else {
				throw new Error("Failed to send message")
			}
		} catch (error) {
			console.error("Contact form submission error:", error)
			showContactError()
		} finally {
			// Reset button state
			setTimeout(() => {
				submitBtn.innerHTML = originalText
				submitBtn.disabled = false
			}, 3000)
		}
	}

	function showContactSuccess() {
		// Create success message
		const successAlert = document.createElement("div")
		successAlert.className =
			"alert alert-success alert-dismissible fade show mt-3"
		successAlert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `

		// Insert after form
		contactForm.parentNode.insertBefore(successAlert, contactForm.nextSibling)

		// Auto-remove after 5 seconds
		setTimeout(() => {
			if (successAlert.parentNode) {
				successAlert.remove()
			}
		}, 5000)

		// Scroll to success message
		successAlert.scrollIntoView({ behavior: "smooth", block: "center" })
	}

	function showContactError() {
		// Create error message
		const errorAlert = document.createElement("div")
		errorAlert.className = "alert alert-danger alert-dismissible fade show mt-3"
		errorAlert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Oops!</strong> There was an error sending your message. Please try again or contact us directly.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `

		// Insert after form
		contactForm.parentNode.insertBefore(errorAlert, contactForm.nextSibling)

		// Auto-remove after 5 seconds
		setTimeout(() => {
			if (errorAlert.parentNode) {
				errorAlert.remove()
			}
		}, 5000)

		// Scroll to error message
		errorAlert.scrollIntoView({ behavior: "smooth", block: "center" })
	}

	// Add character counter for message field
	const messageField = contactForm.querySelector('textarea[name="message"]')
	if (messageField) {
		const counter = document.createElement("small")
		counter.className = "text-muted mt-1 d-block"
		counter.textContent = "0 characters"
		messageField.parentNode.appendChild(counter)

		messageField.addEventListener("input", function () {
			const length = this.value.length
			counter.textContent = `${length} character${length !== 1 ? "s" : ""}`

			// Change color based on length
			if (length > 500) {
				counter.className = "text-danger mt-1 d-block"
			} else if (length > 300) {
				counter.className = "text-warning mt-1 d-block"
			} else {
				counter.className = "text-muted mt-1 d-block"
			}
		})
	}

	// Add form analytics tracking
	contactForm.addEventListener("submit", function () {
		// Track form submission
		console.log("Contact form submitted:", {
			timestamp: new Date().toISOString(),
			formData: Object.fromEntries(new FormData(this)),
		})

		// You can send this data to your analytics service
		// Example: gtag('event', 'contact_form_submit', {
		//     'form_name': 'contact_form'
		// });
	})

	// Add form abandonment tracking
	let formInteracted = false
	const formFields = contactForm.querySelectorAll("input, textarea")

	formFields.forEach((field) => {
		field.addEventListener("input", function () {
			formInteracted = true
		})
	})

	window.addEventListener("beforeunload", function (e) {
		if (formInteracted && !contactForm.classList.contains("submitted")) {
			e.preventDefault()
			e.returnValue =
				"You have unsaved changes. Are you sure you want to leave?"
		}
	})

	console.log("Contact form initialized successfully!")
})
