// Contact Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion
  setupFAQAccordion();
  
  // Form Submission
  setupFormSubmission();
  
  // Auto-populate office field (if needed)
  autoPopulateOffice();
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
        // Collect form data
        const formData = {
          name: document.getElementById('name').value,
          company: document.getElementById('company').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          role: document.getElementById('role').value,
          message: document.getElementById('message').value,
          timestamp: new Date().toISOString()
        };
        
        // Simulate API call
        console.log('Form submitted:', formData);
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
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

// Show notification (reusing from script.js)
function showNotification(message, type = 'info') {
  // Check if function exists in global scope
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
  } else {
    // Fallback notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#51C186' : type === 'error' ? '#ff4444' : '#13B0CB'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 50px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideIn 0.3s ease;
      font-weight: 500;
    `;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}