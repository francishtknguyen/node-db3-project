const db = require("../../data/db-config");

function find() {
  return db
    .select("sc.*")
    .count("st.step_id as number_of_steps")
    .from("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "=", "st.scheme_id")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id");
}

async function findById(scheme_id) {
  const idArray = await db
    .select("sc.scheme_name", "st.*")
    .from("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "=", "st.scheme_id")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number");

  if (!idArray.length) return null;
  const result = idArray.reduce((acc, step) => {
    const { scheme_name, instructions, step_id, step_number } = step;
    if (!step.step_id) {
      return { scheme_id, scheme_name, steps: [] };
    } else if (acc.steps) {
      acc.steps.push({ step_id, step_number, instructions });
    } else {
      acc = {
        scheme_id: parseInt(scheme_id),
        scheme_name: scheme_name,
        steps: [{ instructions, step_id, step_number }],
      };
    }
    return acc;
  }, {});
  return result;
}

function findSteps(scheme_id) {
  return db
    .select("sc.scheme_name", "st.instructions", "st.step_id", "step_number")
    .from("schemes as sc")
    .join("steps as st", "sc.scheme_id", "=", "st.scheme_id")
    .where("sc.scheme_id", scheme_id)
    .orderBy("step_number");
}

async function add(scheme) {
  const [id] = await db("schemes").insert(scheme);
  return db("schemes").where("scheme_id", id).first();
}

async function addStep(scheme_id, step) {
  const { step_number, instructions } = step;
  await db("steps").insert({
    step_number,
    instructions,
    scheme_id,
  });
  return await findSteps(scheme_id);
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
