'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('bands', [{
      name: 'The Beatles',
      genre: 'Rock',
      founded: 1960,
      available_start_time: '10:00:00',
      end_time: '23:00:00',
    }, {
      name: 'The Rolling Stones',
      genre: 'Rock',
      founded: 1962,
      available_start_time: '12:00:00',
      end_time: '15:00:00',
    }, {
      name: 'Led Zeppelin',
      genre: 'Rock',
      founded: 1968,
      available_start_time: '15:00:00',
      end_time: '18:00:00',
    },{
      name: 'Pink Floyd',
      genre: 'Rock',
      founded: 1965,
      available_start_time: '18:00:00',
      end_time: '21:00:00',
  }])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('bands', null, {});
  }
};
