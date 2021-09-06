    var contactForm = document.getElementById("contact-form");
    
    async function handleSubmit(event) {
      event.preventDefault();
      var status = document.getElementById("contact-form-status");
      var data = new FormData(event.target);
      fetch(event.target.action, {
        method: contactForm.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        status.innerHTML = "Thanks for your submission!";
        contactForm.reset()
      }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting your form"
      });

      
    }

    contactForm.addEventListener("submit", handleSubmit)