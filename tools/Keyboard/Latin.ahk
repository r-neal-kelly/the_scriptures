ædeadkey() {
  key1 := getInput(1)

  if (key1 = "=")
    set := "Sups"
  else if (key1 = "+")
    set := "SupsC"
  else if (key1 = "-")
    set := "Subs"
  else if (key1 = "/")
    set := "Combo"
  else if (key1 = ";")
    set := "Symbols"
  else if (key1 = ",")
    set := "Commas"
  else
    set := "Ligs"

  key2 := getInput(1)

  if (set = "Ligs") 
    key := key1 . key2
  else
    key := key2

  if (isShift() or isCaplocked())
    set := set . "_c"
  else
    set := set . "_s"

  char := Latin[set][key]

  if (char)
    Send % char
  else
    Send % key
}

global Latin := {}

; Symbols
Latin.Symbols_s :=  { "p": "¶" ; Pilcrow Sign
                    , "s": "§" ; Section Sign
                    , "-": "‑" ; U+2011 NON-BREAKING HYPHEN
                    , "=": "–" ; U+2013 EN DASH
                    , "'": "ʼ" ; U+02BC MODIFIER LETTER APOSTROPHE
                    , "[": "‘" ; U+2018 LEFT SINGLE QUOTATION MARK
                    , "]": "’" ; U+2019 RIGHT SINGLE QUOTATION MARK
                    , "t": "†" ; U+2020 DAGGER
                    , ".": "⸼" ; U+2E3C STENOGRAPHIC FULL STOP
                    , "\": "…" ; U+2026 HORIZONTAL ELLIPSIS
                    ,   9: "⟦" ; U+27E6 MATHEMATICAL LEFT WHITE SQUARE BRACKET
                    ,   0: "⟧" ; U+27E7 MATHEMATICAL RIGHT WHITE SQUARE BRACKET
                    , "": "" }

Latin.Symbols_c :=  { "+": "—" ; U+2014 EM DASH
                    , "{": "“" ; U+201C LEFT DOUBLE QUOTATION MARK
                    , "}": "”" ; U+201D RIGHT DOUBLE QUOTATION MARK
                    , "(": "｟" ; U+FF5F FULLWIDTH LEFT WHITE PARENTHESIS
                    , ")": "｠" ; U+FF60 FULLWIDTH RIGHT WHITE PARENTHESIS
                    , "<": "〈" ; U+2329 LEFT-POINTING ANGLE BRACKET
                    , ">": "〉" ; U+232A RIGHT-POINTING ANGLE BRACKET
                    , "S": "᾿" ; U+1FBF GREEK PSILI
                    , "R": "῾" ; U+1FFE GREEK DASIA
                    , "": "" }

Latin.Commas_s := {   0: "🄁" ; U+1F101 DIGIT ZERO COMMA
                  ,   1: "🄂" ; U+1F102 DIGIT ONE COMMA
                  ,   2: "🄃" ; U+1F103 DIGIT TWO COMMA
                  ,   3: "🄄" ; U+1F104 DIGIT THREE COMMA
                  ,   4: "🄅" ; U+1F105 DIGIT FOUR COMMA
                  ,   5: "🄆" ; U+1F106 DIGIT FIVE COMMA
                  ,   6: "🄇" ; U+1F107 DIGIT SIX COMMA
                  ,   7: "🄈" ; U+1F108 DIGIT SEVEN COMMA
                  ,   8: "🄉" ; U+1F109 DIGIT EIGHT COMMA
                  ,   9: "🄊" ; U+1F10A DIGIT NINE COMMA
                  , "": "" }

; Ligatures and Digraphs
Latin.Ligs_s  := { "aa": "ꜳ" ; Aa
                 , "ae": "æ" ; Ae
                 , "ao": "ꜵ" ; Ao
                 , "au": "ꜷ" ; Au
                 , "av": "ꜹ" ; Av
                 , "ay": "ꜽ" ; Ay
                 , "oe": "œ" ; Oe
                 , "oo": "ꝏ" ; Oo
                 , "ou": "ȣ" ; Ou
                 , "sz": "ß" ; ſz (Sharp S)
                 , "ue": "ᵫ" ; Ue
                 , "uo": "ꭣ" ; Uo
                 , "vy": "ꝡ" ; Vy
                 , "": "" }

Latin.Ligs_c  := { "aa": "Ꜳ" ; Aa
                 , "ae": "Æ" ; Ae
                 , "ao": "Ꜵ" ; Ao
                 , "au": "Ꜷ" ; Au
                 , "av": "Ꜹ" ; Av
                 , "ay": "Ꜽ" ; Ay
                 , "oe": "Œ" ; Oe
                 , "oo": "Ꝏ" ; Oo
                 , "ou": "Ȣ" ; Ou
                 , "sz": "ẞ" ; ſz (Sharp S)
                 , "vy": "Ꝡ" ; Vy
                 , "": "" }

; Superscripts and Subscripts
Latin.Sups_s  := { "a": "ᵃ" ; A
                 , "b": "ᵇ" ; B
                 , "c": "ᶜ" ; C
                 , "d": "ᵈ" ; D
                 , "e": "ᵉ" ; E
                 , "f": "ᶠ" ; F
                 , "g": "ᵍ" ; G
                 , "h": "ʰ" ; H
                 , "i": "ⁱ" ; I
                 , "j": "ʲ" ; J
                 , "k": "ᵏ" ; K
                 , "l": "ˡ" ; L
                 , "m": "ᵐ" ; M
                 , "n": "ⁿ" ; N
                 , "o": "ᵒ" ; O
                 , "p": "ᵖ" ; P
                 , "r": "ʳ" ; R
                 , "s": "ˢ" ; S
                 , "t": "ᵗ" ; T
                 , "u": "ᵘ" ; U
                 , "v": "ᵛ" ; V
                 , "w": "ʷ" ; W
                 , "x": "ˣ" ; X
                 , "y": "ʸ" ; Y
                 , "z": "ᶻ" ; Z
                 ,   0: "⁰" ; U+2070 SUPERSCRIPT ZERO
                 ,   1: "¹" ; U+00B9 SUPERSCRIPT ONE
                 ,   2: "²" ; U+00B2 SUPERSCRIPT TWO
                 ,   3: "³" ; U+00B3 SUPERSCRIPT THREE
                 ,   4: "⁴" ; U+2074 SUPERSCRIPT FOUR
                 ,   5: "⁵" ; U+2075 SUPERSCRIPT FIVE
                 ,   6: "⁶" ; U+2076 SUPERSCRIPT SIX
                 ,   7: "⁷" ; U+2077 SUPERSCRIPT SEVEN
                 ,   8: "⁸" ; U+2078 SUPERSCRIPT EIGHT
                 ,   9: "⁹" ; U+2079 SUPERSCRIPT NINE
                 , "": "" }

Latin.Sups_c  := { "a": "ᴬ" ; A
                 , "[": "ᴭ" ; Ae
                 , "b": "ᴮ" ; B
                 , "d": "ᴰ" ; D
                 , "e": "ᴱ" ; E
                 , "g": "ᴳ" ; G
                 , "h": "ᴴ" ; H
                 , "i": "ᴵ" ; I
                 , "j": "ᴶ" ; J
                 , "k": "ᴷ" ; K
                 , "l": "ᴸ" ; L
                 , "m": "ᴹ" ; M
                 , "n": "ᴺ" ; N
                 , "o": "ᴼ" ; O
                 , "]": "ᴽ" ; Ou
                 , "p": "ᴾ" ; P
                 , "r": "ᴿ" ; R
                 , "t": "ᵀ" ; T
                 , "u": "ᵁ" ; U
                 , "v": "ⱽ" ; V
                 , "w": "ᵂ" ; W
                 , "": "" }

Latin.Subs_s  := { "a": "ₐ" ; A
                 , "e": "ₑ" ; E
                 , "h": "ₕ" ; H
                 , "i": "ᵢ" ; I
                 , "j": "ⱼ" ; J
                 , "k": "ₖ" ; K
                 , "l": "ₗ" ; L
                 , "m": "ₘ" ; M
                 , "n": "ₙ" ; N
                 , "o": "ₒ" ; O
                 , "p": "ₚ" ; P
                 , "r": "ᵣ" ; R
                 , "s": "ₛ" ; S
                 , "t": "ₜ" ; T
                 , "u": "ᵤ" ; U
                 , "v": "ᵥ" ; V
                 , "x": "ₓ" ; X
                 , "": "" }

Latin.SupsC_s := { "a": "ͣ" ; A
                 , "b": "ᷨ" ; B
                 , "c": "ͨ" ; C
                 , "d": "ͩ" ; D
                 , "e": "ͤ" ; E
                 , "f": "ᷫ" ; F
                 , "g": "ᷚ" ; G
                 , "h": "ͪ" ; H
                 , "i": "ͥ" ; I
                 , "k": "ᷜ" ; K
                 , "l": "ᷝ" ; L
                 , "m": "ͫ" ; M
                 , "n": "ᷠ" ; N
                 , "o": "ͦ" ; O
                 , "p": "ᷮ" ; P
                 , "r": "ͬ" ; R
                 , "s": "ᷤ" ; S
                 , "t": "ͭ" ; T
                 , "u": "ͧ" ; U
                 , "v": "ͮ" ; V
                 , "w": "ᷱ" ; W
                 , "x": "ͯ" ; X
                 , "z": "ᷦ" ; Z
                 , "[": "ᷔ" ; Ae
                 , "ꝛ": "ᷣ" ; R Rotunda
                 , "ſ": "ᷥ" ; Long S
                 , "": "" }

; Diacritics
Latin.Combo_s := { "a": "̀" ; Grave Accent
                 , "s": "́" ; Acute Accent
                 , "d": "̂" ; Circumflex Accent
                 , "f": "̈" ; Diaeresis
                 , "q": "̄" ; Macron
                 , "w": "̆" ; Breve
                 , "r": "̊" ; Ring Above
                 , "t": "̃" ; Tilde
                 , "c": "̧" ; Cedilla
                 , "v": "̨" ; Ogonek
                 , "z": "̏" ; Double Grave Accent
                 , "x": "̋" ; Double Acute Accent
                 , ".": "̄" ; Macron
                 , ",": "̆" ; Breve
                 , "'": "̕" ; U+0315 COMBINING COMMA ABOVE RIGHT
                 , "y": "̇" ; U+0307 COMBINING DOT ABOVE
                 , "u": "̣" ; U+0323 COMBINING DOT BELOW
                 , "": "" }

Latin.Combo_c := { "d": "̌" ; Caron
                 , "w": "̑" ; Inverted Breve
                 , "": "" }
