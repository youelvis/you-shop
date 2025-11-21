(() => {
	const currentScript = document.currentScript;
	const scriptUrl = currentScript ? currentScript.src : window.location.href;
	const baseUrl = new URL('../../', scriptUrl);
	const MENU_COLOR_INTERVAL = 15 * 60 * 1000;
	const menuColors = [
		'linear-gradient(120deg, #1b2845, #274060)',
		'linear-gradient(120deg, #0f2027, #203a43, #2c5364)',
		'linear-gradient(120deg, #1d2671, #c33764)',
		'linear-gradient(120deg, #003973, #e5e5be)',
		'linear-gradient(120deg, #000428, #004e92)'
	];

	const navItems = [
		{
			label: 'Accueil',
			path: 'index.html',
			description: 'Revenir sur la page d’accueil et découvrir les nouveautés.'
		},
		{
			label: 'Vêtements',
			path: 'pages/categories/vetements.html',
			description: 'Collections vêtements pour toute la famille.'
		},
		{
			label: 'Chaussures',
			path: 'pages/categories/chaussures.html',
			description: 'Chaussures confortables pour hommes et femmes.'
		},
		{
			label: 'Accessoires',
			path: 'pages/categories/accessoires.html',
			description: 'Complétez votre look avec nos accessoires tendance.'
		},
		{
			label: 'Électroménager',
			path: 'pages/categories/electromenager.html',
			description: 'Appareils pratiques pour simplifier le quotidien.'
		},
		{
			label: 'Panier',
			path: 'pages/cart.html',
			highlight: true,
			description: 'Consultez les articles ajoutés à votre panier.'
		},
		{
			label: 'Contact',
			path: 'mailto:contact@you.com?subject=Contact%20Boutique%20YOU',
			external: true,
			description: 'Écrivez-nous pour toute question ou demande.'
		}
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
			const logoSrc = new URL('assets/images/you-logo.jpg', baseUrl).href;

			const navLinks = navItems.map(item => {
				const href = resolveHref(item.path, item.external);
				const classes = item.highlight ? 'data-nav highlight-link' : 'data-nav';
				const description = item.description ? `<span class="nav-description">${item.description}</span>` : '';
				return `
					<li>
						<a class="${classes}" href="${href}" ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
							<span class="nav-label">${item.label}</span>
							${description}
						</a>
					</li>
				`;
			}).join('');

			this.innerHTML = `
				<header>
					<div class="flying-critters" aria-hidden="true">
						<span class="ladybug bug-a"></span>
						<span class="ladybug bug-b"></span>
						<span class="butterfly bug-c"></span>
						<span class="butterfly bug-d"></span>
						<span class="dragonfly bug-e"></span>
						<span class="dragonfly bug-f"></span>
					</div>
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
			this.startMenuColorRotation();
			this.ensureGlobalCritters();
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

		startMenuColorRotation() {
			if (this.menuColorIntervalId) {
				clearInterval(this.menuColorIntervalId);
			}
			this.applyMenuColor();
			this.menuColorIntervalId = setInterval(() => this.applyMenuColor(), MENU_COLOR_INTERVAL);
		}

		applyMenuColor() {
			const headerEl = this.querySelector('header');
			if (!headerEl) {
				return;
			}
			const index = Math.floor(Date.now() / MENU_COLOR_INTERVAL) % menuColors.length;
			headerEl.style.background = menuColors[index];
		}

		ensureGlobalCritters() {
			if (document.querySelector('.global-critters')) {
				return;
			}
			const container = document.createElement('div');
			container.className = 'global-critters';
			container.setAttribute('aria-hidden', 'true');
			container.innerHTML = `
				<span class="bug ladybug-body bug-l0"></span>
				<span class="bug ladybug-body bug-l1"></span>
				<span class="bug butterfly-body bug-b0"></span>
				<span class="bug butterfly-body bug-b1"></span>
				<span class="bug dragonfly-body bug-d0"></span>
				<span class="bug dragonfly-body bug-d1"></span>
			`;
			document.body.appendChild(container);
		}
	}

	if (!customElements.get('site-header')) {
		customElements.define('site-header', SiteHeader);
	}
})();
