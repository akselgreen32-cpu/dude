// ---------- Dude v2: conversation styles ----------
// Each style is [name, emoji, 'line|line|line', optional flag: n = night only, m = morning only].
// Every line is passed through the speaking character's voice, so one style sounds different per pal.
(() => {
  const rows = [
    ['Motivation', '\u{1F4AA}', 'You do not need to be perfect. You need to start.|Small steps still move you forward.|Future you is rooting for you right now.'],
    ['Dad joke', '\u{1F602}', 'Why did the laptop get cold? It left its Windows open.|I would tell you a UDP joke, but you might not get it.|Why was the math book sad? Too many problems.'],
    ['Fun fact', '\u{1F9E0}', 'Honey never spoils. It stays edible for thousands of years.|Octopuses have three hearts.|Bananas are berries. Strawberries are not.'],
    ['Riddle', '\u2753', 'What has keys but opens no locks? A keyboard.|What gets wetter the more it dries? A towel.|What goes up but never comes down? Your age.'],
    ['Compliment', '\u{1F31F}', 'You are doing better than you think.|Your effort is noticed, even when you do not notice it.|You have a great mind. Be kind to it.'],
    ['Light roast', '\u{1F525}', 'That tab count is a cry for help.|You said "five more minutes" like 40 minutes ago.|Your search history could be a comedy special.'],
    ['Deep thought', '\u{1F914}', 'If time is money, why does procrastination feel free?|Is a rest day still a day if you spend it worrying?|You are the main character of a very long story. Pace it.'],
    ['Poem', '\u270D\uFE0F', 'Tabs open wide, the hours slide; take a breath, then step outside.|Small steps, small wins, a day well done is where rest begins.|Screens will glow, but let them go, the best of life is off the page.'],
    ['Haiku', '\u{1F338}', 'Quiet screen at night / thoughts drift like soft falling leaves / rest is also work|Open tabs bloom wide / one breath, one sip of water / mind becomes a lake|Morning light arrives / small tasks gather like sparrows / begin with just one'],
    ['Health tip', '\u{1FA7A}', 'Look 20 feet away for 20 seconds every 20 minutes.|Daylight in the morning helps tonight\'s sleep.|A short walk beats another coffee.'],
    ['Posture check', '\u{1FA91}', 'Shoulders down. Chin back. Screen at eye level.|Feet flat on the floor? Back supported? Check.|Unclench your jaw. Yes, that one.'],
    ['Hydration', '\u{1F4A7}', 'Water break. Your brain says thanks.|Sip something. Your future headache says thanks too.|Hydration status: unknown. Fix that.'],
    ['Eye rest', '\u{1F440}', 'Blink slowly ten times. Eyes need it.|Look out a window for a moment.|Rub your palms warm, then cover your eyes for 20 seconds.'],
    ['Stretch', '\u{1F938}', 'Roll your neck slowly. Left, then right.|Reach for the ceiling. Hold two breaths.|Shake out your wrists. They have earned it.'],
    ['Study tip', '\u{1F4DA}', 'Teach it out loud to an imaginary classmate.|Test yourself before rereading. It sticks better.|Study in short bursts. Review before sleep.'],
    ['Productivity', '\u26A1', 'Pick the next smallest step. Do only that.|Close the tabs you are not using. Truly.|One task at a time. Multitasking is a myth.'],
    ['Procrastination', '\u{1F40C}', 'That thing you are avoiding? Two minutes. Just start.|You have been "about to start" for a while now.|The task is smaller than the dread. Go.'],
    ['Would you rather', '\u{1F3B2}', 'Would you rather have unlimited snacks or unlimited naps?|Would you rather talk to animals or speak every language?|Would you rather live in a treehouse or a castle?'],
    ['Fortune cookie', '\u{1F960}', 'A pleasant surprise is in your near future. Possibly lunch.|You will finish something soon. It will feel great.|Someone is thinking kindly of you today.'],
    ['Mood check', '\u{1F324}\uFE0F', 'How is your inner weather? Sunny, cloudy, or storm?|Quick check-in: tired, wired, or fine?|Name one feeling you have right now. Just one.'],
    ['Gratitude', '\u{1F64F}', 'Name one small thing that went right today.|Think of someone who helped you lately. Thank them later.|Be grateful for one boring, ordinary thing today.'],
    ['Breathing', '\u{1F32C}\uFE0F', 'In for four, hold for four, out for six. Twice.|Breathe in slowly... and let the shoulders drop.|Three slow breaths. I will wait.'],
    ['Sleep nudge', '\u{1F634}', 'It is {time}. Sleep is the best study technique.|Dim the screen, close the tabs, go to bed.|Tomorrow\'s you needs tonight\'s sleep.', 'n'],
    ['Bedtime story', '\u{1F319}', 'Once upon a time, someone closed their laptop and slept well. The end.|A tiny cloud learned to rest. It woke up a rainbow. Sleep well.|A sleepy owl waited for you to go to bed. Please hurry. Owls are tired.', 'n'],
    ['Good morning', '\u2600\uFE0F', 'Good morning! One good thing today is enough.|Morning! Water first, then everything else.|A new day. Zero mistakes made so far.', 'm'],
    ['Hype man', '\u{1F4E3}', 'LET\'S GO! You are on a roll!|Look at you, being productive and everything!|Big energy today! Keep it up!'],
    ['Announcer', '\u{1F3AC}', 'And in today\'s episode: someone refuses to take a break.|Coming up: a human, a screen, and an epic stare-down.|Breaking news: you are doing great.'],
    ['Silly conspiracy', '\u{1F6F8}', 'Fact: pigeons are government drones. Fact: tabs multiply at night.|They do not want you to know that naps are free.|Cats run the internet. We are all just visiting.'],
    ['Hot take', '\u{1F336}\uFE0F', 'Hot take: sleep beats grinding. Every time.|Hot take: "one more episode" is never one.|Hot take: a sandwich is the perfect food.'],
    ['Exam pep talk', '\u{1F393}', 'Exams are just questions you have already almost answered.|Review, rest, repeat. You have got this.|A tired brain forgets. A rested one remembers.'],
    ['Trivia', '\u{1F3C6}', 'The shortest war in history lasted under an hour.|A group of flamingos is called a flamboyance.|The Eiffel Tower grows a few centimeters in summer heat.'],
    ['Tongue twister', '\u{1F445}', 'Red lorry, yellow lorry. Say it fast.|She sells seashells by the seashore. Try it.|Unique New York. Ten times fast.'],
    ['Pun', '\u{1F941}', 'I used to hate facial hair, but then it grew on me.|Time flies like an arrow. Fruit flies like a banana.|I am reading a book on anti-gravity. Cannot put it down.'],
    ['Knock-knock', '\u{1F6AA}', 'Knock knock. Who is there? Water. Water who? Water you waiting for?|Knock knock. Who is there? Break. Break who? Break time!|Knock knock. Who is there? Sleep. Sleep who? Sleep tight.'],
    ['Life hack', '\u{1F9F0}', 'Put your phone in another room while you focus.|Write tomorrow\'s top three tasks before you stop.|Set a timer for tasks you dread. It makes starting easier.'],
    ['Tab callout', '\u{1F5C2}\uFE0F', 'Be honest: do you need all these tabs?|Close one tab right now. Feel better?|Tab bar status: overcrowded.'],
    ['Snack idea', '\u{1F34C}', 'Banana plus peanut butter. You are welcome.|A handful of nuts and a glass of water.|A fruit. Any fruit. Do it.'],
    ['Music idea', '\u{1F3B5}', 'Try instrumental music for focus. Lo-fi, piano, anything calm.|Put on a song you love and stretch.|Rain sounds can help you focus. Give them a try.'],
    ['Movie night', '\u{1F39E}\uFE0F', 'Pick a comfort movie tonight. Rewatching is allowed.|Animated movies count as real movies. Always.|Movie night plan: popcorn, blanket, no phone.'],
    ['Game idea', '\u{1F3AE}', 'Play a short co-op game with a friend.|A 20-minute puzzle game counts as a good break.|Try a new game genre this week.'],
    ['Mini challenge', '\u{1F3AF}', 'Challenge: stand up and touch your toes. Go.|Challenge: drink water and text a friend hello.|Challenge: tidy one small spot right now.'],
    ['Mini meditation', '\u{1F9D8}', 'Close your eyes. Notice three sounds around you.|Feel your feet on the floor. Just that.|Let your thoughts pass like clouds. One breath.'],
    ['Self-kindness', '\u{1F917}', 'Talk to yourself like you would talk to a friend.|Rest is not laziness. It is maintenance.|You are allowed to be a work in progress.'],
    ['Overthinking stopper', '\u{1F6D1}', 'You cannot solve tomorrow tonight. Pause.|Write the worry down. Then close the page.|Is it a problem or a what-if? Be honest.'],
    ['Focus coach', '\u{1F50D}', 'Pick one task. Hide everything else.|Phone face-down. Tabs closed. Go for 25 minutes.|Start with the ugliest task first.'],
    ['Time perspective', '\u23F3', 'An hour from now, this moment will be the past. Use it well.|You have 24 hours a day, same as everyone. Include rest.|Small minutes add up to big days.'],
    ['Deal maker', '\u{1F91D}', 'Deal: 25 more minutes of work, then a proper break.|Deal: finish this task, then a snack. No negotiating.|Deal: one more section, then stretch.'],
    ['Pomodoro push', '\u{1F345}', '25 minutes on, 5 minutes off. Ready?|Timer idea: 25 focused, 5 breathe. Repeat.|Do one tomato round. You deserve a break after.'],
    ['Cheer up', '\u{1F308}', 'Rough day? Tomorrow is a new page.|Hey. You made it this far. That counts.|Bad days end. Take a breath. I am here.'],
    ['Sassy', '\u{1F485}', 'Not me watching you do five things at once.|I am not saying you are late. I am saying the clock is.|Cute plan. Does it include sleep?'],
    ['Night sky', '\u{1F30C}', 'The stars are out. Some are older than the internet.|The night is quiet. Let your mind be quiet too.|Somewhere, a whole sky is going on without a screen.', 'n'],
    ['Grandpa wisdom', '\u{1F474}', 'Back in my day, tabs were called "books".|Eat your vegetables and call your family.|If it can wait until tomorrow, let it.'],
    ['Detective noir', '\u{1F575}\uFE0F', 'The case: a missing hour. The suspect: social media.|It was a dark and stormy tab. The suspect: video streaming.|Every tab hides a secret. Mostly memes.'],
    ['Sports commentator', '\u{1F3DF}\uFE0F', 'And they are back on the keyboard! What a comeback!|Incredible focus, folks. Truly Olympic.|Water break! Smart move by the home team.'],
    ['Cooking show', '\u{1F373}', 'First, take one task. Add a pinch of focus. Stir.|Today\'s recipe: one part work, one part rest.|Chef\'s tip: do not rush. Let the idea simmer.'],
    ['Nature documentary', '\u{1F981}', 'Here we observe the human at rest in its natural habitat: the chair.|The student, nocturnal, migrates toward the snack table.|Notice the elegant tab-switching behavior.'],
    ['Pirate', '\u{1F3F4}\u200D\u2620\uFE0F', 'Arr! Ye have been at the screen too long, matey.|Hoist the sails! Or at least stand up and stretch.|Treasure map says: drink water. X marks the kitchen.'],
    ['Shakespearean', '\u{1F3AD}', 'To rest, or not to rest? Rest, good friend. Rest.|O sweet water, where art thou? In the kitchen. Fetch it.|Alas, the tabs are many and the hours are few.'],
    ['Robot mode', '\u{1F916}', 'BEEP. HUMAN DETECTED. SUGGESTION: WATER.|Processing... conclusion: you need a break.|Error 404: energy not found. Please recharge.']
  ];

  const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const styles = rows.map(([n, e, l, f]) => ({ id: slug(n), n, e, lines: l.split('|'), f: f || '' }));
  // Two special styles: the character's own signature lines, and bond-gated deep talk.
  styles.push({ id: 'sig', n: 'Signature', e: '\u{1F3AD}', lines: [], f: '', special: true });
  styles.push({ id: 'deep', n: 'Deep talk', e: '\u{1F4AD}', lines: [], f: '', special: true });
  window.DUDE.STYLES = styles;
})();
