export interface post {
    id?: string;
    profileid: string;
    profileName?: string;
    profileImageUrl?:string;
    groupid?: string;
    posttext?: string;
    createddatetime?:string;
    postCommentsCount?:any;
    resources?: Array<any>;
    postTextOnly?:boolean;
    postCategory?:string;
    postLikedByMe?: boolean;
    postLikesCount?: number;
}

export interface comment {
    id?: string;
    commentId: string;
    profileid: string;
    profileName?: string;
    profileImageUrl?:string;
    commenttext?: string;
    createddatetime?:string;
    resources:Array<resourse>;
    commentTextOnly?:boolean; 
    url?:any;
}
export interface resourse {
    fileType: string;
    url:string;
}



