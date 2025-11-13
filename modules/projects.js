const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function Initialize() {
  return new Promise((resolve, reject) => {
    try {
      projects = projectData.map(project => {
        const sectorObj = sectorData.find(sector => sector.id === project.sector_id);

        return {
          ...project,
          sector: sectorObj ? sectorObj.sector_name : "Recycling",
          category: project.category
            ? project.category
            : inferCategoryFromSector(sectorObj ? sectorObj.sector_name : "")
        };
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function inferCategoryFromSector(sector) {
  const name = (sector || "").toLowerCase();

  if (name.includes("land") || name.includes("food") || name.includes("agriculture"))
    return "ORGANIC WASTE";
  if (name.includes("industry") || name.includes("manufacturing"))
    return "PLASTIC";
  if (name.includes("electricity") || name.includes("transportation"))
    return "ELECTRONIC WASTE";

  return "PLASTIC"; // fallback
}

function getAllProjects() {
  return new Promise((resolve, reject) => {
    if (projects.length > 0) resolve([...projects]);
    else reject("No projects found.");
  });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const project = projects.find(p => p.id === projectId);
    project ? resolve(project) : reject("Project not found.");
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const value = sector.toLowerCase();
    const results = projects.filter(
      p => p.sector && p.sector.toLowerCase().includes(value)
    );
    results.length > 0 ? resolve(results) : reject("No projects found in this sector.");
  });
}

module.exports = { Initialize, getAllProjects, getProjectById, getProjectsBySector };

if (require.main === module) {
  Initialize()
    .then(() => getAllProjects())
    .then(data => {
      console.log("\n=== Sample Projects ===");
      console.table(data.slice(0, 5), ["id", "title", "category", "sector"]);
    })
    .catch(console.error);
}
