// Newest1 - Start

const bookshelf = Config("database");

module.exports = bookshelf.model("City", {
  hasTimestamps: true,

  tableName: process.env.TABLE_PREFIX + "cities",
});

// Newest1 - End
