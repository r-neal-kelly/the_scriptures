#NoEnv
#SingleInstance force
#Include Commons.ahk
;#Include English.ahk
#Include Hebrew.ahk
#Include Greek.ahk
#Include Latin.ahk
#Include Geez.ahk
#Include Aramaic.ahk

^LAlt::changeLang()
+LAlt::changeSubset()
+LCtrl::showToolTip()
^F1::changeLangTo("English")
^F2::changeLangTo("Hebrew")
^F3::changeLangTo("Greek")
^F4::changeLangTo("Latin")
^F5::changeLangTo("Ge'ez")
^F6::changeLangTo("Aramaic")
^Esc::reloadKeyboard()

#If (lang = "English")
  LAlt:: ædeadkey() ; need both, or bug!
  RAlt:: ædeadkey() ; need both, or bug!

#If (lang = "Hebrew") && (subset = "Phonetic")
  f:: Send א ; Aleph
  b:: Send ב ; Bet
  g:: Send ג ; Gimmel
  d:: Send ד ; Dalet
  h:: Send ה ; Hey
  w:: Send ו ; Waw
  z:: Send ז ; Zayin
  j:: Send ח ; Hhet
 +t:: Send ט ; Tet
  y:: Send י ; Yodh
  k:: Send כ ; Kaph
  l:: Send ל ; Lamed
  m:: Send מ ; Mem
  n:: Send נ ; Nun
  x:: Send ס ; Samek
 +f:: Send ע ; Ayin
  p:: Send פ ; Peh
  c:: Send צ ; Tsade
  q:: Send ק ; Qoph
  r:: Send ר ; Resh
  s:: Send שׁ ; Shin + Shin Dot
 +s:: Send שׂ ; Shin + Sin Dot
 !s:: Send ש ; Shin
  t:: Send ת ; Taw
 +k:: Send ך ; Final Kaph
 +m:: Send ם ; Final Mem
 +n:: Send ן ; Final Nun
 +p:: Send ף ; Final Peh
 +c:: Send ץ ; Final Tsade

  u:: Send ּ  ; Shuruk, Dagesh, Mappiq
 +r:: Send ֿ  ; Rafe
  ]:: Send ׁ  ; Shin
  [:: Send ׂ  ; Sin
  v:: Send ָ  ; Qamatz
 +j:: Send ְ  ; Shiva
  a:: Send ַ  ; Patah
  i:: Send ִ  ; Hiriq
  e:: Send ֶ  ; Segol
  o:: Send ֹ  ; Holam
 +i:: Send ֵ  ; Tsere
 +a:: Send ֲ  ; Hataf Patah
 +e:: Send ֱ  ; Hataf Segol
 +u:: Send ֻ  ; Kubutz
 +v:: Send ֳ  ; Hataf Qamatz
 +o:: Send ֺ  ; Holam for Waw
 !v:: Send ׇ  ; Qamats Katan

  -:: Send ־ ; Maqaf
 `;:: Send ׀ ; Pasuq
  ::: Send ׃ ; Sof Pasuq
  ':: Send ׳ ; Geresh
  ":: Send ״ ; Gereshyim
  ~:: Send ﬩ ; Plus Sign
 !4:: Send ₪ ; Shekel
 !n:: Send ׆ ; Nun Hafukha

  /::בdeadkey(Hebrew.Accent) ; Cantillation Marks
  ?::בdeadkey(Hebrew.Poetic) ; Poetic Cantillation Marks
  .::אdeadkey(Hebrew.Dagesh) ; Consonants with Dagesh
  ,::אdeadkey(Hebrew.Rafe)   ; Consonants with Rafe
  \::אdeadkey(Hebrew.Wide)   ; Wide Consonant Variants
 ^/::בdeadkey(Hebrew.Ctrls)  ; Control Markers

#If (lang = "Hebrew") && (subset = "International")
  t:: Send א ; Aleph
  c:: Send ב ; Bet
  d:: Send ג ; Gimmel
  s:: Send ד ; Dalet
  v:: Send ה ; Hey
  u:: Send ו ; Waw
  z:: Send ז ; Zayin
  j:: Send ח ; Hhet
  y:: Send ט ; Tet
  h:: Send י ; Yodh
  f:: Send כ ; Kaph
  k:: Send ל ; Lamed
  n:: Send מ ; Mem
  b:: Send נ ; Nun
  x:: Send ס ; Samek
  g:: Send ע ; Ayin
  p:: Send פ ; Peh
  m:: Send צ ; Tsade
  e:: Send ק ; Qoph
  r:: Send ר ; Resh
  a:: Send ש ; Shin
  ,:: Send ת ; Taw
  l:: Send ך ; Final Kaph
  o:: Send ם ; Final Mem
  i:: Send ן ; Final Nun
 `;:: Send ף ; Final Peh
  .:: Send ץ ; Final Tsade

  w:: Send ־ ; Maqaf
  q:: Send ׀ ; Pasuq
 +;:: Send ׃ ; Sof Pasuq
  ':: Send ׳ ; Geresh
 +':: Send ״ ; Gereshyim
 +b:: Send ׆ ; Nun Hafukha
 +4:: Send ₪ ; Shekel
  
  Numpad0::     Send ּ  ; Shuruk, Dagesh, Mappiq
  NumpadIns::   Send ּ  ; Shuruk, Dagesh, Mappiq
  Numpad1::     Send ִ  ; Hiriq
  NumpadEnd::   Send ִ  ; Hiriq
  Numpad2::     Send ְ  ; Shiva
  NumpadDown::  Send ְ  ; Shiva
  Numpad3::     Send ֵ  ; Tsere
  NumpadPgDn::  Send ֵ  ; Tsere
  Numpad4::     Send ַ  ; Patah
  NumpadLeft::  Send ַ  ; Patah
  Numpad5::     Send ֶ  ; Segol
  NumpadClear:: Send ֶ  ; Segol
  Numpad6::     Send ָ  ; Qamatz
  NumpadRight:: Send ָ  ; Qamatz
  Numpad7::     Send ֲ  ; Hataf Patah
  NumpadHome::  Send ֲ  ; Hataf Patah
  Numpad8::     Send ֱ  ; Hataf Segol
  NumpadUp::    Send ֱ  ; Hataf Segol
  Numpad9::     Send ֳ  ; Hataf Qamatz
  NumpadPgUp::  Send ֳ  ; Hataf Qamatz
  NumpadDot::   Send ֻ  ; Kubutz
  NumpadDel::   Send ֻ  ; Kubutz
  NumpadDiv::   Send ֹ  ; Holam
  NumpadMult::  Send ֿ  ; Rafe
  NumpadAdd::   Send ׁ  ; Shin
  NumpadEnter:: Send ׂ  ; Sin
  NumpadSub::   Send ֺ  ; Holam for Waw

  /::בdeadkey(Hebrew.Accent) ; Cantillation Marks
  ?::בdeadkey(Hebrew.Poetic) ; Poetic Cantillation Marks
  \::אdeadkey(Hebrew.Wide)   ; Wide Consonant Variants
 ^/::בdeadkey(Hebrew.Ctrls)  ; Control Markers

#If (lang = "Hebrew") && (subset = "Points")
  g:: Send ּ  ; Dagesh / Shuruk
  f:: Send ְ  ; Shiva
  d:: Send ֶ  ; Segol
  s:: Send ֵ  ; Tsere
  a:: Send ִ  ; Hiriq
  t:: Send ֹ  ; Holam
  r:: Send ַ  ; Patah
  e:: Send ֳ  ; Hataf Kamats
  w:: Send ֲ  ; Hataf Patah
  q:: Send ֱ  ; Hataf Segol
  v:: Send ָ  ; Kamats
  c:: Send ׁ  ; Shin
  x:: Send ׂ  ; Sin
  z:: Send ֻ  ; Kubuts
 +t:: Send ֺ  ; Waw Holam
 +v:: Send ׇ  ; Kamats Katan
 +r:: Send ֿ  ; Rafe
  Space:: Send {Left}
  RAlt::  Send {Right}
 +Space:: Send {Backspace}
 ^Space:: Send {Up}

#If (lang = "Hebrew") && (subset = "Accents")
  g:: Send ֥  ; Mercha
  f:: Send ֖  ; Tifcha
  d:: Send ֨  ; Qadma
  s:: Send ֜  ; Azia Geresh
  a:: Send ֙  ; Pashta
  t:: Send ֽ  ; Meteg
  r:: Send ֣  ; Munach
  e:: Send ֔  ; Zaqef qatan
  w:: Send ֗  ; Revia
  q:: Send ֕  ; Zaqef gadol
  v:: Send ֑  ; Etnahta
  c:: Send ֤  ; Mahpach
  x:: Send ֛  ; Tevir
  z:: Send ֧  ; Darga
 +g:: Send ֦  ; Mercha kefula
 +f:: Send ֞  ; Gershayim
 +d:: Send ֠  ; Telisha gedolah
 +s:: Send ֩  ; Telisha qetannah
 +a:: Send ֟  ; Qarne farah / pazer gadol
 +t:: Send ֮  ; Zarqa
 +r:: Send ֒  ; Segol
 +e:: Send ֘  ; Tsinnorit
 +w:: Send ֪  ; Yerach ben yomo / galgal
 +q:: Send ׄ  ; Upper Dot
 +v:: Send ֡  ; Pazer
 +c:: Send ֚  ; Yetiv
 +x:: Send ֓  ; Shalshelet
 +z:: Send ׅ  ; Lower Dot
 !f:: Send ֭  ; Dehi
 !s:: Send ֝  ; Geresh muqdam
 !t:: Send ‍ֽ  ; Zero Width Joiner + Meteg
 !v:: Send ֢  ; Atnach hafukh
 !c:: Send ֫  ; Ole
 !r:: Send ֬  ; Iluy
 !a:: Send ﬞ  ; Varika
  0:: Send ֯  ; Masora Circle

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
 !s:: Send § ; Section Sign

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

  ?:: αdeadkey("Com")

#If (lang = "Latin")
  LAlt:: ædeadkey()
  RAlt:: ædeadkey()
     w:: Send ̄ ; Macron
    +w:: Send ̆ ; Breve
   <!s:: Send ſ ; Long S
   <!r:: Send ꝛ ; R Rotunda
  +<!r:: Send Ꝛ ; Capital R Rotunda
   <!|:: Send ¦ ; Broken Bar
  +<!s:: Send § ; Section Sign
  +<!p:: Send ¶ ; Pilcrow Sign

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
