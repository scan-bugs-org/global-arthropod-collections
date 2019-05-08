"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "ALTER TABLE 'collections' ADD CONSTRAINT PRIMARY KEY ('institutionCode', 'collectionCode')"
    );
  }
};

module.exports = (sequelize, DataTypes) => {
  let Collections = sequelize.define(
    "collections",
    {
      institutionCode: { type: DataTypes.TEXT, primaryKey: true },
      collectionCode: { type: DataTypes.TEXT, primaryKey: true },
      collectionName: DataTypes.TEXT,
      size: DataTypes.INTEGER,
      tier: DataTypes.INTEGER,
      percentPublic: DataTypes.DECIMAL,
      type: DataTypes.TEXT,
      lat: DataTypes.DECIMAL,
      lon: DataTypes.DECIMAL,
      url: DataTypes.TEXT,
      scan: DataTypes.TEXT,
      idigbio: DataTypes.INTEGER,
      gbif: DataTypes.INTEGER
    },
    { timestamps: false }
  );

  Collections.associate = function(models) {
    models.collections.belongsTo(models.institutions, { foreignKey: "institutionCode" });
  };

  return Collections;
};
