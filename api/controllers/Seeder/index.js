const Utilities = require('../../utilities');

const storedRecordBasedOnTable = (table, testName, entryIndex) => {
  const randomNumber = Math.round(Math.random() * entryIndex);
  let payload = {};
  testName = testName + randomNumber + entryIndex;
  console.log(table);

  switch (table) {
    case 'User':
      payload['name'] = testName;
      payload['email'] = testName + '@gmail.com';
      payload['instagram'] = '@' + testName;
      payload['stripe_id'] = 'cus_' + randomNumber;
      payload['active'] = entryIndex % 2 === 0 ? true : false;
      break;
    case 'Lead':
      payload['name'] = testName;
      payload['email'] = testName + '@gmail.com';
      payload['active'] = entryIndex % 2 === 0 ? true : false;
      break;
  }

  console.log(payload);
  return payload;
};

module.exports = {
  seed(req, res) {
    if (
      !(
        req.query &&
        req.query.table &&
        req.query.entryCount &&
        req.query.testName
      )
    ) {
      return res.json({ error: 'Missing fields.' });
    }
    let { table, entryCount, testName } = req.query;
    table = Utilities.capitalize(table.toLowerCase());

    let model = require('../../db')[table];
    if (!model) return res.json({ error: 'Table does not exist...' });

    let creationPromises = [];
    for (let i = 0; i <= entryCount; i++) {
      creationPromises.push(
        model.create(storedRecordBasedOnTable(table, testName, i + 1)),
      );
    }
    Promise.all(creationPromises)
      .then(results => {
        return res.send(200);
      })
      .catch(error => {
        return res.send(error);
      });
  },
};
