"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Credits",
      [
        {
          name: "Starter",
          value: 2,
          amount: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Basic",
          value: 3,
          amount: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Standard",
          value: 5,
          amount: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
