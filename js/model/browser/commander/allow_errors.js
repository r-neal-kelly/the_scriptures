import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({commander:t,is_activated:e}){super(),this.commander=t,this.is_activated=e,this.Add_Dependencies([])}Commander(){return this.commander}Symbol(){return this.Is_Activated()?"Ꞩ":"✓"}Is_Activated(){return this.is_activated}Is_Deactivated(){return!this.Is_Activated()}Activate(){this.is_activated=!0}Deactivate(){this.is_activated=!1}Toggle(){this.Is_Activated()?this.Deactivate():this.Activate()}}