import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Slot from"../slot.js";import*as Slot_Order from"./slot_order.js";export class Instance extends Entity.Instance{constructor({selector:e,slot_order:t,does_smart_item_selection:r}){super(),this.selector=e,this.is_toggled=!1,this.slot_orders=[],this.current_slot_order_index=Instance.slot_order_values.indexOf(t),this.does_smart_item_selection=r;for(let e=0,t=Instance.slot_order_values.length;e<t;e+=1)this.slot_orders.push(new Slot_Order.Instance({settings:this,index:e,value:Instance.slot_order_values[e],name:Instance.slot_order_names[e]}))}Selector(){return this.selector}Is_Toggled(){return this.is_toggled}Toggle(){this.is_toggled=!this.is_toggled}Toggle_Symbol(){return this.Is_Toggled()?"^":"v"}Slot_Orders(){return Array.from(this.slot_orders)}Slot_Order_Count(){return this.slot_orders.length}Slot_Order(e){return 0,this.slot_orders[e]}Current_Slot_Order(){return this.slot_orders[this.current_slot_order_index]}Current_Slot_Order_Index(){return this.current_slot_order_index}__Select_Current_Slot_Order_Index__(e){this.Selector().__Set_Slot_Order__(e)}__Set_Current_Slot_Order_Index__(e){this.current_slot_order_index=e}Does_Smart_Item_Selection(){return this.does_smart_item_selection}Set_Does_Smart_Item_Selection(e){this.does_smart_item_selection=e}}Instance.slot_order_values=[Slot.Order.LANGUAGES_VERSIONS_BOOKS,Slot.Order.LANGUAGES_BOOKS_VERSIONS,Slot.Order.VERSIONS_LANGUAGES_BOOKS,Slot.Order.VERSIONS_BOOKS_LANGUAGES,Slot.Order.BOOKS_LANGUAGES_VERSIONS,Slot.Order.BOOKS_VERSIONS_LANGUAGES],Instance.slot_order_names=["Languages | Versions | Books","Languages | Books | Versions","Versions | Languages | Books","Versions | Books | Languages","Books | Languages | Versions","Books | Versions | Languages"];