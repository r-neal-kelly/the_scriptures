import*as Part from"./instance.js";import{Type}from"./type.js";import{Status}from"./status.js";export class Instance extends Part.Instance{constructor({index:t,value:s,style:e,language:a}){super({part_type:Type.POINT,index:t,value:s,status:Status.UNKNOWN,style:e,language:a})}}