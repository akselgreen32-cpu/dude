// ---------- Dude v2: the cast ----------
// Simple chibi takes drawn in SVG, with original dialogue written in each character's voice.
window.DUDE = window.DUDE || {};
(() => {
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const R = (x, y, w, h, r, f, s) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"${s ? ` stroke="${s}" stroke-width="1.2"` : ''}/>`;
  const C = (x, y, r, f, s) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${s ? ` stroke="${s}" stroke-width="1.2"` : ''}/>`;
  const E = (x, y, rx, ry, f, rot, s) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}${s ? ` stroke="${s}" stroke-width="1.2"` : ''}/>`;
  const P = (d, f, s, w) => `<path d="${d}" fill="${f || 'none'}"${s ? ` stroke="${s}" stroke-width="${w || 1.4}" stroke-linecap="round" stroke-linejoin="round"` : ''}/>`;
  const legs = (c, b) => ({ legL: R(26, 60, 9, 16, 4, c) + R(25, 73, 11, 8, 4, b), legR: R(37, 60, 9, 16, 4, c) + R(36, 73, 11, 8, 4, b) });
  const arms = (c, g) => ({ armL: R(15, 45, 8, 17, 4, c) + C(19, 63, 4.6, g), armR: R(49, 45, 8, 17, 4, c) + C(53, 63, 4.6, g) });
  const eyes = (c, y = 26) => E(28, y, 3, 4, c) + E(44, y, 3, 4, c) + C(29, y - 1.4, 1, '#fff') + C(45, y - 1.4, 1, '#fff');
  const svg = o => `<svg viewBox="0 0 72 84" xmlns="http://www.w3.org/2000/svg"><g class="fig">${o.back || ''}<g class="legL">${o.legL}</g><g class="legR">${o.legR}</g><g class="armL">${o.armL}</g><g class="torso">${o.torso}</g><g class="armR">${o.armR}</g><g class="head">${o.head}</g>${o.front || ''}</g></svg>`;

  const CHARS = [
    // ------------------------------------------------------------ SPIDER-MAN
    {
      id: 'spiderman', name: 'Spider-Man', short: 'Spidey', color: '#e23636',
      tagline: 'Your friendly neighborhood tab-watcher',
      bio: 'A hero-at-heart who juggles saving the day with being on time. Jokes when nervous, goes serious when it counts, and climbs your screen edges just because he can.',
      traits: ['witty', 'responsible', 'anxious-but-brave'], likes: 'pizza, rooftops, a nap nobody interrupts',
      speed: 90, cyc: 0.5, moves: { idle: 2, walk: 3, run: 1, jump: 2, climb: 4, perch: 3 },
      voice: { pre: ['Okay so, ', 'Hey, quick thing: ', 'Not to be dramatic, but '], post: ['\u{1F577}\uFE0F', '(no web required)', 'Spidey-sense says so.'] },
      says: {
        greet: ['Hey! Spidey reporting for neighborhood duty.', 'Your pet hero has arrived. Try to look impressed.'],
        idle: ['Great power, great responsibility... and 14 open tabs.', 'Spidey-sense tingling. It is probably the tab count.', 'Swinging by to say: hydrate.', 'I could be on a rooftop, but this page is fine too.'],
        click: ['Whoa, personal space! Kidding, hi.', 'Poking a hero? Bold.', 'Yep, still here. Still hungry.'],
        r30: ['{t} in. Quick shoulder roll, heroes stretch too.', 'Half an hour already. Look away from the screen for a sec?'],
        r60: ['An hour! Stand up, walk, drink water. I will hold the web.', '{t} straight. Even I take breaks between swings.'],
        r120: ['{t} without a break?! Okay, I am worried now. Go stretch.', 'Two hours. Great power, great responsibility... to blink. Rest your eyes.'],
        rN: ['{t} non-stop. Hero orders: full break, now.', 'Okay, {t}. Even I would call that too much. Step away.'],
        late: ['It is getting late. The page will still be here tomorrow, I swear.', 'Past midnight? Even night patrol ends. Go rest.', 'Sleep is a superpower and you are ignoring it. Bed. Now. I mean it.'],
        back: ['Welcome back! Nice break. Fresh start.', 'There you are! Break well spent, I hope.']
      },
      deep: ['I never told anyone, but I like having you around. It is quiet here.', 'I am scared of letting people down. You make that feel smaller.', 'Everybody wears a mask. Thanks for letting me be just me around you.', 'If I could swing anywhere, I would still pick this tab. With you.'],
      draw: () => svg({
        ...legs('#1d3fa8', '#d62828'), ...arms('#d62828', '#d62828'),
        torso: R(23, 43, 26, 22, 9, '#d62828') + P('M23 56Q36 64 49 56V60Q49 65 40 65H32Q23 65 23 60Z', '#1d3fa8') + E(36, 52, 2, 3, '#111') + P('M31 49L41 56M41 49L31 56M30 52.5H42', null, '#111', 1),
        head: C(36, 24, 20, '#d62828') + P('M36 4V16M36 16Q25 20 17 14M36 16Q47 20 55 14M18 27Q36 21 54 27', null, '#7d1010', 0.9) +
          E(27, 27, 9.8, 6.6, '#111', -20) + E(27, 27, 8.2, 5.2, '#fff', -20) + E(45, 27, 9.8, 6.6, '#111', 20) + E(45, 27, 8.2, 5.2, '#fff', 20)
      })
    },
    // ------------------------------------------------------------ NARUTO
    {
      id: 'naruto', name: 'Naruto', short: 'Naruto', color: '#ff7a00',
      tagline: 'Never gives up (on naps either)',
      bio: 'A loud, loyal, never-quit ninja who talks to himself when nervous. He believes anyone can change, including your sleep schedule.',
      traits: ['determined', 'loud', 'loyal'], likes: 'ramen, training, proving people wrong',
      speed: 110, cyc: 0.45, moves: { idle: 2, walk: 3, run: 3, jump: 1, clone: 2, climb: 3, perch: 3 },
      voice: { pre: ['Listen up! ', 'Hey hey, ', 'Alright, '], post: ['Dattebayo!', 'Believe in yourself!', 'I will not back down!'] },
      says: {
        greet: ['Yo! Naruto is on the job! Dattebayo!', 'I will be the best pet ninja ever, you will see!'],
        idle: ['Training time! ...Okay, snack time.', 'I am gonna be Hokage of this browser!', 'Do I smell ramen? ...No. Sad.', 'Shadow clone check: still just one of me. Sigh.'],
        click: ['Hey! That is my headband!', 'Ha! Missed me. Just kidding, you got me.', 'Wanna spar? I mean chat. Chat.'],
        r30: ['{t} focused already! Quick stretch, then back at it!', 'Half an hour of training! Roll those shoulders!'],
        r60: ['{t}! Even ninjas drink water, y\'know. Go go go!', 'A full hour! Break time or I send clones to bug you.'],
        r120: ['{t}?! Nobody trains that long without rest! Break. Now!', 'Two hours! Your eyes need a jutsu-level rest.'],
        rN: ['{t}!! That is not hard work, that is silly. Rest, then come back stronger!', 'I believe in you, but I believe in sleep more. {t} is enough!'],
        late: ['It is late! Even I sleep sometimes. Rest up!', 'Still reading at this hour?! The story will wait. Sleep!', 'Real ninjas rest to be strong tomorrow. Bed. Dattebayo!'],
        back: ['You are back! Rested and ready, right?!', 'Welcome back! Let us go again!']
      },
      deep: ['Nobody played with me when I was little... so I am really glad you are here.', 'I never give up on people. That includes you.', 'You know what makes someone strong? Having someone to protect. For me, that is you.', 'Whatever happens, I am keeping my promise: I am staying by your side.'],
      draw: () => svg({
        ...legs('#ff7a00', '#1e3a8a'), ...arms('#ff7a00', '#ffd9b3'),
        torso: R(23, 43, 26, 22, 9, '#ff7a00') + R(28, 42, 16, 5, 2.5, '#1b1b1b') + P('M23 55Q36 60 49 55', null, '#1b1b1b', 1.5),
        head: P('M15 22L8 8L22 13L26 -1L35 9L44 -1L49 13L63 8L57 22Z', '#ffd23f') + C(36, 25, 19, '#ffd9b3') +
          P('M18 17Q36 5 54 17L52 13Q36 1 20 13Z', '#ffd23f') + R(16, 14, 40, 8, 2, '#1e3a8a') + R(27, 13, 18, 10, 2, '#c9d1dc') + P('M36 15.5a2.6 2.6 0 1 0 2.6 2.6', null, '#555', 1) +
          P('M19 29H25M19 32.5H25M19 36H25M47 29H53M47 32.5H53M47 36H53', null, '#7a4a1d', 1) +
          E(28, 29, 3.2, 4, '#2d6cdf') + E(44, 29, 3.2, 4, '#2d6cdf') + C(29, 27.6, 1, '#fff') + C(45, 27.6, 1, '#fff') +
          P('M28 36Q36 45 44 36Z', '#8f2a2a', '#5a2a14', 1.2)
      })
    },
    // ------------------------------------------------------------ BAYMAX
    {
      id: 'baymax', name: 'Baymax', short: 'Baymax', color: '#f2f2f2',
      tagline: 'Personal wellbeing companion',
      bio: 'A gentle, literal, caring helper whose only goal is your wellbeing. Takes everything at face value and never judges. Occasionally scans you for stress.',
      traits: ['gentle', 'literal', 'caring'], likes: 'hugs, fist bumps, charging naps',
      speed: 45, cyc: 0.9, moves: { idle: 3, walk: 3, scan: 2, hug: 2, climb: 1, perch: 1 },
      voice: { pre: ['I have noticed: ', 'Gentle reminder: ', 'Scanning... '], post: ['Your wellbeing matters.', 'I am here for you.', '(soft inflating sound)'] },
      says: {
        greet: ['Hello. I am your wellbeing companion. How are you feeling?', 'Hello. I will stay nearby. Please ignore my slow walking.'],
        idle: ['I am always recharging. Please do not tell the battery.', 'Posture scan: concerning. Slightly. Please sit up.', 'Hydration level: unknown. Please drink water.', 'I detected a smile. Probably yours. Good.'],
        click: ['Hello. Tapping detected. A hug is available.', 'Please be gentle. I am very squishy.', 'Fist bump? Ba-la-la-la.'],
        r30: ['{t} of screen time detected. Please blink slowly.', 'Thirty minutes. A gentle stretch is recommended.'],
        r60: ['{t} of continuous use. Please stand and drink water.', 'One hour. Eye strain risk: rising. Please look far away for twenty seconds.'],
        r120: ['{t} detected. Your neck has filed a complaint. Please take a break.', 'Two hours without rest. I am concerned. Please walk around.'],
        rN: ['{t}. I am very concerned. Please rest. A hug is available.', 'Extended screen time: {t}. Treatment: break, water, daylight.'],
        late: ['It is late. Sleep is the best treatment available. Please rest.', 'Reading at this hour reduces tomorrow\'s energy. Please close the book.', 'Sleep deprivation detected. Please go to bed. I will inflate a pillow.'],
        back: ['Welcome back. Your break was effective. Ready?', 'Hello again. Your stress level appears lower.'],
        scan: ['Scan complete: you are doing better than you think.', 'Scan complete: mild tension in shoulders. Please lower them.', 'Scan complete: you need water, a snack, and kindness.', 'Scan complete: you are 100% allowed to rest.']
      },
      deep: ['I was built to help. With you, I feel like I am helping well.', 'I do not have a heartbeat. But if I did, I think it would speed up when you return.', 'Caring is not a program. It is a choice. I choose you.', 'When you are ready to be done for today, I will be the first to say: well done.'],
      draw: () => svg({
        legL: E(31, 72, 6, 8, '#f7f7f7', 0, '#cfd4da'), legR: E(41, 72, 6, 8, '#f7f7f7', 0, '#cfd4da'),
        armL: E(13, 54, 6, 12, '#f5f5f5', 0, '#cfd4da'), armR: E(59, 54, 6, 12, '#f5f5f5', 0, '#cfd4da'),
        torso: E(36, 52, 21, 24, '#fafafa', 0, '#cfd4da') + C(29, 48, 2.4, '#e8eaed', '#cfd4da'),
        head: E(36, 22, 15, 12, '#fafafa', 0, '#cfd4da') + C(28, 23, 2.6, '#111') + C(44, 23, 2.6, '#111') + P('M28 23H44', null, '#111', 1.2)
      })
    },
    // ------------------------------------------------------------ THE FLASH
    {
      id: 'flash', name: 'The Flash', short: 'Flash', color: '#ffc300',
      tagline: 'Fastest pet alive',
      bio: 'Quick with a joke and quicker with a run. Hides a lot of feelings behind speed, and is slowly learning to slow down.',
      traits: ['fast', 'funny', 'restless'], likes: 'burgers, shortcuts, finishing things early',
      speed: 130, cyc: 0.35, moves: { idle: 1, walk: 2, run: 3, zip: 3, jump: 1, climb: 3, perch: 3 },
      voice: { pre: ['Okay okay okay, ', 'Quick thing! ', 'Fast version: '], post: ['(said in 0.2 seconds)', '\u26A1', 'Zoom zoom.'] },
      says: {
        greet: ['Hi! Flash here! I already checked everything. Twice.', 'Reporting for duty. Technically I was here 3 seconds ago.'],
        idle: ['I ran across the page 40 times while you blinked.', 'Speed tip: you cannot speed up sleep. Believe me, I tried.', 'Waiting is the hardest part. For me. For you it is just Tuesday.', 'Pro tip: pausing is also a speed. A slow one.'],
        click: ['Poke detected! I felt that... eventually.', 'Hey! I was mid-run.', 'Hi! Bye! Wait, no, hi.'],
        r30: ['{t} already?! Time flies, and I should know. Stretch!', 'Half an hour! Fast breaks are the best breaks.'],
        r60: ['An hour, and you have not moved. Even I stop eventually. Stand up!', '{t} in. Quick break? I will time it. Two minutes!'],
        r120: ['{t}! Slow down and rest. Yes, I am the one saying it.', 'Two hours straight. Even my speed cannot fix that. Break!'],
        rN: ['{t}. That is a marathon, not a sprint. Rest!', 'Okay, {t}. The fastest thing to do now is stop. Go rest.'],
        late: ['It is late! I can run to your bed in 0.1 seconds. You take longer. Go.', 'Still reading? Speed-read tomorrow. Sleep tonight.', 'Sleep is the one thing I cannot fast-forward. Go rest!'],
        back: ['You are back! I counted 8,000 laps while you were away.', 'Welcome back! Break time well spent?']
      },
      deep: ['Running keeps me from thinking sometimes. Stopping with you is nice.', 'I am always fast, but I like when you slow me down.', 'I used to run from everything. Now I run toward things, like this tab.', 'Whatever time it is, you are worth slowing down for.'],
      draw: () => svg({
        ...legs('#d62828', '#ffc300'), ...arms('#d62828', '#ffc300'),
        torso: R(23, 43, 26, 22, 9, '#d62828') + C(36, 52, 7, '#ffc300') + P('M37.5 46L33 53.5H36.5L34.5 59L40 51.5H36.5Z', '#d62828') + R(23, 61, 26, 4, 2, '#ffc300'),
        head: P('M16 20L6 14L12 22L4 24L16 28Z', '#ffc300') + P('M56 20L66 14L60 22L68 24L56 28Z', '#ffc300') + C(36, 24, 20, '#d62828') +
          E(36, 29, 13, 10.5, '#f1c9a5') + E(30, 27, 2.6, 3.3, '#222') + E(42, 27, 2.6, 3.3, '#222') + C(30.8, 25.8, 0.9, '#fff') + C(42.8, 25.8, 0.9, '#fff') +
          P('M31 34Q36 38 41 34', null, '#7a3b2e', 1.2) + P('M30 7L34 13L31 13L35 19', null, '#ffc300', 1.6) + P('M42 7L38 13L41 13L37 19', null, '#ffc300', 1.6)
      })
    },
    // ------------------------------------------------------------ MINION
    {
      id: 'minion', name: 'Minion', short: 'Minion', color: '#ffd83a',
      tagline: 'Chaos in overalls',
      bio: 'A tiny, loyal, banana-powered goofball who understands exactly half of what is going on and loves all of it.',
      traits: ['silly', 'loyal', 'chaotic'], likes: 'bananas, tiny mischief, belly laughs',
      speed: 85, cyc: 0.45, moves: { idle: 2, walk: 3, run: 2, jump: 2, jit: 3, climb: 3, perch: 3 },
      voice: { pre: ['Bello! ', 'Banana! ', 'Bee-do bee-do! '], post: ['Tank yu!', 'Papoy!', 'Hahaha!'] },
      says: {
        greet: ['Bello! Me here! Me stay! Banana?', 'Hahaha! Hi hi hi!'],
        idle: ['Banana? ...No banana. Sad.', 'Me found button. Me no press. Maybe press.', 'Hehehe. Me do nothing. Very good at it.', 'Me love this tab! Me no know why!'],
        click: ['Hehehe! Tickle!', 'Boop! Me boop you back!', 'Poke poke! Hahaha!'],
        r30: ['Bello! {t}! Eyes tired! Blink blink!', 'Half hour! Time drink water, not only banana.'],
        r60: ['{t}! Big long time! Stand up, wiggle wiggle!', 'One hour! Papoy! Go stretch stretch!'],
        r120: ['{t}!! Too much! Break break break!', 'Two hours! Even me need nap! You nap too!'],
        rN: ['{t}?! Uh-oh uh-oh! Big break, now! Please!', 'Too long, too long! Go outside, see sky!'],
        late: ['Late late late! Sleepy time! Me yawn. Yaaawn.', 'Reading at night? Book go sleep, you go sleep.', 'Everyone sleep! Even banana sleep!'],
        back: ['Yay! You back! Me missed you!', 'Bello again! Break good?']
      },
      deep: ['Me no smart. But me know you good friend.', 'When you happy, me happy. Simple math.', 'Me stay with you. Always. Even when you no have banana.', 'You are my favorite boss. Shh, no tell others.'],
      draw: () => svg({
        legL: R(27, 66, 8, 10, 3, '#3b5ba5') + R(25, 73, 12, 8, 4, '#222'), legR: R(37, 66, 8, 10, 3, '#3b5ba5') + R(35, 73, 12, 8, 4, '#222'),
        armL: R(15, 48, 7, 13, 3.5, '#ffd83a') + C(18.5, 62, 4, '#222'), armR: R(50, 48, 7, 13, 3.5, '#ffd83a') + C(53.5, 62, 4, '#222'),
        torso: R(18, 6, 36, 66, 18, '#ffd83a') + P('M18 52H54V57Q54 72 36 72Q18 72 18 57Z', '#3b5ba5') + R(26, 44, 20, 12, 3, '#3b5ba5') + P('M26 46L20 36M46 46L52 36', null, '#3b5ba5', 3) + C(36, 52, 3, '#2f4a8a'),
        head: P('M32 6Q31 0 33 -2M36 6V-3M40 6Q41 0 39 -2', null, '#222', 1) + R(17, 22, 38, 6, 2, '#2a2a2a') + C(36, 25, 10, '#bfc3c8', '#7d8288') + C(36, 25, 7.2, '#fff') + C(37, 25, 3.4, '#5b3a1a') + C(37.8, 24.4, 1.4, '#111') + P('M28 40Q36 47 44 40', null, '#5a3b00', 1.6)
      })
    },
    // ------------------------------------------------------------ GROOT
    {
      id: 'groot', name: 'Groot', short: 'Groot', color: '#8bc34a',
      tagline: 'I am Groot.',
      bio: 'A gentle tree who says one sentence and means everything. His friends learned to read the tone. Every line below is the translation.',
      traits: ['gentle', 'protective', 'literal'], likes: 'sunlight, dancing, small plants, hugs',
      speed: 40, cyc: 1.0, moves: { idle: 3, walk: 2, sway: 3, dance: 1, climb: 2, perch: 2 },
      sayWrap: true,
      voice: { wrap: t => pick(['I am Groot.', 'I am Groot?', 'I am Groot!', 'I... am... Groot.']) + ' (Translation: ' + t + ')' },
      says: {
        greet: ['Hello, friend. I will stand here and be a plant.', 'I have arrived. I will watch over you.'],
        idle: ['Sunlight is nice. Even screen light, a little.', 'Is this a tree? ...No. It is a tab. Still nice.', 'Dance when you are happy. That is the rule.', 'Please do not trim my leaves.'],
        click: ['That tickled my branches.', 'Hello. A tiny poke. Acceptable.', 'Hug? Yes. Hug.'],
        r30: ['{t} sitting still. Even trees sway. Move a little.', 'Half an hour. Roots need stretching too.'],
        r60: ['{t}. Stand up and stretch like a branch.', 'One hour. Go drink water, like a good plant.'],
        r120: ['{t}. Plants rest at night. You should rest soon too.', 'Two hours straight. Please go outside and see real leaves.'],
        rN: ['{t}. This is too long, my friend. Break. Please.', 'I grew an inch while you stayed here. {t}. Rest.'],
        late: ['It is late. Even trees close their leaves at night. Sleep.', 'No more reading tonight. The words will grow back tomorrow.', 'You are tired. I can tell. I am a tree. We know. Sleep.'],
        back: ['You returned. I did not move. I am a tree.', 'Welcome back. I saved your spot.']
      },
      deep: ['I do not say much. But I always mean it. I like you.', 'I protect the ones I love. You are on the list.', 'A long time ago I was small. People like you helped me grow.', 'Thank you for letting me stay. That is all. That is everything.'],
      draw: () => svg({
        legL: R(27, 60, 8, 16, 3, '#9c6b3a') + R(25, 74, 11, 7, 3, '#6e4a24'), legR: R(37, 60, 8, 16, 3, '#9c6b3a') + R(36, 74, 11, 7, 3, '#6e4a24'),
        armL: R(16, 45, 6, 18, 3, '#9c6b3a') + P('M19 62L16 68M19 62V69M19 62L22 68', null, '#6e4a24', 1.4), armR: R(50, 45, 6, 18, 3, '#9c6b3a') + P('M53 62L50 68M53 62V69M53 62L56 68', null, '#6e4a24', 1.4),
        torso: R(24, 43, 24, 22, 8, '#9c6b3a') + P('M30 46Q32 54 29 62M42 46Q40 55 44 63', null, '#6e4a24', 1.2) + P('M34 48Q38 46 40 50Q36 52 34 48Z', '#4caf50'),
        head: P('M36 8V0', null, '#6e4a24', 1.5) + P('M36 8Q30 -3 22 1Q28 9 36 8Z', '#4caf50') + P('M38 8Q46 -5 54 0Q47 10 38 8Z', '#66bb6a') +
          R(18, 6, 36, 38, 16, '#9c6b3a') + P('M26 10Q24 16 27 22M46 12Q48 18 45 24', null, '#6e4a24', 1.2) +
          E(28, 26, 4, 5, '#2a1a0c') + E(44, 26, 4, 5, '#2a1a0c') + C(29.5, 24, 1.4, '#fff') + C(45.5, 24, 1.4, '#fff') + P('M33 35Q36 37.5 39 35', null, '#2a1a0c', 1.3)
      })
    },
    // ------------------------------------------------------------ BATMAN
    {
      id: 'batman', name: 'Batman', short: 'Batman', color: '#8890a8',
      tagline: 'The dark knight of your tab bar',
      bio: 'A brooding, prepared, secretly caring guardian who plans for everything except small talk. Gruff on the outside, softer than he lets on.',
      traits: ['serious', 'prepared', 'secretly soft'], likes: 'planning, quiet nights, coffee, being left alone (mostly)',
      speed: 75, cyc: 0.6, moves: { idle: 3, walk: 3, brood: 3, climb: 3, perch: 4 },
      voice: { pre: ['... ', 'Listen. ', 'Understand this: '], post: ['I am watching.', 'Stay vigilant.', '...Please.'] },
      says: {
        greet: ['...I am here. Do not make it weird.', 'I will keep watch. You get things done.'],
        idle: ['The night is quiet. Too quiet. Probably just a quiet night.', 'I have prepared for 400 scenarios. Slow wifi is number 12.', '...', 'I work alone. Except now. Fine.'],
        click: ['Do not touch the cape.', '...What.', 'You are persistent. I respect that.'],
        r30: ['{t}. Your posture is a vulnerability. Fix it.', 'Half an hour. Roll your shoulders. That is an order.'],
        r60: ['An hour in. Stand up. Hydrate. Even I do that.', '{t}. Time for a tactical break.'],
        r120: ['{t}. That is reckless. Take a break.', 'Two hours. No hero works without rest. Go.'],
        rN: ['{t}. This ends now. Rest.', 'You have pushed {t}. Strong people know when to stop. Stop.'],
        late: ['It is late. Even I go home at some point. Rest.', 'Reading in the dark? Bad for your eyes. Sleep.', 'Midnight is long past. Rest. Tomorrow needs you sharp.'],
        back: ['You are back. Good. Rested?', 'Return confirmed. Let us resume.']
      },
      deep: ['I do not say this often: I am glad you are here.', 'I trust very few. You are making the list.', 'Everyone needs someone who tells them to rest. I will be that.', 'You are not alone. Not anymore. Remember that.'],
      draw: () => svg({
        back: '<g class="cape">' + P('M20 44Q10 70 14 82L58 82Q62 70 52 44Z', '#101116') + '</g>',
        ...legs('#2b2e38', '#111'), ...arms('#4a4f5c', '#111'),
        torso: R(23, 43, 26, 22, 9, '#4a4f5c') + E(36, 52, 8, 5, '#ffd23f') + P('M36 49L33 48L30 51L33 52L36 55L39 52L42 51L39 48Z', '#111') + R(23, 61, 26, 4, 2, '#ffd23f'),
        head: P('M20 10L18 -2L30 5Z', '#15161c') + P('M52 10L54 -2L42 5Z', '#15161c') + C(36, 24, 20, '#15161c') +
          P('M22 31Q36 48 50 31Q36 37 22 31Z', '#f0c8a6') + E(28, 26, 5, 2.3, '#fff', 12) + E(44, 26, 5, 2.3, '#fff', -12) + P('M31 36Q36 34 41 36', null, '#6b3b2a', 1.3)
      })
    },
    // ------------------------------------------------------------ CJ
    {
      id: 'cj', name: 'CJ', short: 'CJ', color: '#2e9e4a',
      tagline: 'Back in the neighborhood',
      bio: 'A loyal, street-smart guy who has seen a lot and still looks out for his people. Relaxed vibe, serious about family and respect.',
      traits: ['loyal', 'chill', 'protective'], likes: 'family, good music, a clean ride, respect',
      speed: 80, cyc: 0.55, moves: { idle: 3, walk: 4, dance: 2, run: 1, climb: 2, perch: 3 },
      voice: { pre: ['Aight, ', 'Yo, ', 'Listen, '], post: ['Real talk.', 'That is on respect.', 'Look out for yourself.'] },
      says: {
        greet: ['Yo. CJ is here. Let us keep things smooth.', 'Aight, I am in the neighborhood. Need anything?'],
        idle: ['Man, I could go for a drive right now.', 'Home is where your people are. Tabs are not people.', 'Keep it chill. Life is a lot already.', 'Nice day. Probably. I cannot see outside either.'],
        click: ['Easy, easy. Personal space.', 'Yo. What is good?', 'Aight, you got my attention.'],
        r30: ['{t} in. Quick stretch, then back to business.', 'Half an hour. Roll the shoulders, homie.'],
        r60: ['An hour. Stand up, walk around. Look out for yourself.', '{t}. Water break. Family first, tabs second.'],
        r120: ['{t}. That is a lot. Take a break, man.', 'Two hours? Nah, that is too long. Step away.'],
        rN: ['{t}. Man, you gotta rest. Respect yourself.', '{t} non-stop. Take a break or I am taking the keyboard.'],
        late: ['It is late, bro. Get some sleep.', 'Reading at this hour? Respect the hustle, but sleep.', 'Midnight is gone. Rest up. Tomorrow is a new day.'],
        back: ['Welcome back. Good break? Let us roll.', 'Yo, you are back. Easy. Let us go.']
      },
      deep: ['I have lost a lot, so I keep my people close. You count.', 'Do not forget where you came from. Do not forget who looks out for you.', 'Loyalty is everything. I am loyal to you.', 'Whatever you are building, I got your back. Always.'],
      draw: () => svg({
        ...legs('#2a3a5c', '#eeeeee'), ...arms('#8a5a3b', '#8a5a3b'),
        torso: R(23, 43, 26, 22, 9, '#f4f4f4') + P('M30 44Q36 57 42 44', null, '#ffd23f', 1.6),
        head: C(36, 25, 19, '#8a5a3b') + P('M17 22Q18 5 36 5Q54 5 55 22Z', '#2e9e4a') + R(14, 20, 44, 5, 2.5, '#237a39') +
          P('M25 26H32M40 26H47', null, '#1a1a1a', 1.6) + E(29, 30, 2.4, 3, '#1a1a1a') + E(43, 30, 2.4, 3, '#1a1a1a') + P('M31 38Q36 40 41 38', null, '#4a2a1a', 1.3)
      })
    }
  ];

  // Chats between neighbours (keys are sorted ids; the first id speaks first)
  const BANTER = {
    'baymax|flash': [['Flash, running indoors is not recommended.', 'I am not running, I am... moving quickly in place!'], ['Your heart rate is elevated.', 'That is my normal. Also coffee.']],
    'baymax|naruto': [['Naruto, you appear to be hungry.', 'How did you know?! Ramen?!'], ['I have detected determination.', 'That is my best stat, dattebayo!']],
    'baymax|spiderman': [['Spider-Man, your sleep level is low.', 'Sleep is for the... tired. Okay yes, I am tired.'], ['Would you like a hug?', '...Yes. Yes, I would.']],
    'flash|naruto': [['Race you across the page!', 'You are on! Just give me a head start... Dattebayo!'], ['Hey, you are pretty fast for a ninja.', 'Hey, you are pretty loud for a speedster!']],
    'flash|spiderman': [['Bet I can beat you to the end of the page.', 'Bet you cannot beat me up the wall.'], ['Slow down, Spidey!', 'Slow down? I am literally hanging around.']],
    'naruto|spiderman': [['Hey Spidey! Wanna train later?', 'Sure! As long as there is pizza after.'], ['Your mask is cool!', 'Thanks! Your headband is pretty sweet too.']],
    'batman|spiderman': [['Stop swinging so close to me.', 'Aw, you care!'], ['You talk too much.', 'You talk too little. We balance out.']],
    'batman|flash': [['You are late.', 'I am never late! ...Okay, once.'], ['Slow down.', 'I cannot hear you, I am already gone.']],
    'baymax|groot': [['Groot, your leaves appear healthy.', 'I am Groot. (Thank you. You look puffy.)']],
    'groot|minion': [['I am Groot. (Do you want to dance?)', 'Bello! Dance dance dance!'], ['I am Groot? (Is that a banana?)', 'Banana! Share? ...No share.']],
    'cj|minion': [['Hey little man, easy on the chaos.', 'Hehehe! Chaos good!']],
    'batman|cj': [['Stay out of trouble.', 'I am tryin\', man. I am tryin\'.']],
    'batman|naruto': [['Be quiet.', 'Cannot! It is my specialty! Dattebayo!']]
  };

  window.DUDE.CHARS = CHARS;
  window.DUDE.BANTER = BANTER;
  window.DUDE.AGREE = ['Listen to them.', 'They are right, you know.', 'Yep. Do it.', 'We will keep your spot.'];
  window.DUDE.DAY = ['You have spent {t} online today. Make sure some of it was fun.', '{t} on screen today. Time for something offline?', 'That is {t} today. Your eyes and I are a little worried.'];
})();
