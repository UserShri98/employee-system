const mongoose = require("mongoose");
const Holiday = require("../models/Holiday");
require("dotenv").config();

const seedHolidays = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ems");
    console.log("Connected to MongoDB");

    await Holiday.deleteMany({});
    console.log("Cleared existing holidays");

    const holidays = [
      {
        name: "Republic Day",
        date: new Date(2026, 0, 26), 
        type: "NATIONAL",
        description: "National holiday celebrating India's Republic"
      },
      {
        name: "Independence Day",
        date: new Date(2026, 7, 15), 
        type: "NATIONAL",
        description: "National holiday celebrating India's Independence"
      },
      {
        name: "Gandhi Jayanti",
        date: new Date(2026, 9, 2), 
        type: "NATIONAL",
        description: "Birthday of Mahatma Gandhi"
      },
      {
        name: "Christmas",
        date: new Date(2026, 11, 25), 
        type: "NATIONAL",
        description: "Christmas Day"
      },
      {
        name: "New Year",
        date: new Date(2026, 0, 1), 
        type: "NATIONAL",
        description: "New Year's Day"
      },
      {
        name: "Holi",
        date: new Date(2026, 2, 14), 
        type: "NATIONAL",
        description: "Festival of Colors"
      },
      {
        name: "Diwali",
        date: new Date(2026, 10, 8), 
        type: "NATIONAL",
        description: "Festival of Lights"
      },
      {
        name: "Raksha Bandhan",
        date: new Date(2026, 7, 9),
        type: "OPTIONAL",
        description: "Festival celebrating sibling bond"
      },
      {
        name: "Eid ul-Fitr",
        date: new Date(2026, 3, 11), 
        type: "OPTIONAL",
        description: "Islamic festival"
      },
      {
        name: "Eid ul-Adha",
        date: new Date(2026, 6, 20), 
        type: "OPTIONAL",
        description: "Islamic festival"
      }
    ];

    await Holiday.insertMany(holidays);
    console.log(`✅ Successfully added ${holidays.length} holidays to the database`);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding holidays:", error);
    mongoose.connection.close();
  }
};

seedHolidays();
