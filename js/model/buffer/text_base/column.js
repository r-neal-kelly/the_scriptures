import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import{Default_Min_Counts}from"./default_min_counts.js";export class Instance extends Entity.Instance{constructor({line:t,index:s,text:n}){super(),this.line=t,this.index=s,this.text=n,this.rows=[],null==t?(0,0):(0,0)}Is_Blank(){return null==this.text}Buffer(){return 0,this.Line().Buffer()}Line(){return 0,this.line}Index(){return 0,this.index}Text(){return 0,this.text}Min_Row_Count(){return Default_Min_Counts.ROW}Row_Count(){return this.rows.length}Row_At(t){return 0,t<this.Row_Count()?this.rows[t]:this.Blank_Row()}Push_Row(t){0,this.rows.push(t)}Is_Marginal(){return 0,this.Text().Is_Marginal()}Is_Inter_Marginal(){return 0,this.Text().Is_Inter_Marginal()}Is_Interlinear(){return 0,this.Text().Is_Interlinear()}Is_Inter_Interlinear(){return 0,this.Text().Is_Inter_Interlinear()}Is_Fully_Tabular(){return 0,this.Text().Is_Tabular()}}