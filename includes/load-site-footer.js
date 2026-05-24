(function () {
	// Fallback global notification system if not defined by script.js
	if (typeof window.showNotification !== 'function') {
		window.showNotification = function (message, type) {
			type = type || 'info';
			var existingNotification = document.querySelector('.notification');
			if (existingNotification) {
				existingNotification.remove();
			}
			
			var notification = document.createElement('div');
			notification.className = 'notification notification-' + type;
			
			var icon = 'fa-info-circle';
			if (type === 'success') icon = 'fa-check-circle';
			if (type === 'error') icon = 'fa-exclamation-circle';
			
			notification.innerHTML = '<i class="fas ' + icon + '"></i><span>' + message + '</span>';
			
			var colors = {
				success: { bg: '#51C186' },
				error: { bg: '#ff4444' },
				info: { bg: '#13B0CB' }
			};
			
			notification.style.cssText = 'position: fixed;' +
				'top: 20px;' +
				'right: 20px;' +
				'background: ' + (colors[type] ? colors[type].bg : colors.info.bg) + ';' +
				'color: white;' +
				'padding: 1rem 1.5rem;' +
				'border-radius: 50px;' +
				'box-shadow: 0 4px 20px rgba(0,0,0,0.2);' +
				'z-index: 10000;' +
				'display: flex;' +
				'align-items: center;' +
				'gap: 0.75rem;' +
				'animation: slideIn 0.3s ease;' +
				'font-weight: 500;';
			
			document.body.appendChild(notification);
			
			if (!document.querySelector('#notification-keyframes')) {
				var style = document.createElement('style');
				style.id = 'notification-keyframes';
				style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }' +
					'@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
				document.head.appendChild(style);
			}
			
			setTimeout(function () {
				notification.style.animation = 'slideOut 0.3s ease';
				setTimeout(function () {
					if (notification.parentNode) {
						notification.remove();
					}
				}, 300);
			}, 3000);
		};
	}

	function resolveIncludesBase() {
		var script = document.currentScript;
		if (!script || !script.src) {
			return '/includes/';
		}
		return script.src.replace(/\/[^/]*$/, '/');
	}

	var mount = document.getElementById('site-footer-mount');
	if (!mount) {
		return;
	}

	var base = resolveIncludesBase();
	var cssHref = base + 'site-footer.css';
	if (!document.querySelector('link[data-site-footer-css]')) {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = cssHref;
		link.setAttribute('data-site-footer-css', '1');
		document.head.appendChild(link);
	}

	if (!document.querySelector('link[data-site-footer-fa]')) {
		var fa = document.createElement('link');
		fa.rel = 'stylesheet';
		fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
		fa.setAttribute('data-site-footer-fa', '1');
		document.head.appendChild(fa);
	}

	fetch(base + 'site-footer.html')
		.then(function (res) {
			if (!res.ok) {
				throw new Error('Footer load failed: ' + res.status);
			}
			return res.text();
		})
		.then(function (html) {
			mount.outerHTML = html;
			
			// Setup footer form handling
			var footerForm = document.querySelector('.bv-site-footer__form');
			if (footerForm) {
				var rootPath = base.replace(/\/includes\/$/, '/');
				footerForm.addEventListener('submit', function (e) {
					e.preventDefault();
					
					var first_name_input = footerForm.querySelector('input[name="first_name"]');
					var last_name_input = footerForm.querySelector('input[name="last_name"]');
					var email_input = footerForm.querySelector('input[name="email"]');
					
					var first_name = first_name_input ? first_name_input.value.trim() : '';
					var last_name = last_name_input ? last_name_input.value.trim() : '';
					var email = email_input ? email_input.value.trim() : '';
					
					var submitBtn = footerForm.querySelector('.bv-site-footer__submit');
					var originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
					if (submitBtn) {
						submitBtn.disabled = true;
						submitBtn.innerHTML = 'Submitting... <i class="fas fa-spinner fa-spin"></i>';
					}
					
					fetch('https://api.web3forms.com/submit', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json'
						},
						body: JSON.stringify({
							access_key: '66d77104-7dfb-4961-b5b2-d83058045a3a',
							subject: 'New Get Started Form Submission',
							name: (first_name + ' ' + last_name).trim() || 'Anonymous User',
							email: email
						})
					})
					.then(function () {
						// Redirect to contact page with pre-filled parameters
						var redirectUrl = rootPath + 'BRAINVOICE%20-%20OTHER%20PAGES/contactus.html?' +
							'first_name=' + encodeURIComponent(first_name) +
							'&last_name=' + encodeURIComponent(last_name) +
							'&email=' + encodeURIComponent(email);
						window.location.href = redirectUrl;
					})
					.catch(function (err) {
						console.error('[footer-form]', err);
						// Redirect anyway so the user gets to the contact page
						var redirectUrl = rootPath + 'BRAINVOICE%20-%20OTHER%20PAGES/contactus.html?' +
							'first_name=' + encodeURIComponent(first_name) +
							'&last_name=' + encodeURIComponent(last_name) +
							'&email=' + encodeURIComponent(email);
						window.location.href = redirectUrl;
					});
				});
			}
		})
		.catch(function (err) {
			console.error('[site-footer]', err);
		});
})();
