const quotesJson = [
  {
    author: "Alan Watts",
    quote:
      "Zen does not confuse spirituality with thinking about God while one is peeling potatoes. Zen spirituality is just to peel the potatoes.",
  },
  {
    author: "Alan Watts",
    quote: "Trying to define yourself is like trying to bite your own teeth.",
  },
  {
    author: "Alan Watts",
    quote:
      "I have suggested that behind almost all myth lies the mono-plot of the game of hide-and-seek",
  },
  {
    author: "Alan Watts",
    quote:
      "To have faith is to trust yourself to the water. When you swim you don't grab hold of the water, because if you do you will sink and drown. Instead you relax, and float",
  },
  {
    author: "Alan Watts",
    quote:
      "This is the real secret of life—to be completely engaged with what you are doing in the here and now. And instead of calling it work, realize it is play.",
  },
  {
    author: "Alan Watts",
    quote: "Religion is always falling apart",
  },
  {
    author: "Alan Watts",
    quote:
      "Doctors try to get rid of their patients — clergymen try to get them hooked on the medicine so that they will become addicts to the church.",
  },
  {
    author: "Alan Watts",
    quote:
      "The more we struggle for life (as pleasure), the more we are actually killing what we love",
  },
  {
    author: "Alan Watts",
    quote:
      "The greater part of human activity is designed to make permanent those experiences and joys which are only lovable because they are changing.",
  },
  {
    author: "Alan Watts",
    quote:
      "It must be obvious&hellip; that there is a contradiction in wanting to be perfectly secure in a universe whose very nature is momentariness and fluidity.",
  },
  {
    author: "Alan Watts",
    quote:
      "Running away from fear is fear; fighting pain is pain; trying to be brave is being scared. If the mind is in pain, the mind is pain. The thinker has no other form than his thought.",
  },
  {
    author: "Alan Watts",
    quote:
      "To be free from convention is not to spurn it but not to be deceived by it. It is to be able to use it as an instrument instead of being used by it.",
  },
  {
    author: "Alan Watts",
    quote:
      "If Christianity is wine and Islam coffee, Buddhism is most certainly tea.",
  },
  {
    author: "Alan Watts",
    quote:
      "Buddhism &hellip; is not a culture but a critique of culture, an enduring nonviolent revolution or “loyal opposition” to the culture in which it is involved",
  },
  {
    author: "Alan Watts",
    quote:
      "Sex is no longer a serious taboo. Teenagers sometimes know more about it than adults.",
  },
  {
    author: "Alan Watts",
    quote:
      "The world is in an extremely dangerous situation, and serious diseases often require the risk of a dangerous cure — like the Pasteur serum for rabies.",
  },
  {
    author: "Alan Watts",
    quote:
      "The most strongly enforced of all known taboos is the taboo against knowing who or what you really are behind the mask of your apparently separate, independent, and isolated ego.",
  },
  {
    author: "Alan Watts",
    quote:
      "As a human being it is just my nature to enjoy and share philosophy. I do this in the same way that some birds are eagles and some doves, some flowers lilies and some roses.",
  },
  {
    author: "Alan Watts",
    quote:
      "Everyone has a religion, whether admitted or not, because it is impossible to be human without having some basic assumptions (or intuitions) about existence and the good life.",
  },
  {
    author: "Alan Watts",
    quote:
      "A person who thinks all the time has nothing to think about except thoughts. So he loses touch with reality, and lives in a world of illusion.",
  },
  {
    author: "Alan Watts",
    quote:
      "If you know that \"I\", in the sense of the person, the front, the ego, it really doesn't exist. Then...it won't go to your head too badly, if you wake up and discover that you're God.",
  },
  {
    author: "Alan Watts",
    quote:
      "We have, as a result of two thousand years of Christianity, sex on the brain. Which isn't always the best place for it.",
  },
  {
    author: "Alan Watts",
    quote:
      "The whole history of religion is a history of the failure of preaching. Preaching is moral violence.",
  },
  {
    author: "Terence McKenna",
    quote:
      "What we call imagination is actually the universal library of what's real. You couldn't imagine it if it weren't real somewhere, sometime.",
  },
  {
    author: "Terence McKenna",
    quote: "We are being sucked into the body of eternity.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Life lived in the absence of the psychedelic experience that primordial shamanism is based on is life trivialized, life denied, life enslaved to the ego.",
  },
  {
    author: "Terence McKenna",
    quote:
      "A lot of people pass through the thinking I'm a guru and take enough trips to understand that no, I was just a witness. I was just a witness.",
  },
  {
    author: "Terence McKenna",
    quote:
      "The real secret of magic is that the world is made of words, and that if you know the words that the world is made of, you can make of it whatever you wish.",
  },
  {
    author: "Terence McKenna",
    quote:
      "If the truth can be told so as to be understood, it will be believed.",
  },
  {
    author: "Terence McKenna",
    quote:
      "We are caged by our cultural programming. Culture is a mass hallucination, and when you step outside the mass hallucination, you see it for what it's worth.",
  },
  {
    author: "Terence McKenna",
    quote: "Thinkers are not a welcome addition to most social situations.",
  },
  {
    author: "Terence McKenna",
    quote:
      'Where is it writ in adamantine, "The troops of monkeys should comprehend the architectonics of the cosmos"?',
  },
  {
    author: "Terence McKenna",
    quote:
      "History is the in-rushing toward what the Buddhists call the realm of the densely packed, a transformational realm where the opposites are unified.",
  },
  {
    author: "Terence McKenna",
    quote:
      "We have to claim anarchy and realize that systems have a life of their own that is anti-humanist. There is definitely an anti-humanist tendency in all systems.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Somewhere around 1945, we began to loot the future as a strategy for survival. Some ethical norm was shattered.",
  },
  {
    author: "Terence McKenna",
    quote:
      "If we are all God's children, then why have we rigged the earth with dynamite and are flipping coins to see who gets to set it off?",
  },
  {
    author: "Terence McKenna",
    quote:
      "We've been infected with the idea of original sin, that's what keeps us infantile&hellip;politics without responsibility is fascism.",
  },
  {
    author: "Terence McKenna",
    quote:
      "You need an ego. If you didn't have an ego, you wouldn't know whose mouth to put food in when eating in a restaurant.",
  },
  {
    author: "Terence McKenna",
    quote:
      "&hellip;yes I mean these journeys into higher places, where-ever they are, seem to demand mathematical metaphors.",
  },
  {
    author: "Terence McKenna",
    quote:
      "&hellip;intuition is intuition, & noise is noise, so what you do is, cook it in your mind and go with what feels right",
  },
  {
    author: "Terence McKenna",
    quote:
      "The main thing to understand is that we are imprisoned in some kind of work of art.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "It is in tune with the tempo of life — scattered yet welded into the whole, — broken, yet woven together.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "The job of the poet is to use language effectively, his own language, the only language which is to him authentic.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Poetry demands a different material than prose. It uses another facet of the same fact &hellip; the spontaneous conformation of language as it is heard.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "My first poem was a bolt from the blue &hellip; it broke a spell of disillusion and suicidal despondence. &hellip; it filled me with soul satisfying joy.",
  },
  {
    author: "William Carlos Williams",
    quote: "There's a lot of bastards out there!",
  },
  {
    author: "William Carlos Williams",
    quote:
      "I liked this because of the elimination of the essential in the composition. I cut it down and down, and down. This squeezed up to make it vivid.",
  },
  {
    author: "William Carlos Williams",
    quote:
      'Being an art form, verse cannot be "free" in the sense of having no limitations or guiding principle.',
  },
  {
    author: "William Carlos Williams",
    quote:
      "So different, this man<br>And this woman:<br>A stream flowing<br>In a field.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "The earth cracks and<br>is shriveled up;<br>the wind moans piteously;<br>the sky goes out<br>if you should fail.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "the set pieces<br>of your faces stir me —<br>leading citizens —<br>but not<br>in the same way.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "I lie here thinking of you:—<br>the stain of love<br>is upon the world!",
  },
  {
    author: "William Carlos Williams",
    quote:
      "It's a strange courage<br>you give me ancient star:<br>Shine alone in the sunrise<br>toward which you lend no part!",
  },
  {
    author: "William Carlos Williams",
    quote: "Who shall say I am not<br>the happy genius of my household?",
  },
  {
    author: "Alan Watts",
    quote:
      "We seldom realize, for example, that our most private thoughts and emotions are not actually our own. For we think in terms of languages and images which we did not invent, but which were given to us by our society.",
  },
  {
    author: "Alan Watts",
    quote:
      "The reason we want to go on and on is because we live in an impermanent world.",
  },
  {
    author: "Terence McKenna",
    quote:
      "The cost of sanity, in this society, is a certain level of alienation.",
  },
  {
    author: "Terence McKenna",
    quote:
      "Nature is not our enemy, to be raped and conquered. Nature is ourselves, to be cherished and explored.",
  },
  {
    author: "Terence McKenna",
    quote:
      "The syntax in which we speak is the software which we download into the human operating system.",
  },
  {
    author: "William Carlos Williams",
    quote:
      "The sky leans on us, imperfectly, its breath<br>puffed out towards us<br>in derision. But though<br>the leaves cling to their trees<br>it is not for us alone.",
  },
  {
    author: "William Carlos Williams",
    quote: "The pure products of America<br>go crazy—",
  },
  {
    author: "William Carlos Williams",
    quote:
      "Among the rain<br>and lights<br>I saw the figure 5<br>in gold<br>on a red<br>firetruck<br>moving<br>tense<br>unheeded",
  },
  {
    author: "Aldous Huxley",
    quote:
      "Experience is not what happens to a man; it is what a man does with what happens to him.",
  },
  {
    author: "Hunter S. Thompson",
    quote:
      "Life should not be a journey to the grave with the intention of arriving safely in a pretty and well preserved body, but rather to skid in broadside in a cloud of smoke, thoroughly used up, totally worn out, and loudly proclaiming 'Wow! What a Ride!'",
  },
  {
    author: "Albert Hofmann",
    quote:
      "I believe that if people would learn to use LSD's vision-inducing capability more wisely, under suitable conditions, in medical practice and in conjunction with meditation, then in the future this problem child could become a wonder child.",
  },
  {
    author: "Carlos Castaneda",
    quote:
      "We either make ourselves miserable, or we make ourselves strong. The amount of work is the same.",
  },
  {
    author: "Graham Hancock",
    quote:
      "I believe that ancient and indigenous peoples knew a lot more than we do about the nature of consciousness and reality.",
  },
  {
    author: "C.G. Jung",
    quote:
      "Your visions will become clear only when you can look into your own heart. Who looks outside, dreams; who looks inside, awakes.",
  },
  {
    author: "Timothy Leary",
    quote: "You are a god, act like one, think like one, take responsibility.",
  },
];
