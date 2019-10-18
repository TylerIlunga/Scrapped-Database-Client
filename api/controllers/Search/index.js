const config = require('../../config');
const { Sequelize, connection } = require('../../db');
const Utilities = require('../../utilities');
const Op = Sequelize.Op;

const initEval = (query, queryFeatures, body, bodyFeatures, res) => {
  let payload = {};

  if (bodyFeatures) {
    let missing = bodyFeatures.filter(feature => !body[feature]);
    if (missing.length > 0) return { error: 'Missing required values.' };

    bodyFeatures.map(feature => {
      payload[feature] =
        feature === Array.isArray(body[feature])
          ? [...body[feature]]
          : body[feature];
    });
  }

  if (!(query && query.table)) {
    return { error: 'Missing required values.' };
  }
  if (queryFeatures) {
    let missing = queryFeatures.filter(feature => !query[feature]);
    if (missing.length > 0) return { error: 'Missing required values.' };

    queryFeatures.map(feature => {
      payload[feature] = query[feature];
    });
  }

  let { table, queryValue } = query;
  table = Utilities.capitalize(table.toLowerCase());

  let model = require('../../db')[table];
  if (!model) return { error: 'Table does not exist...' };

  return {
    ...payload,
    table,
    queryValue,
    model,
  };
};

module.exports = {
  init(req, res) {
    connection
      .query(config.queries.getAllTablesAndColumns)
      .then(([results, metadata]) => {
        let tables = [];
        let models = {};
        results.forEach(result => {
          let { table_name, column_name } = result;
          const snakeRegex = '[a-z]*_[a-z]*';

          table_name = table_name.match(snakeRegex)
            ? Utilities.capitalize(Utilities.snakeToCamel(table_name))
            : Utilities.capitalize(table_name);
          table_name = table_name.slice(0, table_name.length - 1);

          if (!models[table_name]) {
            models[table_name] = {
              label: table_name,
              columns: {
                list: [column_name],
                selectedColumn: null,
              },
              selected: false,
            };
          } else {
            models[table_name].columns.list.push(column_name);
          }
        });
        Object.keys(models).forEach(model => {
          tables.push(models[model]);
        });
        return res.json({ tables });
      });
  },
  async list(req, res) {
    let evalPayload = initEval(
      req.query,
      ['table', 'selectedColumn', 'queryValue', 'offset', 'limit'],
      req.body,
      ['columns'],
      res,
    );
    if (evalPayload.error) {
      return res.json({ error: evalPayload.error });
    }

    const {
      selectedColumn,
      columns,
      queryValue,
      model,
      offset,
      limit,
    } = evalPayload;
    model
      .findAll({
        offset,
        limit,
        attributes: ['id', ...columns],
        where: {
          [selectedColumn]: {
            [Op.like]: `%${queryValue}%`,
          },
        },
        order: [['id', 'ASC']],
      })
      .then(recordsFromTable => {
        return res.json({
          success: true,
          records: recordsFromTable,
        });
      })
      .catch(error => {
        return res.json({
          error: error.message,
        });
      });
  },
  fetch(req, res) {
    let evalPayload = initEval(
      req.query,
      ['id', 'table'],
      req.body,
      ['requestedFeatures'],
      res,
    );
    if (evalPayload.error) {
      return res.json({ error: evalPayload.error });
    }

    const { requestedFeatures, model, id } = evalPayload;
    model
      .findAll({
        attributes: [...requestedFeatures, 'id'],
        where: { id },
      })
      .then(recordFromTable => {
        return res.json({
          success: true,
          record: recordFromTable,
        });
      })
      .catch(error => {
        return res.json({
          error: error.message,
        });
      });
  },
  update(req, res) {
    let evalPayload = initEval(
      req.query,
      ['id', 'table'],
      req.body,
      ['updatedColumns', 'updatedValues'],
      res,
    );
    if (evalPayload.error) {
      return res.json({ error: evalPayload.error });
    }

    const { updatedColumns, updatedValues, model, id } = evalPayload;
    model
      .findAll({
        where: { id },
      })
      .then(async recordFromTable => {
        recordFromTable = recordFromTable[0];
        updatedColumns.forEach((column, i) => {
          recordFromTable[column] = updatedValues[i];
        });
        const updatedRecord = await recordFromTable.save();
        return res.json({
          success: true,
          record: recordFromTable,
        });
      })
      .catch(error => {
        return res.json({
          error: error.message,
        });
      });
  },
};
