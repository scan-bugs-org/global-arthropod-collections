"use strict";

module.exports = (sequelize, DataTypes) => {
  let Institutions = sequelize.define(
    "institutions",
    {
      institutionId: { type: DataTypes.INTEGER, primaryKey: true },
      institutionCode: DataTypes.TEXT,
      institutionName: DataTypes.TEXT,
      country: DataTypes.TEXT,
      state: DataTypes.TEXT
    },
    { timestamps: false }
  );

  return Institutions;
};
