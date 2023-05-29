import { Integer } from "../../types.js";
import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

export enum Primary_Combining_Point
{
    LOWER_ALPHA = `α`,
    LOWER_EPSILON = `ε`,
    LOWER_ETA = `η`,
    LOWER_IOTA = `ι`,
    LOWER_OMICRON = `ο`,
    LOWER_RHO = `ρ`,
    LOWER_UPSILON = `υ`,
    LOWER_OMEGA = `ω`,

    CAPITAL_ALPHA = `Α`,
    CAPITAL_EPSILON = `Ε`,
    CAPITAL_ETA = `Η`,
    CAPITAL_IOTA = `Ι`,
    CAPITAL_OMICRON = `Ο`,
    CAPITAL_RHO = `Ρ`,
    CAPITAL_UPSILON = `Υ`,
    CAPITAL_OMEGA = `Ω`,

    LOWER_ΑΛΦΑ = LOWER_ALPHA,
    LOWER_ΕΨΙΛΟΝ = LOWER_EPSILON,
    LOWER_ΗΤΑ = LOWER_ETA,
    LOWER_ΙΩΤΑ = LOWER_IOTA,
    LOWER_ΟΜΙΚΡΟΝ = LOWER_OMICRON,
    LOWER_ΡΩ = LOWER_RHO,
    LOWER_ΥΨΙΛΟΝ = LOWER_UPSILON,
    LOWER_ΩΜΕΓΑ = LOWER_OMEGA,

    CAPITAL_ΑΛΦΑ = CAPITAL_ALPHA,
    CAPITAL_ΕΨΙΛΟΝ = CAPITAL_EPSILON,
    CAPITAL_ΗΤΑ = CAPITAL_ETA,
    CAPITAL_ΙΩΤΑ = CAPITAL_IOTA,
    CAPITAL_ΟΜΙΚΡΟΝ = CAPITAL_OMICRON,
    CAPITAL_ΡΩ = CAPITAL_RHO,
    CAPITAL_ΥΨΙΛΟΝ = CAPITAL_UPSILON,
    CAPITAL_ΩΜΕΓΑ = CAPITAL_OMEGA,
}

const PRIMARY_COMBINING_POINTS: { [primary_combining_point: string]: null } = {};
{
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_ALPHA] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_EPSILON] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_ETA] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_IOTA] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_OMICRON] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_RHO] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_UPSILON] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.LOWER_OMEGA] = null;

    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_ALPHA] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_EPSILON] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_ETA] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_IOTA] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_OMICRON] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_RHO] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_UPSILON] = null;
    PRIMARY_COMBINING_POINTS[Primary_Combining_Point.CAPITAL_OMEGA] = null;
}
Object.freeze(PRIMARY_COMBINING_POINTS);

export function Is_Primary_Combining_Point(
    point: string,
):
    boolean
{
    return PRIMARY_COMBINING_POINTS.hasOwnProperty(point);
}

export enum Secondary_Combining_Point
{
    SMOOTH_BREATH = `\u{0313}`,     // COMBINING COMMA ABOVE
    ROUGH_BREATH = `\u{0314}`,      // COMBINING REVERSED COMMA ABOVE
    DIAERESIS = `\u{0308}`,         // COMBINING DIAERESIS

    GRAVE_ACCENT = `\u{0300}`,      // COMBINING GRAVE ACCENT
    ACUTE_ACCENT = `\u{0301}`,      // COMBINING ACUTE ACCENT
    CIRCUMFLEX = `\u{0342}`,        // COMBINING GREEK PERISPOMENI

    IOTA_SUBSCRIPT = `\u{0345}`,    // COMBINING GREEK YPOGEGRAMMENI
    IOTA_ADSCRIPT = IOTA_SUBSCRIPT,

    MACRON = `\u{0304}`,            // COMBINING MACRON
    BREVE = `\u{0306}`,             // COMBINING BREVE

    ΨΙΛΟΝ_ΠΝΕΥΜΑ = SMOOTH_BREATH,
    ΔΑΣΥ_ΠΝΕΥΜΑ = ROUGH_BREATH,
    ΔΙΑΛΥΤΙΚΑ = DIAERESIS,

    ΒΑΡΕΙΑ = GRAVE_ACCENT,
    ΟΞΕΙΑ = ACUTE_ACCENT,
    ΠΕΡΙΣΠΩΜΕΝΗ = CIRCUMFLEX,

    ΥΠΟΓΕΓΡΑΜΜΕΝΗ = IOTA_SUBSCRIPT,
    ΠΡΟΣΓΕΓΡΑΜΜΕΝΗ = IOTA_ADSCRIPT,

    ΜΑΚΡΟΝ = MACRON,
    ΒΡΑΧΥ = BREVE,
}

const SECONDARY_COMBINING_POINTS: { [secondary_combining_point: string]: null } = {};
{
    SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.SMOOTH_BREATH] = null;
    SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.ROUGH_BREATH] = null;
    SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.DIAERESIS] = null;

    SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.GRAVE_ACCENT] = null;
    SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.ACUTE_ACCENT] = null;
    SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.CIRCUMFLEX] = null;

    SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.IOTA_SUBSCRIPT] = null;

    SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.MACRON] = null;
    SECONDARY_COMBINING_POINTS[Secondary_Combining_Point.BREVE] = null;
}
Object.freeze(PRIMARY_COMBINING_POINTS);

export function Is_Secondary_Combining_Point(
    point: string,
):
    boolean
{
    return SECONDARY_COMBINING_POINTS.hasOwnProperty(point);
}

export enum Secondary_Combining_Point_Precedence
{
    UNARY,
    PRIMARY,
    SECONDARY,
    TERTIARY,
}

const SECONDARY_COMBINING_POINT_PRECEDENCE: { [secondary_combining_point: string]: Secondary_Combining_Point_Precedence } = {};
{
    SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.SMOOTH_BREATH] =
        Secondary_Combining_Point_Precedence.PRIMARY;
    SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.ROUGH_BREATH] =
        Secondary_Combining_Point_Precedence.PRIMARY;
    SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.DIAERESIS] =
        Secondary_Combining_Point_Precedence.PRIMARY;

    SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.GRAVE_ACCENT] =
        Secondary_Combining_Point_Precedence.SECONDARY;
    SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.ACUTE_ACCENT] =
        Secondary_Combining_Point_Precedence.SECONDARY;
    SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.CIRCUMFLEX] =
        Secondary_Combining_Point_Precedence.SECONDARY;

    SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.IOTA_SUBSCRIPT] =
        Secondary_Combining_Point_Precedence.TERTIARY;

    SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.MACRON] =
        Secondary_Combining_Point_Precedence.UNARY;
    SECONDARY_COMBINING_POINT_PRECEDENCE[Secondary_Combining_Point.BREVE] =
        Secondary_Combining_Point_Precedence.UNARY;
}
Object.freeze(SECONDARY_COMBINING_POINT_PRECEDENCE);

function Some_Secondary_Combining_Point_Precedence(
    secondary_combining_point: string,
):
    Secondary_Combining_Point_Precedence
{
    Utils.Assert(
        SECONDARY_COMBINING_POINT_PRECEDENCE.hasOwnProperty(secondary_combining_point),
        `invalid secondary_combining_point`,
    );

    return (
        SECONDARY_COMBINING_POINT_PRECEDENCE[secondary_combining_point] as
        Secondary_Combining_Point_Precedence
    );
}

const COMBINING_CLUSTER_TO_BAKED_POINT: { [combining_cluster: string]: string } = {
    "ἀ": "ἀ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα
    "ἐ": "ἐ", // Lower      Έψιλον      + Ψιλὸν Πνεῦμα
    "ἠ": "ἠ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα
    "ἰ": "ἰ", // Lower      Ιώτα        + Ψιλὸν Πνεῦμα
    "ὀ": "ὀ", // Lower      Όμικρον     + Ψιλὸν Πνεῦμα
    "ῤ": "ῤ", // Lower      Ρώ          + Ψιλὸν Πνεῦμα
    "ὐ": "ὐ", // Lower      Ύψιλον      + Ψιλὸν Πνεῦμα
    "ὠ": "ὠ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα
    "Ἀ": "Ἀ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα
    "Ἐ": "Ἐ", // Capital    Έψιλον      + Ψιλὸν Πνεῦμα
    "Ἠ": "Ἠ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα
    "Ἰ": "Ἰ", // Capital    Ιώτα        + Ψιλὸν Πνεῦμα
    "Ὀ": "Ὀ", // Capital    Όμικρον     + Ψιλὸν Πνεῦμα
    "Ὠ": "Ὠ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα

    "ἄ": "ἄ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Όξεῖα
    "ἔ": "ἔ", // Lower      Έψιλον      + Ψιλὸν Πνεῦμα + Όξεῖα
    "ἤ": "ἤ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Όξεῖα
    "ἴ": "ἴ", // Lower      Ιώτα        + Ψιλὸν Πνεῦμα + Όξεῖα
    "ὄ": "ὄ", // Lower      Όμικρον     + Ψιλὸν Πνεῦμα + Όξεῖα
    "ὔ": "ὔ", // Lower      Ύψιλον      + Ψιλὸν Πνεῦμα + Όξεῖα
    "ὤ": "ὤ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ἄ": "Ἄ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ἔ": "Ἔ", // Capital    Έψιλον      + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ἤ": "Ἤ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ἴ": "Ἴ", // Capital    Ιώτα        + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ὄ": "Ὄ", // Capital    Όμικρον     + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ὤ": "Ὤ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Όξεῖα

    "ᾄ": "ᾄ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾔ": "ᾔ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾤ": "ᾤ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾌ": "ᾌ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Όξεῖα + Προσγεγραμμένη
    "ᾜ": "ᾜ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Όξεῖα + Προσγεγραμμένη
    "ᾬ": "ᾬ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Όξεῖα + Προσγεγραμμένη

    "ἂ": "ἂ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ἒ": "ἒ", // Lower      Έψιλον      + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ἢ": "ἢ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ἲ": "ἲ", // Lower      Ιώτα        + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ὂ": "ὂ", // Lower      Όμικρον     + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ὒ": "ὒ", // Lower      Ύψιλον      + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ὢ": "ὢ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ἂ": "Ἂ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ἒ": "Ἒ", // Capital    Έψιλον      + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ἢ": "Ἢ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ἲ": "Ἲ", // Capital    Ιώτα        + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ὂ": "Ὂ", // Capital    Όμικρον     + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ὢ": "Ὢ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Βαρεῖα

    "ᾂ": "ᾂ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾒ": "ᾒ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾢ": "ᾢ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾊ": "ᾊ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Βαρεῖα + Προσγεγραμμένη
    "ᾚ": "ᾚ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Βαρεῖα + Προσγεγραμμένη
    "ᾪ": "ᾪ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Βαρεῖα + Προσγεγραμμένη

    "ἆ": "ἆ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Περισπωμένη
    "ἦ": "ἦ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Περισπωμένη
    "ἶ": "ἶ", // Lower      Ιώτα        + Ψιλὸν Πνεῦμα + Περισπωμένη
    "ὖ": "ὖ", // Lower      Ύψιλον      + Ψιλὸν Πνεῦμα + Περισπωμένη
    "ὦ": "ὦ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Περισπωμένη
    "Ἆ": "Ἆ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Περισπωμένη
    "Ἦ": "Ἦ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Περισπωμένη
    "Ἶ": "Ἶ", // Capital    Ιώτα        + Ψιλὸν Πνεῦμα + Περισπωμένη
    "Ὦ": "Ὦ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Περισπωμένη

    "ᾆ": "ᾆ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾖ": "ᾖ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾦ": "ᾦ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾎ": "ᾎ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Περισπωμένη + Προσγεγραμμένη
    "ᾞ": "ᾞ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Περισπωμένη + Προσγεγραμμένη
    "ᾮ": "ᾮ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Περισπωμένη + Προσγεγραμμένη

    "ᾀ": "ᾀ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Ὑπογεγραμμένη
    "ᾐ": "ᾐ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Ὑπογεγραμμένη
    "ᾠ": "ᾠ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Ὑπογεγραμμένη
    "ᾈ": "ᾈ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Προσγεγραμμένη
    "ᾘ": "ᾘ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Προσγεγραμμένη
    "ᾨ": "ᾨ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Προσγεγραμμένη

    "ἁ": "ἁ", // Lower      Άλφα        + Δασὺ Πνεῦμα
    "ἑ": "ἑ", // Lower      Έψιλον      + Δασὺ Πνεῦμα
    "ἡ": "ἡ", // Lower      Ήτα         + Δασὺ Πνεῦμα
    "ἱ": "ἱ", // Lower      Ιώτα        + Δασὺ Πνεῦμα
    "ὁ": "ὁ", // Lower      Όμικρον     + Δασὺ Πνεῦμα
    "ῥ": "ῥ", // Lower      Ρώ          + Δασὺ Πνεῦμα
    "ὑ": "ὑ", // Lower      Ύψιλον      + Δασὺ Πνεῦμα
    "ὡ": "ὡ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα
    "Ἁ": "Ἁ", // Capital    Άλφα        + Δασὺ Πνεῦμα
    "Ἑ": "Ἑ", // Capital    Έψιλον      + Δασὺ Πνεῦμα
    "Ἡ": "Ἡ", // Capital    Ήτα         + Δασὺ Πνεῦμα
    "Ἱ": "Ἱ", // Capital    Ιώτα        + Δασὺ Πνεῦμα
    "Ὁ": "Ὁ", // Capital    Όμικρον     + Δασὺ Πνεῦμα
    "Ῥ": "Ῥ", // Capital    Ρώ          + Δασὺ Πνεῦμα
    "Ὑ": "Ὑ", // Capital    Ύψιλον      + Δασὺ Πνεῦμα
    "Ὡ": "Ὡ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα

    "ἅ": "ἅ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Όξεῖα
    "ἕ": "ἕ", // Lower      Έψιλον      + Δασὺ Πνεῦμα + Όξεῖα
    "ἥ": "ἥ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Όξεῖα
    "ἵ": "ἵ", // Lower      Ιώτα        + Δασὺ Πνεῦμα + Όξεῖα
    "ὅ": "ὅ", // Lower      Όμικρον     + Δασὺ Πνεῦμα + Όξεῖα
    "ὕ": "ὕ", // Lower      Ύψιλον      + Δασὺ Πνεῦμα + Όξεῖα
    "ὥ": "ὥ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Όξεῖα
    "Ἅ": "Ἅ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Όξεῖα
    "Ἕ": "Ἕ", // Capital    Έψιλον      + Δασὺ Πνεῦμα + Όξεῖα
    "Ἥ": "Ἥ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Όξεῖα
    "Ἵ": "Ἵ", // Capital    Ιώτα        + Δασὺ Πνεῦμα + Όξεῖα
    "Ὅ": "Ὅ", // Capital    Όμικρον     + Δασὺ Πνεῦμα + Όξεῖα
    "Ὕ": "Ὕ", // Capital    Ύψιλον      + Δασὺ Πνεῦμα + Όξεῖα
    "Ὥ": "Ὥ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Όξεῖα

    "ᾅ": "ᾅ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾕ": "ᾕ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾥ": "ᾥ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾍ": "ᾍ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Όξεῖα + Προσγεγραμμένη
    "ᾝ": "ᾝ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Όξεῖα + Προσγεγραμμένη
    "ᾭ": "ᾭ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Όξεῖα + Προσγεγραμμένη

    "ἃ": "ἃ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Βαρεῖα
    "ἓ": "ἓ", // Lower      Έψιλον      + Δασὺ Πνεῦμα + Βαρεῖα
    "ἣ": "ἣ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Βαρεῖα
    "ἳ": "ἳ", // Lower      Ιώτα        + Δασὺ Πνεῦμα + Βαρεῖα
    "ὃ": "ὃ", // Lower      Όμικρον     + Δασὺ Πνεῦμα + Βαρεῖα
    "ὓ": "ὓ", // Lower      Ύψιλον      + Δασὺ Πνεῦμα + Βαρεῖα
    "ὣ": "ὣ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Βαρεῖα
    "Ἃ": "Ἃ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Βαρεῖα
    "Ἓ": "Ἓ", // Capital    Έψιλον      + Δασὺ Πνεῦμα + Βαρεῖα
    "Ἣ": "Ἣ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Βαρεῖα
    "Ἳ": "Ἳ", // Capital    Ιώτα        + Δασὺ Πνεῦμα + Βαρεῖα
    "Ὃ": "Ὃ", // Capital    Όμικρον     + Δασὺ Πνεῦμα + Βαρεῖα
    "Ὓ": "Ὓ", // Capital    Ύψιλον      + Δασὺ Πνεῦμα + Βαρεῖα
    "Ὣ": "Ὣ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Βαρεῖα

    "ᾃ": "ᾃ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾓ": "ᾓ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾣ": "ᾣ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾋ": "ᾋ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Βαρεῖα + Προσγεγραμμένη
    "ᾛ": "ᾛ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Βαρεῖα + Προσγεγραμμένη
    "ᾫ": "ᾫ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Βαρεῖα + Προσγεγραμμένη

    "ἇ": "ἇ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Περισπωμένη
    "ἧ": "ἧ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Περισπωμένη
    "ἷ": "ἷ", // Lower      Ιώτα        + Δασὺ Πνεῦμα + Περισπωμένη
    "ὗ": "ὗ", // Lower      Ύψιλον      + Δασὺ Πνεῦμα + Περισπωμένη
    "ὧ": "ὧ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Περισπωμένη
    "Ἇ": "Ἇ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Περισπωμένη
    "Ἧ": "Ἧ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Περισπωμένη
    "Ἷ": "Ἷ", // Capital    Ιώτα        + Δασὺ Πνεῦμα + Περισπωμένη
    "Ὗ": "Ὗ", // Capital    Ύψιλον      + Δασὺ Πνεῦμα + Περισπωμένη
    "Ὧ": "Ὧ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Περισπωμένη

    "ᾇ": "ᾇ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾗ": "ᾗ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾧ": "ᾧ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾏ": "ᾏ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Περισπωμένη + Προσγεγραμμένη
    "ᾟ": "ᾟ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Περισπωμένη + Προσγεγραμμένη
    "ᾯ": "ᾯ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Περισπωμένη + Προσγεγραμμένη

    "ᾁ": "ᾁ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Ὑπογεγραμμένη
    "ᾑ": "ᾑ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Ὑπογεγραμμένη
    "ᾡ": "ᾡ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Ὑπογεγραμμένη
    "ᾉ": "ᾉ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Προσγεγραμμένη
    "ᾙ": "ᾙ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Προσγεγραμμένη
    "ᾩ": "ᾩ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Προσγεγραμμένη

    "ϊ": "ϊ", // Lower      Ιώτα        + Διαλυτικά
    "ϋ": "ϋ", // Lower      Ύψιλον      + Διαλυτικά
    "Ϊ": "Ϊ", // Capital    Ιώτα        + Διαλυτικά
    "Ϋ": "Ϋ", // Capital    Ύψιλον      + Διαλυτικά

    "ΐ": "ΐ", // Lower      Ιώτα        + Διαλυτικά + Όξεῖα
    "ΰ": "ΰ", // Lower      Ύψιλον      + Διαλυτικά + Όξεῖα

    "ῒ": "ῒ", // Lower      Ιώτα        + Διαλυτικά + Βαρεῖα
    "ῢ": "ῢ", // Lower      Ύψιλον      + Διαλυτικά + Βαρεῖα

    "ῗ": "ῗ", // Lower      Ιώτα        + Διαλυτικά + Περισπωμένη
    "ῧ": "ῧ", // Lower      Ύψιλον      + Διαλυτικά + Περισπωμένη

    "ά": "ά", // Lower      Άλφα        + Όξεῖα
    "έ": "έ", // Lower      Έψιλον      + Όξεῖα
    "ή": "ή", // Lower      Ήτα         + Όξεῖα
    "ί": "ί", // Lower      Ιώτα        + Όξεῖα
    "ό": "ό", // Lower      Όμικρον     + Όξεῖα
    "ύ": "ύ", // Lower      Ύψιλον      + Όξεῖα
    "ώ": "ώ", // Lower      Ωμέγα       + Όξεῖα
    "Ά": "Ά", // Capital    Άλφα        + Όξεῖα
    "Έ": "Έ", // Capital    Έψιλον      + Όξεῖα
    "Ή": "Ή", // Capital    Ήτα         + Όξεῖα
    "Ί": "Ί", // Capital    Ιώτα        + Όξεῖα
    "Ό": "Ό", // Capital    Όμικρον     + Όξεῖα
    "Ύ": "Ύ", // Capital    Ύψιλον      + Όξεῖα
    "Ώ": "Ώ", // Capital    Ωμέγα       + Όξεῖα

    "ᾴ": "ᾴ", // Lower      Άλφα        + Όξεῖα + Ὑπογεγραμμένη
    "ῄ": "ῄ", // Lower      Ήτα         + Όξεῖα + Ὑπογεγραμμένη
    "ῴ": "ῴ", // Lower      Ωμέγα       + Όξεῖα + Ὑπογεγραμμένη

    "ὰ": "ὰ", // Lower      Άλφα        + Βαρεῖα
    "ὲ": "ὲ", // Lower      Έψιλον      + Βαρεῖα
    "ὴ": "ὴ", // Lower      Ήτα         + Βαρεῖα
    "ὶ": "ὶ", // Lower      Ιώτα        + Βαρεῖα
    "ὸ": "ὸ", // Lower      Όμικρον     + Βαρεῖα
    "ὺ": "ὺ", // Lower      Ύψιλον      + Βαρεῖα
    "ὼ": "ὼ", // Lower      Ωμέγα       + Βαρεῖα
    "Ὰ": "Ὰ", // Capital    Άλφα        + Βαρεῖα
    "Ὲ": "Ὲ", // Capital    Έψιλον      + Βαρεῖα
    "Ὴ": "Ὴ", // Capital    Ήτα         + Βαρεῖα
    "Ὶ": "Ὶ", // Capital    Ιώτα        + Βαρεῖα
    "Ὸ": "Ὸ", // Capital    Όμικρον     + Βαρεῖα
    "Ὺ": "Ὺ", // Capital    Ύψιλον      + Βαρεῖα
    "Ὼ": "Ὼ", // Capital    Ωμέγα       + Βαρεῖα

    "ᾲ": "ᾲ", // Lower      Άλφα        + Βαρεῖα + Ὑπογεγραμμένη
    "ῂ": "ῂ", // Lower      Ήτα         + Βαρεῖα + Ὑπογεγραμμένη
    "ῲ": "ῲ", // Lower      Ωμέγα       + Βαρεῖα + Ὑπογεγραμμένη

    "ᾶ": "ᾶ", // Lower      Άλφα        + Περισπωμένη
    "ῆ": "ῆ", // Lower      Ήτα         + Περισπωμένη
    "ῖ": "ῖ", // Lower      Ιώτα        + Περισπωμένη
    "ῦ": "ῦ", // Lower      Ύψιλον      + Περισπωμένη
    "ῶ": "ῶ", // Lower      Ωμέγα       + Περισπωμένη

    "ᾷ": "ᾷ", // Lower      Άλφα        + Περισπωμένη + Ὑπογεγραμμένη
    "ῇ": "ῇ", // Lower      Ήτα         + Περισπωμένη + Ὑπογεγραμμένη
    "ῷ": "ῷ", // Lower      Ωμέγα       + Περισπωμένη + Ὑπογεγραμμένη

    "ᾳ": "ᾳ", // Lower      Άλφα        + Ὑπογεγραμμένη
    "ῃ": "ῃ", // Lower      Ήτα         + Ὑπογεγραμμένη
    "ῳ": "ῳ", // Lower      Ωμέγα       + Ὑπογεγραμμένη
    "ᾼ": "ᾼ", // Capital    Άλφα        + Προσγεγραμμένη
    "ῌ": "ῌ", // Capital    Ήτα         + Προσγεγραμμένη
    "ῼ": "ῼ", // Capital    Ωμέγα       + Προσγεγραμμένη

    "ᾱ": "ᾱ", // Lower      Άλφα        + Μακρόν
    "ῑ": "ῑ", // Lower      Ιώτα        + Μακρόν
    "ῡ": "ῡ", // Lower      Ύψιλον      + Μακρόν
    "Ᾱ": "Ᾱ", // Capital    Άλφα        + Μακρόν
    "Ῑ": "Ῑ", // Capital    Ιώτα        + Μακρόν
    "Ῡ": "Ῡ", // Capital    Ύψιλον      + Μακρόν

    "ᾰ": "ᾰ", // Lower      Άλφα        + Βραχύ
    "ῐ": "ῐ", // Lower      Ιώτα        + Βραχύ
    "ῠ": "ῠ", // Lower      Ύψιλον      + Βραχύ
    "Ᾰ": "Ᾰ", // Capital    Άλφα        + Βραχύ
    "Ῐ": "Ῐ", // Capital    Ιώτα        + Βραχύ
    "Ῠ": "Ῠ", // Capital    Ύψιλον      + Βραχύ
};
Object.freeze(COMBINING_CLUSTER_TO_BAKED_POINT);

export function Combining_Cluster_To_Baked_Point(
    combining_cluster: string,
):
    string | null
{
    return COMBINING_CLUSTER_TO_BAKED_POINT[combining_cluster];
}

const BAKED_POINT_TO_COMBINING_CLUSTER: { [baked_point: string]: string } = {
    "ἀ": "ἀ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα
    "ἐ": "ἐ", // Lower      Έψιλον      + Ψιλὸν Πνεῦμα
    "ἠ": "ἠ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα
    "ἰ": "ἰ", // Lower      Ιώτα        + Ψιλὸν Πνεῦμα
    "ὀ": "ὀ", // Lower      Όμικρον     + Ψιλὸν Πνεῦμα
    "ῤ": "ῤ", // Lower      Ρώ          + Ψιλὸν Πνεῦμα
    "ὐ": "ὐ", // Lower      Ύψιλον      + Ψιλὸν Πνεῦμα
    "ὠ": "ὠ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα
    "Ἀ": "Ἀ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα
    "Ἐ": "Ἐ", // Capital    Έψιλον      + Ψιλὸν Πνεῦμα
    "Ἠ": "Ἠ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα
    "Ἰ": "Ἰ", // Capital    Ιώτα        + Ψιλὸν Πνεῦμα
    "Ὀ": "Ὀ", // Capital    Όμικρον     + Ψιλὸν Πνεῦμα
    "Ὠ": "Ὠ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα

    "ἄ": "ἄ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Όξεῖα
    "ἔ": "ἔ", // Lower      Έψιλον      + Ψιλὸν Πνεῦμα + Όξεῖα
    "ἤ": "ἤ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Όξεῖα
    "ἴ": "ἴ", // Lower      Ιώτα        + Ψιλὸν Πνεῦμα + Όξεῖα
    "ὄ": "ὄ", // Lower      Όμικρον     + Ψιλὸν Πνεῦμα + Όξεῖα
    "ὔ": "ὔ", // Lower      Ύψιλον      + Ψιλὸν Πνεῦμα + Όξεῖα
    "ὤ": "ὤ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ἄ": "Ἄ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ἔ": "Ἔ", // Capital    Έψιλον      + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ἤ": "Ἤ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ἴ": "Ἴ", // Capital    Ιώτα        + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ὄ": "Ὄ", // Capital    Όμικρον     + Ψιλὸν Πνεῦμα + Όξεῖα
    "Ὤ": "Ὤ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Όξεῖα

    "ᾄ": "ᾄ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾔ": "ᾔ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾤ": "ᾤ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾌ": "ᾌ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Όξεῖα + Προσγεγραμμένη
    "ᾜ": "ᾜ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Όξεῖα + Προσγεγραμμένη
    "ᾬ": "ᾬ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Όξεῖα + Προσγεγραμμένη

    "ἂ": "ἂ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ἒ": "ἒ", // Lower      Έψιλον      + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ἢ": "ἢ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ἲ": "ἲ", // Lower      Ιώτα        + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ὂ": "ὂ", // Lower      Όμικρον     + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ὒ": "ὒ", // Lower      Ύψιλον      + Ψιλὸν Πνεῦμα + Βαρεῖα
    "ὢ": "ὢ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ἂ": "Ἂ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ἒ": "Ἒ", // Capital    Έψιλον      + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ἢ": "Ἢ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ἲ": "Ἲ", // Capital    Ιώτα        + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ὂ": "Ὂ", // Capital    Όμικρον     + Ψιλὸν Πνεῦμα + Βαρεῖα
    "Ὢ": "Ὢ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Βαρεῖα

    "ᾂ": "ᾂ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾒ": "ᾒ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾢ": "ᾢ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾊ": "ᾊ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Βαρεῖα + Προσγεγραμμένη
    "ᾚ": "ᾚ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Βαρεῖα + Προσγεγραμμένη
    "ᾪ": "ᾪ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Βαρεῖα + Προσγεγραμμένη

    "ἆ": "ἆ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Περισπωμένη
    "ἦ": "ἦ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Περισπωμένη
    "ἶ": "ἶ", // Lower      Ιώτα        + Ψιλὸν Πνεῦμα + Περισπωμένη
    "ὖ": "ὖ", // Lower      Ύψιλον      + Ψιλὸν Πνεῦμα + Περισπωμένη
    "ὦ": "ὦ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Περισπωμένη
    "Ἆ": "Ἆ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Περισπωμένη
    "Ἦ": "Ἦ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Περισπωμένη
    "Ἶ": "Ἶ", // Capital    Ιώτα        + Ψιλὸν Πνεῦμα + Περισπωμένη
    "Ὦ": "Ὦ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Περισπωμένη

    "ᾆ": "ᾆ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾖ": "ᾖ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾦ": "ᾦ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾎ": "ᾎ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Περισπωμένη + Προσγεγραμμένη
    "ᾞ": "ᾞ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Περισπωμένη + Προσγεγραμμένη
    "ᾮ": "ᾮ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Περισπωμένη + Προσγεγραμμένη

    "ᾀ": "ᾀ", // Lower      Άλφα        + Ψιλὸν Πνεῦμα + Ὑπογεγραμμένη
    "ᾐ": "ᾐ", // Lower      Ήτα         + Ψιλὸν Πνεῦμα + Ὑπογεγραμμένη
    "ᾠ": "ᾠ", // Lower      Ωμέγα       + Ψιλὸν Πνεῦμα + Ὑπογεγραμμένη
    "ᾈ": "ᾈ", // Capital    Άλφα        + Ψιλὸν Πνεῦμα + Προσγεγραμμένη
    "ᾘ": "ᾘ", // Capital    Ήτα         + Ψιλὸν Πνεῦμα + Προσγεγραμμένη
    "ᾨ": "ᾨ", // Capital    Ωμέγα       + Ψιλὸν Πνεῦμα + Προσγεγραμμένη

    "ἁ": "ἁ", // Lower      Άλφα        + Δασὺ Πνεῦμα
    "ἑ": "ἑ", // Lower      Έψιλον      + Δασὺ Πνεῦμα
    "ἡ": "ἡ", // Lower      Ήτα         + Δασὺ Πνεῦμα
    "ἱ": "ἱ", // Lower      Ιώτα        + Δασὺ Πνεῦμα
    "ὁ": "ὁ", // Lower      Όμικρον     + Δασὺ Πνεῦμα
    "ῥ": "ῥ", // Lower      Ρώ          + Δασὺ Πνεῦμα
    "ὑ": "ὑ", // Lower      Ύψιλον      + Δασὺ Πνεῦμα
    "ὡ": "ὡ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα
    "Ἁ": "Ἁ", // Capital    Άλφα        + Δασὺ Πνεῦμα
    "Ἑ": "Ἑ", // Capital    Έψιλον      + Δασὺ Πνεῦμα
    "Ἡ": "Ἡ", // Capital    Ήτα         + Δασὺ Πνεῦμα
    "Ἱ": "Ἱ", // Capital    Ιώτα        + Δασὺ Πνεῦμα
    "Ὁ": "Ὁ", // Capital    Όμικρον     + Δασὺ Πνεῦμα
    "Ῥ": "Ῥ", // Capital    Ρώ          + Δασὺ Πνεῦμα
    "Ὑ": "Ὑ", // Capital    Ύψιλον      + Δασὺ Πνεῦμα
    "Ὡ": "Ὡ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα

    "ἅ": "ἅ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Όξεῖα
    "ἕ": "ἕ", // Lower      Έψιλον      + Δασὺ Πνεῦμα + Όξεῖα
    "ἥ": "ἥ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Όξεῖα
    "ἵ": "ἵ", // Lower      Ιώτα        + Δασὺ Πνεῦμα + Όξεῖα
    "ὅ": "ὅ", // Lower      Όμικρον     + Δασὺ Πνεῦμα + Όξεῖα
    "ὕ": "ὕ", // Lower      Ύψιλον      + Δασὺ Πνεῦμα + Όξεῖα
    "ὥ": "ὥ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Όξεῖα
    "Ἅ": "Ἅ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Όξεῖα
    "Ἕ": "Ἕ", // Capital    Έψιλον      + Δασὺ Πνεῦμα + Όξεῖα
    "Ἥ": "Ἥ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Όξεῖα
    "Ἵ": "Ἵ", // Capital    Ιώτα        + Δασὺ Πνεῦμα + Όξεῖα
    "Ὅ": "Ὅ", // Capital    Όμικρον     + Δασὺ Πνεῦμα + Όξεῖα
    "Ὕ": "Ὕ", // Capital    Ύψιλον      + Δασὺ Πνεῦμα + Όξεῖα
    "Ὥ": "Ὥ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Όξεῖα

    "ᾅ": "ᾅ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾕ": "ᾕ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾥ": "ᾥ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Όξεῖα + Ὑπογεγραμμένη
    "ᾍ": "ᾍ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Όξεῖα + Προσγεγραμμένη
    "ᾝ": "ᾝ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Όξεῖα + Προσγεγραμμένη
    "ᾭ": "ᾭ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Όξεῖα + Προσγεγραμμένη

    "ἃ": "ἃ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Βαρεῖα
    "ἓ": "ἓ", // Lower      Έψιλον      + Δασὺ Πνεῦμα + Βαρεῖα
    "ἣ": "ἣ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Βαρεῖα
    "ἳ": "ἳ", // Lower      Ιώτα        + Δασὺ Πνεῦμα + Βαρεῖα
    "ὃ": "ὃ", // Lower      Όμικρον     + Δασὺ Πνεῦμα + Βαρεῖα
    "ὓ": "ὓ", // Lower      Ύψιλον      + Δασὺ Πνεῦμα + Βαρεῖα
    "ὣ": "ὣ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Βαρεῖα
    "Ἃ": "Ἃ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Βαρεῖα
    "Ἓ": "Ἓ", // Capital    Έψιλον      + Δασὺ Πνεῦμα + Βαρεῖα
    "Ἣ": "Ἣ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Βαρεῖα
    "Ἳ": "Ἳ", // Capital    Ιώτα        + Δασὺ Πνεῦμα + Βαρεῖα
    "Ὃ": "Ὃ", // Capital    Όμικρον     + Δασὺ Πνεῦμα + Βαρεῖα
    "Ὓ": "Ὓ", // Capital    Ύψιλον      + Δασὺ Πνεῦμα + Βαρεῖα
    "Ὣ": "Ὣ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Βαρεῖα

    "ᾃ": "ᾃ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾓ": "ᾓ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾣ": "ᾣ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Βαρεῖα + Ὑπογεγραμμένη
    "ᾋ": "ᾋ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Βαρεῖα + Προσγεγραμμένη
    "ᾛ": "ᾛ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Βαρεῖα + Προσγεγραμμένη
    "ᾫ": "ᾫ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Βαρεῖα + Προσγεγραμμένη

    "ἇ": "ἇ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Περισπωμένη
    "ἧ": "ἧ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Περισπωμένη
    "ἷ": "ἷ", // Lower      Ιώτα        + Δασὺ Πνεῦμα + Περισπωμένη
    "ὗ": "ὗ", // Lower      Ύψιλον      + Δασὺ Πνεῦμα + Περισπωμένη
    "ὧ": "ὧ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Περισπωμένη
    "Ἇ": "Ἇ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Περισπωμένη
    "Ἧ": "Ἧ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Περισπωμένη
    "Ἷ": "Ἷ", // Capital    Ιώτα        + Δασὺ Πνεῦμα + Περισπωμένη
    "Ὗ": "Ὗ", // Capital    Ύψιλον      + Δασὺ Πνεῦμα + Περισπωμένη
    "Ὧ": "Ὧ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Περισπωμένη

    "ᾇ": "ᾇ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾗ": "ᾗ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾧ": "ᾧ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Περισπωμένη + Ὑπογεγραμμένη
    "ᾏ": "ᾏ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Περισπωμένη + Προσγεγραμμένη
    "ᾟ": "ᾟ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Περισπωμένη + Προσγεγραμμένη
    "ᾯ": "ᾯ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Περισπωμένη + Προσγεγραμμένη

    "ᾁ": "ᾁ", // Lower      Άλφα        + Δασὺ Πνεῦμα + Ὑπογεγραμμένη
    "ᾑ": "ᾑ", // Lower      Ήτα         + Δασὺ Πνεῦμα + Ὑπογεγραμμένη
    "ᾡ": "ᾡ", // Lower      Ωμέγα       + Δασὺ Πνεῦμα + Ὑπογεγραμμένη
    "ᾉ": "ᾉ", // Capital    Άλφα        + Δασὺ Πνεῦμα + Προσγεγραμμένη
    "ᾙ": "ᾙ", // Capital    Ήτα         + Δασὺ Πνεῦμα + Προσγεγραμμένη
    "ᾩ": "ᾩ", // Capital    Ωμέγα       + Δασὺ Πνεῦμα + Προσγεγραμμένη

    "ϊ": "ϊ", // Lower      Ιώτα        + Διαλυτικά
    "ϋ": "ϋ", // Lower      Ύψιλον      + Διαλυτικά
    "Ϊ": "Ϊ", // Capital    Ιώτα        + Διαλυτικά
    "Ϋ": "Ϋ", // Capital    Ύψιλον      + Διαλυτικά

    "ΐ": "ΐ", // Lower      Ιώτα        + Διαλυτικά + Όξεῖα
    "ΰ": "ΰ", // Lower      Ύψιλον      + Διαλυτικά + Όξεῖα

    "ῒ": "ῒ", // Lower      Ιώτα        + Διαλυτικά + Βαρεῖα
    "ῢ": "ῢ", // Lower      Ύψιλον      + Διαλυτικά + Βαρεῖα

    "ῗ": "ῗ", // Lower      Ιώτα        + Διαλυτικά + Περισπωμένη
    "ῧ": "ῧ", // Lower      Ύψιλον      + Διαλυτικά + Περισπωμένη

    "ά": "ά", // Lower      Άλφα        + Όξεῖα
    "έ": "έ", // Lower      Έψιλον      + Όξεῖα
    "ή": "ή", // Lower      Ήτα         + Όξεῖα
    "ί": "ί", // Lower      Ιώτα        + Όξεῖα
    "ό": "ό", // Lower      Όμικρον     + Όξεῖα
    "ύ": "ύ", // Lower      Ύψιλον      + Όξεῖα
    "ώ": "ώ", // Lower      Ωμέγα       + Όξεῖα
    "Ά": "Ά", // Capital    Άλφα        + Όξεῖα
    "Έ": "Έ", // Capital    Έψιλον      + Όξεῖα
    "Ή": "Ή", // Capital    Ήτα         + Όξεῖα
    "Ί": "Ί", // Capital    Ιώτα        + Όξεῖα
    "Ό": "Ό", // Capital    Όμικρον     + Όξεῖα
    "Ύ": "Ύ", // Capital    Ύψιλον      + Όξεῖα
    "Ώ": "Ώ", // Capital    Ωμέγα       + Όξεῖα

    "ᾴ": "ᾴ", // Lower      Άλφα        + Όξεῖα + Ὑπογεγραμμένη
    "ῄ": "ῄ", // Lower      Ήτα         + Όξεῖα + Ὑπογεγραμμένη
    "ῴ": "ῴ", // Lower      Ωμέγα       + Όξεῖα + Ὑπογεγραμμένη

    "ὰ": "ὰ", // Lower      Άλφα        + Βαρεῖα
    "ὲ": "ὲ", // Lower      Έψιλον      + Βαρεῖα
    "ὴ": "ὴ", // Lower      Ήτα         + Βαρεῖα
    "ὶ": "ὶ", // Lower      Ιώτα        + Βαρεῖα
    "ὸ": "ὸ", // Lower      Όμικρον     + Βαρεῖα
    "ὺ": "ὺ", // Lower      Ύψιλον      + Βαρεῖα
    "ὼ": "ὼ", // Lower      Ωμέγα       + Βαρεῖα
    "Ὰ": "Ὰ", // Capital    Άλφα        + Βαρεῖα
    "Ὲ": "Ὲ", // Capital    Έψιλον      + Βαρεῖα
    "Ὴ": "Ὴ", // Capital    Ήτα         + Βαρεῖα
    "Ὶ": "Ὶ", // Capital    Ιώτα        + Βαρεῖα
    "Ὸ": "Ὸ", // Capital    Όμικρον     + Βαρεῖα
    "Ὺ": "Ὺ", // Capital    Ύψιλον      + Βαρεῖα
    "Ὼ": "Ὼ", // Capital    Ωμέγα       + Βαρεῖα

    "ᾲ": "ᾲ", // Lower      Άλφα        + Βαρεῖα + Ὑπογεγραμμένη
    "ῂ": "ῂ", // Lower      Ήτα         + Βαρεῖα + Ὑπογεγραμμένη
    "ῲ": "ῲ", // Lower      Ωμέγα       + Βαρεῖα + Ὑπογεγραμμένη

    "ᾶ": "ᾶ", // Lower      Άλφα        + Περισπωμένη
    "ῆ": "ῆ", // Lower      Ήτα         + Περισπωμένη
    "ῖ": "ῖ", // Lower      Ιώτα        + Περισπωμένη
    "ῦ": "ῦ", // Lower      Ύψιλον      + Περισπωμένη
    "ῶ": "ῶ", // Lower      Ωμέγα       + Περισπωμένη

    "ᾷ": "ᾷ", // Lower      Άλφα        + Περισπωμένη + Ὑπογεγραμμένη
    "ῇ": "ῇ", // Lower      Ήτα         + Περισπωμένη + Ὑπογεγραμμένη
    "ῷ": "ῷ", // Lower      Ωμέγα       + Περισπωμένη + Ὑπογεγραμμένη

    "ᾳ": "ᾳ", // Lower      Άλφα        + Ὑπογεγραμμένη
    "ῃ": "ῃ", // Lower      Ήτα         + Ὑπογεγραμμένη
    "ῳ": "ῳ", // Lower      Ωμέγα       + Ὑπογεγραμμένη
    "ᾼ": "ᾼ", // Capital    Άλφα        + Προσγεγραμμένη
    "ῌ": "ῌ", // Capital    Ήτα         + Προσγεγραμμένη
    "ῼ": "ῼ", // Capital    Ωμέγα       + Προσγεγραμμένη

    "ᾱ": "ᾱ", // Lower      Άλφα        + Μακρόν
    "ῑ": "ῑ", // Lower      Ιώτα        + Μακρόν
    "ῡ": "ῡ", // Lower      Ύψιλον      + Μακρόν
    "Ᾱ": "Ᾱ", // Capital    Άλφα        + Μακρόν
    "Ῑ": "Ῑ", // Capital    Ιώτα        + Μακρόν
    "Ῡ": "Ῡ", // Capital    Ύψιλον      + Μακρόν

    "ᾰ": "ᾰ", // Lower      Άλφα        + Βραχύ
    "ῐ": "ῐ", // Lower      Ιώτα        + Βραχύ
    "ῠ": "ῠ", // Lower      Ύψιλον      + Βραχύ
    "Ᾰ": "Ᾰ", // Capital    Άλφα        + Βραχύ
    "Ῐ": "Ῐ", // Capital    Ιώτα        + Βραχύ
    "Ῠ": "Ῠ", // Capital    Ύψιλον      + Βραχύ
};
Object.freeze(BAKED_POINT_TO_COMBINING_CLUSTER);

export function Baked_Point_To_Combining_Cluster(
    baked_point: string,
):
    string | null
{
    return BAKED_POINT_TO_COMBINING_CLUSTER[baked_point];
}

export function Normalize_With_Baked_Points(
    text: string,
):
    string
{
    let result: string = ``;

    for (
        let iterator: Unicode.Iterator = new Unicode.Iterator(
            {
                text: text,
            },
        );
        !iterator.Is_At_End();
    ) {
        const point: string = iterator.Point();
        const unit_index: Index = iterator.Index();
        if (Is_Primary_Combining_Point(point)) {
            const primary_combining_point: string = point;
            const secondary_combining_points: Array<string> = [];
            const precedence_counts: { [precedence: string]: Count } = {};
            precedence_counts[Secondary_Combining_Point_Precedence.UNARY] = 0;
            precedence_counts[Secondary_Combining_Point_Precedence.PRIMARY] = 0;
            precedence_counts[Secondary_Combining_Point_Precedence.SECONDARY] = 0;
            precedence_counts[Secondary_Combining_Point_Precedence.TERTIARY] = 0;

            iterator = iterator.Next();
            while (
                !iterator.Is_At_End() &&
                Is_Secondary_Combining_Point(iterator.Point())
            ) {
                const point: string = iterator.Point();
                secondary_combining_points.push(point);
                precedence_counts[Some_Secondary_Combining_Point_Precedence(point)] += 1;
                iterator = iterator.Next();
            }

            if (secondary_combining_points.length > 0) {
                let has_invalid_unary_secondary_combining_point: boolean = false;

                secondary_combining_points.sort(
                    function (
                        a: string,
                        b: string,
                    ):
                        Integer
                    {
                        const a_precedence: Secondary_Combining_Point_Precedence =
                            Some_Secondary_Combining_Point_Precedence(a);
                        const b_precedence: Secondary_Combining_Point_Precedence | null =
                            Some_Secondary_Combining_Point_Precedence(b);

                        if (
                            a_precedence == Secondary_Combining_Point_Precedence.UNARY ||
                            b_precedence == Secondary_Combining_Point_Precedence.UNARY
                        ) {
                            has_invalid_unary_secondary_combining_point = true;
                        }

                        return (a_precedence as Integer) - (b_precedence as Integer);
                    },
                );

                if (has_invalid_unary_secondary_combining_point) {
                    Utils.Assert(
                        false,
                        `
                            invalid secondary combining point with unary precedence
                            at: ${unit_index}
                            primary: ${primary_combining_point}
                            secondary: ${secondary_combining_points}
                            context: ${text.slice(unit_index, unit_index + 100)}
                            from: ${text}
                        `,
                    );

                    return ``;
                } else if (precedence_counts[Secondary_Combining_Point_Precedence.PRIMARY] > 1) {
                    Utils.Assert(
                        false,
                        `
                            too many secondary combining points with primary precedence
                            at: ${unit_index}
                            primary: ${primary_combining_point}
                            secondary: ${secondary_combining_points}
                            context: ${text.slice(unit_index, unit_index + 100)}
                            from: ${text}
                        `,
                    );

                    return ``;
                } else if (precedence_counts[Secondary_Combining_Point_Precedence.SECONDARY] > 1) {
                    Utils.Assert(
                        false,
                        `
                            too many secondary combining points with secondary precedence
                            at: ${unit_index}
                            primary: ${primary_combining_point}
                            secondary: ${secondary_combining_points}
                            context: ${text.slice(unit_index, unit_index + 100)}
                            from: ${text}
                        `,
                    );

                    return ``;
                } else if (precedence_counts[Secondary_Combining_Point_Precedence.TERTIARY] > 1) {
                    Utils.Assert(
                        false,
                        `
                            too many secondary combining points with tertiary precedence
                            at: ${unit_index}
                            primary: ${primary_combining_point}
                            secondary: ${secondary_combining_points}
                            context: ${text.slice(unit_index, unit_index + 100)}
                            from: ${text}
                        `,
                    );

                    return ``;
                } else {
                    const combining_cluster: string =
                        `${primary_combining_point}${secondary_combining_points.join(``)}`;
                    const baked_point: string | null = Combining_Cluster_To_Baked_Point(
                        combining_cluster,
                    );
                    if (baked_point != null) {
                        result += baked_point;
                    } else {
                        console.log(
                            `
                                warning: unknown combining cluster
                                at: ${unit_index}
                                primary: ${primary_combining_point}
                                secondary: ${secondary_combining_points}
                                context: ${text.slice(unit_index, unit_index + 100)}
                                from: ${text}
                            `,
                        );

                        result += combining_cluster;
                    }
                }
            } else {
                result += point;
            }
        } else {
            result += point;

            iterator = iterator.Next();
        }
    }

    return result;
}

export function Normalize_With_Combined_Points(
    text: string,
):
    string
{
    let result: string = ``;

    for (
        let iterator: Unicode.Iterator = new Unicode.Iterator(
            {
                text: text,
            },
        );
        !iterator.Is_At_End();
        iterator = iterator.Next()
    ) {
        const point: string = iterator.Point();
        const combining_cluster: string | null = Baked_Point_To_Combining_Cluster(point);
        if (combining_cluster != null) {
            result += combining_cluster;
        } else {
            result += point;
        }
    }

    return result;
}
