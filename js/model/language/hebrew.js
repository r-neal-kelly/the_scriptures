import*as Unicode from"../../unicode.js";import*as Font from"../font.js";import{Name}from"./name.js";import{Direction}from"./direction.js";import*as Language from"./instance.js";import*as Font_Adaptor from"./font_adaptor.js";export class Instance extends Language.Instance{static Remove_Combining_Points(n){let e="";for(let t=new Unicode.Iterator({text:n});!t.Is_At_End();t=t.Next()){const n=t.Point(),o=n.codePointAt(0);(o<1425||o>1455)&&(o<1456||o>1469)&&1471!==o&&1473!==o&&1474!==o&&1476!==o&&1477!==o&&1479!==o&&64286!==o&&(e+=n)}return e}constructor(){super({name:Name.HEBREW,direction:Direction.RIGHT_TO_LEFT,default_font_name:Font.Name.EZRA_SR,font_adaptors:[new Font_Adaptor.Instance({font_name:Font.Name.EZRA,short_font_name:Font.Name.EZRA,styles:{"font-size":"1.125em","line-height":"1.45"}}),new Font_Adaptor.Instance({font_name:Font.Name.EZRA_SR,short_font_name:Font.Name.EZRA_SR,styles:{"font-size":"1.125em","line-height":"1.45"}}),new Font_Adaptor.Instance({font_name:Font.Name.NEAL_PALEO_HEBREW,short_font_name:Font.Name.NEAL_PALEO_HEBREW,styles:{"font-size":"1.125em","line-height":"1.45","letter-spacing":"-0.07em","word-spacing":"0.1em"},treater:function(n){return Instance.Remove_Combining_Points(n)}}),new Font_Adaptor.Instance({font_name:Font.Name.ANCIENT_SEMETIC_HEBREW_ANCIENT,short_font_name:"AS - Ancient",styles:{"font-size":"1.125em","line-height":"1.45","word-spacing":"0.1em"},treater:function(n){return Instance.Remove_Combining_Points(n)}}),new Font_Adaptor.Instance({font_name:Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_GEZER,short_font_name:"AS - Paleo Gezer",styles:{"font-size":"1.125em","line-height":"1.45","word-spacing":"0.1em"},treater:function(n){return Instance.Remove_Combining_Points(n)}}),new Font_Adaptor.Instance({font_name:Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_LACHISH,short_font_name:"AS - Paleo Lachish",styles:{"font-size":"1.125em","line-height":"1.45","word-spacing":"0.1em"},treater:function(n){return Instance.Remove_Combining_Points(n)}}),new Font_Adaptor.Instance({font_name:Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_MESHA,short_font_name:"AS - Paleo Mesha",styles:{"font-size":"1.125em","line-height":"1.45","word-spacing":"0.1em"},treater:function(n){return Instance.Remove_Combining_Points(n)}}),new Font_Adaptor.Instance({font_name:Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_QUMRAN,short_font_name:"AS - Paleo Qumran",styles:{"font-size":"1.125em","line-height":"1.45","word-spacing":"0.1em"},treater:function(n){return Instance.Remove_Combining_Points(n)}}),new Font_Adaptor.Instance({font_name:Font.Name.ANCIENT_SEMETIC_HEBREW_PALEO_SILOAM,short_font_name:"AS - Paleo Siloam",styles:{"font-size":"1.125em","line-height":"1.45","word-spacing":"0.1em"},treater:function(n){return Instance.Remove_Combining_Points(n)}})]})}}