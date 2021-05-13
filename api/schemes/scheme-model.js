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

  const result = idArray.reduce((acc, step) => {
    const { scheme_name, instructions, step_id, step_number } = step;
    if (acc.steps) {
      acc.steps.push({ scheme_id, scheme_name, instructions });
    } else {
      acc = {
        scheme_id: scheme_id,
        scheme_name: scheme_name,
        steps: [{ instructions, step_id, step_number }],
      };
    }
    return acc;
  }, {});
  return result;
  // 5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:
  //   {
  //     "scheme_id": 7,
  //     "scheme_name": "Have Fun!",
  //     "steps": []
  //   }
}

function findSteps(scheme_id) {
  return db("steps").where({ scheme_id }).orderBy("step_number");
}

async function add(scheme) {
  const [id] = await db("schemes").insert(scheme);
  return db("schemes").where("scheme_id", id).first();
}

async function addStep(scheme_id, step) {
  await db("steps").insert({
    step_number: step.step_number,
    instructions: step.instructions,
    scheme_id: scheme_id,
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
