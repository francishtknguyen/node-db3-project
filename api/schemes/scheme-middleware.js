const Schemes = require("./scheme-model");
const yup = require("yup");

const checkSchemeId = async (req, res, next) => {
  const idValid = await Schemes.findById(req.params.scheme_id);
  if (idValid) {
    next();
  } else {
    next({
      status: 404,
      message: `scheme with scheme_id ${req.params.scheme_id} not found`,
    });
  }
};

const schemeSchema = yup.object({
  scheme_name: yup.string().trim().required(),
});

const validateScheme = async (req, res, next) => {
  try {
    req.body = await schemeSchema.validate(req.body, {
      stripUnknown: true,
      strict: true,
    });
    next();
  } catch (err) {
    next({ status: 400, message: "invalid scheme_name" });
  }
};
const stepSchema = yup.object({
  instructions: yup.string().trim().required(),
  step_number: yup.number().min(0).required(),
});

const validateStep = async (req, res, next) => {
  try {
    req.body = await stepSchema.validate(req.body, {
      stripUnknown: true,
    });
    next();
  } catch (err) {
    next({ status: 400, message: "invalid step" });
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
