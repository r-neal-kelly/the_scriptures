import*as Utils from"../../utils.js";import*as Unicode from"../../unicode.js";export var Primary_Combining_Point;!function(n){n.LOWER_ALPHA="α",n.LOWER_EPSILON="ε",n.LOWER_ETA="η",n.LOWER_IOTA="ι",n.LOWER_OMICRON="ο",n.LOWER_RHO="ρ",n.LOWER_UPSILON="υ",n.LOWER_OMEGA="ω",n.CAPITAL_ALPHA="Α",n.CAPITAL_EPSILON="Ε",n.CAPITAL_ETA="Η",n.CAPITAL_IOTA="Ι",n.CAPITAL_OMICRON="Ο",n.CAPITAL_RHO="Ρ",n.CAPITAL_UPSILON="Υ",n.CAPITAL_OMEGA="Ω",n["LOWER_ΑΛΦΑ"]="α",n["LOWER_ΕΨΙΛΟΝ"]="ε",n["LOWER_ΗΤΑ"]="η",n["LOWER_ΙΩΤΑ"]="ι",n["LOWER_ΟΜΙΚΡΟΝ"]="ο",n["LOWER_ΡΩ"]="ρ",n["LOWER_ΥΨΙΛΟΝ"]="υ",n["LOWER_ΩΜΕΓΑ"]="ω",n["CAPITAL_ΑΛΦΑ"]="Α",n["CAPITAL_ΕΨΙΛΟΝ"]="Ε",n["CAPITAL_ΗΤΑ"]="Η",n["CAPITAL_ΙΩΤΑ"]="Ι",n["CAPITAL_ΟΜΙΚΡΟΝ"]="Ο",n["CAPITAL_ΡΩ"]="Ρ",n["CAPITAL_ΥΨΙΛΟΝ"]="Υ",n["CAPITAL_ΩΜΕΓΑ"]="Ω"}(Primary_Combining_Point||(Primary_Combining_Point={}));const PRIMARY_COMBINING_POINTS={};PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_ALPHA]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_EPSILON]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_ETA]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_IOTA]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_OMICRON]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_RHO]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_UPSILON]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_OMEGA]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_ALPHA]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_EPSILON]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_ETA]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_IOTA]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_OMICRON]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_RHO]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_UPSILON]=null,PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_OMEGA]=null,Object.freeze(PRIMARY_COMBINING_POINTS);export function Is_Primary_Combining_Point(n){return PRIMARY_COMBINING_POINTS.hasOwnProperty(n)}export var Secondary_Combining_Point;!function(n){n.SMOOTH_BREATH="̓",n.ROUGH_BREATH="̔",n.DIAERESIS="̈",n.GRAVE_ACCENT="̀",n.ACUTE_ACCENT="́",n.CIRCUMFLEX="͂",n.IOTA_SUBSCRIPT="ͅ",n.IOTA_ADSCRIPT="ͅ",n.MACRON="̄",n.BREVE="̆",n["ΨΙΛΟΝ_ΠΝΕΥΜΑ"]="̓",n["ΔΑΣΥ_ΠΝΕΥΜΑ"]="̔",n["ΔΙΑΛΥΤΙΚΑ"]="̈",n["ΒΑΡΕΙΑ"]="̀",n["ΟΞΕΙΑ"]="́",n["ΠΕΡΙΣΠΩΜΕΝΗ"]="͂",n["ΥΠΟΓΕΓΡΑΜΜΕΝΗ"]="ͅ",n["ΠΡΟΣΓΕΓΡΑΜΜΕΝΗ"]="ͅ",n["ΜΑΚΡΟΝ"]="̄",n["ΒΡΑΧΥ"]="̆"}(Secondary_Combining_Point||(Secondary_Combining_Point={}));const SECONDARY_COMBINING_POINTS={};SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.SMOOTH_BREATH]=null,SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.ROUGH_BREATH]=null,SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.DIAERESIS]=null,SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.GRAVE_ACCENT]=null,SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.ACUTE_ACCENT]=null,SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.CIRCUMFLEX]=null,SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.IOTA_SUBSCRIPT]=null,SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.MACRON]=null,SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.BREVE]=null,Object.freeze(PRIMARY_COMBINING_POINTS);export function Is_Secondary_Combining_Point(n){return SECONDARY_COMBINING_POINTS.hasOwnProperty(n)}export function Remove_Secondary_Combining_Points(n){let _="";for(let o=new Unicode.Iterator({text:n});!o.Is_At_End();o=o.Next()){const n=o.Point();Is_Secondary_Combining_Point(n)||(_+=n)}return _}export var Secondary_Combining_Point_Precedence;!function(n){n[n.UNARY=0]="UNARY",n[n.PRIMARY=1]="PRIMARY",n[n.SECONDARY=2]="SECONDARY",n[n.TERTIARY=3]="TERTIARY"}(Secondary_Combining_Point_Precedence||(Secondary_Combining_Point_Precedence={}));const SECONDARY_COMBINING_POINT_PRECEDENCE={};function Some_Secondary_Combining_Point_Precedence(n){return  SECONDARY_COMBINING_POINT_PRECEDENCE[n]}SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.SMOOTH_BREATH]=Secondary_Combining_Point_Precedence.PRIMARY,SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.ROUGH_BREATH]=Secondary_Combining_Point_Precedence.PRIMARY,SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.DIAERESIS]=Secondary_Combining_Point_Precedence.PRIMARY,SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.GRAVE_ACCENT]=Secondary_Combining_Point_Precedence.SECONDARY,SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.ACUTE_ACCENT]=Secondary_Combining_Point_Precedence.SECONDARY,SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.CIRCUMFLEX]=Secondary_Combining_Point_Precedence.SECONDARY,SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.IOTA_SUBSCRIPT]=Secondary_Combining_Point_Precedence.TERTIARY,SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.MACRON]=Secondary_Combining_Point_Precedence.UNARY,SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.BREVE]=Secondary_Combining_Point_Precedence.UNARY,Object.freeze(SECONDARY_COMBINING_POINT_PRECEDENCE);const COMBINING_CLUSTER_TO_BAKED_POINT={"ἀ":"ἀ","ἐ":"ἐ","ἠ":"ἠ","ἰ":"ἰ","ὀ":"ὀ","ῤ":"ῤ","ὐ":"ὐ","ὠ":"ὠ","Ἀ":"Ἀ","Ἐ":"Ἐ","Ἠ":"Ἠ","Ἰ":"Ἰ","Ὀ":"Ὀ","Ὠ":"Ὠ","ἄ":"ἄ","ἔ":"ἔ","ἤ":"ἤ","ἴ":"ἴ","ὄ":"ὄ","ὔ":"ὔ","ὤ":"ὤ","Ἄ":"Ἄ","Ἔ":"Ἔ","Ἤ":"Ἤ","Ἴ":"Ἴ","Ὄ":"Ὄ","Ὤ":"Ὤ","ᾄ":"ᾄ","ᾔ":"ᾔ","ᾤ":"ᾤ","ᾌ":"ᾌ","ᾜ":"ᾜ","ᾬ":"ᾬ","ἂ":"ἂ","ἒ":"ἒ","ἢ":"ἢ","ἲ":"ἲ","ὂ":"ὂ","ὒ":"ὒ","ὢ":"ὢ","Ἂ":"Ἂ","Ἒ":"Ἒ","Ἢ":"Ἢ","Ἲ":"Ἲ","Ὂ":"Ὂ","Ὢ":"Ὢ","ᾂ":"ᾂ","ᾒ":"ᾒ","ᾢ":"ᾢ","ᾊ":"ᾊ","ᾚ":"ᾚ","ᾪ":"ᾪ","ἆ":"ἆ","ἦ":"ἦ","ἶ":"ἶ","ὖ":"ὖ","ὦ":"ὦ","Ἆ":"Ἆ","Ἦ":"Ἦ","Ἶ":"Ἶ","Ὦ":"Ὦ","ᾆ":"ᾆ","ᾖ":"ᾖ","ᾦ":"ᾦ","ᾎ":"ᾎ","ᾞ":"ᾞ","ᾮ":"ᾮ","ᾀ":"ᾀ","ᾐ":"ᾐ","ᾠ":"ᾠ","ᾈ":"ᾈ","ᾘ":"ᾘ","ᾨ":"ᾨ","ἁ":"ἁ","ἑ":"ἑ","ἡ":"ἡ","ἱ":"ἱ","ὁ":"ὁ","ῥ":"ῥ","ὑ":"ὑ","ὡ":"ὡ","Ἁ":"Ἁ","Ἑ":"Ἑ","Ἡ":"Ἡ","Ἱ":"Ἱ","Ὁ":"Ὁ","Ῥ":"Ῥ","Ὑ":"Ὑ","Ὡ":"Ὡ","ἅ":"ἅ","ἕ":"ἕ","ἥ":"ἥ","ἵ":"ἵ","ὅ":"ὅ","ὕ":"ὕ","ὥ":"ὥ","Ἅ":"Ἅ","Ἕ":"Ἕ","Ἥ":"Ἥ","Ἵ":"Ἵ","Ὅ":"Ὅ","Ὕ":"Ὕ","Ὥ":"Ὥ","ᾅ":"ᾅ","ᾕ":"ᾕ","ᾥ":"ᾥ","ᾍ":"ᾍ","ᾝ":"ᾝ","ᾭ":"ᾭ","ἃ":"ἃ","ἓ":"ἓ","ἣ":"ἣ","ἳ":"ἳ","ὃ":"ὃ","ὓ":"ὓ","ὣ":"ὣ","Ἃ":"Ἃ","Ἓ":"Ἓ","Ἣ":"Ἣ","Ἳ":"Ἳ","Ὃ":"Ὃ","Ὓ":"Ὓ","Ὣ":"Ὣ","ᾃ":"ᾃ","ᾓ":"ᾓ","ᾣ":"ᾣ","ᾋ":"ᾋ","ᾛ":"ᾛ","ᾫ":"ᾫ","ἇ":"ἇ","ἧ":"ἧ","ἷ":"ἷ","ὗ":"ὗ","ὧ":"ὧ","Ἇ":"Ἇ","Ἧ":"Ἧ","Ἷ":"Ἷ","Ὗ":"Ὗ","Ὧ":"Ὧ","ᾇ":"ᾇ","ᾗ":"ᾗ","ᾧ":"ᾧ","ᾏ":"ᾏ","ᾟ":"ᾟ","ᾯ":"ᾯ","ᾁ":"ᾁ","ᾑ":"ᾑ","ᾡ":"ᾡ","ᾉ":"ᾉ","ᾙ":"ᾙ","ᾩ":"ᾩ","ϊ":"ϊ","ϋ":"ϋ","Ϊ":"Ϊ","Ϋ":"Ϋ","ΐ":"ΐ","ΰ":"ΰ","ῒ":"ῒ","ῢ":"ῢ","ῗ":"ῗ","ῧ":"ῧ","ά":"ά","έ":"έ","ή":"ή","ί":"ί","ό":"ό","ύ":"ύ","ώ":"ώ","Ά":"Ά","Έ":"Έ","Ή":"Ή","Ί":"Ί","Ό":"Ό","Ύ":"Ύ","Ώ":"Ώ","ᾴ":"ᾴ","ῄ":"ῄ","ῴ":"ῴ","ὰ":"ὰ","ὲ":"ὲ","ὴ":"ὴ","ὶ":"ὶ","ὸ":"ὸ","ὺ":"ὺ","ὼ":"ὼ","Ὰ":"Ὰ","Ὲ":"Ὲ","Ὴ":"Ὴ","Ὶ":"Ὶ","Ὸ":"Ὸ","Ὺ":"Ὺ","Ὼ":"Ὼ","ᾲ":"ᾲ","ῂ":"ῂ","ῲ":"ῲ","ᾶ":"ᾶ","ῆ":"ῆ","ῖ":"ῖ","ῦ":"ῦ","ῶ":"ῶ","ᾷ":"ᾷ","ῇ":"ῇ","ῷ":"ῷ","ᾳ":"ᾳ","ῃ":"ῃ","ῳ":"ῳ","ᾼ":"ᾼ","ῌ":"ῌ","ῼ":"ῼ","ᾱ":"ᾱ","ῑ":"ῑ","ῡ":"ῡ","Ᾱ":"Ᾱ","Ῑ":"Ῑ","Ῡ":"Ῡ","ᾰ":"ᾰ","ῐ":"ῐ","ῠ":"ῠ","Ᾰ":"Ᾰ","Ῐ":"Ῐ","Ῠ":"Ῠ"};Object.freeze(COMBINING_CLUSTER_TO_BAKED_POINT);export function Combining_Cluster_To_Baked_Point(n){return COMBINING_CLUSTER_TO_BAKED_POINT[n]}const BAKED_POINT_TO_COMBINING_CLUSTER={"ἀ":"ἀ","ἐ":"ἐ","ἠ":"ἠ","ἰ":"ἰ","ὀ":"ὀ","ῤ":"ῤ","ὐ":"ὐ","ὠ":"ὠ","Ἀ":"Ἀ","Ἐ":"Ἐ","Ἠ":"Ἠ","Ἰ":"Ἰ","Ὀ":"Ὀ","Ὠ":"Ὠ","ἄ":"ἄ","ἔ":"ἔ","ἤ":"ἤ","ἴ":"ἴ","ὄ":"ὄ","ὔ":"ὔ","ὤ":"ὤ","Ἄ":"Ἄ","Ἔ":"Ἔ","Ἤ":"Ἤ","Ἴ":"Ἴ","Ὄ":"Ὄ","Ὤ":"Ὤ","ᾄ":"ᾄ","ᾔ":"ᾔ","ᾤ":"ᾤ","ᾌ":"ᾌ","ᾜ":"ᾜ","ᾬ":"ᾬ","ἂ":"ἂ","ἒ":"ἒ","ἢ":"ἢ","ἲ":"ἲ","ὂ":"ὂ","ὒ":"ὒ","ὢ":"ὢ","Ἂ":"Ἂ","Ἒ":"Ἒ","Ἢ":"Ἢ","Ἲ":"Ἲ","Ὂ":"Ὂ","Ὢ":"Ὢ","ᾂ":"ᾂ","ᾒ":"ᾒ","ᾢ":"ᾢ","ᾊ":"ᾊ","ᾚ":"ᾚ","ᾪ":"ᾪ","ἆ":"ἆ","ἦ":"ἦ","ἶ":"ἶ","ὖ":"ὖ","ὦ":"ὦ","Ἆ":"Ἆ","Ἦ":"Ἦ","Ἶ":"Ἶ","Ὦ":"Ὦ","ᾆ":"ᾆ","ᾖ":"ᾖ","ᾦ":"ᾦ","ᾎ":"ᾎ","ᾞ":"ᾞ","ᾮ":"ᾮ","ᾀ":"ᾀ","ᾐ":"ᾐ","ᾠ":"ᾠ","ᾈ":"ᾈ","ᾘ":"ᾘ","ᾨ":"ᾨ","ἁ":"ἁ","ἑ":"ἑ","ἡ":"ἡ","ἱ":"ἱ","ὁ":"ὁ","ῥ":"ῥ","ὑ":"ὑ","ὡ":"ὡ","Ἁ":"Ἁ","Ἑ":"Ἑ","Ἡ":"Ἡ","Ἱ":"Ἱ","Ὁ":"Ὁ","Ῥ":"Ῥ","Ὑ":"Ὑ","Ὡ":"Ὡ","ἅ":"ἅ","ἕ":"ἕ","ἥ":"ἥ","ἵ":"ἵ","ὅ":"ὅ","ὕ":"ὕ","ὥ":"ὥ","Ἅ":"Ἅ","Ἕ":"Ἕ","Ἥ":"Ἥ","Ἵ":"Ἵ","Ὅ":"Ὅ","Ὕ":"Ὕ","Ὥ":"Ὥ","ᾅ":"ᾅ","ᾕ":"ᾕ","ᾥ":"ᾥ","ᾍ":"ᾍ","ᾝ":"ᾝ","ᾭ":"ᾭ","ἃ":"ἃ","ἓ":"ἓ","ἣ":"ἣ","ἳ":"ἳ","ὃ":"ὃ","ὓ":"ὓ","ὣ":"ὣ","Ἃ":"Ἃ","Ἓ":"Ἓ","Ἣ":"Ἣ","Ἳ":"Ἳ","Ὃ":"Ὃ","Ὓ":"Ὓ","Ὣ":"Ὣ","ᾃ":"ᾃ","ᾓ":"ᾓ","ᾣ":"ᾣ","ᾋ":"ᾋ","ᾛ":"ᾛ","ᾫ":"ᾫ","ἇ":"ἇ","ἧ":"ἧ","ἷ":"ἷ","ὗ":"ὗ","ὧ":"ὧ","Ἇ":"Ἇ","Ἧ":"Ἧ","Ἷ":"Ἷ","Ὗ":"Ὗ","Ὧ":"Ὧ","ᾇ":"ᾇ","ᾗ":"ᾗ","ᾧ":"ᾧ","ᾏ":"ᾏ","ᾟ":"ᾟ","ᾯ":"ᾯ","ᾁ":"ᾁ","ᾑ":"ᾑ","ᾡ":"ᾡ","ᾉ":"ᾉ","ᾙ":"ᾙ","ᾩ":"ᾩ","ϊ":"ϊ","ϋ":"ϋ","Ϊ":"Ϊ","Ϋ":"Ϋ","ΐ":"ΐ","ΰ":"ΰ","ῒ":"ῒ","ῢ":"ῢ","ῗ":"ῗ","ῧ":"ῧ","ά":"ά","έ":"έ","ή":"ή","ί":"ί","ό":"ό","ύ":"ύ","ώ":"ώ","Ά":"Ά","Έ":"Έ","Ή":"Ή","Ί":"Ί","Ό":"Ό","Ύ":"Ύ","Ώ":"Ώ","ᾴ":"ᾴ","ῄ":"ῄ","ῴ":"ῴ","ὰ":"ὰ","ὲ":"ὲ","ὴ":"ὴ","ὶ":"ὶ","ὸ":"ὸ","ὺ":"ὺ","ὼ":"ὼ","Ὰ":"Ὰ","Ὲ":"Ὲ","Ὴ":"Ὴ","Ὶ":"Ὶ","Ὸ":"Ὸ","Ὺ":"Ὺ","Ὼ":"Ὼ","ᾲ":"ᾲ","ῂ":"ῂ","ῲ":"ῲ","ᾶ":"ᾶ","ῆ":"ῆ","ῖ":"ῖ","ῦ":"ῦ","ῶ":"ῶ","ᾷ":"ᾷ","ῇ":"ῇ","ῷ":"ῷ","ᾳ":"ᾳ","ῃ":"ῃ","ῳ":"ῳ","ᾼ":"ᾼ","ῌ":"ῌ","ῼ":"ῼ","ᾱ":"ᾱ","ῑ":"ῑ","ῡ":"ῡ","Ᾱ":"Ᾱ","Ῑ":"Ῑ","Ῡ":"Ῡ","ᾰ":"ᾰ","ῐ":"ῐ","ῠ":"ῠ","Ᾰ":"Ᾰ","Ῐ":"Ῐ","Ῠ":"Ῠ"};Object.freeze(BAKED_POINT_TO_COMBINING_CLUSTER);export function Baked_Point_To_Combining_Cluster(n){return BAKED_POINT_TO_COMBINING_CLUSTER[n]}const BAKED_POINT_TO_PRIMARY_COMBINING_POINT={"ἀ":"α","ἐ":"ε","ἠ":"η","ἰ":"ι","ὀ":"ο","ῤ":"ρ","ὐ":"υ","ὠ":"ω","Ἀ":"Α","Ἐ":"Ε","Ἠ":"Η","Ἰ":"Ι","Ὀ":"Ο","Ὠ":"Ω","ἄ":"α","ἔ":"ε","ἤ":"η","ἴ":"ι","ὄ":"ο","ὔ":"υ","ὤ":"ω","Ἄ":"Α","Ἔ":"Ε","Ἤ":"Η","Ἴ":"Ι","Ὄ":"Ο","Ὤ":"Ω","ᾄ":"α","ᾔ":"η","ᾤ":"ω","ᾌ":"Α","ᾜ":"Η","ᾬ":"Ω","ἂ":"α","ἒ":"ε","ἢ":"η","ἲ":"ι","ὂ":"ο","ὒ":"υ","ὢ":"ω","Ἂ":"Α","Ἒ":"Ε","Ἢ":"Η","Ἲ":"Ι","Ὂ":"Ο","Ὢ":"Ω","ᾂ":"α","ᾒ":"η","ᾢ":"ω","ᾊ":"Α","ᾚ":"Η","ᾪ":"Ω","ἆ":"α","ἦ":"η","ἶ":"ι","ὖ":"υ","ὦ":"ω","Ἆ":"Α","Ἦ":"Η","Ἶ":"Ι","Ὦ":"Ω","ᾆ":"α","ᾖ":"η","ᾦ":"ω","ᾎ":"Α","ᾞ":"Η","ᾮ":"Ω","ᾀ":"α","ᾐ":"η","ᾠ":"ω","ᾈ":"Α","ᾘ":"Η","ᾨ":"Ω","ἁ":"α","ἑ":"ε","ἡ":"η","ἱ":"ι","ὁ":"ο","ῥ":"ρ","ὑ":"υ","ὡ":"ω","Ἁ":"Α","Ἑ":"Ε","Ἡ":"Η","Ἱ":"Ι","Ὁ":"Ο","Ῥ":"Ρ","Ὑ":"Υ","Ὡ":"Ω","ἅ":"α","ἕ":"ε","ἥ":"η","ἵ":"ι","ὅ":"ο","ὕ":"υ","ὥ":"ω","Ἅ":"Α","Ἕ":"Ε","Ἥ":"Η","Ἵ":"Ι","Ὅ":"Ο","Ὕ":"Υ","Ὥ":"Ω","ᾅ":"α","ᾕ":"η","ᾥ":"ω","ᾍ":"Α","ᾝ":"Η","ᾭ":"Ω","ἃ":"α","ἓ":"ε","ἣ":"η","ἳ":"ι","ὃ":"ο","ὓ":"υ","ὣ":"ω","Ἃ":"Α","Ἓ":"Ε","Ἣ":"Η","Ἳ":"Ι","Ὃ":"Ο","Ὓ":"Υ","Ὣ":"Ω","ᾃ":"α","ᾓ":"η","ᾣ":"ω","ᾋ":"Α","ᾛ":"Η","ᾫ":"Ω","ἇ":"α","ἧ":"η","ἷ":"ι","ὗ":"υ","ὧ":"ω","Ἇ":"Α","Ἧ":"Η","Ἷ":"Ι","Ὗ":"Υ","Ὧ":"Ω","ᾇ":"α","ᾗ":"η","ᾧ":"ω","ᾏ":"Α","ᾟ":"Η","ᾯ":"Ω","ᾁ":"α","ᾑ":"η","ᾡ":"ω","ᾉ":"Α","ᾙ":"Η","ᾩ":"Ω","ϊ":"ι","ϋ":"υ","Ϊ":"Ι","Ϋ":"Υ","ΐ":"ι","ΰ":"υ","ῒ":"ι","ῢ":"υ","ῗ":"ι","ῧ":"υ","ά":"α","έ":"ε","ή":"η","ί":"ι","ό":"ο","ύ":"υ","ώ":"ω","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ό":"Ο","Ύ":"Υ","Ώ":"Ω","ᾴ":"α","ῄ":"η","ῴ":"ω","ὰ":"α","ὲ":"ε","ὴ":"η","ὶ":"ι","ὸ":"ο","ὺ":"υ","ὼ":"ω","Ὰ":"Α","Ὲ":"Ε","Ὴ":"Η","Ὶ":"Ι","Ὸ":"Ο","Ὺ":"Υ","Ὼ":"Ω","ᾲ":"α","ῂ":"η","ῲ":"ω","ᾶ":"α","ῆ":"η","ῖ":"ι","ῦ":"υ","ῶ":"ω","ᾷ":"α","ῇ":"η","ῷ":"ω","ᾳ":"α","ῃ":"η","ῳ":"ω","ᾼ":"Α","ῌ":"Η","ῼ":"Ω","ᾱ":"α","ῑ":"ι","ῡ":"υ","Ᾱ":"Α","Ῑ":"Ι","Ῡ":"Υ","ᾰ":"α","ῐ":"ι","ῠ":"υ","Ᾰ":"Α","Ῐ":"Ι","Ῠ":"Υ"};Object.freeze(BAKED_POINT_TO_PRIMARY_COMBINING_POINT);export function Baked_Point_To_Primary_Combining_Point(n){return BAKED_POINT_TO_PRIMARY_COMBINING_POINT[n]}export function Normalize_With_Baked_Points(n){let _="";for(let o=new Unicode.Iterator({text:n});!o.Is_At_End();){const i=o.Point(),e=o.Index();if(Is_Primary_Combining_Point(i)){const t=i,I=[],P={};for(P[Secondary_Combining_Point_Precedence.UNARY]=0,P[Secondary_Combining_Point_Precedence.PRIMARY]=0,P[Secondary_Combining_Point_Precedence.SECONDARY]=0,P[Secondary_Combining_Point_Precedence.TERTIARY]=0,o=o.Next();!o.Is_At_End()&&Is_Secondary_Combining_Point(o.Point());){const n=o.Point();I.push(n),P[Some_Secondary_Combining_Point_Precedence(n)]+=1,o=o.Next()}if(I.length>0){let o=!1;if(I.sort((function(n,_){const i=Some_Secondary_Combining_Point_Precedence(n),e=Some_Secondary_Combining_Point_Precedence(_);return i!==Secondary_Combining_Point_Precedence.UNARY&&e!==Secondary_Combining_Point_Precedence.UNARY||(o=!0),i-e})),o)return  "";if(P[Secondary_Combining_Point_Precedence.PRIMARY]>1)return  "";if(P[Secondary_Combining_Point_Precedence.SECONDARY]>1)return  "";if(P[Secondary_Combining_Point_Precedence.TERTIARY]>1)return  "";{const n=`${t}${I.join("")}`,o=Combining_Cluster_To_Baked_Point(n);_+=null!=o?o:n}}else _+=i}else _+=i,o=o.Next()}return _}export function Normalize_With_Combined_Points(n){let _="";for(let o=new Unicode.Iterator({text:n});!o.Is_At_End();o=o.Next()){const n=o.Point(),i=Baked_Point_To_Combining_Cluster(n);_+=null!=i?i:n}return _}const GREEK_POINT_TO_ARCHAIC_POINT={"α":"a","Α":"A","β":"b","Β":"B","γ":"g","Γ":"G","δ":"d","Δ":"D","ε":"e","Ε":"E","ζ":"z","Ζ":"Z","η":"h","Η":"H","θ":"q","Θ":"Q","ι":"i","Ι":"I","κ":"k","Κ":"K","λ":"l","Λ":"L","μ":"m","Μ":"M","ν":"n","Ν":"N","ξ":"x","Ξ":"X","ο":"o","Ο":"O","π":"p","Π":"P","ρ":"r","Ρ":"R","σ":"s","ς":"j","Σ":"S","τ":"t","Τ":"T","υ":"u","Υ":"U","φ":"f","Φ":"F","χ":"c","Χ":"C","ψ":"y","Ψ":"Y","ω":"w","Ω":"W"};export function Greek_Point_To_Archaic_Point(n){return GREEK_POINT_TO_ARCHAIC_POINT[n]}import*as Font from"../font.js";import{Name}from"./name.js";import{Direction}from"./direction.js";import*as Language from"./instance.js";import*as Font_Adaptor from"./font_adaptor.js";export class Instance extends Language.Instance{constructor(){super({name:Name.GREEK,direction:Direction.LEFT_TO_RIGHT,default_font_name:Font.Name.QUIVIRA,font_adaptors:[new Font_Adaptor.Instance({font_name:Font.Name.GENTIUM,short_font_name:Font.Name.GENTIUM,styles:{"font-size":"1.25em","line-height":"1.3"}}),new Font_Adaptor.Instance({font_name:Font.Name.GENTIUM_BOOK,short_font_name:Font.Name.GENTIUM_BOOK,styles:{"font-size":"1.25em","line-height":"1.3"}}),new Font_Adaptor.Instance({font_name:Font.Name.QUIVIRA,short_font_name:Font.Name.QUIVIRA,styles:{"font-size":"1.25em","line-height":"1.3"}}),new Font_Adaptor.Instance({font_name:Font.Name.KRIS_J_UDD_GREEK_ARCHAIC,short_font_name:"K.J.U. Archaic",styles:{"font-size":"1.25em","line-height":"1.3","word-spacing":"0.215em"},treater:function(n){let _="";for(let o=new Unicode.Iterator({text:n});!o.Is_At_End();o=o.Next()){let n=o.Point();if(!Is_Secondary_Combining_Point(n)){const o=Baked_Point_To_Primary_Combining_Point(n);null!=o&&(n=o);const i=Greek_Point_To_Archaic_Point(n);null!=i&&(n=i),_+=n}}return _}})]})}}