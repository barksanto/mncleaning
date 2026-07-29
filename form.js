/**
 * Single-step quote form: validation, honeypot spam check,
 * Formspree submit, success UI, and GTM dataLayer events.
 */
document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("quote-form-element")
	const successEl = document.getElementById("quote-success")
	const submitBtn = document.getElementById("submit-btn")

	if (!form || !submitBtn) return

	const phoneField = form.querySelector('input[name="phone"]')
	const zipField = form.querySelector('input[name="zip"]')

	if (phoneField) {
		phoneField.addEventListener("input", () => formatPhoneNumber(phoneField))
	}
	if (zipField) {
		zipField.addEventListener("input", () => {
			zipField.value = zipField.value.replace(/\D/g, "").slice(0, 5)
		})
	}

	form.querySelectorAll("input, select, textarea").forEach((field) => {
		field.addEventListener("blur", () => {
			if (field.name === "website_url") return
			validateField(field)
		})
		field.addEventListener("input", () => clearFieldError(field))
		field.addEventListener("change", () => clearFieldError(field))
	})

	form.addEventListener("submit", async (e) => {
		e.preventDefault()

		const honeypot = form.querySelector('input[name="website_url"]')
		if (honeypot && honeypot.value.trim() !== "") {
			// Silent success for bots
			showSuccess()
			pushDataLayer("quote_spam_blocked")
			return
		}

		if (!validateForm()) {
			const firstInvalid = form.querySelector(".is-invalid")
			if (firstInvalid) firstInvalid.focus()
			return
		}

		submitBtn.classList.add("loading")
		submitBtn.disabled = true

		try {
			const formData = new FormData(form)
			formData.delete("website_url")
			formData.append("submission_time", new Date().toISOString())
			formData.append("_subject", "New M&N Cleaning Quote Request")

			const response = await fetch(form.action, {
				method: "POST",
				body: formData,
				headers: { Accept: "application/json" },
			})

			if (!response.ok) throw new Error("Submission failed")

			pushDataLayer("quote_submit_success", {
				service_type: formData.get("service-type") || "",
				zip: formData.get("zip") || "",
			})
			showSuccess()
			form.reset()
			clearAllValidation()
		} catch (err) {
			console.error("Quote form error:", err)
			pushDataLayer("quote_submit_error")
			showError()
		} finally {
			submitBtn.classList.remove("loading")
			submitBtn.disabled = false
		}
	})

	function validateForm() {
		let ok = true
		form.querySelectorAll("[required]").forEach((field) => {
			if (!validateField(field)) ok = false
		})
		return ok
	}

	function validateField(field) {
		const value = field.value.trim()
		let valid = true
		let message = "This field is required"

		if (field.hasAttribute("required") && !value) {
			valid = false
		} else if (field.type === "email" && value) {
			valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
			message = "Please enter a valid email address"
		} else if (field.name === "phone" && value) {
			const digits = value.replace(/\D/g, "")
			valid = digits.length === 10
			message = "Please enter a 10-digit phone number"
		} else if (field.name === "zip" && value) {
			valid = /^\d{5}$/.test(value)
			message = "Please enter a 5-digit zip code"
		}

		clearFieldError(field)
		if (!valid) {
			field.classList.add("is-invalid")
			const feedback = document.createElement("div")
			feedback.className = "invalid-feedback"
			feedback.textContent = message
			field.parentNode.appendChild(feedback)
		}
		return valid
	}

	function clearFieldError(field) {
		field.classList.remove("is-invalid")
		const existing = field.parentNode.querySelector(".invalid-feedback")
		if (existing) existing.remove()
	}

	function clearAllValidation() {
		form.querySelectorAll(".is-invalid").forEach((f) => f.classList.remove("is-invalid"))
		form.querySelectorAll(".invalid-feedback").forEach((el) => el.remove())
	}

	function formatPhoneNumber(input) {
		let digits = input.value.replace(/\D/g, "").slice(0, 10)
		if (digits.length >= 6) {
			input.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
		} else if (digits.length >= 3) {
			input.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`
		} else {
			input.value = digits
		}
	}

	function showSuccess() {
		form.style.display = "none"
		if (successEl) {
			successEl.classList.add("is-visible")
			successEl.scrollIntoView({ behavior: "smooth", block: "center" })
		}
		const modalEl = document.getElementById("successModal")
		if (modalEl && typeof bootstrap !== "undefined") {
			bootstrap.Modal.getOrCreateInstance(modalEl).show()
		}
	}

	function showError() {
		let errorModal = document.getElementById("errorModal")
		if (!errorModal) {
			errorModal = document.createElement("div")
			errorModal.className = "modal fade"
			errorModal.id = "errorModal"
			errorModal.innerHTML = `
				<div class="modal-dialog modal-dialog-centered">
					<div class="modal-content">
						<div class="modal-body text-center p-5">
							<h4 class="fw-bold text-danger mb-3">Something went wrong</h4>
							<p class="mb-4">Please try again or call us at 617-719-0054.</p>
							<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>`
			document.body.appendChild(errorModal)
		}
		if (typeof bootstrap !== "undefined") {
			bootstrap.Modal.getOrCreateInstance(errorModal).show()
		}
	}

	function pushDataLayer(event, extra = {}) {
		window.dataLayer = window.dataLayer || []
		window.dataLayer.push({ event, ...extra })
	}
})
