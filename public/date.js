module.exports = getDate;

function getDate() {
    const date = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = date.toLocaleDateString("en-US", options);
    var year = date.getFullYear();
    return {
        'day': day,
        'year': year
    }
}

