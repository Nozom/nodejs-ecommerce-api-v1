const slugify = require("slugify");
const expressHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");
const {
  CreateBrandValidator,
  UpdateBrandValidator,
  BrandValidatorId,
} = require("../utils/validators/BrandValidator");

exports.cerateDocs = (Model) =>
  expressHandler(async (req, res, next) => {
    const { error } = CreateBrandValidator(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    req.body.slug = slugify(req.body.name);
    const documents = await new Model(req.body);
    await documents.save();
    console.log(documents);
    res.status(201).json({ data: documents });
  });

exports.getDocs = (Model, modelName = "") =>
  expressHandler(async (req, res, next) => {
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(), req.query)
      .paginate(documentsCount)
      .filter()
      .search(modelName)
      .fields()
      .sort();
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    if (documents.length == 0) {
      return next(new ApiError(`no documents`, 404));
    }
    res
      .status(200)
      .json({ result: documents.length, paginationResult, data: documents });
  });

exports.updateDocs = (Model) =>
  expressHandler(async (req, res, next) => {
    const { error } = UpdateBrandValidator(req);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { id } = req.params;
    const { name } = req.body;
    const Brands = await Model.findById(id);
    if (Brands) {
      const updatedDouc = await Model.findOneAndUpdate(
        { _id: id },
        {
          name,
          slug: slugify(name),
        },
        { new: true }
      );
      res.status(200).json({ data: updatedDouc });
    } else {
      return next(new ApiError(`no documents for this id ${id}`, 404));
    }
  });

exports.getDoc = (Model) =>
  expressHandler(async (req, res, next) => {
    const { error } = BrandValidatorId(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const documents = await Model.findById(req.params.id);
    if (!documents) {
      return next(
        new ApiError(`no documents found for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: documents });
  });

exports.deleteOne = (Model) =>
  expressHandler(async (req, res, next) => {
    const { error } = BrandValidatorId(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    // Trigger "remove" event when update document
    document.remove();
    res.status(204).send();
  });
