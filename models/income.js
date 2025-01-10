const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Income = sequelize.define('Income', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amountReceived: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    sourceOfIncome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateReceived: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});


module.exports = Income;
