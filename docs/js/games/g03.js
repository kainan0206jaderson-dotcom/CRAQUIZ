/* Jogo 3 — FUT10 Wordle (Wordle com o nome de guerra do jogador) */
(function () {
  'use strict';
  const MF = window.MF, h = MF.h, t = (k) => MF.t(k);
  const up = (s) => MF.norm(s).replace(/ /g, '').toUpperCase();

  // palavra do dia por dificuldade (jogadores de 1990 em diante):
  // fácil = craques muito conhecidos, com dicas; normal = famosos; difícil = conhecidos; lendário = qualquer jogador relevante
  const LV = {
    easy: [(p) => (p.famous || p.legend) && p.r >= 86, 4, 7, 6],
    normal: [(p) => p.famous || p.r >= 83, 4, 8, 6],
    hard: [(p) => p.r >= 79, 4, 9, 5],
    legend: [(p) => p.r >= 75, 4, 10, 5],
  };
  // nome de guerra: o apelido curado; senão o nome de uma palavra (Casemiro) ou o sobrenome (Haaland)
  function warName(p) {
    const fn = (p.fn || '').trim();
    if (fn && !/\s/.test(fn)) return fn;
    const toks = p.n.trim().split(/\s+/);
    if (toks.length === 1) return toks[0];
    if (toks.length === 2 && !['Brazil', 'Portugal'].includes(p.nat) && !/^(junior|júnior|jr\.?|filho|neto)$/i.test(toks[1])) return toks[1];
    return null;
  }
  function pools(lvl) {
    MF._w2 = MF._w2 || {};
    const NEW = MF.isNew();
    const ck = lvl + (NEW ? ':n' : '');
    if (MF._w2[ck]) return MF._w2[ck];
    const [ok0, lo, hi] = LV[lvl] || LV.normal;
    // a partir de 16/10/2026: palavra do dia pelo critério de jogadores do nível (no Lendário, a base de sempre)
    const ok = NEW && lvl !== 'legend' ? (p) => MF.playerOk(lvl, p, { answer: true }) : ok0;
    const words = new Map();
    for (const p of MF.data.P.slice(0, MF.CORE_N)) {
      if (!MF.era(p) || !ok(p)) continue;
      const nm = warName(p);
      if (!nm || !/^[a-zà-ÿ'.-]+$/i.test(nm)) continue;
      const w = up(nm);
      if (w.length < lo || w.length > hi) continue;
      if (!words.has(w) || words.get(w).r < p.r) words.set(w, p);
    }
    const list = [...words.keys()].sort();
    return (MF._w2[ck] = { list, map: words });
  }

  MF.registerGame({
    num: 3, slug: 'craque-secreto', tag: () => t('wdChances'),
    rules: {
      pt: ['Descubra o nome de guerra do jogador (como ele é conhecido no futebol, ex.: KAKÁ, ROMÁRIO, MESSI). Só jogadores de 1990 para cá.', 'Toque num quadrado para escolher onde a letra vai: você pode colocar letras em quadrados diferentes, em qualquer ordem, e deixar outros vazios. Digite a letra no quadrado marcado (ele avança sozinho) ou use as setas. Verde: letra certa no lugar certo. Amarelo: a letra existe em outro lugar. Cinza: não está no nome. Acentos não contam.', 'Ajuda: uma vez por partida, revela uma letra no lugar certo.', 'Fácil: craques muito conhecidos na mídia, com seleção, posição e último clube como dica, e 6 chances. Normal: jogadores conhecidos que jogam nos clubes mais conhecidos, com a posição como dica, e 6 chances. Difícil: jogadores dos clubes tradicionais das principais ligas e lendas que pararam de 2010 para cá (sem os mais óbvios), sem dicas, 5 chances. Lendário: qualquer jogador relevante, sem dicas, 5 chances e o teclado não mostra cores.'],
      en: ['Find the player’s football name (how he is known, e.g. KAKÁ, ROMÁRIO, MESSI). Only players from 1990 on.', 'Tap a square to choose where the letter goes: you can place letters in any squares, in any order, and leave others empty. Type the letter into the selected square (it moves on by itself) or use the arrows. Green: right letter, right spot. Yellow: the letter is elsewhere. Grey: not in the name. Accents do not matter.', 'Help: once per game, reveals one letter in the right spot.', 'Easy: stars well known in the media, with nation, position and last club as hints, and 6 chances. Normal: well-known players of the best-known clubs, position as a hint, 6 chances. Hard: players of traditional top-league clubs and legends who retired from 2010 on (no obvious picks), no hints, 5 chances. Legendary: any relevant player, no hints, 5 chances and the keyboard shows no colours.'],
      es: ['Descubre el nombre futbolístico del jugador (cómo se le conoce, ej.: KAKÁ, ROMÁRIO, MESSI). Solo jugadores de 1990 en adelante.', 'Toca un cuadro para elegir dónde va la letra: puedes poner letras en cualquier cuadro, en cualquier orden, y dejar otros vacíos. Escribe la letra en el cuadro marcado (avanza solo) o usa las flechas. Verde: letra correcta en su lugar. Amarillo: la letra está en otro lugar. Gris: no está en el nombre. Las tildes no cuentan.', 'Ayuda: una vez por partida, revela una letra en su sitio.', 'Fácil: cracks muy conocidos en los medios, con selección, posición y último club como pista, y 6 oportunidades. Normal: jugadores conocidos de los clubes más conocidos, la posición como pista, 6 oportunidades. Difícil: jugadores de clubes tradicionales de las grandes ligas y leyendas retiradas desde 2010 (sin los más obvios), sin pistas, 5 oportunidades. Legendario: cualquier jugador relevante, sin pistas, 5 oportunidades y el teclado no muestra colores.'],
    },
    options: [
      MF.levelOpt(),
      MF.timerOpt([0, 180, 90]),
    ],
    preview() {
      const row = (w, c) => h('span', { class: 'pv-row' }, [...w].map((l, i) => h('b', { class: c[i] }, l)));
      return h('div', { class: 'pv-wordle' }, row('PELE', ['y', 'g', '', '']), row('MESSI', ['g', 'g', 'g', 'g', 'g']));
    },
    play(board, ctx) {
      const lvl = MF.level(ctx.state);
      const { list, map } = pools(lvl);
      const word = MF.dailyPick(MF.isNew() ? 'g3-wordle4' : 'g3-wordle3', lvl, (l) => pools(l).list);
      const player = map.get(word);
      const L = word.length, ROWS = LV[lvl][3];
      const st = ctx.state;
      st.guesses = st.guesses || [];
      // linha em digitação: uma posição por quadrado ('' = vazio); o quadrado selecionado recebe a próxima letra
      let cur = Array(L).fill('');
      let sel = 0;
      const EMPTY = '.'; // quadrado vazio dentro de uma tentativa já enviada

      const grid = h('div', { class: 'wd-grid', style: { '--n': L }, role: 'grid', 'aria-label': t('attempts') });
      const kb = h('div', { class: 'kb' });
      const score = (g) => {
        const res = Array(L).fill('x');
        const cnt = {};
        for (let i = 0; i < L; i++) if (g[i] === word[i]) res[i] = 'g'; else cnt[word[i]] = (cnt[word[i]] || 0) + 1;
        for (let i = 0; i < L; i++) if (res[i] !== 'g' && cnt[g[i]] > 0) { res[i] = 'y'; cnt[g[i]]--; }
        return res;
      };
      const nextEmpty = (i) => {
        for (let j = i + 1; j < L; j++) if (!cur[j]) return j;
        for (let j = 0; j < L; j++) if (!cur[j]) return j;
        return i;
      };
      function paint(revealRow) {
        MF.clear(grid);
        const live = !ctx.finished();
        for (let r = 0; r < ROWS; r++) {
          const row = h('div', { class: 'wd-row', role: 'row' });
          const g = st.guesses[r];
          const sc = g ? score(g) : null;
          const editing = r === st.guesses.length && live;
          for (let c = 0; c < L; c++) {
            const raw = g ? (g[c] === EMPTY ? '' : g[c]) : editing ? cur[c] || '' : '';
            const isSel = editing && c === sel;
            row.appendChild(h('div', {
              class: 'wd-cell' + (sc ? ' s-' + sc[c] : raw ? ' typed' : '') + (r === revealRow ? ' flip' : '') + (isSel ? ' sel' : ''),
              style: r === revealRow ? { animationDelay: c * 110 + 'ms' } : null, role: 'gridcell',
              'aria-selected': isSel ? 'true' : null,
              onclick: editing ? () => { sel = c; paint(); } : null,
            }, raw));
          }
          grid.appendChild(row);
        }
        // teclado
        const best = {};
        if (lvl !== 'legend') st.guesses.forEach((g) => score(g).forEach((s, i) => {
          const k = g[i], rank = { g: 3, y: 2, x: 1 };
          if (k === EMPTY) return;
          if (!best[k] || rank[s] > rank[best[k]]) best[k] = s;
        }));
        MF.clear(kb);
        ['QWERTYUIOP', 'ASDFGHJKL', '↵ZXCVBNM⌫'].forEach((line) => {
          kb.appendChild(h('div', { class: 'kb-row' }, [...line].map((k) => h('button', {
            type: 'button', class: 'key' + (best[k] ? ' s-' + best[k] : '') + (k === '↵' || k === '⌫' ? ' wide' : ''),
            'aria-label': k === '↵' ? 'Enter' : k === '⌫' ? 'Apagar' : k, onclick: () => press(k),
          }, k === '↵' ? 'ENTER' : k))));
        });
      }
      function press(k) {
        if (ctx.finished()) return;
        if (k === '←' || k === '→') { sel = Math.max(0, Math.min(L - 1, sel + (k === '←' ? -1 : 1))); return paint(); }
        if (k === '⌫') {
          if (cur[sel]) cur[sel] = '';
          else if (sel > 0) { sel--; cur[sel] = ''; }
        } else if (k === '↵') return submit();
        else if (/^[A-Z]$/.test(k)) { cur[sel] = k; sel = nextEmpty(sel); }
        paint();
      }
      function submit() {
        // qualquer palavra vale (dá para errar de propósito e descobrir letras); quadrados vazios contam como vazios
        if (!cur.some(Boolean)) { MF.anim(grid.children[st.guesses.length], 'shake'); return MF.toast(t('letters')); }
        const g = cur.map((x) => x || EMPTY).join('');
        st.guesses.push(g);
        cur = Array(L).fill('');
        sel = 0;
        ctx.save();
        paint(st.guesses.length - 1);
        if (g === word) return setTimeout(() => end(true), MF.reduced() ? 0 : L * 110 + 300);
        if (st.guesses.length >= ROWS) setTimeout(() => end(false), MF.reduced() ? 0 : L * 110 + 300);
      }
      function end(win) {
        const em = { g: '🟩', y: '🟨', x: '⬛' };
        const line = (win ? st.guesses.length : 'X') + '/' + ROWS + '\n' + st.guesses.map((g) => score(g).map((s) => em[s]).join('')).join('\n');
        st.scoreLabel = word;
        ctx.finish(win, win ? ROWS + 1 - st.guesses.length : 0, line, { pi: player.i });
        document.removeEventListener('keydown', onKey);
        helpBtn.refresh();
      }
      const onKey = (e) => {
        if (!document.body.contains(grid)) return document.removeEventListener('keydown', onKey);
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.key === 'Enter') { e.preventDefault(); press('↵'); }
        else if (e.key === 'Backspace') press('⌫');
        else if (e.key === 'ArrowLeft') press('←');
        else if (e.key === 'ArrowRight') press('→');
        else if (/^[a-z]$/i.test(e.key)) press(e.key.toUpperCase());
      };
      document.addEventListener('keydown', onKey);
      // ajuda única: revela uma letra no lugar certo (a primeira que ainda não ficou verde)
      const helpBtn = MF.helpButton(ctx, () => {
        const green = new Set();
        st.guesses.forEach((g) => score(g).forEach((x, i) => { if (x === 'g') green.add(i); }));
        const k = [...Array(L).keys()].find((i) => !green.has(i));
        if (k == null) return false;
        st.helpPos = k;
        return MF.ht('letter', { n: k + 1, l: word[k] });
      });
      board.appendChild(h('div', { class: 'bar' }, h('span', { class: 'pill' }, L + ' ' + t('letters')),
        lvl === 'easy' ? h('span', { class: 'pill' }, MF.flag(player.nat), ' ', MF.pos(player.pos), ' · ', lastClub(player)) : lvl === 'normal' ? h('span', { class: 'pill' }, MF.pos(player.pos)) : null,
        h('span', { class: 'pill' }, ROWS + ' ' + t('chancesWord')), ctx.timerEl));
      board.appendChild(grid);
      board.appendChild(kb);
      if (!ctx.finished()) board.appendChild(h('div', { class: 'help-row' }, helpBtn, helpBtn.note));
      paint();
    },
    renderDetail(d) { return MF.playerReveal(d.pi); },
  });
  function lastClub(p) {
    const s = p.st.slice().sort((a, b) => b[2] - a[2] || b[1] - a[1])[0];
    return s ? MF.data.clubs[s[0]].n : '';
  }
})();
