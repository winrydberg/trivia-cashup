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
      "PaymentMethods",
      [
        {
          provider: "MTN",
          code: "01",
          type: "MOMO",
          logo: "./",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          provider: "VODAFONE GH",
          code: "02",
          type: "MOMO",
          logo: "./",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          provider: "AIRTEL TIGO",
          code: "03",
          type: "MOMO",
          logo: "./",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          provider: "VISA",
          code: "04",
          type: "CARD",
          logo: "./",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          provider: "MASTERCARD",
          code: "05",
          type: "CARD",
          logo: "./",
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
