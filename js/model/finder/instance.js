import*as Entity from"../entity.js";import*as Data from"../data.js";import*as Search from"../search.js";export class Instance extends Entity.Instance{constructor({}){super(),this.selector=new Data.Selector.Instance({}),this.search=new Search.Instance,this.search_expression=null,this.search_help=null,this.search_results=null,this.Add_Dependencies([Data.Singleton(),this.search])}Selector(){return this.selector}Search(){return this.search}Maybe_Search_Expression(){return this.search_expression}Maybe_Search_Help(){return this.search_help}Maybe_Search_Results(){return null!=this.search_results?Array.from(this.search_results):null}Title(){return"Finder"}Short_Title(){return"Finder"}}