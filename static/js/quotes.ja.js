const quotesJson = [
  {
    author: "Alan Watts",
    quote: "禅は、ジャガイモの皮を剥きながら神について考えることを精神性と混同しません。禅の精神性とは、ただジャガイモの皮を剥くことです。",
  },
  {
    author: "Alan Watts",
    quote: "自分自身を定義しようとすることは、自分の歯を噛もうとするようなものです。",
  },
  {
    author: "Alan Watts",
    quote: "ほとんどすべての神話の背後には、かくれんぼというゲームの単一のプロットがあると私は示唆してきました。",
  },
  {
    author: "Alan Watts",
    quote: "信仰を持つということは、自分自身を水に委ねることです。泳ぐとき、水をつかもうとはしません。つかめば沈んで溺れてしまうからです。代わりに、リラックスして浮かぶのです。",
  },
  {
    author: "Alan Watts",
    quote: "これが人生の本当の秘密です—今この瞬間にしていることに完全に没頭することです。そしてそれを仕事と呼ぶ代わりに、それが遊びであることを理解するのです。",
  },
  {
    author: "Alan Watts",
    quote: "宗教は常に崩壊しています。",
  },
  {
    author: "Alan Watts",
    quote: "医者は患者を治そうとします—聖職者は彼らを薬物中毒者のように教会に依存させようとします。",
  },
  {
    author: "Alan Watts",
    quote: "人生（快楽として）を求めて苦闘すればするほど、私たちは実際に愛するものを殺しているのです。",
  },
  {
    author: "Alan Watts",
    quote: "人間の活動の大部分は、変化しているからこそ愛おしい経験や喜びを永続的なものにしようとすることに向けられています。",
  },
  {
    author: "Alan Watts",
    quote: "明らかなはずです...その本質が一時性と流動性である宇宙の中で、完全な安全を求めることには矛盾があります。",
  },
  {
    author: "Alan Watts",
    quote: "恐怖から逃げることは恐怖であり、痛みと戦うことは痛みであり、勇敢であろうとすることは怖がっていることです。心が痛みの中にあるなら、心は痛みそのものです。思考者は自分の思考以外の形を持ちません。",
  },
  {
    author: "Alan Watts",
    quote: "因習から自由になるということは、それを軽蔑することではなく、それに欺かれないことです。それは、それに使われるのではなく、道具として使えるようになることです。",
  },
  {
    author: "Alan Watts",
    quote: "キリスト教がワインで、イスラム教がコーヒーなら、仏教は間違いなくお茶です。",
  },
  {
    author: "Alan Watts",
    quote: "仏教は...文化ではなく、文化の批評であり、それが関わる文化への永続的な非暴力革命、あるいは「忠実な反対派」なのです。",
  },
  {
    author: "Alan Watts",
    quote: "性はもはや深刻なタブーではありません。時として、10代の若者は大人以上のことを知っています。",
  },
  {
    author: "Alan Watts",
    quote: "世界は極めて危険な状況にあり、深刻な病気には狂犬病のパスツール血清のような危険な治療法を冒すことが必要な場合があります。",
  },
  {
    author: "Alan Watts",
    quote: "既知のタブーの中で最も強く強制されているのは、仮面の背後にある、一見別個で独立し孤立した自我の向こうにある、あなたが本当は誰なのか、何なのかを知ることへのタブーです。",
  },
  {
    author: "Alan Watts",
    quote: "人間として、私は哲学を楽しみ共有することが自然なのです。それは、ある鳥が鷲で、ある鳥が鳩であり、ある花が百合で、ある花が薔薇であるのと同じことです。",
  },
  {
    author: "Alan Watts",
    quote: "認めているかどうかに関わらず、誰もが宗教を持っています。なぜなら、存在と良き人生について何らかの基本的な前提（または直感）を持たずに人間であることは不可能だからです。",
  },
  {
    author: "Alan Watts",
    quote: "常に考えている人は、考えること以外に考えるものがありません。そのため、現実との接点を失い、幻想の世界に生きることになります。",
  },
  {
    author: "Alan Watts",
    quote: "もしあなたが「私」というものが、人格、表面、自我という意味で、本当は存在しないことを知っているなら...目覚めて自分が神であることを発見しても、あまり頭がおかしくなることはないでしょう。",
  },
  {
    author: "Alan Watts",
    quote: "2000年のキリスト教の結果として、私たちは頭の中に性を持っています。それは必ずしも最適な場所ではありません。",
  },
  {
    author: "Alan Watts",
    quote: "宗教の歴史全体が説教の失敗の歴史です。説教は道徳的暴力です。",
  },
  {
    author: "Terence McKenna",
    quote: "私たちが想像力と呼ぶものは、実際には現実の普遍的な図書館です。それがどこかで、いつかの時点で現実でなければ、想像することはできないでしょう。",
  },
  {
    author: "Terence McKenna",
    quote: "私たちは永遠の体の中に吸い込まれているのです。",
  },
  {
    author: "Terence McKenna",
    quote: "原始的なシャーマニズムが基づいているサイケデリック体験なしに生きる人生は、矮小化された人生、否定された人生、自我に隷属した人生です。",
  },
  {
    author: "Terence McKenna",
    quote: "多くの人が私をグルだと思う段階を通過し、十分な旅を重ねて理解します。いいえ、私はただの証人でした。ただの証人だったのです。",
  },
  {
    author: "Terence McKenna",
    quote: "魔法の本当の秘密は、世界が言葉でできているということです。そして、世界を作っている言葉を知っていれば、望むものを何でも作ることができるのです。",
  },
  {
    author: "Terence McKenna",
    quote: "真実が理解されるように語られるなら、それは信じられるでしょう。",
  },
  {
    author: "Terence McKenna",
    quote: "私たちは文化的プログラミングによって檻に閉じ込められています。文化は集団的な幻覚であり、その集団的な幻覚の外に出たとき、その価値がわかるのです。",
  },
  {
    author: "Terence McKenna",
    quote: "思想家は、ほとんどの社会的状況において歓迎されない存在です。",
  },
  {
    author: "Terence McKenna",
    quote: "「猿の群れが宇宙の構造を理解すべし」とは、どこに金文字で書かれているというのでしょうか？",
  },
  {
    author: "Terence McKenna",
    quote: "歴史は、仏教徒が密集界と呼ぶもの、対立するものが統一される変容の領域へと押し寄せていくものです。",
  },
  {
    author: "Terence McKenna",
    quote: "私たちはアナーキーを主張し、システムには反人間主義的な独自の生命があることを認識しなければなりません。すべてのシステムには明らかに反人間主義的な傾向があります。",
  },
  {
    author: "Terence McKenna",
    quote: "1945年頃から、私たちは生存戦略として未来を略奪し始めました。何らかの倫理的規範が破壊されたのです。",
  },
  {
    author: "Terence McKenna",
    quote: "もし私たちが皆、神の子供たちなら、なぜ地球をダイナマイトで仕掛け、誰がそれを起爆させるかコインを投げて決めようとしているのでしょうか？",
  },
  {
    author: "Terence McKenna",
    quote: "私たちは原罪という考えに感染しています。それが私たちを幼児的なままにしているのです...責任のない政治はファシズムです。",
  },
  {
    author: "Terence McKenna",
    quote: "自我は必要です。自我がなければ、レストランで食事をするとき、どの口に食べ物を入れればいいのかわからないでしょう。",
  },
  {
    author: "Terence McKenna",
    quote: "...はい、これらの高次の場所への旅は、それがどこであれ、数学的な比喩を必要とするように思えます。",
  },
  {
    author: "Terence McKenna",
    quote: "...直感は直感であり、ノイズはノイズです。だから、あなたがすることは、それを心の中で調理し、正しいと感じるものに従うことです。",
  },
  {
    author: "Terence McKenna",
    quote: "理解すべき主なことは、私たちが何らかの芸術作品の中に閉じ込められているということです。",
  },
  {
    author: "William Carlos Williams",
    quote: "それは人生のテンポと調和しています—散らばりながらも全体に溶け込み、壊れながらも織り合わされています。",
  },
  {
    author: "William Carlos Williams",
    quote: "詩人の仕事は言語を効果的に使うことです。彼自身の言語、彼にとって本物である唯一の言語を。",
  },
  {
    author: "William Carlos Williams",
    quote: "詩は散文とは異なる素材を要求します。それは同じ事実の別の側面を使用します...聞こえてくる言語の自発的な形成を。",
  },
  {
    author: "William Carlos Williams",
    quote: "私の最初の詩は青天の霹靂でした...それは幻滅と自殺的な落胆の呪縛を破りました。...それは魂を満たす喜びで私を満たしました。",
  },
  {
    author: "William Carlos Williams",
    quote: "世の中にはたくさんのろくでなしがいるものだ！",
  },
  {
    author: "William Carlos Williams",
    quote: "私はこれが好きでした。構成から本質的なものを取り除いたからです。私はそれを削り、削り、削りました。これは生き生きとさせるために圧縮されました。",
  },
  {
    author: "William Carlos Williams",
    quote: "芸術形式である以上、詩は制限や指導原理がないという意味で「自由」ではありえません。",
  },
  {
    author: "William Carlos Williams",
    quote: "こんなにも違う、この男と\nこの女：\n野原を流れる\n一筋の流れ。",
  },
  {
    author: "William Carlos Williams",
    quote: "大地は割れ\n干からびていく；\n風は哀れに呻き；\n空は消えていく\nもしあなたが失敗するなら。",
  },
  {
    author: "William Carlos Williams",
    quote: "あなたがたの顔の\n決まり切った表情が私を動かす—\n立派な市民たちよ—\nしかし\n同じ方法ではない。",
  },
  {
    author: "William Carlos Williams",
    quote: "私はここであなたのことを考えている：—<br>愛の染みが<br>世界に広がっている！",
  },
  {
    author: "William Carlos Williams",
    quote: "不思議な勇気を<br>あなたは私に与えてくれる 古い星よ：<br>日の出の中でひとり輝け<br>あなたは何の役も果たさないのに！",
  },
  {
    author: "William Carlos Williams",
    quote: "誰が私を<br>我が家の幸せな天才でないと言えようか？",
  },
  {
    author: "Alan Watts",
    quote: "例えば、私たちの最も私的な思考や感情が実は私たち自身のものではないということに、めったに気づきません。なぜなら、私たちは自分で発明したのではなく、社会から与えられた言語やイメージで考えているからです。",
  },
  {
    author: "Alan Watts",
    quote: "私たちが永遠に続けたいと思う理由は、私たちが無常の世界に生きているからです。",
  },
  {
    author: "Terence McKenna",
    quote: "この社会で正気を保つためのコストは、ある程度の疎外感なのです。",
  },
  {
    author: "Terence McKenna",
    quote: "自然は征服し、蹂躙すべき敵ではありません。自然は私たち自身であり、大切にし、探求すべきものなのです。",
  },
  {
    author: "Terence McKenna",
    quote: "私たちが話す構文は、人間のオペレーティングシステムにダウンロードするソフトウェアなのです。",
  },
  {
    author: "William Carlos Williams",
    quote: "空は不完全に私たちに寄りかかり<br>その息を私たちに向かって<br>嘲笑うように吐き出す。しかし<br>木々に葉が留まっているのは<br>私たちのためだけではない。",
  },
  {
    author: "William Carlos Williams",
    quote: "アメリカの純粋な産物は<br>狂っていく—",
  },
  {
    author: "William Carlos Williams",
    quote: "雨と<br>灯りの中で<br>私は5という数字を見た<br>金色に輝いて<br>赤い<br>消防車の上で<br>動いていく<br>緊張して<br>顧みられることなく",
  },
  {
    author: "Aldous Huxley",
    quote: "経験とは人に起こることではなく、人が起こったことに対して何をするかということです。",
  },
  {
    author: "Hunter S. Thompson",
    quote: "人生は、きれいで保存状態の良い体で安全に墓場にたどり着くための旅であってはならない。むしろ、横滑りで煙を上げながら、完全に使い果たされ、完全に擦り切れて、大声で「ワオ！なんて素晴らしい乗り物だったんだ！」と叫びながら到着すべきなのだ。",
  },
  {
    author: "Albert Hofmann",
    quote: "人々がLSDのビジョンを引き起こす能力をより賢明に、適切な条件下で、医療実践や瞑想と組み合わせて使用することを学べば、この問題児は将来、不思議な子供になる可能性があると信じています。",
  },
  {
    author: "Carlos Castaneda",
    quote: "私たちは自分を不幸にするか、強くするかのどちらかです。必要な労力は同じです。",
  },
  {
    author: "Graham Hancock",
    quote: "古代の人々や先住民は、意識と現実の本質について、私たちよりもはるかに多くのことを知っていたと信じています。",
  },
  {
    author: "C.G. Jung",
    quote: "あなたのビジョンは、自分の心の中を見ることができたときにのみ明確になります。外を見る者は夢を見、内を見る者は目覚めるのです。",
  },
  {
    author: "Timothy Leary",
    quote: "あなたは神なのです。神のように行動し、神のように考え、責任を持ちなさい。",
  }
];

function getRandomQuoteHtml() {
  const randomQuote = quotesJson[Math.floor(Math.random() * quotesJson.length)];
  return `
    <blockquote>
      <p>${randomQuote.quote}</p>
      <footer>
        <cite>— ${randomQuote.author}</cite>
      </footer>
    </blockquote>
  `;
}

function updateQuoteContainer() {
  const container = document.getElementById("quote-container");
  if (container) {
    container.innerHTML = getRandomQuoteHtml();
  }
}

// Initial update
updateQuoteContainer();

// Update every 10 seconds
setInterval(updateQuoteContainer, 10000); 