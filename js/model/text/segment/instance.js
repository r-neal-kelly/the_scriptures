import*as Utils from"../../../utils.js";import{Type}from"./type.js";export class Instance{constructor({segment_type:t,index:s}){this.segment_type=t,this.index=s,this.items=[]}Segment_Type(){return this.segment_type}Index(){return this.index}Item_Count(){return this.items.length}Has_Item(t){return this.items.indexOf(t)>-1}Has_Item_Index(t){return t>-1&&t<this.items.length}Item(t){return 0,this.items[t]}Item_Index(t){const s=this.items.indexOf(t);return 0,s}Items(){return Array.from(this.items)}Try_Add_Item(t){const s=this.Segment_Type();if(s===Type.MICRO){if(0,0===this.items.length)return this.items.push(t),!0;{const s=t,e=this.items[this.items.length-1];return s.Is_Point()?e.Is_Point()?(this.items.push(s),!0):!e.Is_Letter()&&(e.Is_Marker()?!!/\S+/.test(e.Value())&&(this.items.push(s),!0):e.Is_Command()?(this.items.push(s),!0):(0,!1)):s.Is_Letter()?!e.Is_Point()&&(e.Is_Letter()?(this.items.push(s),!0):e.Is_Marker()?!!/\S+/.test(e.Value())&&(this.items.push(s),!0):e.Is_Command()?(this.items.push(s),!0):(0,!1)):s.Is_Marker()||s.Is_Command()?e.Is_Point()||e.Is_Letter()?(this.items.push(s),!0):e.Is_Marker()?!!/\S+/.test(e.Value())&&(this.items.push(s),!0):e.Is_Command()?(this.items.push(s),!0):(0,!1):(0,!1)}}if(s===Type.MACRO){if(0,0===this.items.length)return this.items.push(t),!0;{const s=this.items[this.items.length-1];if(t.Is_Part()){const e=t;if(e.Is_Point()){if(s.Is_Part()){const t=s;return t.Is_Point()?(this.items.push(e),!0):!t.Is_Word()&&(t.Is_Command()?(this.items.push(e),!0):(0,!1))}if(s.Is_Split()){return!!/\S+/.test(s.Value())&&(this.items.push(e),!0)}return 0,!1}if(e.Is_Word()){if(s.Is_Part()){const t=s;return!t.Is_Point()&&(!t.Is_Word()&&(t.Is_Command()?(this.items.push(e),!0):(0,!1)))}if(s.Is_Split()){return!!/\S+/.test(s.Value())&&(this.items.push(e),!0)}return 0,!1}if(e.Is_Command()){if(s.Is_Part()){const t=s;return t.Is_Point()||t.Is_Word()||t.Is_Command()?(this.items.push(e),!0):(0,!1)}if(s.Is_Split()){return!!/\S+/.test(s.Value())&&(this.items.push(e),!0)}return 0,!1}return 0,!1}if(t.Is_Split()){const e=t;if(s.Is_Part()){const t=s;return t.Is_Point()||t.Is_Word()||t.Is_Command()?(this.items.push(e),!0):(0,!1)}if(s.Is_Split()){return!!/\S+/.test(s.Value())&&(this.items.push(e),!0)}return 0,!1}return 0,!1}}return s===Type.MACRO_LEFT_TO_RIGHT||s===Type.MACRO_RIGHT_TO_LEFT?(0,this.items.push(t),!0):(0,!1)}Add_Item(t){const s=this.Try_Add_Item(t);0}Value(){let t="";for(const s of this.items)t+=s.Value();return t}}