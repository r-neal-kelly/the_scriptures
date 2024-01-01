import { Key } from "../../key.js";

import * as Space from "../space.js";

export const ACCENTS: Space.Combos = [
    // U+05A5 HEBREW ACCENT MERKHA
    [[Key.KEY_G], `֥`, false],
    // U+0596 HEBREW ACCENT TIPEHA, U+05AD HEBREW ACCENT DEHI
    [[Key.KEY_F], `֖`, `֭`],
    // U+05A8 HEBREW ACCENT QADMA
    [[Key.KEY_D], `֨`, false],
    // U+059C HEBREW ACCENT GERESH, U+059D HEBREW ACCENT GERESH MUQDAM
    [[Key.KEY_S], `֜`, `֝`],
    // U+0599 HEBREW ACCENT PASHTA
    [[Key.KEY_A], `֙`, false],
    // U+05AE HEBREW ACCENT ZINOR, U+0598 HEBREW ACCENT ZARQA
    [[Key.KEY_T], `֮`, `֘`],
    // U+0592 HEBREW ACCENT SEGOL
    [[Key.KEY_R], `֒`, false],
    // U+05A0 HEBREW ACCENT TELISHA GEDOLA
    [[Key.KEY_E], `֠`, false],
    // U+05A9 HEBREW ACCENT TELISHA QETANA
    [[Key.KEY_W], `֩`, false],
    // U+059F HEBREW ACCENT QARNEY PARA
    [[Key.KEY_Q], `֟`, false],
    // U+05BD HEBREW POINT METEG
    [[Key.KEY_H], `ֽ`, false],
    // U+05A3 HEBREW ACCENT MUNAH, U+05AC HEBREW ACCENT ILUY
    [[Key.KEY_J], `֣`, `֬`],
    // U+059B HEBREW ACCENT TEVIR
    [[Key.KEY_K], `֛`, false],
    // U+05A7 HEBREW ACCENT DARGA
    [[Key.KEY_L], `֧`, false],
    // U+0593 HEBREW ACCENT SHALSHELET
    [[Key.KEY_Y], `֓`, false],
    // U+0594 HEBREW ACCENT ZAQEF QATAN
    [[Key.KEY_U], `֔`, false],
    // U+0597 HEBREW ACCENT REVIA
    [[Key.KEY_I], `֗`, false],
    // U+0595 HEBREW ACCENT ZAQEF GADOL
    [[Key.KEY_O], `֕`, false],
    // U+05A1 HEBREW ACCENT PAZER
    [[Key.KEY_P], `֡`, false],
    // U+0591 HEBREW ACCENT ETNAHTA
    [[Key.KEY_V], `֑`, false],
    // U+05AA HEBREW ACCENT YERAH BEN YOMO, U+05A2 HEBREW ACCENT ATNAH HAFUKH
    [[Key.KEY_B], `֪`, `֢`],
    // U+05A4 HEBREW ACCENT MAHAPAKH, U+05AB HEBREW ACCENT OLE
    [[Key.KEY_N], `֤`, `֫`],
    // U+059A HEBREW ACCENT YETIV
    [[Key.KEY_M], `֚`, false],
    // U+059E HEBREW ACCENT GERSHAYIM
    [[Key.KEY_C], `֞`, false],
    // U+05A6 HEBREW ACCENT MERKHA KEFULA
    [[Key.KEY_X], `֦`, false],
    // U+05AF HEBREW MARK MASORA CIRCLE
    [[Key.KEY_Z], `֯`, false],
    // U+05C4 HEBREW MARK UPPER DOT
    [[Key.BRACKET_LEFT], `ׄ`, false],
    // U+05C5 HEBREW MARK LOWER DOT
    [[Key.BRACKET_RIGHT], `ׅ`, false],
    // U+FB1E HEBREW POINT JUDEO-SPANISH VARIKA
    [[Key.COMMA], `ﬞ`, false],
];
