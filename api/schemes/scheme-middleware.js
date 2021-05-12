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
  scheme_name: yup
    .string()
    .trim()
    .min(1, "invalid scheme_name")
    .required("invalid scheme_name"),
});

const validateScheme = async (req, res, next) => {
  try {
    const schemeValidation = await schemeSchema.validate(req.body, {
      stripUnknown: true,
    });
    req.body = schemeValidation;
    next();
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};
const stepSchema = yup.object({
  instructions: yup
    .string()
    .trim()
    .typeError("invalid step")
    .min(1, "invalid step")
    .required("invalid step"),
  step_number: yup
    .number()
    .typeError("invalid step")
    .min(1, "invalid step")
    .required("invalid step"),
});

const validateStep = async (req, res, next) => {
  try {
    const stepValidation = await stepSchema.validate(req.body, {
      stripUnknown: true,
    });
    req.body = stepValidation;
    next();
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
