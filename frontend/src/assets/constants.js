import imgPlaceholder from './img/img_error_placeholder.png';
import imgCompanyPlaceholder from './img/company_placeholder.png';
import imgProductPlaceholder from './img/product_placeholder.png';

const employmentTypeEnum = ["full-time", "part-time", "seasonal", "on-call"];
const payTypeEnum = ["hourly", "salary"]
const businessTypeEnum = [
    {
        label: 'coffee shop',
        icon: '☕'
    },
    {
        label: 'cafe',
        icon: '🍰'
    },
    {
        label: 'restaurant',
        icon: '🍽️'
    },
    {
        label: 'bar',
        icon: '🍺'
    },
    {
        label: 'food truck',
        icon: '🚚'
    },
    {
        label: 'event',
        icon: '🎉'
    },
    {
        label: 'bakery',
        icon: '🍞'
    },
    {
        label: 'hotel',
        icon: '🏨'
    },
    {
        label: 'brewery',
        icon: '🍺'
    },
    {
        label: 'catering',
        icon:  '🍽️'
    }, 
    {
        label: 'fine dining',
        icon: '🍷'
    },
    {
        label: 'casual dining',
        icon: '🍔'
    },
    {
        label: 'market',
        icon: '🛒'
    },
    {
        label: 'pub',
        icon: '🍻'
    },
    {
        label: 'other',
        icon: '🌐'
    }]
const cuisineTypeEnum = [
    {
        label: 'american',
        icon: "🇺🇸"
    }, {
        label: 'mexican',
        icon: "🇲🇽"
    }, {
        label: 'italian',
        icon: "🇮🇹"
    }, {
        label: 'chinese',
        icon: "🇨🇳"
    }, {
        label: 'japanese',
        icon: "🇯🇵"
    }, {
        label: 'indian',
        icon: "🇮🇳"
    }, {
        label: 'thai',
        icon: "🇹🇭"
    }, {
        label: 'mediterranean',
        icon: "🇬🇷"
    }, {
        label: 'french',
        icon: "🇫🇷"
    }, {
        label: 'greek',
        icon: "🇬🇷"
    }, {
        label: 'korean',
        icon: "🇰🇷"
    }, {
        label: 'vietnamese',
        icon: "🇻🇳"
    }, {
        label: 'spanish',
        icon: "🇪🇸"
    }, {
        label: 'german',
        icon: "🇩🇪"
    }, {
        label: 'brazilian',
        icon: "🇧🇷"
    }, {
        label: 'african',
        icon: "🌍"
    }, {
        label: 'caribbean',
        icon: "🏝️"
    }, {
        label: 'other',
        icon: "🌐"
    }
]
const positionTypeEnum = ['server', 'bartender', "baker", 'host', 'cook', 'dishwasher', 'barista', 'manager', 'cashier', 'busser', 'sous-chef', 'chef', 'owner', 'other']
const benefitsEnum = [
    {
        label: "health",
        icon: '🏥'
    },
    {
        label: "dental",
        icon: '🦷'
    },
    {
        label: "vision",
        icon: '👓'
    },
    {
        label: "401k",
        icon: '💰'
    },
    {
        label: "paid time off",
        icon: '🏖️'
    },
    {
        label: "sick leave",
        icon: '🤒'
    },
    {
        label: "paid breaks",
        icon: '🍫'
    },
    {
        label: "free meals",
        icon: '🍔'
    },
    {
        label: "dining discounts",
        icon: '🍽️'
    },
    {
        label: "commuter benefits",
        icon: '🚇'
    },
    {
        label: "discounts",
        icon: '🛍️'
    },
    {
        label: "paid training",
        icon: '📚'
    }, 
    {
        label: "wellness program",
        icon: '🧘'
    },
    {
        label: 'potential bonuses',
        icon: '💰'
    }
]
const certificationsEnum = [
    "Food Handler's Permit/Certificate",
    "ServSafe Certification",
    "Alcohol Server Permit/License",
    "Manager Food Safety Certification",
    "Bartender License",
    "Allergen Awareness Certification",
    "Health Department Licenses",
    "Culinary Certifications",
    "Tobacco Sales License",
    "First Aid and CPR Certification",
    "Liquor License Manager",
]
const stateEnum = [ "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY" ]
const stateDetailedEnum = [ {label: "Alabama", value: "AL"}, {label: "Alaska", value: "AK"}, {label: "Arizona", value: "AZ"}, {label: "Arkansas", value: "AR"}, {label: "California", value: "CA"}, {label: "Colorado", value: "CO"}, {label: "Connecticut", value: "CT"}, {label: "Delaware", value: "DE"}, {label: "Florida", value: "FL"}, {label: "Georgia", value: "GA"}, {label: "Hawaii", value: "HI"}, {label: "Idaho", value: "ID"}, {label: "Illinois", value: "IL"}, {label: "Indiana", value: "IN"}, {label: "Iowa", value: "IA"}, {label: "Kansas", value: "KS"}, {label: "Kentucky", value: "KY"}, {label: "Louisiana", value: "LA"}, {label: "Maine", value: "ME"}, {label: "Maryland", value: "MD"}, {label: "Massachusetts", value: "MA"}, {label: "Michigan", value: "MI"}, {label: "Minnesota", value: "MN"}, {label: "Mississippi", value: "MS"}, {label: "Missouri", value: "MO"}, {label: "Montana", value: "MT"}, {label: "Nebraska", value: "NE"}, {label: "Nevada", value: "NV"}, {label: "New Hampshire", value: "NH"}, {label: "New Jersey", value: "NJ"}, {label: "New Mexico", value: "NM"}, {label: "New York", value: "NY"}, {label: "North Carolina", value: "NC"}, {label: "North Dakota", value: "ND"}, {label: "Ohio", value: "OH"}, {label: "Oklahoma", value: "OK"}, {label: "Oregon", value: "OR"}, {label: "Pennsylvania", value: "PA"}, {label: "Rhode Island", value: "RI"}, {label: "South Carolina", value: "SC"}, {label: "South Dakota", value: "SD"}, {label: "Tennessee", value: "TN"}, {label: "Texas", value: "TX"}, {label: "Utah", value: "UT"}, {label: "Vermont", value: "VT"}, {label: "Virginia", value: "VA"}, {label: "Washington", value: "WA"}, {label: "West Virginia", value: "WV"}, {label: "Wisconsin", value: "WI"}, {label: "Wyoming", value: "WY"} ]

const possibleSkillsEnum = [ "Bartending", "Barista", "Bussing", "Catering", "Cooking", "Customer Service", "Dish-washing", "Event Planning", "Food Prep", "Food Safety", "Hostessing", "Management", "Marketing", "Mixology", "Ordering", "Organizing", "POS", "Sales", "Scheduling", "Serving", "Supervising", "Training", "Wine Knowledge" ]
const commonLanguagesEnum = [ "English", "Spanish", "Chinese", "Hindi", "Arabic", "Russian", "Japanese", "German"]
const commonJobsEnum = [
    // Front of House Roles
    'Barista',
    'Bartender',
    'Cashier',
    'Hostess',
    "Baker",
    'Server',
    'Host',
    'Busser',
    'Barback',
    'Sommelier',
    'Food Runner',
    'Expeditor',

    // Management Roles
    'Restaurant Manager',
    'General Manager',
    'Bar Manager',
    'Shift Manager',
    'Kitchen Manager',
    'Front of House Manager',
    'Back of House Manager',

    // Kitchen Roles
    'Chef',
    'Cook',
    'Line Cook',
    'Prep Cook',
    'Pastry Chef',
    'Sous Chef',
    'Executive Chef',
    'Head Chef',
    'Catering Chef',
    'Private Chef',
    'Personal Chef',
  
    // Specialized Roles
    'Dishwasher',
    'Culinary Instructor',
    'Culinary Consultant',
    'Culinary Director',
    'Culinary Manager',
    'Culinary Supervisor',
    'Culinary Specialist',
    'Culinary Coordinator',
    'Culinary Assistant',
    'Culinary Intern',
    'Culinary Apprentice',
    'Culinary Trainee',
    'Culinary Student',
    'Culinary Graduate',
  
    // Creative & Leadership Roles
    'Culinary Professional',
    'Culinary Expert',
    'Culinary Enthusiast',
    'Culinary Artist',
    'Culinary Innovator',
    'Culinary Visionary',
    'Culinary Pioneer',
    'Culinary Trailblazer',
    'Culinary Maestro',
    'Culinary Genius',
    'Culinary Virtuoso',
    'Culinary Prodigy'
  ];
const locationNewYorkEnum = [
    "New York, NY",
    "Brooklyn, NY",
    "Queens, NY",
    "Manhattan, NY",
    "Bronx, NY",
    "Jersey City, NJ",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "Austin, TX",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
    "Austin, TX",
    "Jacksonville, FL",
    "Fort Worth, TX",
]

export {
    imgPlaceholder,
    imgCompanyPlaceholder,
    imgProductPlaceholder,
    employmentTypeEnum,
    payTypeEnum,
    businessTypeEnum,
    cuisineTypeEnum,
    positionTypeEnum,
    benefitsEnum,
    certificationsEnum,
    stateEnum,
    stateDetailedEnum,
    possibleSkillsEnum,
    commonLanguagesEnum,
    commonJobsEnum,
    locationNewYorkEnum,
}