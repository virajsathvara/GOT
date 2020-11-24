var express = require('express');
var router = express.Router();

/* GET battles listing. */
router.get('/', function (req, res, next) {
  const battlesCollection = req.app.db.collection('Battles');
  battlesCollection.find().toArray()
    .then(result => {
      res.send(result);
    })
    .catch(error => res.send(error));
});

/* GET battle places listing. */
router.get('/list', function (req, res, next) {
  const battlesCollection = req.app.db.collection('Battles');
  battlesCollection.distinct('location')
    .then(result => {
      res.send(result);
    })
    .catch(error => res.send(error));
});

/* GET battle count. */
router.get('/count', function (req, res, next) {
  const battlesCollection = req.app.db.collection('Battles');
  battlesCollection.distinct('battle_number')
    .then(result => {
      let count = 0;
      result.forEach(element => {
        count += element;
      });
      res.send(`count is: ${count}`);
    })
    .catch(error => res.send(error));
});

/* GET battle search. */
router.get('/search', function (req, res, next) {
  const battlesCollection = req.app.db.collection('Battles');
  const query = req.query;
  const search_parameters = [];
  let index = 0;
  for (const [key, value] of Object.entries(query)) {
    if (key.includes('name')) {
      search_parameters[index] = { name: { $regex: value } };
    }
    if (key.includes('year')) {
      search_parameters[index] = { year: value };
    }
    if (key.includes('king')) {
      search_parameters[index] = { $or: [{ attacker_king: { $regex: `.*${value}.*` } }, { defender_king: { $regex: `.*${value}.*` } }] };
    }
    if (key.includes('type')) {
      search_parameters[index] = { battle_type: value };
    }
    if (key.includes('size')) {
      search_parameters[index] = { $or: [{ attacker_size: value }, { defender_size: value }] };
    }
    if (key.includes('commander')) {
      search_parameters[index] = { $or: [{ attacker_commander: { $regex: `.*${value}.*` } }, { defender_commander: { $regex: `.*${value}.*` } }] };
    }
    if (key.includes('location')) {
      search_parameters[index] = { location: value };
    }
    if (key.includes('region')) {
      search_parameters[index] = { region: value };
    }
    index++;
  }
  battlesCollection.find({ $and: search_parameters }).toArray()
    .then(result => {
      res.send(result);
    }).catch(error => res.send(error));
});

module.exports = router;