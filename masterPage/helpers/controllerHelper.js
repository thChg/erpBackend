const _ = require("lodash");
const { DATA_TYPE } = require("../../constants/dataType");
const { default: mongoose } = require("mongoose");

const getDocumentList = async (skip, limit, Model, cond, access) => {
  const { select, sortBy } = cond;
  let selectQuery = null;
  let sortObject = { updatedAt: 1 };
  if (select) {
    selectQuery = select.split(",").join(" ");
  }
  if (sortBy) {
    const [field, direction = "asc"] = sortBy.split(".");
    sortObject = { [field]: direction === "asc" ? 1 : -1 };
  }
  if (!access) {
    const error = new Error("Unauthorized!");
    error.statusCode = 401;
    throw error;
  }
  const { recordFeatureList, apiFeatureList } = access;
  const query = generateQuery([...recordFeatureList, ...apiFeatureList]);

  const objectList = await Model.find(query)
    .skip(skip)
    .limit(limit)
    .select(selectQuery)
    .sort(sortObject);
  const length = await Model.countDocuments(query);

  return { objectList, length };
};

const normalizeDocToSchema = (doc, schema) => {
  // Base case
  if (!_.isPlainObject(schema) || !_.isPlainObject(doc)) {
    return doc;
  }

  const normalizedDoc = Object.entries(schema).reduce(
    (acc, [key, schemaValue]) => {
      const value = doc[key];

      if (value === undefined) {
        return acc;
      }

      // Case 1: Schema defines an array
      if (_.isArray(schemaValue)) {
        const subSchema = schemaValue[0];

        // Case 1a: Array of objects
        if (_.isPlainObject(subSchema)) {
          if (Array.isArray(value)) {
            acc[key] = value.map((item) =>
              normalizeDocToSchema(item, subSchema)
            );
          }
        }
        // Case 1b: Array of primitives
        else {
          // ⭐ NEW LOGIC HERE ⭐
          // If the schema wants an array and we got an array, keep it.
          if (Array.isArray(value)) {
            acc[key] = value;
          }
          // If we got a single, non-null value, wrap it in an array.
          else if (value !== null) {
            acc[key] = [value];
          }
        }
      }
      // Case 2: Nested object
      else if (_.isPlainObject(schemaValue) && !schemaValue.type) {
        if (_.isPlainObject(value)) {
          acc[key] = normalizeDocToSchema(value, schemaValue);
        }
      }
      // Case 3: Primitive type
      else {
        acc[key] = value;
      }

      return acc;
    },
    {}
  );
  return removeDeepEmpty(normalizedDoc);
};

const removeDeepEmpty = (obj) => {
  if (_.isArray(obj)) {
    return obj
      .map(removeDeepEmpty)
      .filter((v) => v !== "" && v !== null && v !== undefined);
  } else if (_.isPlainObject(obj)) {
    return _.reduce(
      obj,
      (acc, value, key) => {
        const cleaned = removeDeepEmpty(value);
        if (
          cleaned !== "" &&
          cleaned !== null &&
          cleaned !== undefined &&
          (!_.isObject(cleaned) || !_.isEmpty(cleaned))
        ) {
          acc[key] = cleaned;
        }
        return acc;
      },
      {}
    );
  }
  return obj;
};

const getDocumentById = async (Model, id, name = "Document", access) => {
  if (!id) {
    const error = new Error(`Missing ${name} Id from params.`);
    error.statusCode = 400;
    throw error;
  }
  if (!access) {
    const error = new Error("Unauthorized!");
    error.statusCode = 401;
    throw error;
  }

  const doc = await Model.findById(id);

  if (!doc) {
    const error = new Error(`${name} doesn't exist.`);
    error.statusCode = 400;
    throw error;
  }

  return doc;
};

const updateDocumentById = async (
  Model,
  id,
  updatingDoc,
  name = "Document",
  access
) => {
  const schema = Model.schema.obj;

  const doc = await getDocumentById(Model, id, name, access);

  const normalizedDoc = normalizeDocToSchema(updatingDoc, schema);

  doc.set(normalizedDoc);

  await doc.save();

  return doc;
};

const updateRelatedModel = async (Model, cond, updatingDoc) => {
  const arrayFilterArray = [];
  let setObject;
  let normalizedDoc;
  let updatedDocs;
  const [[key, value]] = Object.entries(cond);

  const splittedKey = key.split(".");
  let formattedSetArray = [];
  let currentSchema = Model.schema.obj;
  for (let i = 0; i < splittedKey.length - 1; i++) {
    currentSchema = currentSchema[splittedKey[i]][0].obj;

    formattedSetArray.push(splittedKey[i], `$[${splittedKey[i].charAt(0)}]`);

    arrayFilterArray.push({
      [[splittedKey[i].charAt(0), ...splittedKey.slice(i + 1)].join(".")]:
        value,
    });
  }

  const formattedSetField = formattedSetArray.join(".");

  normalizedDoc = normalizeDocToSchema(updatingDoc, currentSchema);

  setObject = Object.entries(normalizedDoc).reduce((acc, [key, value]) => {
    acc[formattedSetField.concat(`.${key}`)] = value;
    return acc;
  }, {});

  if (arrayFilterArray.length < 1) {
    updatedDocs = await Model.updateMany(cond, { $set: normalizedDoc });
  } else {
    updatedDocs = await Model.updateMany(
      cond,
      { $set: setObject },
      {
        arrayFilters: arrayFilterArray,
      }
    );
  }

  return updatedDocs;
};

const createNewDocument = async (Model, newDoc, name = "Document") => {
  const schema = Model.schema.obj;
  const keys = Object.entries(schema).reduce((acc, [key, value]) => {
    if (value.unique === true) {
      acc.push({ [key]: newDoc[key] });
    }
    return acc;
  }, []);

  const existingDoc = await Model.findOne({ $or: keys });

  if (existingDoc) {
    const error = new Error(`Duplicate unique Field(s) on ${name}`);
    error.statusCode = 400;
    throw error;
  }

  const normalizedDoc = normalizeDocToSchema(newDoc, schema);
  try {
    const createdDoc = await Model.create(normalizedDoc);
    return createdDoc;
  } catch (error) {
    console.error(error);
  }
};

const convertToSwaggerType = (jsType) => {
  switch (jsType) {
    case String:
      return "String";
    case Number:
      return "Number";
    case Boolean:
      return "Boolean";
    case mongoose.Schema.Types.ObjectId:
      return "id";
    case mongoose.Schema.Types.Date:
      return "Date";
    default:
      return "Array";
  }
};

const createSwaggerDefinition = (data, prefix = "") => {
  const requiredField = [];
  const properties = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value.unique) requiredField.push(`${prefix}${key}`);
    if (_.isArray(value)) {
      const { requiredField: subRequiredField, properties: subProperties } =
        createSwaggerDefinition(value[0], `${key}.`);

      requiredField.push(...subRequiredField);
      Object.entries(subProperties).forEach(([subKey, subValue]) => {
        properties[subKey] = subValue;
      });
    }
    const type = convertToSwaggerType(value.type);
    const propKey = `${prefix}${key}`;
    properties[propKey] = { type };
  });

  return { requiredField, properties };
};

const generateSwagger = (req, model) => {
  const { apiList, data } = model;

  const swagger = {};

  swagger.swagger = "2.0";
  swagger.host = "";
  swagger.basePath = req.baseUrl;

  swagger.info = {
    title: req.baseUrl.split("/")[1],
    version: 1,
    description: "",
    contact: {
      email: "chuongbgls@gmail.com",
    },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html",
    },
  };

  swagger.paths = {};

  apiList.forEach((api) => {
    const { path, method, operationId } = api;

    let currentPath = swagger.paths[path];

    if (!currentPath) {
      currentPath = {};
      swagger.paths[path] = currentPath;
    }

    currentPath[method] = {
      operationId,
    };
  });

  const { requiredField, properties } = createSwaggerDefinition(data);

  swagger.definitions = {
    required: requiredField,
    properties,
  };

  return swagger;
};

const generateQuery = (rules) => {
  if (!Array.isArray(rules)) {
    return {};
  }

  // Map feature names to their specific queryable ID fields within nested arrays.
  const nestedFieldMap = {
    roleList: "roleList.roleId",
    companyList: "companyList.companyId",
    departmentList: "departmentList.departmentId",
    moduleList: "moduleList.moduleId",
    functionList: "functionList.functionId",
  };

  const query = rules.reduce((acc, rule) => {
    // Skip any invalid or empty rules.
    if (!rule || !rule.featureName || !rule.operator) {
      return acc;
    }

    const queryKey = nestedFieldMap[rule.featureName] || rule.featureName;

    if (rule.operator === "$in" || rule.operator === "$nin") {
      acc[queryKey] = {
        [rule.operator]: _.isArray(rule.featureValue)
          ? rule.featureValue
          : [rule.featureValue],
      };
    } else {
      acc[queryKey] = rule.featureValue;
    }

    return acc;
  }, {});

  return query;
};

module.exports = {
  getDocumentList,
  getDocumentById,
  updateDocumentById,
  createNewDocument,
  updateRelatedModel,
  generateSwagger,
  generateQuery,
};
