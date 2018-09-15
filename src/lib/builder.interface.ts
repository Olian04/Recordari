export const internal = Symbol('builder-internal');

export type _INode = {
  [internal]: IInternal;
}
export const hasInternal = (node: object): node is _INode => {
  return internal in node;
}

export enum NodeType {
  Base = 'Base',
  Number = 'Number',
  Max = 'Max',
  Min = 'Min',
  Exact = 'Exact',
  Length = 'Length',
  Each = 'Each',
  Contains = 'Contains',
  Like = 'Like',
  Array = 'Array',
  And = 'And',
  Or = 'Or',
  Not = 'Not',
  Any = 'Any',
  Boolean = 'Boolean',
  True =  'True',
  False = 'False',
  Modulo = 'Modulo',
  Either =  'Either',
}
export interface IInternal {
  type: NodeType;
  data: any[];
  children: IInternal[];
}
export interface INode { } // Used to refer to any Node
export interface INode_Void extends INode { }

export interface INode_Number extends INode {
  not: INode_Number;
  Whole: INode_Number;
  Natural: INode_Number;
  Min(value: number): INode_Number;
  Max(value: number): INode_Number;
  Mod(mod: number, result: number): INode_Number;
  Exact(value: number): INode_Number;
  Either(values: number[]): INode_Number;
  Between(valueA: number, valueB: number): INode_Number;
}
export interface INode_Array extends INode {
  Length: INode_Number;
  Each: INode_Base;
  Contains: INode_Base;
  Like(tuple_of_constraints: INode[]): INode_Void;
}
export interface INode_Boolean extends INode {
  True: INode_Void;
  False: INode_Void;
}
export interface INode_Base extends INode {
  Number: INode_Number;
  Array: INode_Array;
  Boolean: INode_Boolean;
  and(constraints: INode[]): INode_Void;
  or(constraints: INode[]): INode_Void;
  not: INode_Base;
  Any: INode_Void;
}
