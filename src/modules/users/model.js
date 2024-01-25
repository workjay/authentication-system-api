const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/mysql");
const bcrypt = require("bcryptjs");

class Users extends Model {
  isValidPassword(password) {
    return bcrypt.compareSync(password, this.getDataValue("password"));
  }
}

Users.init(
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if (val) {
          this.setDataValue("password", bcrypt.hashSync(val, 10));
        }
      },
    },
    role: {
      type: DataTypes.ENUM("customer", "admin"),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "Users",
  }
);

module.exports = Users;
