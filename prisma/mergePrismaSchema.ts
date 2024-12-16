const fs = require('fs');
const path = require('path');

// Read the main schema
const mainSchema = fs.readFileSync(
  path.join(__dirname, '../prisma/schema.prisma'),
  'utf8'
);

// Read all model files
const userModel = fs.readFileSync(
  path.join(__dirname, '../prisma/user.prisma'),
  'utf8'
);
const periodTrackerModel = fs.readFileSync(
  path.join(__dirname, '../prisma/periodTracker.prisma'),
  'utf8'
);
const weekContentModel = fs.readFileSync(
  path.join(__dirname, '../prisma/weekContent.prisma'),
  'utf8'
);

const cycleInsightsModel = fs.readFileSync(
  path.join(__dirname, '../prisma/cycleInsights.prisma'),
  'utf8'
);


// Create the combined schema by replacing all imports
let combinedSchema = mainSchema
  .replace('#import "/user.prisma"', userModel)
  .replace('#import "/periodTracker.prisma"', periodTrackerModel)
  .replace('#import "/weekContent.prisma"', weekContentModel)
  .replace('#import "/cycleInsights.prisma"', cycleInsightsModel)

// Ensure the generated directory exists
const generatedDir = path.join(__dirname, '../prisma/generated');
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

// Write the combined schema
fs.writeFileSync(
  path.join(__dirname, '../prisma/generated/schema.prisma'),
  combinedSchema
);

console.log('Schema files merged successfully!');