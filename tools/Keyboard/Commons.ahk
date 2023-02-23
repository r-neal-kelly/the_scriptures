global lang     := "English"
global subset   := "Standard"
global langs    := [ "English", "Hebrew", "Greek", "Latin", "Ge'ez", "Aramaic" ]
global subsets  := { "English": [ "Default" ]
                   , "Hebrew" : [ "Phonetic", "International", "Points", "Accents" ]
                   , "Greek"  : [ "Polytonic", "Monotonic", "Combining" ]
                   , "Latin"  : [ "Classical", "Italic" ] 
                   , "Ge'ez"  : [ "Abugida", "Abjad" ]
                   , "Aramaic": [ "Syriac", "Samaritan", "Imperial", "Phoenician" ] }

; Main ;
rotate(arr) {
  arr.Push(arr[1])
  arr.RemoveAt(1)
}

showToolTip() {
  ToolTip, %lang% - %subset%
  SetTimer, hideToolTip, 1200
}

hideToolTip() {
  SetTimer, hideToolTip, Off
  ToolTip
}

changeLang() {
  rotate(langs)
  lang := langs[1]
  subset := subsets[lang][1]
  showToolTip()
}

changeSubset() {
  rotate(subsets[lang])
  subset := subsets[lang][1]
  showToolTip()
}

changeLangTo(str) {
  while (lang != str)
    changeLang()
  showToolTip()
}

reloadKeyboard() {
  Reload
  Sleep 1000
  MsgBox Failed to reload.
}

; Modules ;
getInput(len) {
  Input, key, % "L" . len, {Esc}{BackSpace}{Delete}{End}
  return key
}

isShift() {
  return GetKeyState("shift")
}

isCaplocked() {
  return GetKeyState("capslock", "T")
}
