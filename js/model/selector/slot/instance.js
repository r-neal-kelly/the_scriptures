import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import{Type}from"./type.js";import*as Item from"./item.js";export class Instance extends Entity.Instance{constructor({filter:t,index:e,type:s,item_names:i}){super(),this.filter=t,this.index=e,this.type=s,s===Type.BOOKS?this.name="Books":s===Type.LANGUAGES?this.name="Languages":s===Type.VERSIONS?this.name="Versions":s===Type.FILES?this.name="Files":( this.name=""),this.items=[],this.selected_item=null;for(let t=0,e=i.length;t<e;t+=1)this.items.push(new Item.Instance({slot:this,index:t,name:i[t]}))}Filter(){return this.filter}Index(){return this.index}Type(){return this.type}Name(){return this.name}Has_Item(t){return this.items.includes(t)}Item_Count(){return this.items.length}Item_At_Index(t){return   this.items[t]}Maybe_Item_From_Name(t){for(let e=0,s=this.Item_Count();e<s;e+=1){const s=this.Item_At_Index(e);if(s.Name()===t)return s}return null}Item_From_Name(t){const e=this.Maybe_Item_From_Name(t);return  e}Items(){return Array.from(this.items)}Has_Selected_Item(){return null!=this.selected_item}Selected_Item(){return  this.selected_item}__Select_Item__({item:t}){ this.selected_item=t}Select_Item(t){this.Filter().__Select_Item__({slot:this,slot_item:t})}}