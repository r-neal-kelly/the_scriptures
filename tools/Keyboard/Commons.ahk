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
