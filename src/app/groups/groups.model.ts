export interface groups {
    groupId?: string,
    groupName?: string,
    createdById?:string,
    privateChanel?: boolean,
    groupDescription?: string,
    groupImageUrl?:any,
    groupCategory?: any,
    isAdmin?: boolean;
    isMainAdmin?: boolean;
    memberType?: string;
    defaultGroup?: boolean;
    createdDateTime?:string;
    totalAdminsCount?:number;
    totalMembersCount?:number;
    admins?: Array<members> | null;
    members?: Array<members> | null;
}

export interface groupsActions {
    label: string;
    show: boolean;
    showTo: Array<string>;
}

export interface groupsListResponse {
    id?: string;
    name?: string;
    createdById?: string;
    createdDateTime?: any;
    defaultGroup?: boolean;
    groupImageUrl?:any,
    groupDescription?: string;
    groupCategory?: string;
    groupMemberType?: string;
    admins?: Array<members> | null;
    members?: Array<members> | null;
    groupSettings?: any;
    totalAdminsCount?:number;
    totalMembersCount?:number;
}

export interface members {
    groupId?: string;
    adminId?: string;
    createdDateTime?: string;
    createdById?: string;
    profileId?: string;
    profileName?: string;
    userId?: string;
    profileImageUrl?: string;
    isAdmin?: boolean;
    profileCoverImageUrl?: string;
    isMember? :boolean;
    isMainAdmin?:boolean;
    selectedRelationShipType?:relationShipType;
    invited?:boolean;
    connected?:boolean;
}

export interface relationShipType{
    id:any;
    description?:string;
}

export interface inviteeRelationnshipResp  {
    profileId: string;
    relatedProfileId:  string;
    firstName: string;
    lastName:  string;
    profileimageFile:  string;
    profileImageUrl?:string;
    coverimageFile:  string;
    profileCoverImageUrl?:string;
    relationshipType:  string;
    relationStatusId: any;
    invitationStatus:  string;
  }

export interface searchMember {
    profileId?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    profileCoverImageUrl?: string;
}

export interface invitedMembers {
    id: string; 

    groupid: string;

    profileid: string;
    
    name?: string;
    
    groupImageUrl?: string;

    profileName: string;

    profileImageUrl: string;

    invitetext: string;

    invitedbyprofileid?:string;

    invitedByProfileName?: string;

    invitedbyProfileImageUrl?: string;

    actionByAdminProfileid?:string; 

    status?: string;

    invitationSentTime?: any;

    invitationAdminActionTime?: any; 

    inviteeActionTime?: any; 
}

