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
    set := "Symbs"
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
Latin.Symbs_s := { "p": "¶" ; Pilcrow Sign
                 , "s": "§" ; Section Sign
                 , "-": "—" ; Em Dash
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
                 , "": "̂" }

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
                 , "": "̂" }

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
                 , "e": "̇" ; Dot Above
                 , "r": "̊" ; Ring Above
                 , "t": "̃" ; Tilde
                 , "c": "̧" ; Cedilla
                 , "v": "̨" ; Ogonek
                 , "z": "̏" ; Double Grave Accent
                 , "x": "̋" ; Double Acute Accent
                 , ".": "̄" ; Macron
                 , ",": "̆" ; Breve
                 , "": "" }

Latin.Combo_c := { "d": "̌" ; Caron
                 , "w": "̑" ; Inverted Breve
                 , "": "" }
