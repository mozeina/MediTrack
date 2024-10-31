const getDay = () => {
    let dayInt = new Date().getDay();
    let day;
    switch (dayInt) {
        case 0:
            day = "sunday";
            break;
        case 1:
            day = "monday";
            break;
        case 2:
            day = "tuesday";
            break;
        case 3:
            day = "wednesday";
            break;
        case 4:
            day = "thursday";
            break;
        case 5:
            day = "friday";
            break;
        case 6:
            day = "saturday";
    }
    return day;
}

const getMonth = () => {
    let monthInt = new Date().getMonth();
    let month;

    switch (monthInt) {
        case 0:
            month = "jan";
            break;
        case 1:
            month = "feb";
            break;
        case 2:
            month = "mar";
            break;
        case 3:
            month = "apr";
            break;
        case 5:
            month = "may";
            break;
        case 6:
            month = "jun";
            break;
        case 7:
            month = "aug";
            break;
        case 8:
            month = "sep";
            break;
        case 9:
            month = "oct";
            break;
        case 10:
            month = "nov";
            break;
        case 11:
            month = "dec";
            break;
    }
    return month
}

export { getDay, getMonth };
