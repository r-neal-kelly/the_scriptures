import*as Utils from"./utils.js";export class Instance{constructor({capacity:t,initial_unit:s=null}){0,this.buffer=[],this.first_index=0,this.count=0,this.initial_unit=s;for(let i=0,e=t;i<e;i+=1)this.buffer.push(s)}Count(){return this.count}Length(){return this.count}Capacity(){return this.buffer.length}Is_Empty(){return this.count<1}Is_Full(){return this.count===this.buffer.length}Has_Units(){return this.count>0}Has_Space(){return this.count<this.buffer.length}Add_Front(t){0,this.first_index>0?this.first_index-=1:this.first_index=this.buffer.length-1,this.buffer[this.first_index]=t,this.count+=1}Remove_Front(){0;const t=this.buffer[this.first_index];return this.buffer[this.first_index]=this.initial_unit,this.first_index+=1,this.first_index===this.buffer.length&&(this.first_index=0),this.count-=1,t}Add_Back(t){0;let s=this.first_index+this.count;s>=this.buffer.length&&(s-=this.buffer.length),this.buffer[s]=t,this.count+=1}Remove_Back(){0;let t=this.first_index+this.count-1;t>=this.buffer.length&&(t-=this.buffer.length);const s=this.buffer[t];return this.buffer[t]=this.initial_unit,this.count-=1,s}Add_At(t,s){0,0,0;let i;if(t<Math.floor(this.count/2)){this.first_index-=1,this.first_index<0&&(this.first_index+=this.buffer.length),i=this.first_index;for(let s=t;s>0;s-=1){let t=i;i+=1,i>=this.buffer.length&&(i-=this.buffer.length),this.buffer[t]=this.buffer[i]}}else{i=this.first_index+this.count,i>=this.buffer.length&&(i-=this.buffer.length);for(let s=this.count-t;s>0;s-=1){let t=i;i-=1,i<0&&(i+=this.buffer.length),this.buffer[t]=this.buffer[i]}}this.buffer[i]=s,this.count+=1}Remove_At(t){0,0,0;const s=Math.floor(this.count/2);let i=this.first_index+t;i>=this.buffer.length&&(i-=this.buffer.length);const e=this.buffer[i];if(t<s){for(let s=t;s>0;s-=1){let t=i;i-=1,i<0&&(i+=this.buffer.length),this.buffer[t]=this.buffer[i]}this.first_index+=1,this.first_index>=this.buffer.length&&(this.first_index-=this.buffer.length)}else for(let s=this.count-1-t;s>0;s-=1){let t=i;i+=1,i>=this.buffer.length&&(i-=this.buffer.length),this.buffer[t]=this.buffer[i]}return this.buffer[i]=this.initial_unit,this.count-=1,e}At(t){0,0;let s=this.first_index+t;return s>=this.buffer.length&&(s-=this.buffer.length),this.buffer[s]}Index_Of(t){for(let s=0,i=this.count;s<i;s+=1)if(this.At(s)===t)return s;return null}Has(t){return null!=this.Index_Of(t)}}function Test(){{const t=new Instance({capacity:6,initial_unit:-1});0,t.Add_At(0,3),t.Add_At(0,2),t.Add_At(0,1),0,0,0,0,t.Add_At(2,-1),0,0,0,0,0,t.Add_At(t.Count(),-1),0,0,0,0,0,0,t.Add_At(1,-1),0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}Utils.Print("Circle_Buffer passed all tests")}