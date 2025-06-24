const contactFormSection = document.getElementById('contact');
let form = contactFormSection.querySelector('form'); // Use let to allow reassignment
const originalFormHTML = form.innerHTML; // Store the original form structure
const formAction = form.action; // Store original action
const formMethod = form.method; // Store original method

form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(form);
    const url = form.action;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Important for cross-origin requests to Google Forms
        });

        form.reset(); // Reset the form fields

        // Fade out the current content (form)
        contactFormSection.classList.remove('visible');

        // After fade out, change content and fade in
        setTimeout(() => {
            contactFormSection.innerHTML = `
                <h2>Thank You!</h2>
                <p>Your message has been submitted successfully.</p>
                <a href="#" id="submitAnother">Submit another response</a>
            `;
            // Ensure it's ready for fade-in
            contactFormSection.classList.remove('visible'); // Remove if already there from previous state
            contactFormSection.classList.add('fade-in-effect'); // Ensure base class is present
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    contactFormSection.classList.add('visible');
                });
            });

            const submitAnotherLink = document.getElementById('submitAnother');
            submitAnotherLink.addEventListener('click', (e) => {
                e.preventDefault();
                contactFormSection.classList.remove('visible');
                // Wait for fade out before changing content
                setTimeout(() => {
                    contactFormSection.innerHTML = `<h2>Get in touch</h2>`; 
                    const newForm = document.createElement('form');
                    newForm.action = formAction; 
                    newForm.method = formMethod;
                    newForm.innerHTML = originalFormHTML;
                    contactFormSection.appendChild(newForm);
                    
                    form = newForm; 
                    form.addEventListener('submit', handleSubmit);
                    
                    contactFormSection.classList.add('fade-in-effect');
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            contactFormSection.classList.add('visible');
                        });
                    });
                }, 500); // Match CSS transition duration
            });

        }, 500); // Match CSS transition duration

    } catch (error) {
        console.error('Error submitting form:', error);
        
        contactFormSection.classList.remove('visible');
        setTimeout(() => {
            contactFormSection.innerHTML = `<h2>Get in touch</h2>`;
            const newForm = document.createElement('form');
            newForm.action = formAction;
            newForm.method = formMethod;
            newForm.innerHTML = originalFormHTML;
            contactFormSection.appendChild(newForm);
            
            form = newForm; 
            form.addEventListener('submit', handleSubmit);

            const errorElement = document.createElement('p');
            errorElement.style.color = 'red';
            errorElement.textContent = 'An error occurred. Please try again.';
            form.appendChild(errorElement); 

            contactFormSection.classList.add('fade-in-effect');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    contactFormSection.classList.add('visible');
                });
            });
        }, 500); // Match CSS transition duration
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Intersection Observer for .watch-this-space --- 
    const watchThisSpaceSection = document.querySelector('.watch-this-space');
    if (watchThisSpaceSection) {
        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.1 
        };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); 
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(watchThisSpaceSection);
    } else {
        console.log('.watch-this-space section not found.');
    }

    // --- Header shrink effect --- 
    const header = document.querySelector('header');
    if (!header) {
        console.error('Header element not found for shrink effect!');
        return; // Return from the DOMContentLoaded callback if header is not found
    }

    const shrinkThreshold = 60; 

    function handleHeaderShrink() {
        const scrollPosition = window.scrollY; 

        if (scrollPosition > shrinkThreshold) {
            if (!header.classList.contains('header-shrunk')) {
                header.classList.add('header-shrunk');
            }
        } else {
            if (header.classList.contains('header-shrunk')) {
                header.classList.remove('header-shrunk');
            }
        }
    }

    // Using addEventListener as it's generally preferred over onscroll for multiple listeners scenario
    // though in a single DOMContentLoaded, onscroll is fine if it's the only one.
    window.addEventListener('scroll', handleHeaderShrink);
    
    handleHeaderShrink(); // Initial check

    // Custom email validation for contact form
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        const emailInput = contactForm.querySelector('input[type="email"]');
        const emailErrorId = 'email-custom-error';

        contactForm.addEventListener('submit', function(e) {
            // Remove any previous custom error
            let prevError = contactForm.querySelector(`#${emailErrorId}`);
            if (prevError) prevError.remove();

            const emailValue = emailInput ? emailInput.value.trim().toLowerCase() : '';
            if (
                emailValue.includes('testform.xyz') ||
                emailValue === 'yawiviseya67@gmail.com'
            ) {
                e.preventDefault();
                // Show custom error message
                const errorMsg = document.createElement('div');
                errorMsg.id = emailErrorId;
                errorMsg.style.color = 'red';
                errorMsg.style.fontSize = '0.9rem';
                errorMsg.style.marginTop = '0.25rem';
                errorMsg.textContent = 'This email address is not allowed.';
                emailInput.insertAdjacentElement('afterend', errorMsg);
                emailInput.focus();
            }
        });
    }

}); 