(() => {
	const currentScript = document.currentScript;
	const scriptUrl = currentScript ? currentScript.src : window.location.href;
	const baseUrl = new URL('./', scriptUrl);

	const navItems = [
		{ label: 'Accueil', path: 'index.html' },
		{ label: 'Vêtements', path: 'pages/categories/vetements.html' },
		{ label: 'Chaussures', path: 'pages/categories/chaussures.html' },
		{ label: 'Accessoires', path: 'pages/categories/accessoires.html' },
		{ label: 'Électroménager', path: 'pages/categories/electromenager.html' },
		{ label: 'Panier', path: 'pages/cart.html', highlight: true },
		{ label: 'Contact', path: 'mailto:contact@you.com?subject=Contact%20Boutique%20YOU', external: true }
	];

	const resolveHref = (path, external) => external ? path : new URL(path, baseUrl).href;

	const normalizePath = (value) => {
		try {
			const url = new URL(value, window.location.href);
			let pathname = url.pathname.replace(/index\.html$/i, '');
			if (pathname.endsWith('/')) {
				pathname = pathname.slice(0, -1);
			}
			return pathname || '/';
		} catch (error) {
			return '';
		}
	};

	const currentPath = normalizePath(window.location.href);

	class SiteHeader extends HTMLElement {
		connectedCallback() {
			this.render();
		}

		render() {
			const logoHref = resolveHref('index.html', false);
			const logoSrc = new URL('../images/you-logo.jpg', baseUrl).href;

			const navLinks = navItems.map(item => {
				const href = resolveHref(item.path, item.external);
				const classes = item.highlight ? 'data-nav highlight-link' : 'data-nav';
				return `
					<li>
						<a class="${classes}" href="${href}" ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
							${item.label}
						</a>
					</li>
				`;
			}).join('');

			this.innerHTML = `
				<header>
					<div class="logo">
						<a href="${logoHref}">
							<img src="${logoSrc}" alt="Logo YOU">
						</a>
					</div>
					<button class="menu-toggle" aria-expanded="false" aria-controls="main-menu">
						<span class="sr-only">Ouvrir le menu</span>
						☰
					</button>
					<nav id="main-menu">
						<ul>
							${navLinks}
						</ul>
					</nav>
				</header>
			`;

			this.activateMenu();
			this.highlightCurrentLink();
		}

		activateMenu() {
			const menuToggle = this.querySelector('.menu-toggle');
			const nav = this.querySelector('#main-menu');
			if (menuToggle && nav) {
				menuToggle.addEventListener('click', () => {
					const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
					menuToggle.setAttribute('aria-expanded', (!expanded).toString());
					nav.classList.toggle('is-open');
				});
			}
		}

		highlightCurrentLink() {
			const links = this.querySelectorAll('a.data-nav');
			links.forEach(link => {
				const isExternal = link.href.startsWith('mailto:');
				if (isExternal) {
					return;
				}
				const linkPath = normalizePath(link.href);
				if (linkPath === currentPath) {
					link.setAttribute('aria-current', 'page');
				}
			});
		}
	}

	if (!customElements.get('site-header')) {
		customElements.define('site-header', SiteHeader);
	}
})();
