αdeadkey(set) {
  key := getInput(1)
  if (Greek[set][key])
    Send % Greek[set][key]
  else
    Send % Greek[set]["0"] . key
}

αCaps(char) {
  if (isCaplocked())
    char := Greek.L[char]
  Send % char
}

global Greek := {}

Greek.L   := { "α": "Α" ; Alpha
             , "β": "Β" ; Beta
             , "γ": "Γ" ; Gamma
             , "δ": "Δ" ; Delta
             , "ε": "Ε" ; Epsilon
             , "ζ": "Ζ" ; Zeta
             , "η": "Η" ; Eta
             , "θ": "Θ" ; Theta
             , "ι": "Ι" ; Iota
             , "κ": "Κ" ; Kappa
             , "λ": "Λ" ; Lambda
             , "μ": "Μ" ; Mu
             , "ν": "Ν" ; Nu
             , "ξ": "Ξ" ; Xi
             , "ο": "Ο" ; Omicron
             , "π": "Π" ; Pi
             , "ρ": "Ρ" ; Rho
             , "σ": "Σ" ; Sigma
             , "ς": "Σ" ; Final Sigma
             , "τ": "Τ" ; Tau
             , "υ": "Υ" ; Upsilon
             , "φ": "Φ" ; Phi
             , "χ": "Χ" ; Chi
             , "ψ": "Ψ" ; Psi
             , "ω": "Ω" ; Omega
             , "": "" }

Greek.T   := { "α": "ά" ; Small Alpha with Tonos
             , "ε": "έ" ; Small Epsilon with Tonos
             , "η": "ή" ; Small Eta with Tonos
             , "ι": "ί" ; Small Iota with Tonos
             , "ο": "ό" ; Small Omicron with Tonos
             , "υ": "ύ" ; Small Upsilon with Tonos
             , "ω": "ώ" ; Small Omega with Tonos
             , "Α": "Ά" ; Capital Alpha with Tonos
             , "Ε": "Έ" ; Capital Epsilon with Tonos
             , "Η": "Ή" ; Capital Eta with Tonos
             , "Ι": "Ί" ; Capital Iota with Tonos
             , "Ο": "Ό" ; Capital Omicron with Tonos
             , "Υ": "Ύ" ; Capital Upsilon with Tonos
             , "Ω": "Ώ" ; Capital Omega with Tonos
             , "0": "΄" ; Tonos
             , " ": ";" ; Question Mark
             , ".": "·" ; Ano Teleia
             , "": "" }

Greek.DT  := { "ι": "ΐ" ; Small Iota with Dialytika and Tonos
             , "υ": "ΰ" ; Small Upsilon with Dialytika and Tonos
             , "0": "΅" ; Dialytika Tonos
             , "": "" }

Greek.A   := { "α": "ά" ; Small Alpha with Oxia
             , "ε": "έ" ; Small Epsilon with Oxia
             , "η": "ή" ; Small Eta with Oxia
             , "ι": "ί" ; Small Iota with Oxia
             , "ο": "ό" ; Small Omicron with Oxia
             , "υ": "ύ" ; Small Upsilon with Oxia
             , "ω": "ώ" ; Small Omega with Oxia
             , "Α": "Ά" ; Capital Alpha with Oxia
             , "Ε": "Έ" ; Capital Epsilon with Oxia
             , "Η": "Ή" ; Capital Eta with Oxia
             , "Ι": "Ί" ; Capital Iota with Oxia
             , "Ο": "Ό" ; Capital Omicron with Oxia
             , "Υ": "Ύ" ; Capital Upsilon with Oxia
             , "Ω": "Ώ" ; Capital Omega with Oxia
             , "0": "´" ; Oxia
             , " ": ";" ; Greek Question Mark
             , ",": "᾽" ; Greek Koronis
             , ".": "·" ; Ano Teleia
             , "": "" }

Greek.G   := { "α": "ὰ" ; Small Alpha with Varia
             , "ε": "ὲ" ; Small Epsilon with Varia
             , "η": "ὴ" ; Small Eta with Varia
             , "ι": "ὶ" ; Small Iota with Varia
             , "ο": "ὸ" ; Small Omicron with Varia
             , "υ": "ὺ" ; Small Upsilon with Varia
             , "ω": "ὼ" ; Small Omega with Varia
             , "Α": "Ὰ" ; Capital Alpha with Varia
             , "Ε": "Ὲ" ; Capital Epsilon with Varia
             , "Η": "Ὴ" ; Capital Eta with Varia
             , "Ι": "Ὶ" ; Capital Iota with Varia
             , "Ο": "Ὸ" ; Capital Omicron with Varia
             , "Υ": "Ὺ" ; Capital Upsilon with Varia
             , "Ω": "Ὼ" ; Capital Omega with Varia
             , "0": "`" ; Varia
             , " ": ";" ; Greek Question Mark
             , ",": "᾽" ; Greek Koronis
             , ".": "·" ; Ano Teleia
             , "": "" }

Greek.C   := { "α": "ᾶ" ; Small Alpha with Perispomeni
             , "η": "ῆ" ; Small Eta with Perispomeni
             , "ι": "ῖ" ; Small Iota with Perispomeni
             , "υ": "ῦ" ; Small Upsilon with Perispomeni
             , "ω": "ῶ" ; Small Omega with Perispomeni
             , "0": "῀" ; Perispomeni
             , "": "" }

Greek.S   := { "α": "ἀ" ; Small Alpha with Psili
             , "ε": "ἐ" ; Small Epsilon with Psili
             , "η": "ἠ" ; Small Eta with Psili
             , "ι": "ἰ" ; Small Iota with Psili
             , "ο": "ὀ" ; Small Omicron with Psili
             , "υ": "ὐ" ; Small Upsilon with Psili
             , "ω": "ὠ" ; Small Omega with Psili
             , "ρ": "ῤ" ; Small Rho with Psili
             , "Α": "Ἀ" ; Capital Alpha with Psili
             , "Ε": "Ἐ" ; Capital Epsilon with Psili
             , "Η": "Ἠ" ; Capital Eta with Psili
             , "Ι": "Ἰ" ; Capital Iota with Psili
             , "Ο": "Ὀ" ; Capital Omicron with Psili
             , "Ω": "Ὠ" ; Capital Omega with Psili
             , "0": "᾿" ; Psili
             , " ": ";" ; Greek Question Mark
             , ",": "᾽" ; Greek Koronis
             , ".": "·" ; Ano Teleia
             , "": "" }

Greek.SA  := { "α": "ἄ" ; Small Alpha with Psili and Oxia
             , "ε": "ἔ" ; Small Epsilon with Psili and Oxia
             , "η": "ἤ" ; Small Eta with Psili and Oxia
             , "ι": "ἴ" ; Small Iota with Psili and Oxia
             , "ο": "ὄ" ; Small Omicron with Psili and Oxia
             , "υ": "ὔ" ; Small Upsilon with Psili and Oxia
             , "ω": "ὤ" ; Small Omega with Psili and Oxia
             , "Α": "Ἄ" ; Capital Alpha with Psili and Oxia
             , "Ε": "Ἔ" ; Capital Epsilon with Psili and Oxia
             , "Η": "Ἤ" ; Capital Eta with Psili and Oxia
             , "Ι": "Ἴ" ; Capital Iota with Psili and Oxia
             , "Ο": "Ὄ" ; Capital Omicron with Psili and Oxia
             , "Ω": "Ὤ" ; Capital Omega with Psili and Oxia
             , "0": "῎" ; Psili and Oxia
             , "": "" }

Greek.SG  := { "α": "ἂ" ; Small Alpha with Psili and Varia
             , "ε": "ἒ" ; Small Epsilon with Psili and Varia
             , "η": "ἢ" ; Small Eta with Psili and Varia
             , "ι": "ἲ" ; Small Iota with Psili and Varia
             , "ο": "ὂ" ; Small Omicron with Psili and Varia
             , "υ": "ὒ" ; Small Upsilon with Psili and Varia
             , "ω": "ὢ" ; Small Omega with Psili and Varia
             , "Α": "Ἂ" ; Capital Alpha with Psili and Varia
             , "Ε": "Ἒ" ; Capital Epsilon with Psili and Varia
             , "Η": "Ἢ" ; Capital Eta with Psili and Varia
             , "Ι": "Ἲ" ; Capital Iota with Psili and Varia
             , "Ο": "Ὂ" ; Capital Omicron with Psili and Varia
             , "Ω": "Ὢ" ; Capital Omega with Psili and Varia
             , "0": "῍" ; Psili and Varia
             , "": "" }

Greek.SC  := { "α": "ἆ" ; Small Alpha with Psili and Perispomeni
             , "η": "ἦ" ; Small Eta with Psili and Perispomeni
             , "ι": "ἶ" ; Small Iota with Psili and Perispomeni
             , "υ": "ὖ" ; Small Upsilon with Psili and Perispomeni
             , "ω": "ὦ" ; Small Omega with Psili and Perispomeni
             , "Α": "Ἆ" ; Capital Alpha with Psili and Perispomeni
             , "Η": "Ἦ" ; Capital Eta with Psili and Perispomeni
             , "Ι": "Ἶ" ; Capital Iota with Psili and Perispomeni
             , "Ω": "Ὦ" ; Capital Omega with Psili and Perispomeni
             , "0": "῏" ; Psili and Perispomeni
             , "": "" }

Greek.R   := { "α": "ἁ" ; Small Alpha with Dasia
             , "ε": "ἑ" ; Small Epsilon with Dasia
             , "η": "ἡ" ; Small Eta with Dasia
             , "ι": "ἱ" ; Small Iota with Dasia
             , "ο": "ὁ" ; Small Omicron with Dasia
             , "υ": "ὑ" ; Small Upsilon with Dasia
             , "ω": "ὡ" ; Small Omega with Dasia
             , "ρ": "ῥ" ; Small Rho with Dasia
             , "Α": "Ἁ" ; Capital Alpha with Dasia
             , "Ε": "Ἑ" ; Capital Epsilon with Dasia
             , "Η": "Ἡ" ; Capital Eta with Dasia
             , "Ι": "Ἱ" ; Capital Iota with Dasia
             , "Ο": "Ὁ" ; Capital Omicron with Dasia
             , "Υ": "Ὑ" ; Capital Upsilon with Dasia
             , "Ω": "Ὡ" ; Capital Omega with Dasia
             , "Ρ": "Ῥ" ; Capital Rho with Dasia
             , "0": "῾" ; Dasia
             , " ": ";" ; Greek Question Mark
             , ",": "᾽" ; Greek Koronis
             , ".": "·" ; Ano Teleia
             , "": "" }

Greek.RA  := { "α": "ἅ" ; Small Alpha with Dasia and Oxia
             , "ε": "ἕ" ; Small Epsilon with Dasia and Oxia
             , "η": "ἥ" ; Small Eta with Dasia and Oxia
             , "ι": "ἵ" ; Small Iota with Dasia and Oxia
             , "ο": "ὅ" ; Small Omicron with Dasia and Oxia
             , "υ": "ὕ" ; Small Upsilon with Dasia and Oxia
             , "ω": "ὥ" ; Small Omega with Dasia and Oxia
             , "Α": "Ἅ" ; Capital Alpha with Dasia and Oxia
             , "Ε": "Ἕ" ; Capital Epsilon with Dasia and Oxia
             , "Η": "Ἥ" ; Capital Eta with Dasia and Oxia
             , "Ι": "Ἵ" ; Capital Iota with Dasia and Oxia
             , "Ο": "Ὅ" ; Capital Omicron with Dasia and Oxia
             , "Υ": "Ὕ" ; Capital Upsilon with Dasia and Oxia
             , "Ω": "Ὥ" ; Capital Omega with Dasia and Oxia
             , "0": "῞" ; Dasia and Oxia
             , "": "" }

Greek.RG  := { "α": "ἃ" ; Small Alpha with Dasia and Varia
             , "ε": "ἓ" ; Small Epsilon with Dasia and Varia
             , "η": "ἣ" ; Small Eta with Dasia and Varia
             , "ι": "ἳ" ; Small Iota with Dasia and Varia
             , "ο": "ὃ" ; Small Omicron with Dasia and Varia
             , "υ": "ὓ" ; Small Upsilon with Dasia and Varia
             , "ω": "ὣ" ; Small Omega with Dasia and Varia
             , "Α": "Ἃ" ; Capital Alpha with Dasia and Varia
             , "Ε": "Ἓ" ; Capital Epsilon with Dasia and Varia
             , "Η": "Ἣ" ; Capital Eta with Dasia and Varia
             , "Ι": "Ἳ" ; Capital Iota with Dasia and Varia
             , "Ο": "Ὃ" ; Capital Omicron with Dasia and Varia
             , "Υ": "Ὓ" ; Capital Upsilon with Dasia and Varia
             , "Ω": "Ὣ" ; Capital Omega with Dasia and Varia
             , "0": "῝" ; Dasia and Varia
             , "": "" }

Greek.RC  := { "α": "ἇ" ; Small Alpha with Dasia and Perispomeni
             , "η": "ἧ" ; Small Eta with Dasia and Perispomeni
             , "ι": "ἷ" ; Small Iota with Dasia and Perispomeni
             , "υ": "ὗ" ; Small Upsilon with Dasia and Perispomeni
             , "ω": "ὧ" ; Small Omega with Dasia and Perispomeni
             , "Α": "Ἇ" ; Capital Alpha with Dasia and Perispomeni
             , "Η": "Ἧ" ; Capital Eta with Dasia and Perispomeni
             , "Ι": "Ἷ" ; Capital Iota with Dasia and Perispomeni
             , "Υ": "Ὗ" ; Capital Upsilon with Dasia and Perispomeni
             , "Ω": "Ὧ" ; Capital Omega with Dasia and Perispomeni
             , "0": "῟" ; Dasia and Perispomeni
             , "": "" }

Greek.I   := { "α": "ᾳ" ; Small Alpha with Ypogegrammeni
             , "η": "ῃ" ; Small Eta with Ypogegrammeni
             , "ω": "ῳ" ; Small Omega with Ypogegrammeni
             , "Α": "ᾼ" ; Capital Alpha with Prosgegrammeni
             , "Η": "ῌ" ; Capital Eta with Prosgegrammeni
             , "Ω": "ῼ" ; Capital Omega with Prosgegrammeni
             , "0": "ͺ" ; Ypogegrammeni
             , "": "" }

Greek.AI  := { "α": "ᾴ" ; Small Alpha with Oxia and Ypogegrammeni
             , "η": "ῄ" ; Small Eta with Oxia and Ypogegrammeni
             , "ω": "ῴ" ; Small Omega with Oxia and Ypogegrammeni
             , "": "" }

Greek.GI  := { "α": "ᾲ" ; Small Alpha with Varia and Ypogegrammeni
             , "η": "ῂ" ; Small Eta with Varia and Ypogegrammeni
             , "ω": "ῲ" ; Small Omega with Varia and Ypogegrammeni
             , "": "" }

Greek.CI  := { "α": "ᾷ" ; Small Alpha with Perispomeni and Ypogegrammeni
             , "η": "ῇ" ; Small Eta with Perispomeni and Ypogegrammeni
             , "ω": "ῷ" ; Small Omega with Perispomeni and Ypogegrammeni
             , "": "" }

Greek.SI  := { "α": "ᾀ" ; Small Alpha with Psili and Ypogegrammeni
             , "η": "ᾐ" ; Small Eta with Psili and Ypogegrammeni
             , "ω": "ᾠ" ; Small Omega with Psili and Ypogegrammeni
             , "Α": "ᾈ" ; Capital Alpha with Psili and Prosgegrammeni
             , "Η": "ᾘ" ; Capital Eta with Psili and Prosgegrammeni
             , "Ω": "ᾨ" ; Capital Omega with Psili and Prosgegrammeni
             , "": "" }

Greek.SAI := { "α": "ᾄ" ; Small Alpha with Psili and Oxia and Ypogegrammeni
             , "η": "ᾔ" ; Small Eta with Psili and Oxia and Ypogegrammeni
             , "ω": "ᾤ" ; Small Omega with Psili and Oxia and Ypogegrammeni
             , "Α": "ᾌ" ; Capital Alpha with Psili and Oxia and Prosgegrammeni
             , "Η": "ᾜ" ; Capital Eta with Psili and Oxia and Prosgegrammeni
             , "Ω": "ᾬ" ; Capital Omega with Psili and Oxia and Prosgegrammeni
             , "": "" }

Greek.SGI := { "α": "ᾂ" ; Small Alpha with Psili and Varia and Ypogegrammeni
             , "η": "ᾒ" ; Small Eta with Psili and Varia and Ypogegrammeni
             , "ω": "ᾢ" ; Small Omega with Psili and Varia and Ypogegrammeni
             , "Α": "ᾊ" ; Capital Alpha with Psili and Varia and Prosgegrammeni
             , "Η": "ᾚ" ; Capital Eta with Psili and Varia and Prosgegrammeni
             , "Ω": "ᾪ" ; Capital Omega with Psili and Varia and Prosgegrammeni
             , "": "" }

Greek.SCI := { "α": "ᾆ" ; Small Alpha with Psili and Perispomeni and Ypogegrammeni
             , "η": "ᾖ" ; Small Eta with Psili and Perispomeni and Ypogegrammeni
             , "ω": "ᾦ" ; Small Omega with Psili and Perispomeni and Ypogegrammeni
             , "Α": "ᾎ" ; Capital Alpha with Psili and Perispomeni and Prosgegrammeni
             , "Η": "ᾞ" ; Capital Eta with Psili and Perispomeni and Prosgegrammeni
             , "Ω": "ᾮ" ; Capital Omega with Psili and Perispomeni and Prosgegrammeni
             , "": "" }

Greek.RI  := { "α": "ᾁ" ; Small Alpha with Dasia and Ypogegrammeni
             , "η": "ᾑ" ; Small Eta with Dasia and Ypogegrammeni
             , "ω": "ᾡ" ; Small Omega with Dasia and Ypogegrammeni
             , "Α": "ᾉ" ; Capital Alpha with Dasia and Prosgegrammeni
             , "Η": "ᾙ" ; Capital Eta with Dasia and Prosgegrammeni
             , "Ω": "ᾩ" ; Capital Omega with Dasia and Prosgegrammeni
             , "": "" }

Greek.RAI := { "α": "ᾅ" ; Small Alpha with Dasia and Oxia and Ypogegrammeni
             , "η": "ᾕ" ; Small Eta with Dasia and Oxia and Ypogegrammeni
             , "ω": "ᾥ" ; Small Omega with Dasia and Oxia and Ypogegrammeni
             , "Α": "ᾍ" ; Capital Alpha with Dasia and Oxia and Prosgegrammeni
             , "Η": "ᾝ" ; Capital Eta with Dasia and Oxia and Prosgegrammeni
             , "Ω": "ᾭ" ; Capital Omega with Dasia and Oxia and Prosgegrammeni
             , "": "" }

Greek.RGI := { "α": "ᾃ" ; Small Alpha with Dasia and Varia and Ypogegrammeni
             , "η": "ᾓ" ; Small Eta with Dasia and Varia and Ypogegrammeni
             , "ω": "ᾣ" ; Small Omega with Dasia and Varia and Ypogegrammeni
             , "Α": "ᾋ" ; Capital Alpha with Dasia and Varia and Prosgegrammeni
             , "Η": "ᾛ" ; Capital Eta with Dasia and Varia and Prosgegrammeni
             , "Ω": "ᾫ" ; Capital Omega with Dasia and Varia and Prosgegrammeni
             , "": "" }

Greek.RCI := { "α": "ᾇ" ; Small Alpha with Dasia and Perispomeni and Ypogegrammeni
             , "η": "ᾗ" ; Small Eta with Dasia and Perispomeni and Ypogegrammeni
             , "ω": "ᾧ" ; Small Omega with Dasia and Perispomeni and Ypogegrammeni
             , "Α": "ᾏ" ; Capital Alpha with Dasia and Perispomeni and Prosgegrammeni
             , "Η": "ᾟ" ; Capital Eta with Dasia and Perispomeni and Prosgegrammeni
             , "Ω": "ᾯ" ; Capital Omega with Dasia and Perispomeni and Prosgegrammeni
             , "": "" }

Greek.D   := { "ι": "ϊ" ; Small Iota with Dialytika
             , "υ": "ϋ" ; Small Upsilon with Dialytika
             , "Ι": "Ϊ" ; Capital Iota with Dialytika
             , "Υ": "Ϋ" ; Capital Upsilon with Dialytika
             , "0": "¨" ; Diaeresis
             , "": "" }

Greek.DA  := { "ι": "ΐ" ; Small Iota with Dialytika and Oxia
             , "υ": "ΰ" ; Small Upsilon with Dialytika and Oxia
             , "0": "΅" ; Dialytika and Oxia
             , "": "" }

Greek.DG  := { "ι": "ῒ" ; Small Iota with Dialytika and Varia
             , "υ": "ῢ" ; Small Upsilon with Dialytika and Varia
             , "0": "῭" ; Dialytika and Varia
             , "": "" }

Greek.DC  := { "ι": "ῗ" ; Small Iota with Dialytika and Perispomeni
             , "υ": "ῧ" ; Small Upsilon with Dialytika and Perispomeni
             , "0": "῁" ; Dialytika and Perispomeni
             , "": "" }

Greek.M   := { "α": "ᾱ" ; Small Alpha with Macron
             , "ι": "ῑ" ; Small Iota with Macron
             , "υ": "ῡ" ; Small Upsilon with Macron
             , "Α": "Ᾱ" ; Capital Alpha with Macron
             , "Ι": "Ῑ" ; Capital Iota with Macron
             , "Υ": "Ῡ" ; Capital Upsilon with Macron
             , "0": "¯" ; Macron
             , "": "" }

Greek.B   := { "α": "ᾰ" ; Small Alpha with Vrachy
             , "ι": "ῐ" ; Small Iota with Vrachy
             , "υ": "ῠ" ; Small Upsilon with Vrachy
             , "Α": "Ᾰ" ; Capital Alpha with Vrachy
             , "Ι": "Ῐ" ; Capital Iota with Vrachy
             , "Υ": "Ῠ" ; Capital Upsilon with Vrachy
             , "0": "˘" ; Breve
             , "": "" }

Greek.Com := { "ε": "̓" ; Combining Comma Above (Smooth Breath)
             , "η": "̔" ; Combining Reversed Comma Above (Rough Breath)
             , "α": "́" ; Combining Acute Accent
             , "ο": "̀" ; Combining Grave Accent
             , "ω": "͂" ; Combining Greek Perispomeni (Circumflex)
             , "ι": "ͅ" ; Combining Greek Ypogegrammeni (Iota Subscript)
             , "υ": "̈" ; Combining Diaeresis
             , "μ": "̄" ; Combining Macron
             , "β": "̆" ; Combining Breve
             , "": "" }
