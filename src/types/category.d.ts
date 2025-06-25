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

  export type GoalData = {
  getAllGoals: {
    data: GoalDataArr[];
    meta: {
      message: string;
      messageCode: string | null;
      statusCode: number;
      status: string;
      type: string;
      errors: any[];
      errorType: string | null;
      __typename: string;
    };
    __typename: string;
  };
};

export type GoalDataArr = {
  uuid: string;
  key?: string;
  emoji?: string | null;
  is_active?: boolean;
  translations?: Array<{ tr: string; lang_code: string; title: string; __typename?: string }>;
  created_at?: string;
  updated_at?: string;
  __typename?: string;
};
