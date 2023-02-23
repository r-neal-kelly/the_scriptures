adeadkey() {
  key := getInput(1)
  char := English.Symbs[key]
  if (char)
    Send % char
  else
    Send % key
}

global English := {}

; Ligatures and Digraphs
English.Symbs := { "p": "¶" ; Pilcrow Sign
                 , "s": "§" ; Section Sign
                 , "-": "—" ; Em Dash
                 , "f": "̈" ; Diaeresis
                 , "": "̂" }
