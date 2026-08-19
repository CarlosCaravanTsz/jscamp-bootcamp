import { validateJob, validatePartialJob } from "../schemas/jobs";

export const validateCreate = (req, res, next) => {
  const result = validateJob(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid Request",
      details: result.error.issues,
    });
  }

  req.body = result.data;
  next();
};

export const validateUpdate = (req, res, next) => {
  const result = validatePartialJob(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid Request",
      details: result.error.issues,
    });
  }

  req.body = result.data;
  next();
};
