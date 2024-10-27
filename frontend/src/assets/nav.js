import {
    marketIcon,
    marketFillIcon,
    receiptIcon,
    receiptFillIcon,
    dashboardFillIcon,
    dashboardIcon,
    toolIcon,
    toolFillIcon,
    priceMoreIcon,
    priceMoreFillIcon,
    locationIcon,
    locationFillIcon,
    settingsIcon,
    settingsFillIcon,
    usersIcon,
    usersFillIcon,
    itemIcon,
    itemFillIcon,
    storageIcon,
    storageFillIcon,
    basketIcon,
    basketFillIcon,
    trashIcon,
    trashFillIcon,
    trainingIcon,
    trainingFillIcon,
    invitationIcon,
    invitationFillIcon,
    reportIcon,
    reportFillIcon,
    logbookFillIcon,
    logbookIcon
} from "./img/icons"

const ordersNav = [
    {
        title: "Dashboard",
        icon: dashboardIcon,
        fillIcon: dashboardFillIcon,
        path: "/dashboard/orders",
        starts: "/dashboard"
    },
    {
        title: 'Orders',
        icon: basketIcon,
        fillIcon: basketFillIcon,
        path: '/supply/orders/submit/one-time',
        starts: '/supply/orders'
    },
    {
        title: 'Logbook',
        icon: logbookIcon,
        fillIcon: logbookFillIcon,
        path: '/teams/logbook/overview',
        starts: '/teams/logbook'
    },
    // {
    //     title: 'Storage',
    //     icon: storageIcon,
    //     fillIcon: storageFillIcon,
    //     path: '/teams/storage/submit/waste',
    //     starts: '/teams/storage'
    // },
    {
        title: 'Reports',
        icon: reportIcon,
        fillIcon: reportFillIcon,
        path: '/reports',
    },
]

const teamNav = [
    {
        title: 'All Employees',
        path: '/employees/list'
    },
    {
        title: 'Invitation',
        path: '/employees/invitation'
    },
]

const trainingNav = [
    {
        title: 'Progress',
        path: '/training/list'
    },
    {
        title: 'Add Training',
        path: '/training/add'
    },
]


const businessNav = [
    {
        title: 'Locations',
        icon: locationIcon,
        fillIcon: locationFillIcon,
        path: '/locations',
    },
]

const supportNav = [
    {
        title: 'Settings',
        icon: settingsIcon,
        fillIcon: settingsFillIcon,
        path: '/business/account',
        starts: '/settings'
    }
]


export {
    ordersNav,
    businessNav,
    teamNav,
    supportNav,
    trainingNav
}