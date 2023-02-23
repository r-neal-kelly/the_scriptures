ሀdeadkey(set) {
  ሀtoggle()
  key := getInput(1)
  if (isShift() or isCaplocked())
    key .= key
  char := Geez[set][key]
  if (char)
    Send % char
  else
    Send ፨
  ሀtoggle()
}

ሀtoggle() {
  keys := [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"
          , "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ]
  Hotkey, If, (lang = "Ge'ez") && (subset = "Abugida")
  for i, key in keys
    Hotkey, %key%, Toggle
}

global Geez := {}

Geez.h       := { "a": "ሀ" ; Ha
                , "u": "ሁ" ; Hu
                , "i": "ሂ" ; Hi
                , "aa": "ሃ" ; Haa
                , "ee": "ሄ" ; Hee
                , "e": "ህ" ; He
                , "o": "ሆ" ; Ho
                , "፨": "ሀ" ; default
                , "": "" }

Geez.l       := { "a": "ለ" ; La
                , "u": "ሉ" ; Lu
                , "i": "ሊ" ; Li
                , "aa": "ላ" ; Laa
                , "ee": "ሌ" ; Lee
                , "e": "ል" ; Le
                , "o": "ሎ" ; Lo
                , "w": "ሏ" ; Lwa
                , "፨": "ለ" ; default
                , "": "" }

Geez.j       := { "a": "ሐ" ; Hha
                , "u": "ሑ" ; Hhu
                , "i": "ሒ" ; Hhi
                , "aa": "ሓ" ; Hhaa
                , "ee": "ሔ" ; Hhee
                , "e": "ሕ" ; Hhe
                , "o": "ሖ" ; Hho
                , "w": "ሗ" ; Hhwa
                , "፨": "ሐ" ; default
                , "": "" }

Geez.m       := { "a": "መ" ; Ma
                , "u": "ሙ" ; Mu
                , "i": "ሚ" ; Mi
                , "aa": "ማ" ; Maa
                , "ee": "ሜ" ; Mee
                , "e": "ም" ; Me
                , "o": "ሞ" ; Mo
                , "w": "ሟ" ; Mwa
                , "y": "ፙ" ; Mya
                , "፨": "መ" ; default
                , "": "" }

Geez.ss      := { "a": "ሠ" ; Sza
                , "u": "ሡ" ; Szu
                , "i": "ሢ" ; Szi
                , "aa": "ሣ" ; Szaa
                , "ee": "ሤ" ; Szee
                , "e": "ሥ" ; Sze
                , "o": "ሦ" ; Szo
                , "w": "ሧ" ; Szwa
                , "፨": "ሠ" ; default
                , "": "" }

Geez.r       := { "a": "ረ" ; Ra
                , "u": "ሩ" ; Ru
                , "i": "ሪ" ; Ri
                , "aa": "ራ" ; Raa
                , "ee": "ሬ" ; Ree
                , "e": "ር" ; Re
                , "o": "ሮ" ; Ro
                , "w": "ሯ" ; Rwa
                , "y": "ፘ" ; Rya
                , "፨": "ረ" ; default
                , "": "" }

Geez.s       := { "a": "ሰ" ; Sa
                , "u": "ሱ" ; Su
                , "i": "ሲ" ; Si
                , "aa": "ሳ" ; Saa
                , "ee": "ሴ" ; See
                , "e": "ስ" ; Se
                , "o": "ሶ" ; So
                , "w": "ሷ" ; Swa
                , "፨": "ሰ" ; default
                , "": "" }

Geez.q       := { "a": "ቀ" ; Qa
                , "u": "ቁ" ; Qu
                , "i": "ቂ" ; Qi
                , "aa": "ቃ" ; Qaa
                , "ee": "ቄ" ; Qee
                , "e": "ቅ" ; Qe
                , "o": "ቆ" ; Qo
                , "w": "ቋ" ; Qwaa
                , "፨": "ቀ" ; default
                , "": "" }

Geez.qq      := { "a": "ቈ" ; Qwa
                , "i": "ቊ" ; Qwi
                , "aa": "ቋ" ; Qwaa
                , "ee": "ቌ" ; Qwee
                , "e": "ቍ" ; Qwe
                , "፨": "ቈ" ; default
                , "": "" }

Geez.b       := { "a": "በ" ; Ba
                , "u": "ቡ" ; Bu
                , "i": "ቢ" ; Bi
                , "aa": "ባ" ; Baa
                , "ee": "ቤ" ; Bee
                , "e": "ብ" ; Be
                , "o": "ቦ" ; Bo
                , "w": "ቧ" ; Bwa
                , "፨": "በ" ; default
                , "": "" }

Geez.t       := { "a": "ተ" ; Ta
                , "u": "ቱ" ; Tu
                , "i": "ቲ" ; Ti
                , "aa": "ታ" ; Taa
                , "ee": "ቴ" ; Tee
                , "e": "ት" ; Te
                , "o": "ቶ" ; To
                , "w": "ቷ" ; Twa
                , "፨": "ተ" ; default
                , "": "" }

Geez.x       := { "a": "ኀ" ; Xa
                , "u": "ኁ" ; Xu
                , "i": "ኂ" ; Xi
                , "aa": "ኃ" ; Xaa
                , "ee": "ኄ" ; Xee
                , "e": "ኅ" ; Xe
                , "o": "ኆ" ; Xo
                , "w": "ኋ" ; Xwaa
                , "፨": "ኀ" ; default
                , "": "" }

Geez.xx      := { "a": "ኈ" ; Xwa
                , "i": "ኊ" ; Xwi
                , "aa": "ኋ" ; Xwaa
                , "ee": "ኌ" ; Xwee
                , "e": "ኍ" ; Xwe
                , "፨": "ኈ" ; default
                , "": "" }

Geez.n       := { "a": "ነ" ; Na
                , "u": "ኑ" ; Nu
                , "i": "ኒ" ; Ni
                , "aa": "ና" ; Naa
                , "ee": "ኔ" ; Nee
                , "e": "ን" ; Ne
                , "o": "ኖ" ; No
                , "w": "ኗ" ; Nwa
                , "፨": "ነ" ; default
                , "": "" }

Geez.a       := { "a": "አ" ; Glottal A
                , "u": "ኡ" ; Glottal U
                , "i": "ኢ" ; Glottal I
                , "aa": "ኣ" ; Glottal Aa
                , "ee": "ኤ" ; Glottal Ee
                , "e": "እ" ; Glottal E
                , "o": "ኦ" ; Glottal O
                , "w": "ኧ" ; Glottal Wa
                , "፨": "አ" ; default
                , "": "" }

Geez.k       := { "a": "ከ" ; Ka
                , "u": "ኩ" ; Ku
                , "i": "ኪ" ; Ki
                , "aa": "ካ" ; Kaa
                , "ee": "ኬ" ; Kee
                , "e": "ክ" ; Ke
                , "o": "ኮ" ; Ko
                , "w": "ኳ" ; Kwaa
                , "፨": "ከ" ; default
                , "": "" }

Geez.kk      := { "a": "ኰ" ; Kwa
                , "i": "ኲ" ; Kwi
                , "aa": "ኳ" ; Kwaa
                , "ee": "ኴ" ; Kwee
                , "e": "ኵ" ; Kwe
                , "፨": "ኰ" ; default
                , "": "" }

Geez.w       := { "a": "ወ" ; Wa
                , "u": "ዉ" ; Wu
                , "i": "ዊ" ; Wi
                , "aa": "ዋ" ; Waa
                , "ee": "ዌ" ; Wee
                , "e": "ው" ; We
                , "o": "ዎ" ; Wo
                , "፨": "ወ" ; default
                , "": "" }

Geez.o       := { "a": "ዐ" ; Pharyngeal A
                , "u": "ዑ" ; Pharyngeal U
                , "i": "ዒ" ; Pharyngeal I
                , "aa": "ዓ" ; Pharyngeal Aa
                , "ee": "ዔ" ; Pharyngeal Ee
                , "e": "ዕ" ; Pharyngeal E
                , "o": "ዖ" ; Pharyngeal O
                , "፨": "ዐ" ; default
                , "": "" }

Geez.z       := { "a": "ዘ" ; Za
                , "u": "ዙ" ; Zu
                , "i": "ዚ" ; Zi
                , "aa": "ዛ" ; Zaa
                , "ee": "ዜ" ; Zee
                , "e": "ዝ" ; Ze
                , "o": "ዞ" ; Zo
                , "w": "ዟ" ; Zwa
                , "፨": "ዘ" ; default
                , "": "" }

Geez.y       := { "a": "የ" ; Ya
                , "u": "ዩ" ; Yu
                , "i": "ዪ" ; Yi
                , "aa": "ያ" ; Yaa
                , "ee": "ዬ" ; Yee
                , "e": "ይ" ; Ye
                , "o": "ዮ" ; Yo
                , "፨": "የ" ; default
                , "": "" }

Geez.d       := { "a": "ደ" ; Da
                , "u": "ዱ" ; Du
                , "i": "ዲ" ; Di
                , "aa": "ዳ" ; Daa
                , "ee": "ዴ" ; Dee
                , "e": "ድ" ; De
                , "o": "ዶ" ; Do
                , "w": "ዷ" ; Dwa
                , "፨": "ደ" ; default
                , "": "" }

Geez.g       := { "a": "ገ" ; Ga
                , "u": "ጉ" ; Gu
                , "i": "ጊ" ; Gi
                , "aa": "ጋ" ; Gaa
                , "ee": "ጌ" ; Gee
                , "e": "ግ" ; Ge
                , "o": "ጎ" ; Go
                , "w": "ጓ" ; Gwaa
                , "፨": "ገ" ; default
                , "": "" }

Geez.gg      := { "a": "ጐ" ; Gwa
                , "i": "ጒ" ; Gwi
                , "aa": "ጓ" ; Gwaa
                , "ee": "ጔ" ; Gwee
                , "e": "ጕ" ; Gwe
                , "፨": "ጐ" ; default
                , "": "" }

Geez.tt      := { "a": "ጠ" ; Tha
                , "u": "ጡ" ; Thu
                , "i": "ጢ" ; Thi
                , "aa": "ጣ" ; Thaa
                , "ee": "ጤ" ; Thee
                , "e": "ጥ" ; The
                , "o": "ጦ" ; Tho
                , "w": "ጧ" ; Thwa
                , "፨": "ጠ" ; default
                , "": "" }

Geez.pp      := { "a": "ጰ" ; Pha
                , "u": "ጱ" ; Phu
                , "i": "ጲ" ; Phi
                , "aa": "ጳ" ; Phaa
                , "ee": "ጴ" ; Phee
                , "e": "ጵ" ; Phe
                , "o": "ጶ" ; Pho
                , "w": "ጷ" ; Phwa
                , "፨": "ጰ" ; default
                , "": "" }

Geez.c       := { "a": "ጸ" ; Tsa
                , "u": "ጹ" ; Tsu
                , "i": "ጺ" ; Tsi
                , "aa": "ጻ" ; Tsaa
                , "ee": "ጼ" ; Tsee
                , "e": "ጽ" ; Tse
                , "o": "ጾ" ; Tso
                , "w": "ጿ" ; Tswa
                , "፨": "ጸ" ; default
                , "": "" }

Geez.v       := { "a": "ፀ" ; Tza
                , "u": "ፁ" ; Tzu
                , "i": "ፂ" ; Tzi
                , "aa": "ፃ" ; Tzaa
                , "ee": "ፄ" ; Tzee
                , "e": "ፅ" ; Tze
                , "o": "ፆ" ; Tzo
                , "፨": "ፀ" ; default
                , "": "" }

Geez.f       := { "a": "ፈ" ; Fa
                , "u": "ፉ" ; Fu
                , "i": "ፊ" ; Fi
                , "aa": "ፋ" ; Faa
                , "ee": "ፌ" ; Fee
                , "e": "ፍ" ; Fe
                , "o": "ፎ" ; Fo
                , "w": "ፏ" ; Fwa
                , "y": "ፚ" ; Fya
                , "፨": "ፈ" ; default
                , "": "" }

Geez.p       := { "a": "ፐ" ; Pa
                , "u": "ፑ" ; Pu
                , "i": "ፒ" ; Pi
                , "aa": "ፓ" ; Paa
                , "ee": "ፔ" ; Pee
                , "e": "ፕ" ; Pe
                , "o": "ፖ" ; Po
                , "w": "ፗ" ; Pwa
                , "፨": "ፐ" ; default
                , "": "" }
