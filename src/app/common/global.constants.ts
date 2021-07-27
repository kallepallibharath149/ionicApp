
export const authNotrequiredAPI = ["login", "Register", "ValidateCode", "ReGenerateRegistrationCode", "ForgotPasswordGenerateCode", "ForgotPasswordUpdate"];

export const filesBaseURL = "http://konnect.egatetech.com:8888/api/";

export const navItems: Array<any> = [
    {
      navLink: "Posts",
      navigateTo:'testtt/groupsPosts/details'
    },
    {
      navLink: "Network",
      navigateTo:'testtt/network'
    },
    {
      navLink: "Events",
      navigateTo:'testtt/events'
    },
    {
      navLink: "Groups",
      navigateTo:'testtt/groups'
    }
    // ,
    // {
    //   navLink: "Albums"
    // }
  ];

  export const GLOBAL_SEARCH_UI_ITEMS: Array<any> = [
    {
      searchItem: ["Posts"],
      navigateTo:'testtt/groupsPosts/details',
      displayText: "Show Group Posts",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "POSTS",
      navigationOptions: {
        NAVIGATION_PAGE: "",
        ACTIVE_TAB_INDEX: null,
        SHOW_SIDEBAR: false
      }
    },
    {
      searchItem: ["Network", "Network Graph", "Relationship Graph", "graph"],
      navigateTo:'testtt/network',
      displayText: "Show Network Graph",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "NETWORK",
      navigationOptions: {
        NAVIGATION_PAGE: "NETWORK",
        ACTIVE_TAB_INDEX: 1,
        SHOW_SIDEBAR: false
      }
    },
    {
      searchItem: ["My Connections", "friends", "friend",  "Connections", "Connection", "relations"],
      navigateTo:'testtt/network',
      displayText: "Show My Connections",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "NETWORK",
      navigationOptions: {
        NAVIGATION_PAGE: "NETWORK",
        ACTIVE_TAB_INDEX: 0,
        SHOW_SIDEBAR: false,
        SUB_SCREEN_NAVOPTIONS:{
          NAVIGATION_PAGE: "MYCONNECTIONS",
          ACTIVE_TAB_INDEX: 0,
          SHOW_SIDEBAR: false, 
        }
      }
    },
    {
      searchItem: ["invitations"],
      navigateTo:'testtt/network',
      displayText: "Show Connection Invitations",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "NETWORK",
      navigationOptions: {
        NAVIGATION_PAGE: "NETWORK",
        ACTIVE_TAB_INDEX: 0,
        SHOW_SIDEBAR: false,
        SUB_SCREEN_NAVOPTIONS:{
          NAVIGATION_PAGE: "MYCONNECTIONS",
          ACTIVE_TAB_INDEX: 1,
          SHOW_SIDEBAR: false, 
        }
      }
    },
    {
      searchItem: ["sent Invitations"],
      navigateTo:'testtt/network',
      displayText: "Show Connections Sent Invitations",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "NETWORK",
      navigationOptions: {
        NAVIGATION_PAGE: "NETWORK",
        ACTIVE_TAB_INDEX: 0,
        SHOW_SIDEBAR: false,
        SUB_SCREEN_NAVOPTIONS:{
          NAVIGATION_PAGE: "MYCONNECTIONS",
          ACTIVE_TAB_INDEX: 2,
          SHOW_SIDEBAR: false, 
        }
      }
    },
    {
      searchItem: ["Events"],
      navigateTo:'testtt/events',
      displayText: "Show Events",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "EVENTS",
      navigationOptions: {
        NAVIGATION_PAGE: "EVENTS",
        ACTIVE_TAB_INDEX: 0,
        SHOW_SIDEBAR: false
      }
    },

    {
      searchItem: ["Pending Events", "Pending"],
      navigateTo:'testtt/events',
      displayText: "Show Pending Events",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "EVENTS",
      navigationOptions: {
        NAVIGATION_PAGE: "EVENTS",
        ACTIVE_TAB_INDEX: 2,
        SHOW_SIDEBAR: false
      }
    },

    {
      searchItem: ["Rejected Events", "Rejected"],
      navigateTo:'testtt/events',
      displayText: "Show Rejected Events",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "EVENTS",
      navigationOptions: {
        NAVIGATION_PAGE: "EVENTS",
        ACTIVE_TAB_INDEX: 3,
        SHOW_SIDEBAR: false
      }
    },
    
    {
      searchItem: ["create"],
      navigateTo:'testtt/events',
      displayText: "Create Event",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "EVENTS",
      navigationOptions: {
        NAVIGATION_PAGE: "EVENTS",
        SHOW_SIDEBAR: true
      }
    },
    {
      searchItem: ["created by me, created by"],
      navigateTo:'testtt/events',
      displayText: "Events Created By Me",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "EVENTS",
      navigationOptions: {
        NAVIGATION_PAGE: "EVENTS",
        ACTIVE_TAB_INDEX: 0,
        SHOW_SIDEBAR: true
      }
    },
    {
      searchItem: ["Groups", "My Groups", "Group" ],
      navigateTo:'testtt/groups',
      displayText: "Show Groups",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "GROUPS",
      navigationOptions: {
        NAVIGATION_PAGE: "GROUPS",
        ACTIVE_TAB_INDEX: 0,
        SHOW_SIDEBAR: false
      }
    },
    {
      searchItem: ["Create Group", "Create", "New Group", "Group Create"],
      navigateTo:'testtt/groups',
      displayText: "Create New Group",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "GROUPS",
      navigationOptions: {
        NAVIGATION_PAGE: "GROUPS",
        ACTIVE_TAB_INDEX: 0,
        SHOW_SIDEBAR: true
      }
    },
    {
      searchItem: ["Pending Invitations", "Invitations"],
      navigateTo:'testtt/groups',
      displayText: "Pending Group Invitations",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "GROUPS",
      navigationOptions: {
        NAVIGATION_PAGE: "GROUPS",
        ACTIVE_TAB_INDEX: 2,
        SHOW_SIDEBAR: false
      }
    },
    {
      searchItem: ["Created By Me", "Created"],
      navigateTo:'testtt/groups',
      displayText: "Groups Created By Me",
      navigationType: "MAIN_NAVIGATION",
      navigationSection: "GROUPS",
      navigationOptions: {
        NAVIGATION_PAGE: "GROUPS",
        ACTIVE_TAB_INDEX: 1,
        SHOW_SIDEBAR: false
      }
    }
    
  ];

  export const COUNTRY_CODES: Array<any> = [
    {
      "countryName": "Afghanistan",
      "dial_code": "+93",
      "code": "AF",
      "flag": "🇦🇫"
    },
    {
      "countryName": "Albania",
      "dial_code": "+355",
      "code": "AL",
      "flag": "🇦🇱"
    },
    {
      "countryName": "Algeria",
      "dial_code": "+213",
      "code": "DZ",
      "flag": "🇩🇿"
    },
    {
      "countryName": "AmericanSamoa",
      "dial_code": "+1684",
      "code": "AS",
      "flag": "🇦🇸"
    },
    {
      "countryName": "Andorra",
      "dial_code": "+376",
      "code": "AD",
      "flag": "🇦🇩"
    },
    {
      "countryName": "Angola",
      "dial_code": "+244",
      "code": "AO",
      "flag": "🇦🇴"
    },
    {
      "countryName": "Anguilla",
      "dial_code": "+1264",
      "code": "AI",
      "flag": "🇦🇮"
    },
    {
      "countryName": "Antarctica",
      "dial_code": "+672",
      "code": "AQ",
      "flag": "🇦🇶"
    },
    {
      "countryName": "Antigua and Barbuda",
      "dial_code": "+1268",
      "code": "AG",
      "flag": "🇦🇬"
    },
    {
      "countryName": "Argentina",
      "dial_code": "+54",
      "code": "AR",
      "flag": "🇦🇷"
    },
    {
      "countryName": "Armenia",
      "dial_code": "+374",
      "code": "AM",
      "flag": "🇦🇲"
    },
    {
      "countryName": "Aruba",
      "dial_code": "+297",
      "code": "AW",
      "flag": "🇦🇼"
    },
    {
      "countryName": "Australia",
      "dial_code": "+61",
      "code": "AU",
      "preferred": true,
      "flag": "🇦🇺"
    },
    {
      "countryName": "Austria",
      "dial_code": "+43",
      "code": "AT",
      "flag": "🇦🇹"
    },
    {
      "countryName": "Azerbaijan",
      "dial_code": "+994",
      "code": "AZ",
      "flag": "🇦🇿"
    },
    {
      "countryName": "Bahamas",
      "dial_code": "+1242",
      "code": "BS",
      "flag": "🇧🇸"
    },
    {
      "countryName": "Bahrain",
      "dial_code": "+973",
      "code": "BH",
      "flag": "🇧🇭"
    },
    {
      "countryName": "Bangladesh",
      "dial_code": "+880",
      "code": "BD",
      "flag": "🇧🇩"
    },
    {
      "countryName": "Barbados",
      "dial_code": "+1246",
      "code": "BB",
      "flag": "🇧🇧"
    },
    {
      "countryName": "Belarus",
      "dial_code": "+375",
      "code": "BY",
      "flag": "🇧🇾"
    },
    {
      "countryName": "Belgium",
      "dial_code": "+32",
      "code": "BE",
      "flag": "🇧🇪"
    },
    {
      "countryName": "Belize",
      "dial_code": "+501",
      "code": "BZ",
      "flag": "🇧🇿"
    },
    {
      "countryName": "Benin",
      "dial_code": "+229",
      "code": "BJ",
      "flag": "🇧🇯"
    },
    {
      "countryName": "Bermuda",
      "dial_code": "+1441",
      "code": "BM",
      "flag": "🇧🇲"
    },
    {
      "countryName": "Bhutan",
      "dial_code": "+975",
      "code": "BT",
      "flag": "🇧🇹"
    },
    {
      "countryName": "Bolivia, Plurinational State of",
      "dial_code": "+591",
      "code": "BO",
      "flag": "🇧🇴"
    },
    {
      "countryName": "Bosnia and Herzegovina",
      "dial_code": "+387",
      "code": "BA",
      "flag": "🇧🇦"
    },
    {
      "countryName": "Botswana",
      "dial_code": "+267",
      "code": "BW",
      "flag": "🇧🇼"
    },
    {
      "countryName": "Brazil",
      "dial_code": "+55",
      "code": "BR",
      "flag": "🇧🇷"
    },
    {
      "countryName": "British Indian Ocean Territory",
      "dial_code": "+246",
      "code": "IO",
      "flag": "🇮🇴"
    },
    {
      "countryName": "Brunei Darussalam",
      "dial_code": "+673",
      "code": "BN",
      "flag": "🇧🇳"
    },
    {
      "countryName": "Bulgaria",
      "dial_code": "+359",
      "code": "BG",
      "flag": "🇧🇬"
    },
    {
      "countryName": "Burkina Faso",
      "dial_code": "+226",
      "code": "BF",
      "flag": "🇧🇫"
    },
    {
      "countryName": "Burundi",
      "dial_code": "+257",
      "code": "BI",
      "flag": "🇧🇮"
    },
    {
      "countryName": "Cambodia",
      "dial_code": "+855",
      "code": "KH",
      "flag": "🇰🇭"
    },
    {
      "countryName": "Cameroon",
      "dial_code": "+237",
      "code": "CM",
      "flag": "🇨🇲"
    },
    {
      "countryName": "Canada",
      "dial_code": "+1",
      "code": "CA",
      "flag": "🇨🇦"
    },
    {
      "countryName": "Cape Verde",
      "dial_code": "+238",
      "code": "CV",
      "flag": "🇨🇻"
    },
    {
      "countryName": "Cayman Islands",
      "dial_code": "+345",
      "code": "KY",
      "flag": "🇰🇾"
    },
    {
      "countryName": "Central African Republic",
      "dial_code": "+236",
      "code": "CF",
      "flag": "🇨🇫"
    },
    {
      "countryName": "Chad",
      "dial_code": "+235",
      "code": "TD",
      "flag": "🇹🇩"
    },
    {
      "countryName": "Chile",
      "dial_code": "+56",
      "code": "CL",
      "flag": "🇨🇱"
    },
    {
      "countryName": "China",
      "dial_code": "+86",
      "code": "CN",
      "flag": "🇨🇳"
    },
    {
      "countryName": "Christmas Island",
      "dial_code": "+61",
      "code": "CX",
      "flag": "🇨🇽"
    },
    {
      "countryName": "Cocos (Keeling) Islands",
      "dial_code": "+61",
      "code": "CC",
      "flag": "🇨🇨"
    },
    {
      "countryName": "Colombia",
      "dial_code": "+57",
      "code": "CO",
      "flag": "🇨🇴"
    },
    {
      "countryName": "Comoros",
      "dial_code": "+269",
      "code": "KM",
      "flag": "🇰🇲"
    },
    {
      "countryName": "Congo",
      "dial_code": "+242",
      "code": "CG",
      "flag": "🇨🇬"
    },
    {
      "countryName": "Congo, The Democratic Republic of the",
      "dial_code": "+243",
      "code": "CD",
      "flag": "🇨🇩"
    },
    {
      "countryName": "Cook Islands",
      "dial_code": "+682",
      "code": "CK",
      "flag": "🇨🇰"
    },
    {
      "countryName": "Costa Rica",
      "dial_code": "+506",
      "code": "CR",
      "flag": "🇨🇷"
    },
    {
      "countryName": "Cote d'Ivoire",
      "dial_code": "+225",
      "code": "CI",
      "flag": "🇨🇮"
    },
    {
      "countryName": "Croatia",
      "dial_code": "+385",
      "code": "HR",
      "flag": "🇭🇷"
    },
    {
      "countryName": "Cuba",
      "dial_code": "+53",
      "code": "CU",
      "flag": "🇨🇺"
    },
    {
      "countryName": "Cyprus",
      "dial_code": "+537",
      "code": "CY",
      "flag": "🇨🇾"
    },
    {
      "countryName": "Czech Republic",
      "dial_code": "+420",
      "code": "CZ",
      "flag": "🇨🇿"
    },
    {
      "countryName": "Denmark",
      "dial_code": "+45",
      "code": "DK",
      "flag": "🇩🇰"
    },
    {
      "countryName": "Djibouti",
      "dial_code": "+253",
      "code": "DJ",
      "flag": "🇩🇯"
    },
    {
      "countryName": "Dominica",
      "dial_code": "+1767",
      "code": "DM",
      "flag": "🇩🇲"
    },
    {
      "countryName": "Dominican Republic",
      "dial_code": "+1849",
      "code": "DO",
      "flag": "🇩🇴"
    },
    {
      "countryName": "Ecuador",
      "dial_code": "+593",
      "code": "EC",
      "flag": "🇪🇨"
    },
    {
      "countryName": "Egypt",
      "dial_code": "+20",
      "code": "EG",
      "flag": "🇪🇬"
    },
    {
      "countryName": "El Salvador",
      "dial_code": "+503",
      "code": "SV",
      "flag": "🇸🇻"
    },
    {
      "countryName": "Equatorial Guinea",
      "dial_code": "+240",
      "code": "GQ",
      "flag": "🇬🇶"
    },
    {
      "countryName": "Eritrea",
      "dial_code": "+291",
      "code": "ER",
      "flag": "🇪🇷"
    },
    {
      "countryName": "Estonia",
      "dial_code": "+372",
      "code": "EE",
      "flag": "🇪🇪"
    },
    {
      "countryName": "Ethiopia",
      "dial_code": "+251",
      "code": "ET",
      "flag": "🇪🇹"
    },
    {
      "countryName": "Falkland Islands (Malvinas)",
      "dial_code": "+500",
      "code": "FK",
      "flag": "🇫🇰"
    },
    {
      "countryName": "Faroe Islands",
      "dial_code": "+298",
      "code": "FO",
      "flag": "🇫🇴"
    },
    {
      "countryName": "Fiji",
      "dial_code": "+679",
      "code": "FJ",
      "flag": "🇫🇯"
    },
    {
      "countryName": "Finland",
      "dial_code": "+358",
      "code": "FI",
      "flag": "🇫🇮"
    },
    {
      "countryName": "France",
      "dial_code": "+33",
      "code": "FR",
      "flag": "🇫🇷"
    },
    {
      "countryName": "French Guiana",
      "dial_code": "+594",
      "code": "GF",
      "flag": "🇬🇫"
    },
    {
      "countryName": "French Polynesia",
      "dial_code": "+689",
      "code": "PF",
      "flag": "🇵🇫"
    },
    {
      "countryName": "Gabon",
      "dial_code": "+241",
      "code": "GA",
      "flag": "🇬🇦"
    },
    {
      "countryName": "Gambia",
      "dial_code": "+220",
      "code": "GM",
      "flag": "🇬🇲"
    },
    {
      "countryName": "Georgia",
      "dial_code": "+995",
      "code": "GE",
      "flag": "🇬🇪"
    },
    {
      "countryName": "Germany",
      "dial_code": "+49",
      "code": "DE",
      "flag": "🇩🇪"
    },
    {
      "countryName": "Ghana",
      "dial_code": "+233",
      "code": "GH",
      "flag": "🇬🇭"
    },
    {
      "countryName": "Gibraltar",
      "dial_code": "+350",
      "code": "GI",
      "flag": "🇬🇮"
    },
    {
      "countryName": "Greece",
      "dial_code": "+30",
      "code": "GR",
      "flag": "🇬🇷"
    },
    {
      "countryName": "Greenland",
      "dial_code": "+299",
      "code": "GL",
      "flag": "🇬🇱"
    },
    {
      "countryName": "Grenada",
      "dial_code": "+1473",
      "code": "GD",
      "flag": "🇬🇩"
    },
    {
      "countryName": "Guadeloupe",
      "dial_code": "+590",
      "code": "GP",
      "flag": "🇬🇵"
    },
    {
      "countryName": "Guam",
      "dial_code": "+1671",
      "code": "GU",
      "flag": "🇬🇺"
    },
    {
      "countryName": "Guatemala",
      "dial_code": "+502",
      "code": "GT",
      "flag": "🇬🇹"
    },
    {
      "countryName": "Guernsey",
      "dial_code": "+44",
      "code": "GG",
      "flag": "🇬🇬"
    },
    {
      "countryName": "Guinea",
      "dial_code": "+224",
      "code": "GN",
      "flag": "🇬🇳"
    },
    {
      "countryName": "Guinea-Bissau",
      "dial_code": "+245",
      "code": "GW",
      "flag": "🇬🇼"
    },
    {
      "countryName": "Guyana",
      "dial_code": "+595",
      "code": "GY",
      "flag": "🇬🇾"
    },
    {
      "countryName": "Haiti",
      "dial_code": "+509",
      "code": "HT",
      "flag": "🇭🇹"
    },
    {
      "countryName": "Holy See (Vatican City State)",
      "dial_code": "+379",
      "code": "VA",
      "flag": "🇻🇦"
    },
    {
      "countryName": "Honduras",
      "dial_code": "+504",
      "code": "HN",
      "flag": "🇭🇳"
    },
    {
      "countryName": "Hong Kong",
      "dial_code": "+852",
      "code": "HK",
      "flag": "🇭🇰"
    },
    {
      "countryName": "Hungary",
      "dial_code": "+36",
      "code": "HU",
      "flag": "🇭🇺"
    },
    {
      "countryName": "Iceland",
      "dial_code": "+354",
      "code": "IS",
      "flag": "🇮🇸"
    },
    {
      "countryName": "India",
      "dial_code": "+91",
      "code": "IN",
      "preferred": true,
      "flag": "🇮🇳"
    },
    {
      "countryName": "Indonesia",
      "dial_code": "+62",
      "code": "ID",
      "flag": "🇮🇩"
    },
    {
      "countryName": "Iran, Islamic Republic of",
      "dial_code": "+98",
      "code": "IR",
      "flag": "🇮🇷"
    },
    {
      "countryName": "Iraq",
      "dial_code": "+964",
      "code": "IQ",
      "flag": "🇮🇶"
    },
    {
      "countryName": "Ireland",
      "dial_code": "+353",
      "code": "IE",
      "flag": "🇮🇪"
    },
    {
      "countryName": "Isle of Man",
      "dial_code": "+44",
      "code": "IM",
      "flag": "🇮🇲"
    },
    {
      "countryName": "Israel",
      "dial_code": "+972",
      "code": "IL",
      "flag": "🇮🇱"
    },
    {
      "countryName": "Italy",
      "dial_code": "+39",
      "code": "IT",
      "flag": "🇮🇹"
    },
    {
      "countryName": "Jamaica",
      "dial_code": "+1876",
      "code": "JM",
      "flag": "🇯🇲"
    },
    {
      "countryName": "Japan",
      "dial_code": "+81",
      "code": "JP",
      "flag": "🇯🇵"
    },
    {
      "countryName": "Jersey",
      "dial_code": "+44",
      "code": "JE",
      "flag": "🇯🇪"
    },
    {
      "countryName": "Jordan",
      "dial_code": "+962",
      "code": "JO",
      "flag": "🇯🇴"
    },
    {
      "countryName": "Kazakhstan",
      "dial_code": "+77",
      "code": "KZ",
      "flag": "🇰🇿"
    },
    {
      "countryName": "Kenya",
      "dial_code": "+254",
      "code": "KE",
      "flag": "🇰🇪"
    },
    {
      "countryName": "Kiribati",
      "dial_code": "+686",
      "code": "KI",
      "flag": "🇰🇮"
    },
    {
      "countryName": "Korea, Democratic People's Republic of",
      "dial_code": "+850",
      "code": "KP",
      "flag": "🇰🇵"
    },
    {
      "countryName": "Korea, Republic of",
      "dial_code": "+82",
      "code": "KR",
      "flag": "🇰🇷"
    },
    {
      "countryName": "Kuwait",
      "dial_code": "+965",
      "code": "KW",
      "flag": "🇰🇼"
    },
    {
      "countryName": "Kyrgyzstan",
      "dial_code": "+996",
      "code": "KG",
      "flag": "🇰🇬"
    },
    {
      "countryName": "Lao People's Democratic Republic",
      "dial_code": "+856",
      "code": "LA",
      "flag": "🇱🇦"
    },
    {
      "countryName": "Latvia",
      "dial_code": "+371",
      "code": "LV",
      "flag": "🇱🇻"
    },
    {
      "countryName": "Lebanon",
      "dial_code": "+961",
      "code": "LB",
      "flag": "🇱🇧"
    },
    {
      "countryName": "Lesotho",
      "dial_code": "+266",
      "code": "LS",
      "flag": "🇱🇸"
    },
    {
      "countryName": "Liberia",
      "dial_code": "+231",
      "code": "LR",
      "flag": "🇱🇷"
    },
    {
      "countryName": "Libyan Arab Jamahiriya",
      "dial_code": "+218",
      "code": "LY",
      "flag": "🇱🇾"
    },
    {
      "countryName": "Liechtenstein",
      "dial_code": "+423",
      "code": "LI",
      "flag": "🇱🇮"
    },
    {
      "countryName": "Lithuania",
      "dial_code": "+370",
      "code": "LT",
      "flag": "🇱🇹"
    },
    {
      "countryName": "Luxembourg",
      "dial_code": "+352",
      "code": "LU",
      "flag": "🇱🇺"
    },
    {
      "countryName": "Macao",
      "dial_code": "+853",
      "code": "MO",
      "flag": "🇲🇴"
    },
    {
      "countryName": "Macedonia, The Former Yugoslav Republic of",
      "dial_code": "+389",
      "code": "MK",
      "flag": "🇲🇰"
    },
    {
      "countryName": "Madagascar",
      "dial_code": "+261",
      "code": "MG",
      "flag": "🇲🇬"
    },
    {
      "countryName": "Malawi",
      "dial_code": "+265",
      "code": "MW",
      "flag": "🇲🇼"
    },
    {
      "countryName": "Malaysia",
      "dial_code": "+60",
      "code": "MY",
      "flag": "🇲🇾"
    },
    {
      "countryName": "Maldives",
      "dial_code": "+960",
      "code": "MV",
      "flag": "🇲🇻"
    },
    {
      "countryName": "Mali",
      "dial_code": "+223",
      "code": "ML",
      "flag": "🇲🇱"
    },
    {
      "countryName": "Malta",
      "dial_code": "+356",
      "code": "MT",
      "flag": "🇲🇹"
    },
    {
      "countryName": "Marshall Islands",
      "dial_code": "+692",
      "code": "MH",
      "flag": "🇲🇭"
    },
    {
      "countryName": "Martinique",
      "dial_code": "+596",
      "code": "MQ",
      "flag": "🇲🇶"
    },
    {
      "countryName": "Mauritania",
      "dial_code": "+222",
      "code": "MR",
      "flag": "🇲🇷"
    },
    {
      "countryName": "Mauritius",
      "dial_code": "+230",
      "code": "MU",
      "flag": "🇲🇺"
    },
    {
      "countryName": "Mayotte",
      "dial_code": "+262",
      "code": "YT",
      "flag": "🇾🇹"
    },
    {
      "countryName": "Mexico",
      "dial_code": "+52",
      "code": "MX",
      "flag": "🇲🇽"
    },
    {
      "countryName": "Micronesia, Federated States of",
      "dial_code": "+691",
      "code": "FM",
      "flag": "🇫🇲"
    },
    {
      "countryName": "Moldova, Republic of",
      "dial_code": "+373",
      "code": "MD",
      "flag": "🇲🇩"
    },
    {
      "countryName": "Monaco",
      "dial_code": "+377",
      "code": "MC",
      "flag": "🇲🇨"
    },
    {
      "countryName": "Mongolia",
      "dial_code": "+976",
      "code": "MN",
      "flag": "🇲🇳"
    },
    {
      "countryName": "Montenegro",
      "dial_code": "+382",
      "code": "ME",
      "flag": "🇲🇪"
    },
    {
      "countryName": "Montserrat",
      "dial_code": "+1664",
      "code": "MS",
      "flag": "🇲🇸"
    },
    {
      "countryName": "Morocco",
      "dial_code": "+212",
      "code": "MA",
      "flag": "🇲🇦"
    },
    {
      "countryName": "Mozambique",
      "dial_code": "+258",
      "code": "MZ",
      "flag": "🇲🇿"
    },
    {
      "countryName": "Myanmar",
      "dial_code": "+95",
      "code": "MM",
      "flag": "🇲🇲"
    },
    {
      "countryName": "Namibia",
      "dial_code": "+264",
      "code": "NA",
      "flag": "🇳🇦"
    },
    {
      "countryName": "Nauru",
      "dial_code": "+674",
      "code": "NR",
      "flag": "🇳🇷"
    },
    {
      "countryName": "Nepal",
      "dial_code": "+977",
      "code": "NP",
      "flag": "🇳🇵"
    },
    {
      "countryName": "Netherlands",
      "dial_code": "+31",
      "code": "NL",
      "flag": "🇳🇱"
    },
    {
      "countryName": "Netherlands Antilles",
      "dial_code": "+599",
      "code": "AN",
      "flag": "🇦🇳"
    },
    {
      "countryName": "New Caledonia",
      "dial_code": "+687",
      "code": "NC",
      "flag": "🇳🇨"
    },
    {
      "countryName": "New Zealand",
      "dial_code": "+64",
      "code": "NZ",
      "flag": "🇳🇿"
    },
    {
      "countryName": "Nicaragua",
      "dial_code": "+505",
      "code": "NI",
      "flag": "🇳🇮"
    },
    {
      "countryName": "Niger",
      "dial_code": "+227",
      "code": "NE",
      "flag": "🇳🇪"
    },
    {
      "countryName": "Nigeria",
      "dial_code": "+234",
      "code": "NG",
      "flag": "🇳🇬"
    },
    {
      "countryName": "Niue",
      "dial_code": "+683",
      "code": "NU",
      "flag": "🇳🇺"
    },
    {
      "countryName": "Norfolk Island",
      "dial_code": "+672",
      "code": "NF",
      "flag": "🇳🇫"
    },
    {
      "countryName": "Northern Mariana Islands",
      "dial_code": "+1670",
      "code": "MP",
      "flag": "🇲🇵"
    },
    {
      "countryName": "Norway",
      "dial_code": "+47",
      "code": "NO",
      "flag": "🇳🇴"
    },
    {
      "countryName": "Oman",
      "dial_code": "+968",
      "code": "OM",
      "flag": "🇴🇲"
    },
    {
      "countryName": "Pakistan",
      "dial_code": "+92",
      "code": "PK",
      "flag": "🇵🇰"
    },
    {
      "countryName": "Palau",
      "dial_code": "+680",
      "code": "PW",
      "flag": "🇵🇼"
    },
    {
      "countryName": "Palestinian Territory, Occupied",
      "dial_code": "+970",
      "code": "PS",
      "flag": "🇵🇸"
    },
    {
      "countryName": "Panama",
      "dial_code": "+507",
      "code": "PA",
      "flag": "🇵🇦"
    },
    {
      "countryName": "Papua New Guinea",
      "dial_code": "+675",
      "code": "PG",
      "flag": "🇵🇬"
    },
    {
      "countryName": "Paraguay",
      "dial_code": "+595",
      "code": "PY",
      "flag": "🇵🇾"
    },
    {
      "countryName": "Peru",
      "dial_code": "+51",
      "code": "PE",
      "flag": "🇵🇪"
    },
    {
      "countryName": "Philippines",
      "dial_code": "+63",
      "code": "PH",
      "flag": "🇵🇭"
    },
    {
      "countryName": "Pitcairn",
      "dial_code": "+872",
      "code": "PN",
      "flag": "🇵🇳"
    },
    {
      "countryName": "Poland",
      "dial_code": "+48",
      "code": "PL",
      "flag": "🇵🇱"
    },
    {
      "countryName": "Portugal",
      "dial_code": "+351",
      "code": "PT",
      "flag": "🇵🇹"
    },
    {
      "countryName": "Puerto Rico",
      "dial_code": "+1939",
      "code": "PR",
      "flag": "🇵🇷"
    },
    {
      "countryName": "Qatar",
      "dial_code": "+974",
      "code": "QA",
      "flag": "🇶🇦"
    },
    {
      "countryName": "Romania",
      "dial_code": "+40",
      "code": "RO",
      "flag": "🇷🇴"
    },
    {
      "countryName": "Russia",
      "dial_code": "+7",
      "code": "RU",
      "flag": "🇷🇺"
    },
    {
      "countryName": "Rwanda",
      "dial_code": "+250",
      "code": "RW",
      "flag": "🇷🇼"
    },
    {
      "countryName": "Réunion",
      "dial_code": "+262",
      "code": "RE",
      "flag": "🇷🇪"
    },
    {
      "countryName": "Saint Barthélemy",
      "dial_code": "+590",
      "code": "BL",
      "flag": "🇧🇱"
    },
    {
      "countryName": "Saint Helena, Ascension and Tristan Da Cunha",
      "dial_code": "+290",
      "code": "SH",
      "flag": "🇸🇭"
    },
    {
      "countryName": "Saint Kitts and Nevis",
      "dial_code": "+1869",
      "code": "KN",
      "flag": "🇰🇳"
    },
    {
      "countryName": "Saint Lucia",
      "dial_code": "+1758",
      "code": "LC",
      "flag": "🇱🇨"
    },
    {
      "countryName": "Saint Martin",
      "dial_code": "+590",
      "code": "MF",
      "flag": "🇲🇫"
    },
    {
      "countryName": "Saint Pierre and Miquelon",
      "dial_code": "+508",
      "code": "PM",
      "flag": "🇵🇲"
    },
    {
      "countryName": "Saint Vincent and the Grenadines",
      "dial_code": "+1784",
      "code": "VC",
      "flag": "🇻🇨"
    },
    {
      "countryName": "Samoa",
      "dial_code": "+685",
      "code": "WS",
      "flag": "🇼🇸"
    },
    {
      "countryName": "San Marino",
      "dial_code": "+378",
      "code": "SM",
      "flag": "🇸🇲"
    },
    {
      "countryName": "Sao Tome and Principe",
      "dial_code": "+239",
      "code": "ST",
      "flag": "🇸🇹"
    },
    {
      "countryName": "Saudi Arabia",
      "dial_code": "+966",
      "code": "SA",
      "flag": "🇸🇦"
    },
    {
      "countryName": "Senegal",
      "dial_code": "+221",
      "code": "SN",
      "flag": "🇸🇳"
    },
    {
      "countryName": "Serbia",
      "dial_code": "+381",
      "code": "RS",
      "flag": "🇷🇸"
    },
    {
      "countryName": "Seychelles",
      "dial_code": "+248",
      "code": "SC",
      "flag": "🇸🇨"
    },
    {
      "countryName": "Sierra Leone",
      "dial_code": "+232",
      "code": "SL",
      "flag": "🇸🇱"
    },
    {
      "countryName": "Singapore",
      "dial_code": "+65",
      "code": "SG",
      "flag": "🇸🇬"
    },
    {
      "countryName": "Slovakia",
      "dial_code": "+421",
      "code": "SK",
      "flag": "🇸🇰"
    },
    {
      "countryName": "Slovenia",
      "dial_code": "+386",
      "code": "SI",
      "flag": "🇸🇮"
    },
    {
      "countryName": "Solomon Islands",
      "dial_code": "+677",
      "code": "SB",
      "flag": "🇸🇧"
    },
    {
      "countryName": "Somalia",
      "dial_code": "+252",
      "code": "SO",
      "flag": "🇸🇴"
    },
    {
      "countryName": "South Africa",
      "dial_code": "+27",
      "code": "ZA",
      "flag": "🇿🇦"
    },
    {
      "countryName": "South Georgia and the South Sandwich Islands",
      "dial_code": "+500",
      "code": "GS",
      "flag": "🇬🇸"
    },
    {
      "countryName": "Spain",
      "dial_code": "+34",
      "code": "ES",
      "flag": "🇪🇸"
    },
    {
      "countryName": "Sri Lanka",
      "dial_code": "+94",
      "code": "LK",
      "flag": "🇱🇰"
    },
    {
      "countryName": "Sudan",
      "dial_code": "+249",
      "code": "SD",
      "flag": "🇸🇩"
    },
    {
      "countryName": "Suriname",
      "dial_code": "+597",
      "code": "SR",
      "flag": "🇸🇷"
    },
    {
      "countryName": "Svalbard and Jan Mayen",
      "dial_code": "+47",
      "code": "SJ",
      "flag": "🇸🇯"
    },
    {
      "countryName": "Swaziland",
      "dial_code": "+268",
      "code": "SZ",
      "flag": "🇸🇿"
    },
    {
      "countryName": "Sweden",
      "dial_code": "+46",
      "code": "SE",
      "flag": "🇸🇪"
    },
    {
      "countryName": "Switzerland",
      "dial_code": "+41",
      "code": "CH",
      "flag": "🇨🇭"
    },
    {
      "countryName": "Syrian Arab Republic",
      "dial_code": "+963",
      "code": "SY",
      "flag": "🇸🇾"
    },
    {
      "countryName": "Taiwan, Province of China",
      "dial_code": "+886",
      "code": "TW",
      "flag": "🇹🇼"
    },
    {
      "countryName": "Tajikistan",
      "dial_code": "+992",
      "code": "TJ",
      "flag": "🇹🇯"
    },
    {
      "countryName": "Tanzania, United Republic of",
      "dial_code": "+255",
      "code": "TZ",
      "flag": "🇹🇿"
    },
    {
      "countryName": "Thailand",
      "dial_code": "+66",
      "code": "TH",
      "flag": "🇹🇭"
    },
    {
      "countryName": "Timor-Leste",
      "dial_code": "+670",
      "code": "TL",
      "flag": "🇹🇱"
    },
    {
      "countryName": "Togo",
      "dial_code": "+228",
      "code": "TG",
      "flag": "🇹🇬"
    },
    {
      "countryName": "Tokelau",
      "dial_code": "+690",
      "code": "TK",
      "flag": "🇹🇰"
    },
    {
      "countryName": "Tonga",
      "dial_code": "+676",
      "code": "TO",
      "flag": "🇹🇴"
    },
    {
      "countryName": "Trinidad and Tobago",
      "dial_code": "+1868",
      "code": "TT",
      "flag": "🇹🇹"
    },
    {
      "countryName": "Tunisia",
      "dial_code": "+216",
      "code": "TN",
      "flag": "🇹🇳"
    },
    {
      "countryName": "Turkey",
      "dial_code": "+90",
      "code": "TR",
      "flag": "🇹🇷"
    },
    {
      "countryName": "Turkmenistan",
      "dial_code": "+993",
      "code": "TM",
      "flag": "🇹🇲"
    },
    {
      "countryName": "Turks and Caicos Islands",
      "dial_code": "+1649",
      "code": "TC",
      "flag": "🇹🇨"
    },
    {
      "countryName": "Tuvalu",
      "dial_code": "+688",
      "code": "TV",
      "flag": "🇹🇻"
    },
    {
      "countryName": "Uganda",
      "dial_code": "+256",
      "code": "UG",
      "flag": "🇺🇬"
    },
    {
      "countryName": "Ukraine",
      "dial_code": "+380",
      "code": "UA",
      "flag": "🇺🇦"
    },
    {
      "countryName": "United Arab Emirates",
      "dial_code": "+971",
      "code": "AE",
      "preferred": true,
      "flag": "🇦🇪"
    },
    {
      "countryName": "United Kingdom",
      "dial_code": "+44",
      "code": "GB",
      "preferred": true,
      "flag": "🇬🇧"
    },
    {
      "countryName": "United States",
      "dial_code": "+1",
      "code": "US",
      "preferred": true,
      "flag": "🇺🇸"
    },
    {
      "countryName": "Uruguay",
      "dial_code": "+598",
      "code": "UY",
      "flag": "🇺🇾"
    },
    {
      "countryName": "Uzbekistan",
      "dial_code": "+998",
      "code": "UZ",
      "flag": "🇺🇿"
    },
    {
      "countryName": "Vanuatu",
      "dial_code": "+678",
      "code": "VU",
      "flag": "🇻🇺"
    },
    {
      "countryName": "Venezuela, Bolivarian Republic of",
      "dial_code": "+58",
      "code": "VE",
      "flag": "🇻🇪"
    },
    {
      "countryName": "Viet Nam",
      "dial_code": "+84",
      "code": "VN",
      "flag": "🇻🇳"
    },
    {
      "countryName": "Virgin Islands, British",
      "dial_code": "+1284",
      "code": "VG",
      "flag": "🇻🇬"
    },
    {
      "countryName": "Virgin Islands, U.S.",
      "dial_code": "+1340",
      "code": "VI",
      "flag": "🇻🇮"
    },
    {
      "countryName": "Wallis and Futuna",
      "dial_code": "+681",
      "code": "WF",
      "flag": "🇼🇫"
    },
    {
      "countryName": "Yemen",
      "dial_code": "+967",
      "code": "YE",
      "flag": "🇾🇪"
    },
    {
      "countryName": "Zambia",
      "dial_code": "+260",
      "code": "ZM",
      "flag": "🇿🇲"
    },
    {
      "countryName": "Zimbabwe",
      "dial_code": "+263",
      "code": "ZW",
      "flag": "🇿🇼"
    },
    {
      "countryName": "Åland Islands",
      "dial_code": "+358",
      "code": "AX",
      "flag": "🇦🇽"
    }
  ]