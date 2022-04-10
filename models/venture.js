const Sequelize = require("sequelize-cockroachdb")

module.exports = function (sequelize, dataTypes) {
    const Venture = sequelize.define("ventures", {
        id: {
            type: dataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        category: {
            type: dataTypes.STRING,
            allowNull: false
        },
        target: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        moneyRaised: {
            type: dataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        valuation: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: dataTypes.STRING(4000),
            allowNull: false
        },
        percentInvested: {
            type: dataTypes.FLOAT,
            get() {
              return (this.getDataValue('moneyRaised')/this.getDataValue('target') * 100)
            }
          }
    })

    return Venture
}
