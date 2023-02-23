אdeadkey(set) {
  Input, key, L1, {Esc}{BackSpace}{Delete}{End}
  if (A_ThisHotkey = "s") {
    Send {Backspace}
    key := "שׁ"
  }
  if (A_ThisHotkey = "+s") {
    Send {Backspace}
    key := "שׂ"
  }
  if (set[key]) {
    Send % set[key]
  } else {
    Send % set["0"] . key
  }
}

בdeadkey(set) {
  Input, key, L1, {Esc}{BackSpace}{Delete}{End}
  if (key = "ש")
    Send {Backspace}
  key := A_ThisHotkey
  if (set[key]) {
    Send % set[key]
  } else {
    Send % set["0"] . key
  }
}

Hebrew := {}

Hebrew.Dagesh := { "א": "אּ" ; Aleph with Mappiq
                 , "ב": "בּ" ; Bet with Dagesh
                 , "ג": "גּ" ; Gimmel with Dagesh
                 , "ד": "דּ" ; Dalet with Dagesh
                 , "ה": "הּ" ; Hey with Mappiq
                 , "ו": "וּ" ; Waw with Shuruk/Dagesh
                 , "ז": "זּ" ; Zayin with Dagesh
                 , "ח": "חּ" ; Hhet with Dagesh
                 , "ט": "טּ" ; Tet with Dagesh
                 , "י": "יּ" ; Yodh with Dagesh
                 , "כ": "כּ" ; Kaph with Dagesh
                 , "ל": "לּ" ; Lamed with Dagesh
                 , "מ": "מּ" ; Mem with Dagesh
                 , "נ": "נּ" ; Nun with Dagesh
                 , "ס": "סּ" ; Samek with Dagesh
                 , "ע": "עּ" ; Ayin with Mappiq
                 , "פ": "פּ" ; Peh with Dagesh
                 , "צ": "צּ" ; Tsade with Dagesh
                 , "ק": "קּ" ; Qoph with Dagesh
                 , "ר": "רּ" ; Resh with Dagesh
                 , "שׁ": "שּׁ" ; Shin with Dagesh
                 , "שׂ": "שּׂ" ; Sin with Dagesh
                 , "ת": "תּ" ; Taw with Dagesh
                 , "ך": "ךּ" ; Final Kaph with Dagesh
                 , "ם": "םּ" ; Final Mem with Dagesh
                 , "ן": "ןּ" ; Final Nun with Dagesh
                 , "ף": "ףּ" ; Final Peh with Dagesh
                 , "ץ": "ץּ" ; Final Tsade with Dagesh
                 , "": "" }

Hebrew.Rafe   := { "א": "אֿ" ; Aleph with Rafe
                 , "ב": "בֿ" ; Bet with Rafe
                 , "ג": "גֿ" ; Gimmel with Rafe
                 , "ד": "דֿ" ; Dalet with Rafe
                 , "ה": "הֿ" ; Hey with Rafe
                 , "ו": "וֿ" ; Waw with Rafe
                 , "ז": "זֿ" ; Zayin with Rafe
                 , "ח": "חֿ" ; Hhet with Rafe
                 , "ט": "טֿ" ; Tet with Rafe
                 , "י": "יֿ" ; Yodh with Rafe
                 , "כ": "כֿ" ; Kaph with Rafe
                 , "ל": "לֿ" ; Lamed with Rafe
                 , "מ": "מֿ" ; Mem with Rafe
                 , "נ": "נֿ" ; Nun with Rafe
                 , "ס": "סֿ" ; Samek with Rafe
                 , "ע": "עֿ" ; Ayin with Rafe
                 , "פ": "פֿ" ; Peh with Rafe
                 , "צ": "צֿ" ; Tsade with Rafe
                 , "ק": "קֿ" ; Qoph with Rafe
                 , "ר": "רֿ" ; Resh with Rafe
                 , "שׁ": "שֿׁ" ; Shin with Rafe
                 , "שׂ": "שֿׂ" ; Sin with Rafe
                 , "ת": "תֿ" ; Taw with Rafe
                 , "ך": "ךֿ" ; Final Kaph with Rafe
                 , "ם": "םֿ" ; Final Mem with Rafe
                 , "ן": "ןֿ" ; Final Nun with Rafe
                 , "ף": "ףֿ" ; Final Peh with Rafe
                 , "ץ": "ץֿ" ; Final Tsade with Rafe
                 , "": "" }

Hebrew.Wide   := { "א": "ﬡ" ; Wide Aleph
                 , "ד": "ﬢ" ; Wide Dalet
                 , "ה": "ﬣ" ; Wide Hey
                 , "כ": "ﬤ" ; Wide Kaph
                 , "ל": "ﬥ" ; Wide Lamed
                 , "ם": "ﬦ" ; Wide Final Mem
                 , "ר": "ﬧ" ; Wide Resh
                 , "ת": "ﬨ" ; Wide Taw
                 , "": "" }

Hebrew.Accent := { "g": "֥" ; Mercha
                 , "f": "֖" ; Tifcha
                 , "d": "֨" ; Qadma
                 , "s": "֜" ; Azla Geresh
                 , "a": "֙" ; Pashta
                 , "t": "֮" ; Zarqa
                 , "r": "֒" ; Segol
                 , "e": "֠" ; Telisha Gedolah
                 , "w": "֩" ; Telisha Qetannah
                 , "q": "֟" ; Qarne Farah / Pazer Gadol
                 , "h": "ֽ" ; Meteg
                 , "j": "֣" ; Munach
                 , "k": "֛" ; Tevir
                 , "l": "֧" ; Darga
                 , "y": "֓" ; Shalshelet
                 , "u": "֔" ; Zaqef Qatan
                 , "i": "֗" ; Revia/Revi’i
                 , "o": "֕" ; Zaqef Gadol
                 , "p": "֡" ; Pazer
                 , "v": "֑" ; Etnaḥta
                 , "b": "֪" ; Yerach Ben Yomo / Galgal
                 , "n": "֤" ; Mahpach
                 , "m": "֚" ; Yetiv
                 , "c": "֞" ; Gershayim
                 , "x": "֦" ; Mercha Kefula
                 , "z": "֯" ; Masora Circle
                 , "[": "ׄ" ; Upper Dot
                 , "]": "ׅ" ; Lower Dot
                 , "~": "ﬞ" ; Varika
                 , "": "" }

Hebrew.Poetic := { "s": "֝" ; Geresh Muqdam
                 , "f": "֭" ; Dehi
                 , "n": "֫" ; Ole
                 , "t": "֘" ; Tsinnorit
                 , "j": "֬" ; Iluy
                 , "b": "֢" ; Atnach Hafukh
                 , "": "" }

Hebrew.Ctrls  := { "0": "‍" ; Zero Width Joiner
                 , "9": "‌" ; Zero Width Non-Joiner
                 , "8": "͏" ; Combining Grapheme Joiner
                 , "h": "‍ֽ" ; Zero Width Joiner + Meteg
                 , "": "" }
