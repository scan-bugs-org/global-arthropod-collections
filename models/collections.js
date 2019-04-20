"use strict";

module.exports = (sequelize, DataTypes) => {
  let Collections = sequelize.define(
    "collections",
    {
      collectionId: { type: DataTypes.INTEGER, primaryKey: true },
      collectionCode: DataTypes.TEXT,
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
    models.collections.belongsTo(models.institutions, { foreignKey: "institutionId" });
  };

  return Collections;
};
