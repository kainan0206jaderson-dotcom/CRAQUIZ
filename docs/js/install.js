/* CRAQUIZ — instalar no celular como app.
   Android (Chrome/Samsung): botão nativo "Instalar". iPhone (Safari): passo a passo para "Adicionar à Tela de Início".
   Some quando o app já está instalado ou quando a pessoa fecha o aviso (guardado no navegador). */
(() => {
  const KEY = 'mf10:install-dismissed';
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (standalone) return;
  let dismissed = false;
  try { dismissed = localStorage.getItem(KEY) === '1'; } catch (e) { /* sem armazenamento */ }
  if (dismissed) return;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  let deferred = null;
  let bar = null;

  function close() {
    if (bar) bar.remove();
    bar = null;
    try { localStorage.setItem(KEY, '1'); } catch (e) { /* ignora */ }
  }
  function show(text, label, onAction) {
    if (bar) bar.remove();
    bar = document.createElement('div');
    bar.className = 'install-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Instalar o CRAQUIZ');
    const p = document.createElement('p');
    p.textContent = text;
    const go = document.createElement('button');
    go.type = 'button';
    go.textContent = label;
    go.addEventListener('click', onAction);
    const x = document.createElement('button');
    x.type = 'button';
    x.className = 'install-x';
    x.setAttribute('aria-label', 'Fechar');
    x.textContent = '×';
    x.addEventListener('click', close);
    bar.append(p, go, x);
    document.body.appendChild(bar);
  }

  // Android: o navegador avisa que pode instalar; guardamos o evento para o botão
  addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    show('Baixe o CRAQUIZ no seu celular e jogue direto da tela inicial.', 'Instalar', async () => {
      if (!deferred) return;
      deferred.prompt();
      try { await deferred.userChoice; } catch (err) { /* ignora */ }
      deferred = null;
      close();
    });
  });
  addEventListener('appinstalled', close);

  // iPhone: sem botão nativo; mostramos como fazer
  if (ios) {
    const start = () => show('Quer o CRAQUIZ na tela inicial do iPhone?', 'Como instalar', () => {
      show('Toque em Compartilhar (ícone com seta para cima) e depois em "Adicionar à Tela de Início".', 'Entendi', close);
    });
    if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start); else start();
  }
})();
