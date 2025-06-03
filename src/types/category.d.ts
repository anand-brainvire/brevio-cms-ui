
export type PaginationParams = {
    limit : number
    page : number
    sortBy : string
    sortOrder : string
    search : string
}
export type CategoryTreeDataArr={

    id:number,
    category_name:string
    parent_category:number
    parentData:{
        category_name:string
        id?:number

    }
}
export type DropdownOptionCategoryTree = {
    name: string | number;
    key:  string|number;
    parentId:number|string;
    parentName:number|string
  };
  export type TreeNode= {
    key: number;
    label: string;
    children?: TreeNode[];
  }
  
  export type TreeViewProps= {
    data1: TreeNode[];
  }
  export type TreeNodeProps= {
   
    key: number;
    label: string;
    icons?:IconType<TreeNode> | undefined;
    data?:string
    children?: TreeNodeProps[];
  }