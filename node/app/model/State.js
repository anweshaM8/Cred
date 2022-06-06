// Newest1 - Start

const bookshelf = Config("database");

module.exports = bookshelf.model("State", {
  hasTimestamps: true,

  tableName: process.env.TABLE_PREFIX + "states",
});

// Newest1 - End
