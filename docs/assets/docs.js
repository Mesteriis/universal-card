(() => {
  const body = document.body;
  const toggle = document.querySelector('.docs-nav-toggle');

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = body.classList.toggle('docs-nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('.docs-content pre').forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code || pre.dataset.copyReady === 'true') {
      return;
    }

    const button = document.createElement('button');
    button.className = 'docs-copy-button';
    button.type = 'button';
    button.textContent = 'Copy';

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent || '');
        button.textContent = 'Copied';
        window.setTimeout(() => {
          button.textContent = 'Copy';
        }, 1800);
      } catch (error) {
        button.textContent = 'Failed';
        window.setTimeout(() => {
          button.textContent = 'Copy';
        }, 1800);
      }
    });

    pre.dataset.copyReady = 'true';
    pre.appendChild(button);
  });
})();
