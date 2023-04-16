import*as Utils from"../../utils.js";import{Boundary}from"./boundary.js";export var Type;!function(e){e[e.OPEN_GROUP=0]="OPEN_GROUP",e[e.CLOSE_GROUP=1]="CLOSE_GROUP",e[e.OPEN_SEQUENCE=2]="OPEN_SEQUENCE",e[e.CLOSE_SEQUENCE=3]="CLOSE_SEQUENCE",e[e.NOT=4]="NOT",e[e.CASE=5]="CASE",e[e.ALIGN=6]="ALIGN",e[e.META=7]="META",e[e.AND=8]="AND",e[e.XOR=9]="XOR",e[e.OR=10]="OR",e[e.TEXT=11]="TEXT"}(Type||(Type={}));export class Instance{constructor({type:e}){this.type=e}Type(){return this.type}}export class Operator extends Instance{}export class Open_Group extends Operator{constructor(){super({type:Type.OPEN_GROUP})}}export class Close_Group extends Operator{constructor(){super({type:Type.CLOSE_GROUP})}}export class Open_Sequence extends Operator{constructor(){super({type:Type.OPEN_SEQUENCE})}}export class Close_Sequence extends Operator{constructor(){super({type:Type.CLOSE_SEQUENCE})}}export class Not extends Operator{constructor(){super({type:Type.NOT})}}export class Case extends Operator{constructor(){super({type:Type.CASE})}}export class Align extends Operator{constructor(){super({type:Type.ALIGN})}}export class Meta extends Operator{constructor(){super({type:Type.META})}}export class And extends Operator{constructor(){super({type:Type.AND})}}export class Xor extends Operator{constructor(){super({type:Type.XOR})}}export class Or extends Operator{constructor(){super({type:Type.OR})}}export class Text extends Instance{constructor({part:e}){super({type:Type.TEXT}),this.part=e,this.boundary=null}Part(){return this.part}Boundary(){return Utils.Assert(null!=this.boundary,"boundary was not set on this token."),this.boundary}Set_Boundary(e){Utils.Assert(null==this.boundary,"boundary has already been set."),this.boundary=e}May_Precede_Implicit_Word_In_Sequence(){return this.Boundary()!=Boundary.ANY&&this.Boundary()!=Boundary.END&&this.Part().Is_Break()}May_Precede_Implicit_Break_In_Sequence(){return this.Boundary()!=Boundary.ANY&&this.Boundary()!=Boundary.END&&this.Part().Is_Word()}}