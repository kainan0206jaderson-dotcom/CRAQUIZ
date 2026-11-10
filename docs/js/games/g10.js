/* Jogo 10 — Draft por clube sorteado
   1) escolha 1 de 5 formações; 2) a cada rodada um clube é sorteado: toque na posição que quiser e escolha QUALQUER jogador
   que já passou por esse clube — lenda ou atual (base do Transfermarkt + lendas curadas).
   Ligações entre vizinhos dão a química: verde = já jogaram no mesmo clube, ou mesma seleção e mesma liga; laranja = mesma
   seleção ou mesma liga; vermelho = nada em comum. Jogador fora da posição perde química.
   Pontuação draft = nota do time + química (até 100). Notas MUNDOFUT: calculadas a partir de valor de mercado, seleção,
   anos em grandes ligas e prêmios (não são notas de videogame).
   Dificuldade (desde 15/10/2026): Fácil = clubes famosos e 3 trocas; Normal = famosos + campeões da Champions, 2 trocas;
   Difícil = campeões da Champions e da Europa League + clubes conhecidos da 1ª divisão, 1 troca; Lendário = clubes menores, sem trocas.
   Busca sem ajuda: aparecem todos os jogadores da base; escolher quem nunca jogou no clube da rodada = 1 erro (3 erros = fim).
   Mata-mata (desde 09/11/2026): com os 11 escalados, o time entra num mata-mata de 4 rodadas (oitavas, quartas, semi, final).
   Cada adversário é outro time montado a partir de um clube sorteado do mesmo nível. Vale a pontuação draft (nota + química):
   a maior passa, a menor cai; empate vai para os pênaltis. Campeão = vence as 4. */
(function () {
  'use strict';
  const MF = window.MF, h = MF.h, t = (k) => MF.t(k);

  const DEF4 = [['GK', 50, 91], ['LB', 11, 68], ['CB', 36, 73], ['CB', 64, 73], ['RB', 89, 68]];
  const BACK4 = [[0, 2], [0, 3], [1, 2], [2, 3], [3, 4]];
  const FORMS = {
    '4-3-3': { s: [...DEF4, ['CM', 24, 47], ['CM', 50, 52], ['CM', 76, 47], ['LW', 15, 18], ['ST', 50, 13], ['RW', 85, 18]],
      l: [...BACK4, [1, 5], [2, 6], [3, 6], [4, 7], [5, 6], [6, 7], [5, 8], [6, 9], [7, 10], [8, 9], [9, 10]] },
    '4-4-2': { s: [...DEF4, ['LM', 11, 42], ['CM', 36, 49], ['CM', 64, 49], ['RM', 89, 42], ['ST', 34, 14], ['ST', 66, 14]],
      l: [...BACK4, [1, 5], [2, 6], [3, 7], [4, 8], [5, 6], [6, 7], [7, 8], [5, 9], [6, 9], [7, 10], [8, 10], [9, 10]] },
    '4-2-3-1': { s: [...DEF4, ['CDM', 35, 55], ['CDM', 65, 55], ['LM', 13, 33], ['CAM', 50, 34], ['RM', 87, 33], ['ST', 50, 11]],
      l: [...BACK4, [1, 7], [2, 5], [3, 6], [4, 9], [5, 6], [5, 7], [5, 8], [6, 8], [6, 9], [7, 10], [8, 10], [9, 10]] },
    '4-1-2-1-2': { s: [...DEF4, ['CDM', 50, 57], ['CM', 24, 44], ['CM', 76, 44], ['CAM', 50, 32], ['ST', 33, 12], ['ST', 67, 12]],
      l: [...BACK4, [1, 6], [2, 5], [3, 5], [4, 7], [5, 6], [5, 7], [6, 8], [7, 8], [6, 9], [7, 10], [8, 9], [8, 10], [9, 10]] },
    '3-5-2': { s: [['GK', 50, 91], ['CB', 24, 74], ['CB', 50, 77], ['CB', 76, 74], ['LM', 9, 45], ['CDM', 34, 56], ['CDM', 66, 56], ['RM', 91, 45], ['CAM', 50, 34], ['ST', 33, 12], ['ST', 67, 12]],
      l: [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [1, 4], [1, 5], [2, 5], [2, 6], [3, 6], [3, 7], [4, 5], [5, 6], [6, 7], [5, 8], [6, 8], [4, 9], [7, 10], [8, 9], [8, 10], [9, 10]] },
    '3-4-3': { s: [['GK', 50, 91], ['CB', 24, 74], ['CB', 50, 77], ['CB', 76, 74], ['LM', 9, 46], ['CM', 36, 51], ['CM', 64, 51], ['RM', 91, 46], ['LW', 16, 18], ['ST', 50, 12], ['RW', 84, 18]],
      l: [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [1, 4], [2, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [4, 8], [5, 9], [6, 9], [7, 10], [8, 9], [9, 10]] },
    '4-3-2-1': { s: [...DEF4, ['CM', 22, 52], ['CM', 50, 56], ['CM', 78, 52], ['CAM', 30, 31], ['CAM', 70, 31], ['ST', 50, 11]],
      l: [...BACK4, [1, 5], [2, 6], [3, 6], [4, 7], [5, 6], [6, 7], [5, 8], [6, 8], [6, 9], [7, 9], [8, 9], [8, 10], [9, 10]] },
    '5-3-2': { s: [['GK', 50, 91], ['LB', 9, 60], ['CB', 29, 75], ['CB', 50, 78], ['CB', 71, 75], ['RB', 91, 60], ['CM', 24, 44], ['CM', 50, 50], ['CM', 76, 44], ['ST', 34, 13], ['ST', 66, 13]],
      l: [[0, 2], [0, 3], [0, 4], [1, 2], [2, 3], [3, 4], [4, 5], [1, 6], [2, 6], [3, 7], [4, 8], [5, 8], [6, 7], [7, 8], [6, 9], [7, 9], [7, 10], [8, 10], [9, 10]] },
  };
  const PITCH_SVG = '<svg class="pitch-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="2" y="2" width="96" height="96"/><line x1="2" y1="50" x2="98" y2="50"/><circle cx="50" cy="50" r="10"/><rect x="26" y="2" width="48" height="15"/><rect x="26" y="83" width="48" height="15"/></svg>';
  // posições "parecidas" (sem perder química)
  const NEAR = { GK: ['GK'], CB: ['CB'], LB: ['LB', 'LWB'], RB: ['RB', 'RWB'], CDM: ['CDM', 'CM'], CM: ['CM', 'CDM', 'CAM'], CAM: ['CAM', 'CM', 'CF'],
    LM: ['LM', 'LW'], RM: ['RM', 'RW'], LW: ['LW', 'LM'], RW: ['RW', 'RM'], ST: ['ST', 'CF'], CF: ['CF', 'ST', 'CAM'] };
  const REROLLS = { easy: 3, normal: 2, hard: 1, legend: 0 };
  const fits = (p, pos) => (NEAR[pos] || [pos]).includes(p.pos) || p.allpos.some((a) => (NEAR[pos] || [pos]).includes(a));
  const line = (pos) => MF.line(pos);
  // mata-mata: 4 rodadas a partir das oitavas; cada adversário é montado para ter a pontuação-alvo da rodada (t)
  const KN = [
    { k: 'knR16', t: 145 },
    { k: 'knQF', t: 160 },
    { k: 'knSF', t: 172 },
    { k: 'knF', t: 182 },
  ];

  // clubes sorteáveis por dificuldade: quantidade de jogadores relevantes que passaram por ele (base principal)
  // 15/10/2026: no Draft os critérios novos já valem hoje (pedido do usuário), não só a partir de 16/10
  function clubPools() {
    const NEW = true;
    if (MF._draftClubs && MF._draftClubs.NEW === NEW) return MF._draftClubs;
    const { P, clubs, byClub } = MF.data;
    const score = clubs.map((c) => {
      const ps = byClub[c.i].map((i) => P[i]);
      const good = ps.filter((p) => p.r >= 78);
      const lines = new Set(good.map((p) => line(p.pos)));
      return { c: c.i, n: ps.length, g: good.length, ok: lines.size === 4 && ps.some((p) => p.pos === 'GK') };
    }).filter((x) => x.ok && x.n >= 25).sort((a, b) => b.g - a.g || b.n - a.n);
    if (NEW) {
      // a partir de 16/10/2026 — Fácil: clubes famosos; Normal: + campeões da Champions; Difícil: campeões da Champions e da
      // Europa League e clubes da 1ª divisão em 2026/27; Lendário: clubes menores (como antes)
      const of = (l) => score.filter((x) => MF.clubOk(l, x.c)).map((x) => x.c);
      return (MF._draftClubs = { NEW, easy: of('easy'), normal: of('normal'), hard: of('hard'), legend: score.slice(70, 420).map((x) => x.c) });
    }
    return (MF._draftClubs = {
      NEW, easy: score.slice(0, 30).map((x) => x.c), normal: score.slice(0, 90).map((x) => x.c),
      hard: score.slice(25, 220).map((x) => x.c), legend: score.slice(70, 420).map((x) => x.c),
    });
  }

  // química: verde (2) = já jogaram no mesmo clube, ou mesma seleção e liga; laranja (1) = mesma seleção ou liga; vermelho (0)
  function linkVal(a, b) {
    if (a.clubs.some((c) => b.clubs.includes(c))) return 2;
    const nat = a.nat && a.nat === b.nat, lg = a.leagues.some((l) => b.leagues.includes(l));
    return nat && lg ? 2 : nat || lg ? 1 : 0;
  }
  function rate(team, formKey) {
    const { P, clubs } = MF.data;
    const F = FORMS[formKey] || FORMS['4-3-3'];
    const ps = team.map((i) => (i != null ? P[i] : null));
    const filled = ps.filter(Boolean);
    const sum = Array(11).fill(0), cnt = Array(11).fill(0);
    const links = F.l.map(([a, b]) => {
      if (!ps[a] || !ps[b]) return null;
      const v = linkVal(ps[a], ps[b]);
      sum[a] += v; sum[b] += v; cnt[a]++; cnt[b]++;
      return v;
    });
    const pchem = ps.map((p, k) => {
      if (!p) return null;
      const pos = F.s[k][0];
      const pen = fits(p, pos) ? 0 : line(p.pos) === line(pos) ? 2 : 5;
      if (!cnt[k]) return Math.max(0, 3 - pen);
      return Math.max(0, Math.min(10, Math.round(3 + 3.5 * (sum[k] / cnt[k])) - pen));
    });
    const chem = Math.min(100, pchem.reduce((s, c) => s + (c || 0), 0));
    const tot = filled.reduce((s, p) => s + p.r, 0);
    const avg = tot / 11;
    const ex = filled.reduce((s, p) => s + Math.max(0, p.r - avg), 0);
    const ovr = filled.length ? Math.floor((tot + ex) / 11 + 0.04) : 0;
    const score = ovr + chem;
    const stars = score >= 182 ? 5 : score >= 170 ? 4 : score >= 157 ? 3 : score >= 142 ? 2 : 1;
    const nClubs = new Set(team.map((x, k) => x != null ? x : null).filter((x) => x != null).map((x) => x)).size;
    const nNations = new Set(filled.map((p) => p.nat)).size;
    return { ovr, chem, score, stars, label: labels()[stars - 1], nNations, nClubs, links, pchem };
  }
  function labels() {
    const L = { pt: ['Várzea', 'Mediano', 'Bom time', 'Elite', 'Lendário'], en: ['Sunday league', 'Average', 'Good side', 'Elite', 'Legendary'], es: ['Potrero', 'Normal', 'Buen equipo', 'Élite', 'Legendario'] };
    return L[MF.lang] || L.pt;
  }

  // time adversário: parte dos jogadores vem de um clube sorteado (química alta) e o resto de outros clubes do nível
  // (química menor). Assim a pontuação varia e pode ser calibrada para cada rodada.
  function oppXI(formKey, pool, rnd) {
    const { P } = MF.data;
    const F = FORMS[formKey].s;
    const lists = (c) => (MF.data.byClubAll || MF.data.byClub)[c] || [];
    const anchor = lists(pool[Math.floor(rnd() * pool.length)]);
    if (!anchor.length) return null;
    const fromAnchor = Math.round(rnd() * 11);
    const used = new Set();
    const pickFrom = (list, pos) => {
      const ok = list.filter((x) => !used.has(x) && fits(P[x], pos));
      return ok.length ? ok[Math.floor(rnd() * ok.length)] : null;
    };
    const team = F.map(([pos], k) => {
      let i = null;
      if (k < fromAnchor) i = pickFrom(anchor, pos);
      for (let tries = 0; i == null && tries < 12; tries++) i = pickFrom(lists(pool[Math.floor(rnd() * pool.length)]), pos);
      if (i == null) i = pickFrom(anchor, pos) ?? anchor.find((x) => !used.has(x)) ?? null;
      if (i != null) used.add(i);
      return i;
    });
    return team.includes(null) ? null : team;
  }
  // monta o caminho do mata-mata: um adversário por rodada, o time sorteado mais perto da pontuação-alvo daquela rodada
  function makeKnockout(st, pool, seed) {
    const rnd = MF.rng(seed + ':kn');
    const { P } = MF.data;
    const path = [];
    KN.forEach((rd) => {
      let best = null;
      for (let i = 0; i < 240; i++) {
        const team = oppXI(st.form, pool, rnd);
        if (!team) continue;
        const r = rate(team, st.form);
        const d = Math.abs(r.score - rd.t) + rnd() * 3;
        if (!best || d < best.d) best = { d, team, score: r.score, ovr: r.ovr, chem: r.chem };
      }
      if (best) {
        const top = best.team.map((x) => P[x]).sort((a, b) => b.r - a.r).slice(0, 3).map((x) => x.n);
        path.push({ team: best.team, score: best.score, ovr: best.ovr, chem: best.chem, top, coin: rnd() < 0.5 });
      }
    });
    st.kn = { path, res: [] };
  }

  // ---- partida ao vivo do mata-mata: simulação determinística ----
  // O resultado segue a regra (maior pontuação passa; empate = pênaltis). A narração (minutos, autores dos gols,
  // assistências, chutes, posse) é sorteada a partir da semente do dia/nível/rodada: a mesma partida em todo recarregamento.
  const POSW = { GK: 0.02, CB: 0.4, LB: 0.6, RB: 0.6, LWB: 0.6, RWB: 0.6, CDM: 0.7, CM: 1.2, CAM: 2.2, LM: 1.8, RM: 1.8, LW: 3, RW: 3, CF: 4, ST: 4.5 };
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  function poisson(lam, rnd) {
    const L = Math.exp(-lam);
    let k = 0, p = 1;
    do { k++; p *= rnd(); } while (p > L && k < 12);
    return k - 1;
  }
  // quem marca: atacante pesa mais; a nota também conta
  function weighted(team, rnd, not) {
    const { P } = MF.data;
    const c = team.filter((i) => i != null && i !== not);
    const w = c.map((i) => (POSW[P[i].pos] || 1) * Math.pow(Math.max(P[i].r, 60) / 80, 3));
    let x = rnd() * w.reduce((s, v) => s + v, 0);
    for (let k = 0; k < c.length; k++) { x -= w[k]; if (x <= 0) return c[k]; }
    return c[c.length - 1];
  }
  function simRegular(us, them, tu, tt, rnd) {
    const win = us > them ? 'us' : us < them ? 'th' : null;
    const d = (us - them) / 22;
    const gu = Math.min(7, poisson(clamp(1.25 + d, 0.25, 3.2), rnd));
    const gt = Math.min(7, poisson(clamp(1.25 - d, 0.25, 3.2), rnd));
    // gols "de última hora" para o resultado bater com a regra (empate: os dois times ficam iguais)
    let bu = 0, bt = 0;
    if (win === 'us' && gu <= gt) bu = gt + 1 - gu;
    else if (win === 'th' && gt <= gu) bt = gu + 1 - gt;
    else if (win === null) { bu = Math.max(gu, gt) - gu; bt = Math.max(gu, gt) - gt; }
    const goals = [];
    const mk = (side, late) => {
      const team = side === 'us' ? tu : tt;
      const m = late ? 74 + Math.floor(rnd() * 17) : 1 + Math.floor(rnd() * 90);
      const sc = weighted(team, rnd, -1);
      const as = rnd() < 0.7 ? weighted(team, rnd, sc) : null;
      goals.push({ side, m, sc, as });
    };
    for (let i = 0; i < gu; i++) mk('us', false);
    for (let i = 0; i < bu; i++) mk('us', true);
    for (let i = 0; i < gt; i++) mk('th', false);
    for (let i = 0; i < bt; i++) mk('th', true);
    goals.sort((a, b) => a.m - b.m);
    const fu = gu + bu, ft = gt + bt;
    const pos = Math.round(clamp(50 + d * 5 + (rnd() * 10 - 5), 30, 70));
    const shU = fu + poisson(clamp(7 + d * 2, 3, 14), rnd);
    const shT = ft + poisson(clamp(7 - d * 2, 3, 14), rnd);
    return { gu: fu, gt: ft, goals, pos, shU, shT };
  }
  // pênaltis: 5 cobranças cada, o vencedor já está definido; para quando a série acaba
  function simPens(winSide, tu, tt, rnd) {
    const { P } = MF.data;
    const w = 3 + Math.floor(rnd() * 3);
    const l = Math.max(0, w - 1 - Math.floor(rnd() * 3));
    const pick = (n) => {
      const idx = [0, 1, 2, 3, 4];
      for (let i = 4; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = idx[i]; idx[i] = idx[j]; idx[j] = x; }
      const yes = new Set(idx.slice(0, n));
      return [0, 1, 2, 3, 4].map((k) => yes.has(k));
    };
    const kU = pick(winSide === 'us' ? w : l), kT = pick(winSide === 'th' ? w : l);
    const order = (team) => team.filter((i) => i != null).sort((a, b) => (POSW[P[b].pos] || 1) * P[b].r - (POSW[P[a].pos] || 1) * P[a].r);
    const oU = order(tu), oT = order(tt);
    const kicks = [];
    for (let k = 0; k < 5; k++) {
      kicks.push({ side: 'us', ok: kU[k], who: oU[k % oU.length] });
      kicks.push({ side: 'th', ok: kT[k], who: oT[k % oT.length] });
    }
    let a = 0, b = 0, ka = 0, kb = 0, stop = kicks.length;
    for (let i = 0; i < kicks.length; i++) {
      const k = kicks[i];
      if (k.side === 'us') { ka++; if (k.ok) a++; } else { kb++; if (k.ok) b++; }
      if (a > b + (5 - kb) || b > a + (5 - ka)) { stop = i + 1; break; }
    }
    return { kicks: kicks.slice(0, stop), a, b };
  }

  MF.registerGame({
    num: 10, slug: 'draft-club',
    rules: {
      pt: ['Escolha 1 de 5 formações. Em cada rodada um clube é sorteado: toque na posição que quiser e digite um jogador que já passou por esse clube — lenda ou atual. A busca mostra todos os jogadores da base: se escolher alguém que nunca jogou no clube, conta 1 erro; no 3º erro o draft acaba.', 'As linhas entre vizinhos mostram a química: verde = já jogaram num mesmo clube, ou mesma seleção e mesma liga; laranja = mesma seleção ou mesma liga; vermelho = nada em comum. Fora da posição, o jogador perde química. Toque num jogador escalado e depois noutra posição para trocá-los.', 'Pontuação draft = nota do time + química (até 100). As notas são do MUNDOFUT10 (valor de mercado, seleção, anos em grandes ligas e prêmios).', 'Fácil: só clubes famosos e 3 trocas de clube. Normal: os famosos e os campeões da Champions, 2 trocas. Difícil: campeões da Champions e da Europa League e clubes conhecidos da 1ª divisão, 1 troca. Lendário: clubes menores e nenhuma troca. Ajuda: uma vez por partida, sugere um jogador do clube da rodada.', 'Mata-mata: com os 11 escalados, seu time entra num mata-mata de 4 rodadas, começando nas oitavas. Em cada partida, a pontuação draft do seu time é comparada à do adversário: a maior passa, a menor cai (empate vai para os pênaltis). Campeão = vence as 4.'],
      en: ['Pick 1 of 5 formations. Each round a club is drawn: tap the position you want and type a player who ever played for that club — legend or current. The search lists every player in the database: picking someone who never played there is a miss; 3 misses end the draft.', 'Lines between neighbours show chemistry: green = they shared a club, or same nation and league; orange = same nation or league; red = nothing in common. Out of position, a player loses chemistry. Tap a player, then another position, to swap them.', 'Draft score = team rating + chemistry (up to 100). Ratings are MUNDOFUT10’s own (market value, caps, years in big leagues and awards).', 'Easy: famous clubs only and 3 club rerolls. Normal: the famous ones plus Champions League winners, 2 rerolls. Hard: Champions League and Europa League winners and well-known top-flight clubs, 1 reroll. Legendary: smaller clubs and no rerolls. Help: once per game, suggests a player from the club of the round.', 'Knockout: with all 11 picked, your team enters a 4-round knockout, starting at the round of 16. In each match your draft score is compared to the opponent’s: the higher one advances, the lower one goes out (a draw goes to penalties). Champions = win all 4.'],
      es: ['Elige 1 de 5 formaciones. En cada ronda se sortea un club: toca la posición que quieras y escribe un jugador que haya pasado por ese club — leyenda o actual. La búsqueda muestra a todos los jugadores de la base: si eliges a alguien que nunca jugó allí, cuenta 1 error; con 3 errores termina el draft.', 'Las líneas entre vecinos muestran la química: verde = compartieron club, o misma selección y liga; naranja = misma selección o liga; rojo = nada en común. Fuera de posición, el jugador pierde química. Toca un jugador y luego otra posición para cambiarlos.', 'Puntuación draft = media del equipo + química (hasta 100). Las medias son de MUNDOFUT10 (valor de mercado, selección, años en grandes ligas y premios).', 'Fácil: solo clubes famosos y 3 cambios de club. Normal: los famosos y los campeones de la Champions, 2 cambios. Difícil: campeones de la Champions y la Europa League y clubes conocidos de primera, 1 cambio. Legendario: clubes más pequeños y sin cambios. Ayuda: una vez por partida, sugiere un jugador del club de la ronda.', 'Eliminatoria: con los 11 elegidos, tu equipo entra en una eliminatoria de 4 rondas, desde los octavos. En cada partido, la puntuación draft de tu equipo se compara con la del rival: la mayor avanza, la menor cae (empate va a penaltis). Campeón = gana las 4.'],
    },
    options: [MF.levelOpt(), MF.timerOpt([0, 300, 180, 120])],
    preview() { return h('div', { class: 'pv-draft' }, FORMS['4-3-3'].s.map(([, x, y]) => h('b', { style: { left: x + '%', top: y + '%' } }))); },
    play(board, ctx) { start(board, ctx); },
    renderDetail(d) {
      const r = d.r;
      if (!r) return null;
      return h('div', { class: 'rating' },
        h('div', { class: 'rating-big' }, h('strong', null, r.score), h('span', null, t('fdDraft'))),
        h('div', { class: 'rating-big' }, h('strong', null, r.ovr), h('span', null, t('fdRating'))),
        h('div', { class: 'rating-big' }, h('strong', null, r.chem), h('span', null, t('chemistry'))),
        h('p', { class: 'stars', 'aria-label': r.stars + '/5' }, h('span', { class: 'stars-row' }, Array.from({ length: 5 }, (_, i) => MF.icon(i < r.stars ? 'star' : 'starOff', 24))), ' ', h('span', null, r.label)));
    },
  });

  // carta compacta (campo e escolha)
  function card(pi, opts) {
    const { P, clubs } = MF.data;
    const p = P[pi], o = opts || {};
    const tier = p.r >= 88 ? 'elite' : p.r >= 78 ? 'gold' : p.r >= 70 ? 'silver' : 'bronze';
    const club = o.club != null ? clubs[o.club].n : '';
    return h('span', { class: 'fdc ' + tier + (o.mini ? ' mini' : '') + (o.cls ? ' ' + o.cls : '') },
      h('span', { class: 'fdc-top' }, h('b', { class: 'fdc-r' }, p.r), h('span', { class: 'fdc-p' }, MF.pos(o.pos || p.pos))),
      MF.photo(p.n, p.nat, o.mini ? 30 : 58),
      h('span', { class: 'fdc-n' }, p.fn && !/\s/.test(p.fn) ? p.fn : p.n),
      h('span', { class: 'fdc-m' }, MF.flag(p.nat), club ? MF.crest(club, o.mini ? 14 : 20) : null),
      !o.mini && club ? h('span', { class: 'fdc-c' }, club) : null);
  }

  function start(board, ctx) {
    const { P, clubs } = MF.data;
    const st = ctx.state;
    const lvl = MF.level(st);
    const day = MF.today();
    const seed = 'fd5:' + day + ':' + lvl;
    if (st.v !== 4) Object.assign(st, { v: 4, phase: 'form', form: null, forms: null, team: Array(11).fill(null), from: Array(11).fill(null), round: 0, rerolls: 0, drawn: [], miss: 0, wrong: [], kn: null });
    if (st.miss == null) { st.miss = 0; st.wrong = []; }
    if (st.kn === undefined) st.kn = null;
    if (!st.forms) st.forms = MF.sample(Object.keys(FORMS), 5, MF.rng(seed + ':forms'));
    const pools = clubPools();
    const pool = pools[lvl] || pools.normal;
    // sequência de clubes do dia (sem repetir); trocas puxam o próximo da fila
    const order = MF.shuffle(pool, MF.rng(seed + ':clubs'));
    const clubAt = (k) => order[k % order.length];
    if (!st.drawn.length) st.drawn = [clubAt(0)];
    const curClub = () => st.drawn[st.drawn.length - 1];
    let sel = null;
    let target = null; // posição escolhida para o jogador do clube da rodada

    const F = () => FORMS[st.form];
    const stepPill = h('span', { class: 'pill' });
    const pitch = h('div', { class: 'mini-pitch fd-pitch' });
    const side = h('div', { class: 'fd-side' });
    const sheet = h('div', { class: 'fd-sheet', hidden: true });
    const roundBox = h('div', { class: 'fd-round', 'aria-live': 'polite' });
    const flag = h('button', { class: 'btn btn-ghost flag-btn', type: 'button', 'aria-label': t('giveUp'), title: t('giveUp'), onclick: () => end(false) }, MF.icon('flag'));
    const used = () => new Set(st.team.filter((x) => x != null));
    // busca: TODOS os jogadores da base (principal + estendida), sem dica de quem passou pelo clube — o jogador decide.
    // Errou (o escolhido nunca jogou no clube da rodada)? Conta 1 erro; no 3º erro o draft acaba.
    const MAXMISS = 3;
    const ac = MF.autocomplete({
      placeholder: t('fdTypeFrom'),
      source: (q) => {
        const u = used();
        return MF.searchPlayers(q, 8, (i) => !u.has(i)).map((i) => ({ id: i, label: P[i].n, sub: MF.pos(P[i].pos), flag: P[i].nat }));
      },
      onPick: (it) => choose(it.id),
    });
    const playedHere = (pi, c) => {
      if (MF.playedFor(pi, c)) return true;
      const k = MF.canon && MF.canon[pi];
      return k != null && k !== pi && MF.playedFor(k, c);
    };
    const NF = { pt: '{p} nunca jogou no {c}.', en: '{p} never played for {c}.', es: '{p} nunca jugó en el {c}.' };
    const missPill = h('span', { class: 'pill' });

    // ajuda única: sugere um jogador conhecido do clube da rodada para uma posição livre
    const helpBtn = MF.helpButton(ctx, () => {
      if (st.phase !== 'xi') return false;
      const c = curClub(), u = used(), f = F().s;
      const free = f.map(([pos], j) => (st.team[j] == null ? pos : null)).filter(Boolean);
      const want = target != null && st.team[target] == null ? [f[target][0]] : free;
      const cand = (MF.data.byClubAll || MF.data.byClub)[c].filter((i) => !u.has(i)).map((i) => P[i]).sort((a, b) => b.r - a.r);
      const p = cand.find((q) => want.some((pos) => fits(q, pos))) || cand[0];
      if (!p) return false;
      const pos = want.find((x) => fits(p, x)) || p.pos;
      return MF.ht('draftTip', { p: p.n, pos: MF.pos(pos) });
    });
    function closeSheet() { sheet.hidden = true; MF.clear(sheet); board.classList.remove('fd-modal'); }
    function formSheet() {
      MF.clear(sheet);
      const panel = h('div', { class: 'fd-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('fdForm') },
        h('div', { class: 'fd-head' }, h('div', null, h('h3', null, t('fdForm')), h('p', null, t('fdFormNote')))),
        h('div', { class: 'fd-opts fd-forms' }, st.forms.map((fk) => h('button', { type: 'button', class: 'fd-form', onclick: () => { st.form = fk; st.phase = 'xi'; ctx.save(); closeSheet(); paint(); } },
          h('span', { class: 'fd-form-pitch' }, FORMS[fk].s.map(([, x, y]) => h('i', { style: { left: x + '%', top: y + '%' } }))),
          h('strong', null, fk)))));
      sheet.appendChild(h('div', { class: 'fd-scrim' }));
      sheet.appendChild(panel);
      sheet.hidden = false;
      board.classList.add('fd-modal');
    }
    function reroll() {
      if (st.rerolls >= REROLLS[lvl] || ctx.finished()) return;
      st.rerolls++;
      let k = st.drawn.length + st.round;
      let c = clubAt(k);
      while (st.drawn.includes(c) && k < order.length * 2) c = clubAt(++k);
      st.drawn.push(c);
      ctx.save();
      paint();
    }
    function choose(pi) {
      if (ctx.finished() || st.phase !== 'xi') return;
      const p = P[pi];
      if (!playedHere(pi, curClub())) {
        st.miss++;
        st.wrong.push(pi);
        MF.toast((NF[MF.lang] || NF.pt).replace('{p}', p.n).replace('{c}', clubs[curClub()].n));
        ctx.save();
        if (st.miss >= MAXMISS) return end(false);
        paint();
        setTimeout(() => ac.focus && ac.focus(), 50);
        return;
      }
      let k = target;
      if (k == null || st.team[k] != null) {
        // sem posição escolhida: a primeira vaga livre da posição dele (ou da mesma linha)
        const f = F().s;
        k = f.findIndex(([pos], j) => st.team[j] == null && fits(p, pos));
        if (k < 0) k = f.findIndex(([pos], j) => st.team[j] == null && line(pos) === line(p.pos));
        if (k < 0) k = st.team.findIndex((x) => x == null);
      }
      if (k < 0) return;
      st.team[k] = pi;
      st.from[k] = curClub();
      st.round++;
      target = null;
      if (st.team.every((x) => x != null)) {
        // time completo: entra no mata-mata (o adversário de cada rodada é montado agora e fica salvo)
        st.phase = 'kn';
        makeKnockout(st, pool, seed);
        ctx.save();
        return paint(k);
      }
      // próximo clube (sem repetir)
      let n = st.drawn.length + st.round;
      let c = clubAt(n);
      while (st.drawn.includes(c) && n < order.length * 2) c = clubAt(++n);
      st.drawn.push(c);
      ctx.save();
      paint(k);
      setTimeout(() => ac.focus && ac.focus(), 50);
    }
    function tapSlot(k) {
      if (ctx.finished() || st.phase !== 'xi') return;
      const pi = st.team[k];
      if (sel != null) {
        if (sel === k) { sel = null; return paint(); }
        const a = st.team[sel], fa = st.from[sel];
        st.team[sel] = pi; st.from[sel] = st.from[k];
        st.team[k] = a; st.from[k] = fa;
        const from = sel; sel = null; ctx.save(); return paint(k, from);
      }
      if (pi != null) { sel = k; target = null; return paint(); }
      target = target === k ? null : k;
      paint();
      if (target != null) setTimeout(() => ac.focus && ac.focus(), 30);
    }

    // mata-mata: rodadas jogadas e a próxima partida
    const knRounds = () => (st.kn ? st.kn.res.length : 0);
    const knOver = () => !!st.kn && (st.kn.res.length === KN.length || st.kn.res.some((x) => !x.won));
    const knChamp = () => !!st.kn && st.kn.res.length === KN.length && st.kn.res.every((x) => x.won);
    function playRound() {
      if (!st.kn || knOver() || ctx.finished()) return;
      const n = knRounds();
      const us = rate(st.team, st.form).score;
      const them = st.kn.path[n].score;
      let won = us > them, pen = false;
      if (us === them) { pen = true; won = st.kn.path[n].coin; }
      st.kn.res.push({ us, them, won, pen });
      ctx.save();
      paint();
    }
    function knockoutBox(box) {
      const kn = st.kn, n = knRounds(), over = knOver(), champ = knChamp();
      const cur = !over && n < KN.length ? kn.path[n] : null;
      const us = rate(st.team, st.form).score;
      box.appendChild(h('ol', { class: 'kn-path' }, KN.map((rd, i) => {
        const res = kn.res[i];
        const cls = res ? (res.won ? 'won' : 'lost') : i === n && !over ? 'now' : '';
        return h('li', { class: 'kn-step ' + cls }, h('span', null, t(rd.k)), h('b', null, res ? (res.won ? '✓' : '✕') : '·'));
      })));
      const last = n ? kn.res[n - 1] : null;
      if (last) {
        box.appendChild(h('p', { class: 'kn-last ' + (last.won ? 'won' : 'lost') },
          t(KN[n - 1].k) + ': ' + last.us + ' × ' + last.them + (last.pen ? ' · ' + t('knPens') : '') + ' — ' + (last.won ? t('knWon') : t('knLost'))));
      }
      if (cur) {
        box.appendChild(h('div', { class: 'fd-club pop' },
          h('div', null,
            h('span', { class: 'fd-club-l' }, t('knBracket') + ' · ' + t(KN[n].k)),
            h('strong', null, t('knOppTeam')),
            h('span', { class: 'fd-club-h' }, cur.top.join(', ')),
            h('span', { class: 'fd-club-h' }, t('knYou') + ' ' + us + ' × ' + cur.score + ' ' + t('knOpp')))));
        box.appendChild(h('button', { class: 'btn btn-primary fd-reroll kn-play', type: 'button', onclick: openLive }, t('knPlay')));
      } else {
        box.appendChild(h('p', { class: 'kn-end ' + (champ ? 'won' : 'lost') }, champ ? t('knChamp') : t('knOut')));
        box.appendChild(h('button', { class: 'btn btn-primary fd-reroll kn-play', type: 'button', onclick: () => end(champ) }, t('seeResult')));
      }
      box.appendChild(h('p', { class: 'fd-formula' }, t('knHint')));
    }
    function knLine() {
      return KN.map((rd, i) => (st.kn && st.kn.res[i] ? t(rd.k) + (st.kn.res[i].won ? ' ✓' : ' ✕') : null)).filter(Boolean).join(' · ');
    }

    // ---- partida ao vivo do mata-mata (tela de narração) ----
    // playRound() só registra o resultado; quem mostra a partida é esta tela (a simulação já bate com o resultado)
    const liveCache = {};
    function matchPack(n) {
      if (liveCache[n]) return liveCache[n];
      const cur = st.kn.path[n];
      const us = rate(st.team, st.form).score;
      const rnd = MF.rng(seed + ':live' + n);
      const main = simRegular(us, cur.score, st.team, cur.team, rnd);
      const pens = main.gu === main.gt ? simPens(cur.coin ? 'us' : 'th', st.team, cur.team, rnd) : null;
      // os outros jogos da mesma rodada do chaveamento (8 → 4 → 2 → 1 partidas)
      const orng = MF.rng(seed + ':oth' + n);
      const cnt = Math.pow(2, KN.length - 1 - n) - 1;
      const others = [];
      for (let j = 0; j < cnt; j++) {
        const ta = oppXI(st.form, pool, orng), tb = oppXI(st.form, pool, orng);
        if (!ta || !tb) continue;
        const sa = rate(ta, st.form).score, sb = rate(tb, st.form).score;
        others.push(Object.assign({ a: ta, b: tb, sa, sb }, simRegular(sa, sb, ta, tb, orng)));
      }
      return (liveCache[n] = { us, them: cur.score, main, pens, others, coin: !!cur.coin });
    }
    let liveOv = null, liveT = null;
    function closeLive() {
      clearTimeout(liveT); liveT = null;
      if (liveOv) { liveOv.remove(); liveOv = null; }
      board.classList.remove('fd-modal');
    }
    function commitLive() { closeLive(); playRound(); }
    function openLive() {
      if (!st.kn || knOver() || knRounds() >= KN.length || ctx.finished()) return;
      closeLive();
      const n = knRounds();
      const M = matchPack(n);
      const cur = st.kn.path[n];
      const { P } = MF.data;
      const who = (i) => P[i].n;
      const nm = (side) => (side === 'us' ? t('knYou') : t('knOppTeam'));
      const surname = (i) => P[i].n.split(' ').pop();
      const bestOf = (team) => team.reduce((b, i) => (P[i].r > P[b].r ? i : b), team[0]);
      const sU = h('b', { class: 'kl-sc' }, '0'), sT = h('b', { class: 'kl-sc' }, '0');
      const minEl = h('span', { class: 'kl-min' }, "0'");
      const fill = h('i', { class: 'kl-tl-fill' });
      const tickEls = M.main.goals.map((g) => h('i', { class: 'kl-tick ' + g.side, style: { left: (g.m / 90 * 100) + '%' } }));
      const scU = h('ul', { class: 'kl-scorers' }), scT = h('ul', { class: 'kl-scorers' });
      const feed = h('ol', { class: 'kl-feed' });
      const ban = h('div', { class: 'kl-banner', 'aria-hidden': 'true' });
      const kickList = h('ol', { class: 'kl-kicks' });
      const pensScore = h('b', { class: 'kl-pscore' }, '0 : 0');
      const pensBox = h('div', { class: 'kl-pens', hidden: true }, h('p', { class: 'kl-h' }, t('knPens')), pensScore, kickList);
      const othRefs = M.others.map((o) => {
        const ba = bestOf(o.a), bb = bestOf(o.b);
        const a1 = h('b', null, '0'), a2 = h('b', null, '0'), mn = h('small', null, "0'");
        const row = h('li', null,
          h('span', { class: 'nm' }, MF.flag(P[ba].nat), ' ', surname(ba)), a1,
          h('span', { class: 'dash' }, '–'), a2,
          h('span', { class: 'nm r' }, surname(bb), ' ', MF.flag(P[bb].nat)), mn);
        return { row, a1, a2, mn, o };
      });
      const btnPlay = h('button', { class: 'btn btn-ghost kl-btn', type: 'button', onclick: togglePlay }, t('knPause'));
      const btnSpeed = h('button', { class: 'btn btn-ghost kl-btn', type: 'button', onclick: cycleSpeed }, '×1');
      const btnSkip = h('button', { class: 'btn btn-ghost kl-btn', type: 'button', onclick: skipAll }, t('knSkip'));
      const btnGo = h('button', { class: 'btn btn-primary kl-btn kl-go', type: 'button', hidden: true, onclick: commitLive }, t('knContinue'));
      const res = h('p', { class: 'kl-res', hidden: true });
      const stats = h('div', { class: 'kl-stats', hidden: true });
      const ov = h('div', { class: 'kl play', role: 'dialog', 'aria-modal': 'true', 'aria-label': t(KN[n].k) },
        h('div', { class: 'kl-top' },
          h('span', { class: 'kl-round' }, t(KN[n].k)),
          h('span', { class: 'kl-live' }, h('i', null), t('knLive')),
          h('button', { class: 'kl-x', type: 'button', 'aria-label': t('knClose'), onclick: closeLive }, '✕')),
        h('div', { class: 'kl-board' },
          h('div', { class: 'kl-team us' }, h('strong', null, t('knYou')), h('small', null, t('fdDraft') + ' ' + M.us), scU),
          h('div', { class: 'kl-mid' }, h('span', { class: 'kl-score' }, sU, h('i', null, ':'), sT), minEl, h('div', { class: 'kl-tl' }, fill, tickEls)),
          h('div', { class: 'kl-team th' }, h('strong', null, t('knOppTeam')), h('small', null, t('fdDraft') + ' ' + M.them), scT)),
        h('div', { class: 'kl-body' },
          h('div', { class: 'kl-col' }, h('p', { class: 'kl-h' }, t('knFeed')), feed, pensBox),
          h('div', { class: 'kl-col' }, h('p', { class: 'kl-h' }, t('knOthers')), h('ul', { class: 'kl-oth' }, othRefs.map((r) => r.row)), stats)),
        ban,
        h('div', { class: 'kl-ctl' }, res, btnPlay, btnSpeed, btnSkip, btnGo));
      let minute = 0, playing = true, speed = 1, kicksDone = 0, finished = false, ca = 0, cb = 0;
      const SPEEDS = [1, 2, 4];
      function setScore() {
        sU.textContent = M.main.goals.filter((g) => g.side === 'us' && g.m <= minute).length;
        sT.textContent = M.main.goals.filter((g) => g.side === 'th' && g.m <= minute).length;
      }
      function sys(text) {
        feed.insertBefore(h('li', { class: 'kl-ev sys' }, h('b', null, minute + "'"), h('span', null, ' ' + text)), feed.firstChild);
      }
      function goalEvent(g, anim) {
        const list = g.side === 'us' ? scU : scT;
        feed.insertBefore(h('li', { class: 'kl-ev goal ' + g.side },
          h('b', null, g.m + "'"), h('span', null, ' ⚽ ' + who(g.sc)),
          g.as != null ? h('small', null, ' · ' + t('knAssist') + ' ' + who(g.as)) : null,
          h('em', null, nm(g.side))), feed.firstChild);
        list.insertBefore(h('li', null, who(g.sc) + ' ' + g.m + "'"), list.firstChild);
        tickEls[M.main.goals.indexOf(g)].classList.add('on');
        setScore();
        if (anim) {
          ov.classList.remove('goal'); void ov.offsetWidth; ov.classList.add('goal');
          ban.textContent = t('knGoal') + ' ' + who(g.sc);
          ban.classList.remove('on'); void ban.offsetWidth; ban.classList.add('on');
        }
      }
      function step(anim) {
        minute++;
        minEl.textContent = minute + "'";
        fill.style.width = (minute / 90 * 100) + '%';
        if (minute === 45) sys(t('knHalf'));
        M.main.goals.forEach((g) => { if (g.m === minute) goalEvent(g, anim); });
        othRefs.forEach((r) => {
          r.a1.textContent = r.o.goals.filter((x) => x.side === 'us' && x.m <= minute).length;
          r.a2.textContent = r.o.goals.filter((x) => x.side === 'th' && x.m <= minute).length;
          r.mn.textContent = minute >= 90 ? 'FT' : minute + "'";
        });
        if (minute === 90) sys(t('knFull'));
      }
      function kick(anim) {
        const k = M.pens.kicks[kicksDone++];
        if (k.ok) { if (k.side === 'us') ca++; else cb++; }
        pensScore.textContent = ca + ' : ' + cb;
        kickList.appendChild(h('li', { class: k.ok ? 'ok' : 'miss' }, (k.side === 'us' ? '▲ ' : '▼ ') + who(k.who) + (k.ok ? ' ✓' : ' ✕')));
        if (anim) { kickList.lastChild.classList.add('new'); }
      }
      function doNext(anim) {
        if (finished) return;
        if (minute < 90) step(anim);
        else if (M.pens && kicksDone < M.pens.kicks.length) {
          if (kicksDone === 0) { pensBox.hidden = false; sys(t('knPensStart')); }
          kick(anim);
        } else end();
      }
      function loop() {
        clearTimeout(liveT);
        if (!playing || finished) return;
        const delay = (minute >= 90 ? 700 : 220) / speed;
        liveT = setTimeout(() => { doNext(true); loop(); }, delay);
      }
      function togglePlay() {
        if (finished) return;
        playing = !playing;
        ov.classList.toggle('play', playing);
        btnPlay.textContent = playing ? t('knPause') : t('knResume');
        if (playing) loop(); else clearTimeout(liveT);
      }
      function cycleSpeed() {
        speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
        btnSpeed.textContent = '×' + speed;
        if (playing) loop();
      }
      function skipAll() {
        if (finished) return;
        clearTimeout(liveT);
        while (minute < 90) step(false);
        if (M.pens) {
          if (kicksDone === 0) { pensBox.hidden = false; sys(t('knPensStart')); }
          while (kicksDone < M.pens.kicks.length) kick(false);
        }
        end();
      }
      function end() {
        if (finished) return;
        finished = true; playing = false;
        clearTimeout(liveT);
        ov.classList.remove('play', 'goal'); ov.classList.add('done');
        btnPlay.hidden = true; btnSpeed.hidden = true; btnSkip.hidden = true; btnGo.hidden = false;
        const win = M.us > M.them || (M.us === M.them && M.coin);
        const g = M.main;
        res.textContent = g.gu + ' × ' + g.gt + (M.pens ? ' (' + t('knPens') + ' ' + M.pens.a + ' × ' + M.pens.b + ')' : '') + ' — ' + (win ? t('knWon') : t('knLost'));
        res.className = 'kl-res ' + (win ? 'won' : 'lost');
        res.hidden = false;
        MF.clear(stats);
        stats.append(
          h('div', null, h('span', null, t('knStatsPos')), h('b', null, g.pos + '% · ' + (100 - g.pos) + '%')),
          h('div', null, h('span', null, t('knStatsShots')), h('b', null, g.shU + ' · ' + g.shT)));
        stats.hidden = false;
      }
      // apresentação do adversário (como no draft do FIFA): os 11 do rival no campo, com a formação do seu time
      const slots = (FORMS[st.form] || FORMS['4-3-3']).s;
      const intro = h('div', { class: 'kl-intro' },
        h('p', { class: 'kl-h' }, t('knIntro')),
        h('strong', { class: 'kl-intro-t' }, t('knOppTeam') + ' · ' + t('fdDraft') + ' ' + M.them),
        h('div', { class: 'kl-intro-pitch' }, slots.map(([pos, x, y], k) =>
          h('div', { class: 'kl-intro-slot', style: { left: x + '%', top: y + '%', animationDelay: (k * 80) + 'ms' } }, card(cur.team[k], { mini: true, pos })))),
        h('button', { class: 'btn btn-primary kl-go kl-intro-go', type: 'button', onclick: startMatch }, t('knKickoffBtn')));
      function startMatch() { intro.remove(); sys(t('knKick')); loop(); }
      board.classList.add('fd-modal');
      board.appendChild(ov);
      ov.appendChild(intro);
      liveOv = ov;
    }

    function paint(pop, pop2) {
      const done = ctx.finished();
      const r = st.form ? rate(st.team, st.form) : null;
      const nFilled = st.team.filter((x) => x != null).length;
      stepPill.textContent = st.phase === 'form' ? t('fdForm') : st.phase === 'kn' ? t('knBracket') : t('fdStep') + ' ' + nFilled + '/11';
      missPill.textContent = t('misses') + ': ' + st.miss + '/' + MAXMISS;
      missPill.classList.toggle('hot', st.miss > 0);
      MF.clear(pitch);
      pitch.insertAdjacentHTML('beforeend', PITCH_SVG);
      const f = F() || FORMS[st.forms[0]];
      if (st.form) {
        const lines = f.l.map(([a, b], i) => {
          const v = r.links[i];
          const cls = v == null ? 'ln-n' : v === 2 ? 'ln-g' : v === 1 ? 'ln-o' : 'ln-r';
          return `<line class="${cls}" x1="${f.s[a][1]}" y1="${f.s[a][2]}" x2="${f.s[b][1]}" y2="${f.s[b][2]}" vector-effect="non-scaling-stroke"/>`;
        }).join('');
        pitch.insertAdjacentHTML('beforeend', '<svg class="fd-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + lines + '</svg>');
      }
      f.s.forEach(([pos, x, y], k) => {
        const pi = st.team[k];
        const cls = 'fd-slot' + (pi != null ? ' on' : '') + (sel === k ? ' sel' : '') + (sel != null && sel !== k ? ' can' : '') + (target === k ? ' open' : '') + (pop === k || pop2 === k ? ' pop' : '');
        const label = MF.pos(pos) + (pi != null ? ' · ' + P[pi].n + ' ' + P[pi].r + ' · ' + t('chemistry') + ' ' + r.pchem[k] : '');
        const inner = pi != null
          ? [card(pi, { mini: true, pos, club: st.from[k] }), h('span', { class: 'fd-chem c' + Math.min(3, Math.floor((r.pchem[k] || 0) / 3.4)) }, r.pchem[k])]
          : [h('span', { class: 'fd-plus', 'aria-hidden': 'true' }, '+'), h('span', { class: 'fd-pos' }, MF.pos(pos))];
        pitch.appendChild(h('button', { type: 'button', class: cls, style: { left: x + '%', top: y + '%' }, disabled: done || st.phase !== 'xi', 'aria-label': label, 'aria-pressed': sel === k || target === k ? 'true' : null, onclick: () => tapSlot(k) }, inner));
      });
      // rodada: clube sorteado + busca (fase do time) ou mata-mata (fase de partidas)
      MF.clear(roundBox);
      if (!done && st.phase === 'xi') {
        const c = curClub();
        const left = REROLLS[lvl] - st.rerolls;
        roundBox.appendChild(h('div', { class: 'fd-club pop' },
          MF.crest(clubs[c].n, 52),
          h('div', null, h('span', { class: 'fd-club-l' }, t('fdRoundClub') + ' · ' + (st.round + 1) + '/11'), h('strong', null, clubs[c].n),
            h('span', { class: 'fd-club-h' }, target != null ? t('fdForPos').replace('{p}', MF.pos(F().s[target][0])) : t('fdPickPos')))));
        roundBox.appendChild(ac);
        if (REROLLS[lvl] > 0) roundBox.appendChild(h('button', { class: 'btn btn-ghost fd-reroll', type: 'button', disabled: left <= 0, onclick: reroll }, left > 0 ? t('fdRerollClub') + ' (' + left + ')' : t('fdRerollUsed')));
        helpBtn.refresh();
        roundBox.appendChild(helpBtn);
        roundBox.appendChild(helpBtn.note);
      } else if (!done && st.phase === 'kn' && st.kn) {
        knockoutBox(roundBox);
      }
      MF.clear(side);
      const stat = (n, l, cls) => h('div', { class: 'fd-stat' + (cls ? ' ' + cls : '') }, h('strong', null, n), h('span', null, l));
      side.appendChild(roundBox);
      side.appendChild(h('div', { class: 'fd-stats' }, stat(r ? r.ovr : 0, t('fdRating')), stat(r ? r.chem : 0, t('chemistry')), stat(r ? r.score : 0, t('fdDraft'), 'big')));
      side.appendChild(h('p', { class: 'fd-formula' }, t('fdFormula')));
      if (!done) {
        if (st.form && st.phase === 'xi') side.appendChild(h('p', { class: 'fd-legend' }, h('i', { class: 'lg-g' }), ' ', h('i', { class: 'lg-o' }), ' ', h('i', { class: 'lg-r' }), ' ', t('fdLinks')));
        side.appendChild(h('div', { class: 'fd-actions' }, flag));
      } else if (r) {
        side.appendChild(h('p', { class: 'stars', 'aria-label': r.stars + '/5' }, h('span', { class: 'stars-row' }, Array.from({ length: 5 }, (_, i) => MF.icon(i < r.stars ? 'star' : 'starOff', 22))), ' ', h('span', null, r.label)));
      }
      if (!done && st.phase === 'form') formSheet();
    }
    // fim do draft: vence (campeão do mata-mata) ou perde; a pontuação só conta quando vence
    function end(win) {
      if (ctx.finished()) return;
      closeLive();
      closeSheet(); sel = null;
      const r = rate(st.team, st.form || st.forms[0]);
      const ok = !!win && st.team.every((x) => x != null);
      st.scoreLabel = t('fdDraft') + ': ' + r.score + ' (' + r.ovr + ' + ' + r.chem + ')';
      const kn = knLine();
      const lineTxt = '⭐'.repeat(r.stars) + '☆'.repeat(5 - r.stars) + '\n' + (st.form || '') + ' · ' + t('fdRating') + ' ' + r.ovr + ' · ' + t('chemistry') + ' ' + r.chem + ' · ' + t('fdDraft') + ' ' + r.score + (kn ? '\n' + kn : '');
      ctx.finish(ok, ok ? r.score : 0, lineTxt, { r: { ovr: r.ovr, chem: r.chem, score: r.score, stars: r.stars, label: r.label } });
      paint();
    }
    ctx.onTimeUp = () => end(false);
    // a base completa (todos os jogadores do Transfermarkt) chega em segundo plano
    MF.loadExt && MF.loadExt();
    board.appendChild(h('div', { class: 'bar' }, stepPill, missPill, ctx.timerEl));
    board.appendChild(h('div', { class: 'draft-layout fd-layout' }, pitch, side));
    board.appendChild(sheet);
    paint();
    // gancho de teste (como MF._pyrLast): permite montar um time completo e rodar o mata-mata
    MF._draftLast = { st, paint, makeKnockout: (p) => makeKnockout(st, p || pool, seed) };
  }
  MF.rateDraft = rate;
  MF._draftForms = FORMS;
  MF._draftClubs0 = clubPools;
})();
