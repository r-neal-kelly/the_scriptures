#NoEnv
#SingleInstance force
#Include Greek.ahk
#Include Geez.ahk

#If (lang = "Greek") && (subset = "Polytonic")
   `;:: αdeadkey("A")   ; Acute
    ::: αdeadkey("G")   ; Grave
    -:: αdeadkey("C")   ; Circumflex
    _:: αdeadkey("D")   ; Diaeresis

    ':: αdeadkey("S")   ; Smooth Breath
   +':: αdeadkey("R")   ; Rough Breath
    /:: αdeadkey("SA")  ; Smooth Breath + Acute
    ?:: αdeadkey("RA")  ; Rough Breath + Acute
    \:: αdeadkey("SG")  ; Smooth Breath + Grave
    |:: αdeadkey("RG")  ; Rough Breath + Grave
    =:: αdeadkey("SC")  ; Smooth Breath + Circumflex
    +:: αdeadkey("RC")  ; Rough Breath + Circumflex

    [:: αdeadkey("DA")  ; Diaeresis + Acute
    {:: αdeadkey("DG")  ; Diaeresis + Grave
    ]:: αdeadkey("DC")  ; Diaeresis + Circumflex

; These will be put in under backquote, but keep all the same keys.
; Iota itself with be the backquote again.
; Macron and Breve will be period and comma respectively.
    {:: αdeadkey("I")   ; Iota

  >!;:: αdeadkey("AI")  ; Acute + Iota
 >!+;:: αdeadkey("GI")  ; Grave + Iota
  >![:: αdeadkey("CI")  ; Circumflex + Iota

  >!':: αdeadkey("SI")  ; Smooth Breath + Iota
 >!+':: αdeadkey("RI")  ; Rough Breath + Iota
  >!/:: αdeadkey("SAI") ; Smooth Breath + Acute + Iota
  >!?:: αdeadkey("RAI") ; Rough Breath + Acute + Iota
  >!\:: αdeadkey("SGI") ; Smooth Breath + Grave + Iota
  >!|:: αdeadkey("RGI") ; Rough Breath + Grave + Iota
  >!=:: αdeadkey("SCI") ; Smooth Breath + Circumflex + Iota
  >!+:: αdeadkey("RCI") ; Rough Breath + Circumflex + Iota

    -:: αdeadkey("M")   ; Macron
    _:: αdeadkey("B")   ; Breve

#If (lang = "Ge'ez")
  1:: Send ፩ ; One
  2:: Send ፪ ; Two
  3:: Send ፫ ; Three
  4:: Send ፬ ; Four
  5:: Send ፭ ; Five
  6:: Send ፮ ; Six
  7:: Send ፯ ; Seven
  8:: Send ፰ ; Eight
  9:: Send ፱ ; Nine
 +1:: Send ፲ ; Ten
 +2:: Send ፳ ; Twenty
 +3:: Send ፴ ; Thirty
 +4:: Send ፵ ; Forty
 +5:: Send ፶ ; Fifty
 +6:: Send ፷ ; Sixty
 +7:: Send ፸ ; Seventy
 +8:: Send ፹ ; Eighty
 +9:: Send ፺ ; Ninety
  0:: Send ፻ ; Hundred
 +0:: Send ፼ ; Ten Thousand
 !':: Send ፝ ; Combining Gemination and Vowel Length Mark
  ':: Send ፞ ; Combining Vowel Length Mark
 +':: Send ፟ ; Combining Gemination Mark
  <:: Send ፠ ; Section Mark
  /:: Send ፡ ; Wordspace
  .:: Send ። ; Full Stop
  ,:: Send ፣ ; Comma
 `;:: Send ፤ ; Semicolon
  ::: Send ፥ ; Colon
 !;:: Send ፦ ; Preface Colon
  ?:: Send ፧ ; Question Mark
  >:: Send ፨ ; Paragraph Separator

#If (lang = "Ge'ez") && (subset = "Abugida")
  h:: ሀdeadkey("h")  ; Hoy (Hey)
  l:: ሀdeadkey("l")  ; Läwe (Lamed)
  j:: ሀdeadkey("j")  ; Ḥäwt (Hhet)
  m:: ሀdeadkey("m")  ; May (Mem)
 +s:: ሀdeadkey("ss") ; Śäwt (Sin)
  r:: ሀdeadkey("r")  ; Rəʾs (Resh)
  s:: ሀdeadkey("s")  ; Sat (Shin)
  q:: ሀdeadkey("q")  ; Ḳaf (Qoph)
 +q:: ሀdeadkey("qq") ; Ḳaf (Qoph) Labial
  b:: ሀdeadkey("b")  ; Bet (Bet)
  t:: ሀdeadkey("t")  ; Täwe (Taw)
  x:: ሀdeadkey("x")  ; Ḫarm (variant from Hhet)
 +x:: ሀdeadkey("xx") ; Ḫarm (variant from Hhet) Labial
  n:: ሀdeadkey("n")  ; Nähas (Nun)
  a:: ሀdeadkey("a")  ; ʾÄlf (Aleph)
  k:: ሀdeadkey("k")  ; Kaf (Kaph)
 +k:: ሀdeadkey("kk") ; Kaf (Kaph) Labial
  w:: ሀdeadkey("w")  ; Wäwe (Waw)
  o:: ሀdeadkey("o")  ; ʿÄyn (Ayin)
  z:: ሀdeadkey("z")  ; Zäy (Zayin)
  y:: ሀdeadkey("y")  ; Yämän (Yodh)
  d:: ሀdeadkey("d")  ; Dänt (Dalet)
  g:: ሀdeadkey("g")  ; Gäml (Gimmel)
 +g:: ሀdeadkey("gg") ; Gäml (Gimmel) Labial
 +t:: ሀdeadkey("tt") ; Ṭäyt (Tet)
 +p:: ሀdeadkey("pp") ; P̣äyt (variant from Pe?)
  c:: ሀdeadkey("c")  ; Ṣädäy (Tsade)
  v:: ሀdeadkey("v")  ; Ṣ́äppä (variant from Tsade)
  f:: ሀdeadkey("f")  ; Äf (Pe with Dagesh?)
  p:: ሀdeadkey("p")  ; Psa (Pe?)

 ; dupes
 +h:: ሀdeadkey("j")  ; Ḥäwt (Hhet)
  u:: ሀdeadkey("w")  ; Wäwe (Waw)
  i:: ሀdeadkey("y")  ; Yämän (Yodh)
  e:: ሀdeadkey("y")  ; Yämän (Yodh)
 +c:: ሀdeadkey("v")  ; Ṣ́äppä (variant from Tsade)

#If (lang = "Ge'ez") && (subset = "Abjad")
  h:: Send ሀ ; Hoy (Hey)
  l:: Send ለ ; Läwe (Lamed)
  j:: Send ሐ ; Ḥäwt (Hhet)
  m:: Send መ ; May (Mem)
 +s:: Send ሠ ; Śäwt (Sin)
  r:: Send ረ ; Rəʾs (Resh)
  s:: Send ሰ ; Sat (Shin)
  q:: Send ቀ ; Ḳaf (Qoph)
  b:: Send በ ; Bet (Bet)
  t:: Send ተ ; Täwe (Taw)
  x:: Send ኀ ; Ḫarm (variant from Hhet)
  n:: Send ነ ; Nähas (Nun)
  a:: Send አ ; ʾÄlf (Aleph)
  k:: Send ከ ; Kaf (Kaph)
  w:: Send ወ ; Wäwe (Waw)
  o:: Send ዐ ; ʿÄyn (Ayin)
  z:: Send ዘ ; Zäy (Zayin)
  y:: Send የ ; Yämän (Yodh)
  d:: Send ደ ; Dänt (Dalet)
  g:: Send ገ ; Gäml (Gimmel)
 +t:: Send ጠ ; Ṭäyt (Tet)
 +p:: Send ጰ ; P̣äyt (variant from Pe?)
  c:: Send ጸ ; Ṣädäy (Tsade)
  v:: Send ፀ ; Ṣ́äppä (variant from Tsade)
  f:: Send ፈ ; Äf (Pe with Dagesh?)
  p:: Send ፐ ; Psa (Pe?)

 ; dupes
 +h:: Send ሐ ; Ḥäwt (Hhet)
  u:: Send ወ ; Wäwe (Waw)
  i:: Send የ ; Yämän (Yodh)
  e:: Send የ ; Yämän (Yodh)
 +c:: Send ፀ ; Ṣ́äppä (variant from Tsade)

#If (lang = "Aramaic") && (subset = "Syriac")
  f:: Send ܐ ; Alaph
 !f:: Send ܑ ; Superscript Alaph
  b:: Send ܒ ; Beth
  g:: Send ܓ ; Gamal
 !g:: Send ܔ ; Gamal Garshuni
  d:: Send ܕ ; Dalath
 !d:: Send ܖ ; Dotless Dalath Rish
  h:: Send ܗ ; He
  w:: Send ܘ ; Waw
  z:: Send ܙ ; Zain
  j:: Send ܚ ; Heth
 +t:: Send ܛ ; Teth
 !t:: Send ܜ ; Teth Garshuni
  y:: Send ܝ ; Yudh
 !y:: Send ܞ ; Yudh He
  k:: Send ܟ ; Kaph
  l:: Send ܠ ; Lamadh
  m:: Send ܡ ; Mim
  n:: Send ܢ ; Nun
  x:: Send ܣ ; Semkath
 +x:: Send ܤ ; Final Semkath
 +f:: Send ܥ ; E
  p:: Send ܦ ; Pe
 !p:: Send ܧ ; Reversed Pe
  c:: Send ܨ ; Sadhe
  q:: Send ܩ ; Qaph
  r:: Send ܪ ; Rish
  s:: Send ܫ ; Shin
  t:: Send ܬ ; Taw

#If (lang = "Arabic") && (subset = "Default")
  f:: Send ا ; U+0627 ARABIC LETTER ALEF        (א)
  b:: Send ب ; U+0628 ARABIC LETTER BEH         (ב)
  g:: Send ج ; U+062C ARABIC LETTER JEEM        (ג)
  d:: Send د ; U+062F ARABIC LETTER DAL         (ד)
 +d:: Send ذ ; U+0630 ARABIC LETTER THAL        (ד׀)
  h:: Send ه ; U+0647 ARABIC LETTER HEH         (ה)
  w:: Send و ; U+0648 ARABIC LETTER WAW         (ו)
  z:: Send ز ; U+0632 ARABIC LETTER ZAIN        (ז)
  j:: Send ح ; U+062D ARABIC LETTER HAH         (ח)
 +j:: Send خ ; U+062E ARABIC LETTER KHAH        (ח׀)
 +t:: Send ط ; U+0637 ARABIC LETTER TAH         (ט)
!+t:: Send ظ ; U+0638 ARABIC LETTER ZAH         (ט׀)
  y:: Send ي ; U+064A ARABIC LETTER YEH         (י)
  k:: Send ك ; U+0643 ARABIC LETTER KAF         (כ)
  l:: Send ل ; U+0644 ARABIC LETTER LAM         (ל)
  m:: Send م ; U+0645 ARABIC LETTER MEEM        (מ)
  n:: Send ن ; U+0646 ARABIC LETTER NOON        (נ)
  x:: Send س ; U+0633 ARABIC LETTER SEEN        (שׂ)
 +f:: Send ع ; U+0639 ARABIC LETTER AIN         (ע)
!+f:: Send غ ; U+063A ARABIC LETTER GHAIN       (ע׀)
  p:: Send ف ; U+0641 ARABIC LETTER FEH         (פ)
  c:: Send ص ; U+0635 ARABIC LETTER SAD         (צ)
 +c:: Send ض ; U+0636 ARABIC LETTER DAD         (צ׀)
  q:: Send ق ; U+0642 ARABIC LETTER QAF         (ק)
  r:: Send ر ; U+0631 ARABIC LETTER REH         (ר)
  s:: Send ش ; U+0634 ARABIC LETTER SHEEN       (שׁ)
  t:: Send ت ; U+062A ARABIC LETTER TEH         (ת)
 !t:: Send ث ; U+062B ARABIC LETTER THEH        (ת׀)
 ^t:: Send ة ; U+0629 ARABIC LETTER TEH MARBUTA (open, final feminine ת, but sounds like "ha"?)
  ':: Send ء ; U+0621 ARABIC LETTER HAMZA       (glottal stop/plosive)
 