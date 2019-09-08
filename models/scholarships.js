module.exports = function (sequelize, DataTypes) {
    var Scholarships = sequelize.define("Scholarships", {
        scholarship: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    });

    // Associating Scholarships with multiple activities
    // When Scholarships is deleted, deleted any associated activities
    Scholarships.associate = function (models) {
        Scholarships.hasMany(models.Activities, {
            onDelete: "cascade"
        });
    };

    // Scholarships must belong to a User
    // a Scholarship must have User to be created
    Scholarships.associate = function (models) {
        Scholarships.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    }
    return Scholarships;
}