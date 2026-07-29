/**
 * Site interactions: smooth scroll, nav active state, CTA tracking.
 */
document.addEventListener("DOMContentLoaded", () => {
	const navbar = document.querySelector(".navbar")
	const navOffset = () => (navbar ? navbar.offsetHeight : 80)

	window.addEventListener(
		"scroll",
		() => {
			if (!navbar) return
			navbar.classList.toggle("scrolled", window.scrollY > 80)
		},
		{ passive: true }
	)

	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", (e) => {
			const id = anchor.getAttribute("href")
			if (!id || id === "#") return
			const target = document.querySelector(id)
			if (!target) return
			e.preventDefault()
			const top = target.getBoundingClientRect().top + window.scrollY - navOffset()
			window.scrollTo({ top, behavior: "smooth" })
		})
	})

	const navLinks = document.querySelectorAll(".navbar-nav .nav-link")
	const sections = document.querySelectorAll("section[id]")

	window.addEventListener(
		"scroll",
		() => {
			let current = ""
			sections.forEach((section) => {
				if (window.scrollY >= section.offsetTop - 220) {
					current = section.getAttribute("id")
				}
			})
			navLinks.forEach((link) => {
				link.classList.toggle("active", link.getAttribute("href") === `#${current}`)
			})
		},
		{ passive: true }
	)

	const navbarCollapse = document.querySelector(".navbar-collapse")
	if (typeof bootstrap !== "undefined" && navbarCollapse) {
		const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, {
			toggle: false,
		})
		navLinks.forEach((link) => {
			link.addEventListener("click", () => {
				if (window.innerWidth < 992) bsCollapse.hide()
			})
		})
	}

	function pushDataLayer(event, extra = {}) {
		window.dataLayer = window.dataLayer || []
		window.dataLayer.push({ event, ...extra })
	}

	document.querySelectorAll("[data-track]").forEach((el) => {
		el.addEventListener("click", () => {
			pushDataLayer(el.getAttribute("data-track"), {
				href: el.getAttribute("href") || "",
			})
		})
	})

	document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
		if (link.hasAttribute("data-track")) return
		link.addEventListener("click", () => pushDataLayer("cta_call"))
	})
})
