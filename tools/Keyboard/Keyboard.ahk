#NoEnv
#SingleInstance force
#Include Greek.ahk
#Include Geez.ahk
 
#If (lang = "Greek")
  a:: αCaps("α") ; Alpha
  b:: αCaps("β") ; Beta
  g:: αCaps("γ") ; Gamma
  d:: αCaps("δ") ; Delta
  e:: αCaps("ε") ; Epsilon
  z:: αCaps("ζ") ; Zeta
  h:: αCaps("η") ; Eta
  y:: αCaps("θ") ; Theta
  i:: αCaps("ι") ; Iota
  k:: αCaps("κ") ; Kappa
  l:: αCaps("λ") ; Lambda
  m:: αCaps("μ") ; Mu
  n:: αCaps("ν") ; Nu
  x:: αCaps("ξ") ; Xi
  o:: αCaps("ο") ; Omicron
  p:: αCaps("π") ; Pi
  r:: αCaps("ρ") ; Rho
  s:: αCaps("σ") ; Sigma
  w:: αCaps("ς") ; Final Sigma
  t:: αCaps("τ") ; Tau
  u:: αCaps("υ") ; Upsilon
  f:: αCaps("φ") ; Phi
  j:: αCaps("χ") ; Chi
  c:: αCaps("ψ") ; Psi
  v:: αCaps("ω") ; Omega

 +a:: Send Α     ; Capital Alpha
 +b:: Send Β     ; Capital Beta
 +g:: Send Γ     ; Capital Gamma
 +d:: Send Δ     ; Capital Delta
 +e:: Send Ε     ; Capital Epsilon
 +z:: Send Ζ     ; Capital Zeta
 +h:: Send Η     ; Capital Eta
 +y:: Send Θ     ; Capital Theta
 +i:: Send Ι     ; Capital Iota
 +k:: Send Κ     ; Capital Kappa
 +l:: Send Λ     ; Capital Lambda
 +m:: Send Μ     ; Capital Mu
 +n:: Send Ν     ; Capital Nu
 +x:: Send Ξ     ; Capital Xi
 +o:: Send Ο     ; Capital Omicron
 +p:: Send Π     ; Capital Pi
 +r:: Send Ρ     ; Capital Rho
 +s:: Send Σ     ; Capital Sigma
 +w:: Send Σ     ; Capital Final Sigma
 +t:: Send Τ     ; Capital Tau
 +u:: Send Υ     ; Capital Upsilon
 +f:: Send Φ     ; Capital Phi
 +j:: Send Χ     ; Capital Chi
 +c:: Send Ψ     ; Capital Psi
 +v:: Send Ω     ; Capital Omega

 !1:: Send ʹ ; Greek Numeral Sign
 !2:: Send ͵ ; Greek Lower Numeral Sign
 !-:: Send — ; Em Dash
 !k:: Send ϗ ; Greek Kai Symbol
 !p:: Send ¶ ; Pilcrow Sign
 >!s:: Send ϛ ; U+03DB GREEK SMALL LETTER STIGMA
 >+!s:: Send Ϛ ; U+03DA GREEK LETTER STIGMA

#If (lang = "Greek") && (subset = "Polytonic")
   `;:: αdeadkey("A")   ; Acute
    q:: αdeadkey("A")   ; Acute
    ::: αdeadkey("G")   ; Grave
   +q:: αdeadkey("G")   ; Grave
    [:: αdeadkey("C")   ; Circumflex
    ':: αdeadkey("S")   ; Smooth Breath
    /:: αdeadkey("SA")  ; Smooth Breath + Acute
    \:: αdeadkey("SG")  ; Smooth Breath + Grave
    =:: αdeadkey("SC")  ; Smooth Breath + Circumflex
   +':: αdeadkey("R")   ; Rough Breath
    ?:: αdeadkey("RA")  ; Rough Breath + Acute
    |:: αdeadkey("RG")  ; Rough Breath + Grave
    +:: αdeadkey("RC")  ; Rough Breath + Circumflex
    {:: αdeadkey("I")   ; Iota
    ]:: αdeadkey("D")   ; Diaeresis
    `:: αdeadkey("DA")  ; Diaeresis + Acute
    ~:: αdeadkey("DG")  ; Diaeresis + Grave
    -:: αdeadkey("M")   ; Macron
    _:: αdeadkey("B")   ; Breve
  >!;:: αdeadkey("AI")  ; Acute + Iota
  >!q:: αdeadkey("AI")  ; Acute + Iota
 >!+;:: αdeadkey("GI")  ; Grave + Iota
 >!+q:: αdeadkey("GI")  ; Grave + Iota
  >![:: αdeadkey("CI")  ; Circumflex + Iota
  >!':: αdeadkey("SI")  ; Smooth Breath + Iota
  >!/:: αdeadkey("SAI") ; Smooth Breath + Acute + Iota
  >!\:: αdeadkey("SGI") ; Smooth Breath + Grave + Iota
  >!=:: αdeadkey("SCI") ; Smooth Breath + Circumflex + Iota
 >!+':: αdeadkey("RI")  ; Rough Breath + Iota
  >!?:: αdeadkey("RAI") ; Rough Breath + Acute + Iota
  >!|:: αdeadkey("RGI") ; Rough Breath + Grave + Iota
  >!+:: αdeadkey("RCI") ; Rough Breath + Circumflex + Iota
  >!`:: αdeadkey("DC")  ; Diaeresis + Circumflex

#If (lang = "Greek") && (subset = "Monotonic")
    q:: Send `;        ; Question Mark
   +q:: Send :         ; Colon
   `;:: αdeadkey("T")  ; Tonos
    ::: αdeadkey("D")  ; Diaeresis
   +w:: αdeadkey("DT") ; Diaeresis + Tonos
  >!;:: αdeadkey("DT") ; Diaeresis + Tonos

#If (lang = "Greek") && (subset = "Combining")
   ':: Send ̓  ; Psili (Combining Comma Above)
  +':: Send ̔  ; Dasia (Combining Reversed Comma Above)
  `;:: Send ́  ; Oxia (Combining Acute Accent)
  +;:: Send ̀  ; Varia (Combining Grave Accent)
   /:: Send ͂  ; Perispomeni (Combining Greek Perispomeni)
   ]:: Send ͅ  ; Ypogegrammeni (Combining Greek Ypogegrammeni)
   [:: Send ̈  ; Dialytika (Combining Diaeresis)
   -:: Send ̄  ; Macron (Combining Macron)
   =:: Send ̆  ; Vrachy (Combining Breve)

   q:: Send ; ; Greek Question Mark
   >:: Send · ; Greek Ano Teleia
   \:: Send ᾽ ; Greek Koronis

 !+;:: Send ̀  ; Combining Grave Tone Mark
  !;:: Send ́  ; Combining Acute Tone Mark
  !':: Send ̓  ; Combining Greek Koronis
  ![:: Send ̈́  ; Combining Greek Dialytika Tonos

  ?:: αdeadkey("Separate")
  
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
 