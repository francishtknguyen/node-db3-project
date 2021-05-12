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
    next(err);
  }
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
