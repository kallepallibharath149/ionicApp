export interface IprofileDetails {
  profileId?: string;
  profileName?: string;
  profileImageUrl?: string;
  profileCoverImageUrl?: string;
  value?: IprofileId;
}

export interface IprofileId {
  id?: any;
}

export interface loggedInUserDetails {
  firstName: string;
  lastName: string;
  profileCoverImageUrl: string;
  profileId: string;
  profileImageUrl: string;
}

export interface eventAction {
  ACTION_TYPE: any;
  VALUE?: any;
  OPTIONS?: any;
}

export interface navigateAction {
  ROUTE: any;
  NAVIGATION_TYPE: 'MAIN_NAVIGATION' | 'SUB_NAVIGATION';
  SUBNAVIGATION_ID?: any;
  OPTIONS?: optionsItems;
}

export interface optionsItems {
  NAVIGATION_PAGE: any;
  ACTIVE_TAB_INDEX?: any;
  SHOW_SIDEBAR?: boolean;
  SUB_SCREEN_NAVOPTIONS?:optionsItems;
}
export interface securityCodeObj {
  userSecurityCodeID: string,
  profileID?: string
}

export interface securityCodeResp {
  data: securityCodeObj,
  success: string
}
