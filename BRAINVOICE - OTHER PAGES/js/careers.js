// Careers Page Specific JavaScript

const WEB3FORMS_ACCESS_KEY = '66d77104-7dfb-4961-b5b2-d83058045a3a';

document.addEventListener('DOMContentLoaded', function() {
  setupFileUploads();
  setupCareerFormSubmission();
});

// Update label on file selection
function setupFileUploads() {
  const resumeInput = document.getElementById('resume');
  const coverLetterInput = document.getElementById('coverLetter');
  
  if (resumeInput) {
    resumeInput.addEventListener('change', function() {
      const fileName = this.files[0] ? this.files[0].name : 'Choose File';
      const placeholder = document.getElementById('resumeFileName');
      if (placeholder) placeholder.textContent = fileName;
    });
  }
  
  if (coverLetterInput) {
    coverLetterInput.addEventListener('change', function() {
      const fileName = this.files[0] ? this.files[0].name : 'Choose File';
      const placeholder = document.getElementById('coverLetterFileName');
      if (placeholder) placeholder.textContent = fileName;
    });
  }
}

// Form Validation & Submission
function setupCareerFormSubmission() {
  const form = document.getElementById('careerForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (field.type === 'file') {
        if (!field.files || field.files.length === 0) {
          isValid = false;
          const wrapper = field.parentNode.querySelector('.file-input-wrapper') || field;
          wrapper.style.borderColor = '#ff4444';
          showFieldError(field, 'Please upload the required file');
        } else {
          const wrapper = field.parentNode.querySelector('.file-input-wrapper') || field;
          wrapper.style.borderColor = '';
          removeFieldError(field);
        }
      } else {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#ff4444';
          showFieldError(field, 'This field is required');
        } else {
          field.style.borderColor = '';
          removeFieldError(field);
        }
      }
    });
    
    // Validate email format
    const email = document.getElementById('email');
    if (email && email.value && !isValidEmail(email.value)) {
      isValid = false;
      email.style.borderColor = '#ff4444';
      showFieldError(email, 'Please enter a valid email address');
    }
    
    if (isValid) {
      const submitBtn = form.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting... <i class="fas fa-spinner fa-spin"></i>';
      
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const fullName = [firstName, lastName].filter(Boolean).join(' ');
      
      // Use FormData to support file uploads to Web3Forms
      const formData = new FormData(form);
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('subject', 'New Job Application: ' + (fullName || 'Unknown Candidate'));
      
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          showNotification('Application submitted successfully! We\'ll review it and get back to you.', 'success');
          form.reset();
          // Reset file placeholders
          const resumeLabel = document.getElementById('resumeFileName');
          if (resumeLabel) resumeLabel.textContent = 'Choose File';
          const coverLetterLabel = document.getElementById('coverLetterFileName');
          if (coverLetterLabel) coverLetterLabel.textContent = 'Choose File';
        } else {
          console.error(response);
          showNotification(json.message || 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch(error => {
        console.error(error);
        showNotification('Submission failed. Please check your internet connection.', 'error');
      })
      .then(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
    } else {
      showNotification('Please fill in all required fields correctly.', 'error');
    }
  });
}

function showFieldError(field, message) {
  let errorMsg = field.parentNode.querySelector('.error-message');
  if (!errorMsg) {
    errorMsg = document.createElement('span');
    errorMsg.className = 'error-message';
    errorMsg.style.color = '#ff4444';
    errorMsg.style.fontSize = '0.85rem';
    errorMsg.style.marginTop = '0.25rem';
    errorMsg.style.display = 'block';
    field.parentNode.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
}

function removeFieldError(field) {
  const errorMsg = field.parentNode.querySelector('.error-message');
  if (errorMsg) {
    errorMsg.remove();
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}


