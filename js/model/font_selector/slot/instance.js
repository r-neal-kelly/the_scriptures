import*as Utils from"../../../utils.js";import{Type}from"./type.js";import*as Item from"./item.js";export class Instance{constructor({selector:e,index:t,type:s,item_names:i,selected_item_name:m=null}){this.selector=e,this.index=t,this.type=s,s===Type.LANGUAGES?this.name="Languages":s===Type.FONTS?this.name="Fonts":(0,this.name=""),this.items=[],this.selected_item=null;for(let e=0,t=i.length;e<t;e+=1){const t=i[e],s=new Item.Instance({slot:this,index:e,name:t});this.items.push(s),t===m&&(this.selected_item=s)}}Selector(){return this.selector}Index(){return this.index}Type(){return this.type}Name(){return this.name}Has_Item(e){return this.items.includes(e)}Item_Count(){return this.items.length}Item_At_Index(e){return 0,0,this.items[e]}Maybe_Item_From_Name(e){for(let t=0,s=this.Item_Count();t<s;t+=1){const s=this.Item_At_Index(t);if(s.Name()===e)return s}return null}Some_Item_From_Name(e){const t=this.Maybe_Item_From_Name(e);return 0,t}Items(){return Array.from(this.items)}Has_Selected_Item(){return null!=this.selected_item}Selected_Item(){return 0,this.selected_item}__Select_Item__({item:e}){0,this.selected_item=e}Select_Item(e){this.Selector().__Select_Item__({slot:this,slot_item:e})}}