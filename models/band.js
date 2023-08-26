//Dependencies
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.PG_URI);

//Band model
class Band extends Model {

}

//Band attributes
Band.init({
    band_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    founded: DataTypes.INTEGER,
    available_start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Band',
    tableName: 'band',
    timestamps: false
})

//Export model
module.exports = Band;