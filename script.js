document.addEventListener('DOMContentLoaded', () => {
	const emailInput = document.getElementById('email');
	const passInput = document.getElementById('pass');
	const loginBtn = document.getElementById('login-button');
	const createBtn = document.getElementById('create-new-acc');
	const forgotLink = document.getElementById('forgot');
	const loginInterface = document.querySelector('.login-interface');

	function showMessage(text, type = 'info') {
		let msg = document.querySelector('.login-message');
		if (!msg) {
			msg = document.createElement('div');
			msg.className = 'login-message';
			Object.assign(msg.style, {
				padding: '10px',
				marginTop: '10px',
				borderRadius: '4px',
				fontSize: '14px'
			});
			if (loginInterface) loginInterface.appendChild(msg);
			else document.body.appendChild(msg);
		}

		msg.textContent = text;
		msg.style.display = 'block';
		if (type === 'error') {
			msg.style.background = '#fdecea';
			msg.style.color = '#611';
			msg.style.border = '1px solid #f5c6cb';
		} else if (type === 'success') {
			msg.style.background = '#e6ffed';
			msg.style.color = '#064';
			msg.style.border = '1px solid #c3f0d3';
		} else {
			msg.style.background = '#eef6ff';
			msg.style.color = '#044';
			msg.style.border = '1px solid #cfe8ff';
		}

		clearTimeout(msg._hideTimer);
		msg._hideTimer = setTimeout(() => {
			msg.style.display = 'none';
		}, 4500);
	}

	function validateLogin(email, password) {
		if (!email || email.length < 5) return 'Enter a valid email or phone number.';
		if (!password || password.length < 8) return 'Password must be at least 8 characters.';
		return null;
	}

	function handleLogin(e) {
		e && e.preventDefault && e.preventDefault();
		const email = emailInput ? emailInput.value.trim() : '';
		const password = passInput ? passInput.value : '';

		const validationError = validateLogin(email, password);
		if (validationError) {
			showMessage(validationError, 'error');
			return;
		}

		// Accept any validated credentials (no server). Create a local session.
		localStorage.setItem('fb_user', email);
		showMessage('Login successful. Redirecting...', 'success');

		// Update UI to logged-in state after a short delay
		setTimeout(() => {
			showLoggedInUI(email);
		}, 600);
	}

	function showLoggedInUI(email) {
		// Hide login interface and show a simple welcome area
		if (loginInterface) loginInterface.style.display = 'none';
		let header = document.querySelector('.facebook');
		if (!header) header = document.createElement('div');
		const welcome = document.createElement('div');
		welcome.className = 'fb-welcome';
		welcome.innerHTML = `
			<h2>Welcome, ${email}</h2>
			<p>You are logged in (client-side session).</p>
			<button id="fb-logout" style="padding:6px 10px">Log out</button>
		`;
		header.insertAdjacentElement('afterend', welcome);

		document.getElementById('fb-logout').addEventListener('click', () => {
			localStorage.removeItem('fb_user');
			welcome.remove();
			if (loginInterface) loginInterface.style.display = '';
			showMessage('Logged out.', 'info');
		});
	}

	function createPasswordToggle() {
		if (!passInput) return;
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.textContent = 'Show';
		Object.assign(btn.style, {
			marginLeft: '8px',
			padding: '6px 8px',
			fontSize: '12px',
			cursor: 'pointer'
		});

		btn.addEventListener('click', () => {
			if (passInput.type === 'password') {
				passInput.type = 'text';
				btn.textContent = 'Hide';
			} else {
				passInput.type = 'password';
				btn.textContent = 'Show';
			}
			passInput.focus();
		});

		passInput.insertAdjacentElement('afterend', btn);
	}

	function openCreateAccountModal() {
		const overlay = document.createElement('div');
		overlay.id = 'create-modal-overlay';
		Object.assign(overlay.style, {
			position: 'fixed',
			inset: '0',
			background: 'rgba(0,0,0,0.5)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: '9999'
		});

		const modal = document.createElement('div');
		Object.assign(modal.style, {
			width: '320px',
			background: '#fff',
			padding: '18px',
			borderRadius: '8px',
			boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
		});

		modal.innerHTML = `
			<h3 style="margin:0 0 10px 0">Create New Account (demo)</h3>
			<input id="ca-first" placeholder="First name" style="width:100%;padding:8px;margin-bottom:8px" />
			<input id="ca-last" placeholder="Last name" style="width:100%;padding:8px;margin-bottom:8px" />
			<input id="ca-email" placeholder="Email or mobile" style="width:100%;padding:8px;margin-bottom:8px" />
			<input id="ca-pass" placeholder="New password" type="password" style="width:100%;padding:8px;margin-bottom:12px" />
			<div style="text-align:right">
				<button id="ca-cancel" style="margin-right:8px;padding:6px 10px">Cancel</button>
				<button id="ca-submit" style="padding:6px 10px">Create</button>
			</div>
		`;

		overlay.appendChild(modal);
		document.body.appendChild(overlay);

		overlay.addEventListener('click', (ev) => {
			if (ev.target === overlay) document.body.removeChild(overlay);
		});

		document.getElementById('ca-cancel').addEventListener('click', () => {
			document.body.removeChild(overlay);
		});

		document.getElementById('ca-submit').addEventListener('click', () => {
			const first = document.getElementById('ca-first').value.trim();
			const last = document.getElementById('ca-last').value.trim();
			const email = document.getElementById('ca-email').value.trim();
			const pass = document.getElementById('ca-pass').value;

			if (!first || !last || !email || pass.length < 8) {
				alert('Please fill all fields. Password must be 8+ characters.');
				return;
			}

			// Demo: simply show success and close modal
			alert('Account created (demo). You can now log in with demo credentials.');
			if (document.body.contains(overlay)) document.body.removeChild(overlay);
		});
	}

	// Attach events
	if (loginBtn) loginBtn.addEventListener('click', handleLogin);
	if (createBtn) createBtn.addEventListener('click', (e) => { e.preventDefault(); openCreateAccountModal(); });
	if (forgotLink) forgotLink.addEventListener('click', (e) => { e.preventDefault(); showMessage('Password reset link sent (demo). Check your email.', 'info'); });

	// Enter key submits login
	[emailInput, passInput].forEach((el) => {
		if (!el) return;
		el.addEventListener('keydown', (ev) => {
			if (ev.key === 'Enter') handleLogin(ev);
		});
	});

	createPasswordToggle();

});

