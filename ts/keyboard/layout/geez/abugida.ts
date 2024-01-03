import * as Language from "../../../model/language.js";

import { Key } from "../../key.js";

import * as Layout from "../instance.js";
import * as Space from "../space.js";

import * as Common from "./common.js";

const HOY: Space.Combo = [
    [Common.HOY_KEY],
    [
        // U+1200 ETHIOPIC SYLLABLE HA
        [[Key.SPACE], `ሀ`, false],

        // U+1200 ETHIOPIC SYLLABLE HA,
        // U+1203 ETHIOPIC SYLLABLE HAA
        [[Key.KEY_A], `ሀ`, `ሃ`],
        // U+1205 ETHIOPIC SYLLABLE HE,
        // U+1204 ETHIOPIC SYLLABLE HEE
        [[Key.KEY_E], `ህ`, `ሄ`],
        // U+1202 ETHIOPIC SYLLABLE HI
        [[Key.KEY_I], `ሂ`, false],
        // U+1206 ETHIOPIC SYLLABLE HO
        [[Key.KEY_O], `ሆ`, false],
        // U+1201 ETHIOPIC SYLLABLE HU
        [[Key.KEY_U], `ሁ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const LAWE: Space.Combo = [
    [Common.LAWE_KEY],
    [
        // U+1208 ETHIOPIC SYLLABLE LA
        [[Key.SPACE], `ለ`, false],

        // U+1208 ETHIOPIC SYLLABLE LA,
        // U+120B ETHIOPIC SYLLABLE LAA
        [[Key.KEY_A], `ለ`, `ላ`],
        // U+120D ETHIOPIC SYLLABLE LE,
        // U+120C ETHIOPIC SYLLABLE LEE
        [[Key.KEY_E], `ል`, `ሌ`],
        // U+120A ETHIOPIC SYLLABLE LI
        [[Key.KEY_I], `ሊ`, false],
        // U+120E ETHIOPIC SYLLABLE LO
        [[Key.KEY_O], `ሎ`, false],
        // U+1209 ETHIOPIC SYLLABLE LU
        [[Key.KEY_U], `ሉ`, false],
        // U+120F ETHIOPIC SYLLABLE LWA
        [[Key.KEY_W], `ሏ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const HAWT: Space.Combo = [
    [Common.HAWT_KEY],
    [
        // U+1210 ETHIOPIC SYLLABLE HHA
        [[Key.SPACE], `ሐ`, false],

        // U+1210 ETHIOPIC SYLLABLE HHA,
        // U+1213 ETHIOPIC SYLLABLE HHAA
        [[Key.KEY_A], `ሐ`, `ሓ`],
        // U+1215 ETHIOPIC SYLLABLE HHE,
        // U+1214 ETHIOPIC SYLLABLE HHEE
        [[Key.KEY_E], `ሕ`, `ሔ`],
        // U+1212 ETHIOPIC SYLLABLE HHI
        [[Key.KEY_I], `ሒ`, false],
        // U+1216 ETHIOPIC SYLLABLE HHO
        [[Key.KEY_O], `ሖ`, false],
        // U+1211 ETHIOPIC SYLLABLE HHU
        [[Key.KEY_U], `ሑ`, false],
        // U+1217 ETHIOPIC SYLLABLE HHWA
        [[Key.KEY_W], `ሗ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const MAY: Space.Combo = [
    [Common.MAY_KEY],
    [
        // U+1218 ETHIOPIC SYLLABLE MA
        [[Key.SPACE], `መ`, false],

        // U+1218 ETHIOPIC SYLLABLE MA,
        // U+121B ETHIOPIC SYLLABLE MAA
        [[Key.KEY_A], `መ`, `ማ`],
        // U+121D ETHIOPIC SYLLABLE ME,
        // U+121C ETHIOPIC SYLLABLE MEE
        [[Key.KEY_E], `ም`, `ሜ`],
        // U+121A ETHIOPIC SYLLABLE MI
        [[Key.KEY_I], `ሚ`, false],
        // U+121E ETHIOPIC SYLLABLE MO
        [[Key.KEY_O], `ሞ`, false],
        // U+1219 ETHIOPIC SYLLABLE MU
        [[Key.KEY_U], `ሙ`, false],
        // U+121F ETHIOPIC SYLLABLE MWA
        [[Key.KEY_W], `ሟ`, false],
        // U+1359 ETHIOPIC SYLLABLE MYA
        [[Key.KEY_Y], `ፙ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const SAWT: Space.Combo = [
    [Common.SAWT_KEY],
    [
        // U+1220 ETHIOPIC SYLLABLE SZA
        [[Key.SPACE], `ሠ`, false],

        // U+1220 ETHIOPIC SYLLABLE SZA,
        // U+1223 ETHIOPIC SYLLABLE SZAA
        [[Key.KEY_A], `ሠ`, `ሣ`],
        // U+1225 ETHIOPIC SYLLABLE SZE,
        // U+1224 ETHIOPIC SYLLABLE SZEE
        [[Key.KEY_E], `ሥ`, `ሤ`],
        // U+1222 ETHIOPIC SYLLABLE SZI
        [[Key.KEY_I], `ሢ`, false],
        // U+1226 ETHIOPIC SYLLABLE SZO
        [[Key.KEY_O], `ሦ`, false],
        // U+1221 ETHIOPIC SYLLABLE SZU
        [[Key.KEY_U], `ሡ`, false],
        // U+1227 ETHIOPIC SYLLABLE SZWA
        [[Key.KEY_W], `ሧ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const RES: Space.Combo = [
    [Common.RES_KEY],
    [
        // U+1228 ETHIOPIC SYLLABLE RA
        [[Key.SPACE], `ረ`, false],

        // U+1228 ETHIOPIC SYLLABLE RA,
        // U+122B ETHIOPIC SYLLABLE RAA
        [[Key.KEY_A], `ረ`, `ራ`],
        // U+122D ETHIOPIC SYLLABLE RE,
        // U+122C ETHIOPIC SYLLABLE REE
        [[Key.KEY_E], `ር`, `ሬ`],
        // U+122A ETHIOPIC SYLLABLE RI
        [[Key.KEY_I], `ሪ`, false],
        // U+122E ETHIOPIC SYLLABLE RO
        [[Key.KEY_O], `ሮ`, false],
        // U+1229 ETHIOPIC SYLLABLE RU
        [[Key.KEY_U], `ሩ`, false],
        // U+122F ETHIOPIC SYLLABLE RWA
        [[Key.KEY_W], `ሯ`, false],
        // U+1358 ETHIOPIC SYLLABLE RYA
        [[Key.KEY_Y], `ፘ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const SAT: Space.Combo = [
    [Common.SAT_KEY],
    [
        // U+1230 ETHIOPIC SYLLABLE SA
        [[Key.SPACE], `ሰ`, false],

        // U+1230 ETHIOPIC SYLLABLE SA,
        // U+1233 ETHIOPIC SYLLABLE SAA
        [[Key.KEY_A], `ሰ`, `ሳ`],
        // U+1235 ETHIOPIC SYLLABLE SE,
        // U+1234 ETHIOPIC SYLLABLE SEE
        [[Key.KEY_E], `ስ`, `ሴ`],
        // U+1232 ETHIOPIC SYLLABLE SI
        [[Key.KEY_I], `ሲ`, false],
        // U+1236 ETHIOPIC SYLLABLE SO
        [[Key.KEY_O], `ሶ`, false],
        // U+1231 ETHIOPIC SYLLABLE SU
        [[Key.KEY_U], `ሱ`, false],
        // U+1237 ETHIOPIC SYLLABLE SWA
        [[Key.KEY_W], `ሷ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const QAF: Space.Combo = [
    [Common.QAF_KEY],
    [
        // U+1240 ETHIOPIC SYLLABLE QA
        [[Key.SPACE], `ቀ`, false],

        // U+1240 ETHIOPIC SYLLABLE QA,
        // U+1243 ETHIOPIC SYLLABLE QAA
        [[Key.KEY_A], `ቀ`, `ቃ`],
        // U+1245 ETHIOPIC SYLLABLE QE,
        // U+1244 ETHIOPIC SYLLABLE QEE
        [[Key.KEY_E], `ቅ`, `ቄ`],
        // U+1242 ETHIOPIC SYLLABLE QI
        [[Key.KEY_I], `ቂ`, false],
        // U+1246 ETHIOPIC SYLLABLE QO
        [[Key.KEY_O], `ቆ`, false],
        // U+1241 ETHIOPIC SYLLABLE QU
        [[Key.KEY_U], `ቁ`, false],
        // U+124B ETHIOPIC SYLLABLE QWAA
        [[Key.KEY_W], `ቋ`, false],
    ],
    [
        // U+1248 ETHIOPIC SYLLABLE QWA
        [[Key.SPACE], `ቈ`, false],

        // U+1248 ETHIOPIC SYLLABLE QWA,
        // U+124B ETHIOPIC SYLLABLE QWAA
        [[Key.KEY_A], `ቈ`, `ቋ`],
        // U+124D ETHIOPIC SYLLABLE QWE,
        // U+124C ETHIOPIC SYLLABLE QWEE
        [[Key.KEY_E], `ቍ`, `ቌ`],
        // U+124A ETHIOPIC SYLLABLE QWI
        [[Key.KEY_I], `ቊ`, false],
    ],
    Space.IGNORE_CAPS_LOCK,
];

const BET: Space.Combo = [
    [Common.BET_KEY],
    [
        // U+1260 ETHIOPIC SYLLABLE BA
        [[Key.SPACE], `በ`, false],

        // U+1260 ETHIOPIC SYLLABLE BA,
        // U+1263 ETHIOPIC SYLLABLE BAA
        [[Key.KEY_A], `በ`, `ባ`],
        // U+1265 ETHIOPIC SYLLABLE BE,
        // U+1264 ETHIOPIC SYLLABLE BEE
        [[Key.KEY_E], `ብ`, `ቤ`],
        // U+1262 ETHIOPIC SYLLABLE BI
        [[Key.KEY_I], `ቢ`, false],
        // U+1266 ETHIOPIC SYLLABLE BO
        [[Key.KEY_O], `ቦ`, false],
        // U+1261 ETHIOPIC SYLLABLE BU
        [[Key.KEY_U], `ቡ`, false],
        // U+1267 ETHIOPIC SYLLABLE BWA
        [[Key.KEY_W], `ቧ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const TAWE: Space.Combo = [
    [Common.TAWE_KEY],
    [
        // U+1270 ETHIOPIC SYLLABLE TA
        [[Key.SPACE], `ተ`, false],

        // U+1270 ETHIOPIC SYLLABLE TA,
        // U+1273 ETHIOPIC SYLLABLE TAA
        [[Key.KEY_A], `ተ`, `ታ`],
        // U+1275 ETHIOPIC SYLLABLE TE,
        // U+1274 ETHIOPIC SYLLABLE TEE
        [[Key.KEY_E], `ት`, `ቴ`],
        // U+1272 ETHIOPIC SYLLABLE TI
        [[Key.KEY_I], `ቲ`, false],
        // U+1276 ETHIOPIC SYLLABLE TO
        [[Key.KEY_O], `ቶ`, false],
        // U+1271 ETHIOPIC SYLLABLE TU
        [[Key.KEY_U], `ቱ`, false],
        // U+1277 ETHIOPIC SYLLABLE TWA
        [[Key.KEY_W], `ቷ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const HARM: Space.Combo = [
    [Common.HARM_KEY],
    [
        // U+1280 ETHIOPIC SYLLABLE XA
        [[Key.SPACE], `ኀ`, false],

        // U+1280 ETHIOPIC SYLLABLE XA,
        // U+1283 ETHIOPIC SYLLABLE XAA
        [[Key.KEY_A], `ኀ`, `ኃ`],
        // U+1285 ETHIOPIC SYLLABLE XE,
        // U+1284 ETHIOPIC SYLLABLE XEE
        [[Key.KEY_E], `ኅ`, `ኄ`],
        // U+1282 ETHIOPIC SYLLABLE XI
        [[Key.KEY_I], `ኂ`, false],
        // U+1286 ETHIOPIC SYLLABLE XO
        [[Key.KEY_O], `ኆ`, false],
        // U+1281 ETHIOPIC SYLLABLE XU
        [[Key.KEY_U], `ኁ`, false],
        // U+128B ETHIOPIC SYLLABLE XWAA
        [[Key.KEY_W], `ኋ`, false],
    ],
    [
        // U+1288 ETHIOPIC SYLLABLE XWA
        [[Key.SPACE], `ኈ`, false],

        // U+1288 ETHIOPIC SYLLABLE XWA,
        // U+128B ETHIOPIC SYLLABLE XWAA
        [[Key.KEY_A], `ኈ`, `ኋ`],
        // U+128D ETHIOPIC SYLLABLE XWE,
        // U+128C ETHIOPIC SYLLABLE XWEE
        [[Key.KEY_E], `ኍ`, `ኌ`],
        // U+128A ETHIOPIC SYLLABLE XWI
        [[Key.KEY_I], `ኊ`, false],
    ],
    Space.IGNORE_CAPS_LOCK,
];

const NAHAS: Space.Combo = [
    [Common.NAHAS_KEY],
    [
        // U+1290 ETHIOPIC SYLLABLE NA
        [[Key.SPACE], `ነ`, false],

        // U+1290 ETHIOPIC SYLLABLE NA,
        // U+1293 ETHIOPIC SYLLABLE NAA
        [[Key.KEY_A], `ነ`, `ና`],
        // U+1295 ETHIOPIC SYLLABLE NE,
        // U+1294 ETHIOPIC SYLLABLE NEE
        [[Key.KEY_E], `ን`, `ኔ`],
        // U+1292 ETHIOPIC SYLLABLE NI
        [[Key.KEY_I], `ኒ`, false],
        // U+1296 ETHIOPIC SYLLABLE NO
        [[Key.KEY_O], `ኖ`, false],
        // U+1291 ETHIOPIC SYLLABLE NU
        [[Key.KEY_U], `ኑ`, false],
        // U+1297 ETHIOPIC SYLLABLE NWA
        [[Key.KEY_W], `ኗ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const ALF: Space.Combo = [
    [Common.ALF_KEY],
    [
        // U+12A0 ETHIOPIC SYLLABLE GLOTTAL A
        [[Key.SPACE], `አ`, false],

        // U+12A0 ETHIOPIC SYLLABLE GLOTTAL A,
        // U+12A3 ETHIOPIC SYLLABLE GLOTTAL AA
        [[Key.KEY_A], `አ`, `ኣ`],
        // U+12A5 ETHIOPIC SYLLABLE GLOTTAL E,
        // U+12A4 ETHIOPIC SYLLABLE GLOTTAL EE
        [[Key.KEY_E], `እ`, `ኤ`],
        // U+12A2 ETHIOPIC SYLLABLE GLOTTAL I
        [[Key.KEY_I], `ኢ`, false],
        // U+12A6 ETHIOPIC SYLLABLE GLOTTAL O
        [[Key.KEY_O], `ኦ`, false],
        // U+12A1 ETHIOPIC SYLLABLE GLOTTAL U
        [[Key.KEY_U], `ኡ`, false],
        // U+12A7 ETHIOPIC SYLLABLE GLOTTAL WA
        [[Key.KEY_W], `ኧ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const KAF: Space.Combo = [
    [Common.KAF_KEY],
    [
        // U+12A8 ETHIOPIC SYLLABLE KA
        [[Key.SPACE], `ከ`, false],

        // U+12A8 ETHIOPIC SYLLABLE KA,
        // U+12AB ETHIOPIC SYLLABLE KAA
        [[Key.KEY_A], `ከ`, `ካ`],
        // U+12AD ETHIOPIC SYLLABLE KE,
        // U+12AC ETHIOPIC SYLLABLE KEE
        [[Key.KEY_E], `ክ`, `ኬ`],
        // U+12AA ETHIOPIC SYLLABLE KI
        [[Key.KEY_I], `ኪ`, false],
        // U+12AE ETHIOPIC SYLLABLE KO
        [[Key.KEY_O], `ኮ`, false],
        // U+12A9 ETHIOPIC SYLLABLE KU
        [[Key.KEY_U], `ኩ`, false],
        // U+12B3 ETHIOPIC SYLLABLE KWAA
        [[Key.KEY_W], `ኳ`, false],
    ],
    [
        // U+12B0 ETHIOPIC SYLLABLE KWA
        [[Key.SPACE], `ኰ`, false],

        // U+12B0 ETHIOPIC SYLLABLE KWA,
        // U+12B3 ETHIOPIC SYLLABLE KWAA
        [[Key.KEY_A], `ኰ`, `ኳ`],
        // U+12B5 ETHIOPIC SYLLABLE KWE,
        // U+12B4 ETHIOPIC SYLLABLE KWEE
        [[Key.KEY_E], `ኵ`, `ኴ`],
        // U+12B2 ETHIOPIC SYLLABLE KWI
        [[Key.KEY_I], `ኲ`, false],
    ],
    Space.IGNORE_CAPS_LOCK,
];

const WAWE: Space.Combo = [
    [Common.WAWE_KEY],
    [
        // U+12C8 ETHIOPIC SYLLABLE WA
        [[Key.SPACE], `ወ`, false],

        // U+12C8 ETHIOPIC SYLLABLE WA,
        // U+12CB ETHIOPIC SYLLABLE WAA
        [[Key.KEY_A], `ወ`, `ዋ`],
        // U+12CD ETHIOPIC SYLLABLE WE,
        // U+12CC ETHIOPIC SYLLABLE WEE
        [[Key.KEY_E], `ው`, `ዌ`],
        // U+12CA ETHIOPIC SYLLABLE WI
        [[Key.KEY_I], `ዊ`, false],
        // U+12CE ETHIOPIC SYLLABLE WO
        [[Key.KEY_O], `ዎ`, false],
        // U+12C9 ETHIOPIC SYLLABLE WU
        [[Key.KEY_U], `ዉ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const AYN: Space.Combo = [
    [Common.AYN_KEY],
    [
        // U+12D0 ETHIOPIC SYLLABLE PHARYNGEAL A
        [[Key.SPACE], `ዐ`, false],

        // U+12D0 ETHIOPIC SYLLABLE PHARYNGEAL A,
        // U+12D3 ETHIOPIC SYLLABLE PHARYNGEAL AA
        [[Key.KEY_A], `ዐ`, `ዓ`],
        // U+12D5 ETHIOPIC SYLLABLE PHARYNGEAL E,
        // U+12D4 ETHIOPIC SYLLABLE PHARYNGEAL EE
        [[Key.KEY_E], `ዕ`, `ዔ`],
        // U+12D2 ETHIOPIC SYLLABLE PHARYNGEAL I
        [[Key.KEY_I], `ዒ`, false],
        // U+12D6 ETHIOPIC SYLLABLE PHARYNGEAL O
        [[Key.KEY_O], `ዖ`, false],
        // U+12D1 ETHIOPIC SYLLABLE PHARYNGEAL U
        [[Key.KEY_U], `ዑ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const ZAY: Space.Combo = [
    [Common.ZAY_KEY],
    [
        // U+12D8 ETHIOPIC SYLLABLE ZA
        [[Key.SPACE], `ዘ`, false],

        // U+12D8 ETHIOPIC SYLLABLE ZA,
        // U+12DB ETHIOPIC SYLLABLE ZAA
        [[Key.KEY_A], `ዘ`, `ዛ`],
        // U+12DD ETHIOPIC SYLLABLE ZE,
        // U+12DC ETHIOPIC SYLLABLE ZEE
        [[Key.KEY_E], `ዝ`, `ዜ`],
        // U+12DA ETHIOPIC SYLLABLE ZI
        [[Key.KEY_I], `ዚ`, false],
        // U+12DE ETHIOPIC SYLLABLE ZO
        [[Key.KEY_O], `ዞ`, false],
        // U+12D9 ETHIOPIC SYLLABLE ZU
        [[Key.KEY_U], `ዙ`, false],
        // U+12DF ETHIOPIC SYLLABLE ZWA
        [[Key.KEY_W], `ዟ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const YAMAN: Space.Combo = [
    [Common.YAMAN_KEY],
    [
        // U+12E8 ETHIOPIC SYLLABLE YA
        [[Key.SPACE], `የ`, false],

        // U+12E8 ETHIOPIC SYLLABLE YA,
        // U+12EB ETHIOPIC SYLLABLE YAA
        [[Key.KEY_A], `የ`, `ያ`],
        // U+12ED ETHIOPIC SYLLABLE YE,
        // U+12EC ETHIOPIC SYLLABLE YEE
        [[Key.KEY_E], `ይ`, `ዬ`],
        // U+12EA ETHIOPIC SYLLABLE YI
        [[Key.KEY_I], `ዪ`, false],
        // U+12EE ETHIOPIC SYLLABLE YO
        [[Key.KEY_O], `ዮ`, false],
        // U+12E9 ETHIOPIC SYLLABLE YU
        [[Key.KEY_U], `ዩ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const DANT: Space.Combo = [
    [Common.DANT_KEY],
    [
        // U+12F0 ETHIOPIC SYLLABLE DA
        [[Key.SPACE], `ደ`, false],

        // U+12F0 ETHIOPIC SYLLABLE DA,
        // U+12F3 ETHIOPIC SYLLABLE DAA
        [[Key.KEY_A], `ደ`, `ዳ`],
        // U+12F5 ETHIOPIC SYLLABLE DE,
        // U+12F4 ETHIOPIC SYLLABLE DEE
        [[Key.KEY_E], `ድ`, `ዴ`],
        // U+12F2 ETHIOPIC SYLLABLE DI
        [[Key.KEY_I], `ዲ`, false],
        // U+12F6 ETHIOPIC SYLLABLE DO
        [[Key.KEY_O], `ዶ`, false],
        // U+12F1 ETHIOPIC SYLLABLE DU
        [[Key.KEY_U], `ዱ`, false],
        // U+12F7 ETHIOPIC SYLLABLE DWA
        [[Key.KEY_W], `ዷ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const GAML: Space.Combo = [
    [Common.GAML_KEY],
    [
        // U+1308 ETHIOPIC SYLLABLE GA
        [[Key.SPACE], `ገ`, false],

        // U+1308 ETHIOPIC SYLLABLE GA,
        // U+130B ETHIOPIC SYLLABLE GAA
        [[Key.KEY_A], `ገ`, `ጋ`],
        // U+130D ETHIOPIC SYLLABLE GE,
        // U+130C ETHIOPIC SYLLABLE GEE
        [[Key.KEY_E], `ግ`, `ጌ`],
        // U+130A ETHIOPIC SYLLABLE GI
        [[Key.KEY_I], `ጊ`, false],
        // U+130E ETHIOPIC SYLLABLE GO
        [[Key.KEY_O], `ጎ`, false],
        // U+1309 ETHIOPIC SYLLABLE GU
        [[Key.KEY_U], `ጉ`, false],
        // U+1313 ETHIOPIC SYLLABLE GWAA
        [[Key.KEY_W], `ጓ`, false],
    ],
    [
        // U+1310 ETHIOPIC SYLLABLE GWA
        [[Key.SPACE], `ጐ`, false],

        // U+1310 ETHIOPIC SYLLABLE GWA,
        // U+1313 ETHIOPIC SYLLABLE GWAA
        [[Key.KEY_A], `ጐ`, `ጓ`],
        // U+1315 ETHIOPIC SYLLABLE GWE,
        // U+1314 ETHIOPIC SYLLABLE GWEE
        [[Key.KEY_E], `ጕ`, `ጔ`],
        // U+1312 ETHIOPIC SYLLABLE GWI
        [[Key.KEY_I], `ጒ`, false],
    ],
    Space.IGNORE_CAPS_LOCK,
];

const TAYT: Space.Combo = [
    [Common.TAYT_KEY],
    [
        // U+1320 ETHIOPIC SYLLABLE THA
        [[Key.SPACE], `ጠ`, false],

        // U+1320 ETHIOPIC SYLLABLE THA,
        // U+1323 ETHIOPIC SYLLABLE THAA
        [[Key.KEY_A], `ጠ`, `ጣ`],
        // U+1325 ETHIOPIC SYLLABLE THE,
        // U+1324 ETHIOPIC SYLLABLE THEE
        [[Key.KEY_E], `ጥ`, `ጤ`],
        // U+1322 ETHIOPIC SYLLABLE THI
        [[Key.KEY_I], `ጢ`, false],
        // U+1326 ETHIOPIC SYLLABLE THO
        [[Key.KEY_O], `ጦ`, false],
        // U+1321 ETHIOPIC SYLLABLE THU
        [[Key.KEY_U], `ጡ`, false],
        // U+1327 ETHIOPIC SYLLABLE THWA
        [[Key.KEY_W], `ጧ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const PAYT: Space.Combo = [
    [Common.PAYT_KEY],
    [
        // U+1330 ETHIOPIC SYLLABLE PHA
        [[Key.SPACE], `ጰ`, false],

        // U+1330 ETHIOPIC SYLLABLE PHA,
        // U+1333 ETHIOPIC SYLLABLE PHAA
        [[Key.KEY_A], `ጰ`, `ጳ`],
        // U+1335 ETHIOPIC SYLLABLE PHE,
        // U+1334 ETHIOPIC SYLLABLE PHEE
        [[Key.KEY_E], `ጵ`, `ጴ`],
        // U+1332 ETHIOPIC SYLLABLE PHI
        [[Key.KEY_I], `ጲ`, false],
        // U+1336 ETHIOPIC SYLLABLE PHO
        [[Key.KEY_O], `ጶ`, false],
        // U+1331 ETHIOPIC SYLLABLE PHU
        [[Key.KEY_U], `ጱ`, false],
        // U+1337 ETHIOPIC SYLLABLE PHWA
        [[Key.KEY_W], `ጷ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const SADAY: Space.Combo = [
    [Common.SADAY_KEY],
    [
        // U+1338 ETHIOPIC SYLLABLE TSA
        [[Key.SPACE], `ጸ`, false],

        // U+1338 ETHIOPIC SYLLABLE TSA,
        // U+133B ETHIOPIC SYLLABLE TSAA
        [[Key.KEY_A], `ጸ`, `ጻ`],
        // U+133D ETHIOPIC SYLLABLE TSE,
        // U+133C ETHIOPIC SYLLABLE TSEE
        [[Key.KEY_E], `ጽ`, `ጼ`],
        // U+133A ETHIOPIC SYLLABLE TSI
        [[Key.KEY_I], `ጺ`, false],
        // U+133E ETHIOPIC SYLLABLE TSO
        [[Key.KEY_O], `ጾ`, false],
        // U+1339 ETHIOPIC SYLLABLE TSU
        [[Key.KEY_U], `ጹ`, false],
        // U+133F ETHIOPIC SYLLABLE TSWA
        [[Key.KEY_W], `ጿ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const SAPPA: Space.Combo = [
    [Common.SAPPA_KEY],
    [
        // U+1340 ETHIOPIC SYLLABLE TZA
        [[Key.SPACE], `ፀ`, false],

        // U+1340 ETHIOPIC SYLLABLE TZA,
        // U+1343 ETHIOPIC SYLLABLE TZAA
        [[Key.KEY_A], `ፀ`, `ፃ`],
        // U+1345 ETHIOPIC SYLLABLE TZE,
        // U+1344 ETHIOPIC SYLLABLE TZEE
        [[Key.KEY_E], `ፅ`, `ፄ`],
        // U+1342 ETHIOPIC SYLLABLE TZI
        [[Key.KEY_I], `ፂ`, false],
        // U+1346 ETHIOPIC SYLLABLE TZO
        [[Key.KEY_O], `ፆ`, false],
        // U+1341 ETHIOPIC SYLLABLE TZU
        [[Key.KEY_U], `ፁ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const AF: Space.Combo = [
    [Common.AF_KEY],
    [
        // U+1348 ETHIOPIC SYLLABLE FA
        [[Key.SPACE], `ፈ`, false],

        // U+1348 ETHIOPIC SYLLABLE FA,
        // U+134B ETHIOPIC SYLLABLE FAA
        [[Key.KEY_A], `ፈ`, `ፋ`],
        // U+134D ETHIOPIC SYLLABLE FE,
        // U+134C ETHIOPIC SYLLABLE FEE
        [[Key.KEY_E], `ፍ`, `ፌ`],
        // U+134A ETHIOPIC SYLLABLE FI
        [[Key.KEY_I], `ፊ`, false],
        // U+134E ETHIOPIC SYLLABLE FO
        [[Key.KEY_O], `ፎ`, false],
        // U+1349 ETHIOPIC SYLLABLE FU
        [[Key.KEY_U], `ፉ`, false],
        // U+134F ETHIOPIC SYLLABLE FWA
        [[Key.KEY_W], `ፏ`, false],
        // U+135A ETHIOPIC SYLLABLE FYA
        [[Key.KEY_Y], `ፚ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

const PSA: Space.Combo = [
    [Common.PSA_KEY],
    [
        // U+1350 ETHIOPIC SYLLABLE PA
        [[Key.SPACE], `ፐ`, false],

        // U+1350 ETHIOPIC SYLLABLE PA,
        // U+1353 ETHIOPIC SYLLABLE PAA
        [[Key.KEY_A], `ፐ`, `ፓ`],
        // U+1355 ETHIOPIC SYLLABLE PE,
        // U+1354 ETHIOPIC SYLLABLE PEE
        [[Key.KEY_E], `ፕ`, `ፔ`],
        // U+1352 ETHIOPIC SYLLABLE PI
        [[Key.KEY_I], `ፒ`, false],
        // U+1356 ETHIOPIC SYLLABLE PO
        [[Key.KEY_O], `ፖ`, false],
        // U+1351 ETHIOPIC SYLLABLE PU
        [[Key.KEY_U], `ፑ`, false],
        // U+1357 ETHIOPIC SYLLABLE PWA
        [[Key.KEY_W], `ፗ`, false],
    ],
    Space.DEFAULT,
    Space.IGNORE_CAPS_LOCK,
];

export class Instance extends Layout.Instance
{
    constructor()
    {
        super(
            {
                language_name: Language.Name.GEEZ,
                subset_name: `Abugida`,
                is_language_default: true,
                combos_or_space: [
                    HOY,
                    LAWE,
                    HAWT,
                    MAY,
                    SAWT,
                    RES,
                    SAT,
                    QAF,
                    BET,
                    TAWE,
                    HARM,
                    NAHAS,
                    ALF,
                    KAF,
                    WAWE,
                    AYN,
                    ZAY,
                    YAMAN,
                    DANT,
                    GAML,
                    TAYT,
                    PAYT,
                    SADAY,
                    SAPPA,
                    AF,
                    PSA,

                    ...Common.DIGITS_AND_PUNCTUATION_AND_DIACRITICS,
                ],
            },
        );
    }
}
