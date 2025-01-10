const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Member = sequelize.define('Member', {
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fname:{ 
        type:DataTypes.STRING,
        allowNull:false,
    },
    feeAmount:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    feePaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    dateJoined: {
        type: DataTypes.DATE,
        
    },
    memberImage:{
        type:DataTypes.STRING,
        require:true,
        allowNull:false,
    },
    imagePath:{
        type:DataTypes.STRING,
        allowNull:false,
        require:true

    }
});

module.exports = Member;
