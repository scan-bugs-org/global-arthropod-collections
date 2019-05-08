"use strict";

module.exports = (sequelize, DataTypes) => {
  let Institutions = sequelize.define(
    "institutions",
    {
      institutionCode: {type: DataTypes.TEXT, primaryKey: true },
      institutionName: DataTypes.TEXT,
      country: DataTypes.TEXT,
      state: DataTypes.TEXT
    },
    { timestamps: false }
  );

  return Institutions;
};
