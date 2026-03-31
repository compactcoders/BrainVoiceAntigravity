// Home Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Services Accordion
  initServicesAccordion();
});

/**
 * Services Accordion - Only one open at a time
 */
function initServicesAccordion() {
  const serviceItems = document.querySelectorAll('.service-item');
  
  if (serviceItems.length === 0) return;
  
  serviceItems.forEach(item => {
    const header = item.querySelector('.service-header');
    const toggleBtn = item.querySelector('.service-toggle');
    
    // Add click event to header and button
    [header, toggleBtn].forEach(element => {
      if (element) {
        element.addEventListener('click', function(e) {
          e.stopPropagation();
          
          const isActive = item.classList.contains('active');
          
          // Close all other items
          serviceItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
              otherItem.classList.remove('active');
            }
          });
          
          // Toggle current item
          if (isActive) {
            item.classList.remove('active');
          } else {
            item.classList.add('active');
          }
        });
      }
    });
  });
  
  // Optional: Open first item by default
  // if (serviceItems.length > 0) {
  //   serviceItems[0].classList.add('active');
  // }
}