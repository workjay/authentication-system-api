const config = require("./config")[process.env.NODE_ENV || "development"];

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: 3306,
    dialect: config.dialect,
    define: {
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    },
  }
);

module.exports = {
  sequelize,
};
