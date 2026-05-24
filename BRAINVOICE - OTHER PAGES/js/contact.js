// Contact Page Specific JavaScript

const WEB3FORMS_ACCESS_KEY = '66d77104-7dfb-4961-b5b2-d83058045a3a';

document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion
  setupFAQAccordion();
  
  // Form Submission
  setupFormSubmission();
  
  // Auto-populate office field (if needed)
  autoPopulateOffice();
  
  // Pre-fill form fields from URL parameters (e.g. from footer redirection)
  prefillFromQueryParams();
});

// Setup FAQ Accordion
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// Auto-populate office field
function autoPopulateOffice() {
  const officeField = document.getElementById('office');
  if (officeField) {
    // You can dynamically set this based on user location or selection
    // For now, it's already set in HTML
  }
}

// Pre-fill from URL parameters (e.g., when redirected from footer)
function prefillFromQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const firstName = urlParams.get('first_name');
  const lastName = urlParams.get('last_name');
  const emailParam = urlParams.get('email');
  
  if (firstName || lastName) {
    const nameField = document.getElementById('name');
    if (nameField) {
      nameField.value = [firstName, lastName].filter(Boolean).join(' ');
    }
  }
  if (emailParam) {
    const emailField = document.getElementById('email');
    if (emailField) {
      emailField.value = emailParam;
    }
  }
}

// Setup form submission
function setupFormSubmission() {
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate required fields
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#ff4444';
          
          // Add error message
          let errorMsg = field.parentNode.querySelector('.error-message');
          if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#ff4444';
            errorMsg.style.fontSize = '0.85rem';
            errorMsg.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorMsg);
          }
          errorMsg.textContent = 'This field is required';
        } else {
          field.style.borderColor = '';
          const errorMsg = field.parentNode.querySelector('.error-message');
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      });
      
      // Validate email format
      const email = document.getElementById('email');
      if (email && email.value && !isValidEmail(email.value)) {
        isValid = false;
        email.style.borderColor = '#ff4444';
        
        let errorMsg = email.parentNode.querySelector('.error-message');
        if (!errorMsg) {
          errorMsg = document.createElement('span');
          errorMsg.className = 'error-message';
          errorMsg.style.color = '#ff4444';
          errorMsg.style.fontSize = '0.85rem';
          errorMsg.style.marginTop = '0.25rem';
          email.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = 'Please enter a valid email address';
      }
      
      if (isValid) {
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        
        // Collect form data
        const formData = {
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'New Contact Message from ' + document.getElementById('name').value,
          name: document.getElementById('name').value,
          company: document.getElementById('company').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          role: document.getElementById('role').value,
          office: document.getElementById('office').value,
          message: document.getElementById('message').value
        };
        
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(async (response) => {
          let json = await response.json();
          if (response.status == 200) {
            showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
            form.reset();
          } else {
            console.log(response);
            showNotification(json.message || 'Something went wrong. Please try again.', 'error');
          }
        })
        .catch(error => {
          console.log(error);
          showNotification('Form submission failed. Please check your internet connection.', 'error');
        })
        .then(() => {
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        });
      } else {
        showNotification('Please fill in all required fields correctly.', 'error');
      }
    });
  }
}

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
