import*as Entity from"../../entity.js";import*as Open_Browser from"./open_browser.js";import*as Open_Finder from"./open_finder.js";export class Instance extends Entity.Instance{constructor({desktop:e}){super(),this.desktop=e,this.open_browser=new Open_Browser.Instance({menu:this}),this.open_finder=new Open_Finder.Instance({menu:this}),this.is_open=!1,this.Add_Dependencies([this.open_browser,this.open_finder])}Desktop(){return this.desktop}Open_Browser(){return this.open_browser}Open_Finder(){return this.open_finder}Is_Open(){return this.is_open}Is_Closed(){return!this.is_open}Open(){this.is_open=!0}Close(){this.is_open=!1}}