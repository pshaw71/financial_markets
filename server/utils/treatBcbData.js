// Convert the data from BCB API { data, valor} to mongoDB { date, value }
const treatBcbData = (rawData) => {
    return rawData.map(item => ({
        date: new Date(item.data.split('/').reverse().join('-')),
        value: parseFloat(item.valor),
    }));
};

module.exports = { treatBcbData };