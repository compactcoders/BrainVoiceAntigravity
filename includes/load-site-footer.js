(function () {
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
		})
		.catch(function (err) {
			console.error('[site-footer]', err);
		});
})();
