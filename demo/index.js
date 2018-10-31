const { Record, R } = require('recordari');

const RConfig = Record('Config', {
  version: R.Number.Exact(1),
  funWords: R.and([
    R.Array.Each.String,
    R.Array.Length.Min(2),
  ]),
  name: R.String,
});

const conf = RConfig(require('./config.json'));

const lastWord = conf.funWords.pop();
console.log(`${conf.name} thinks ${conf.funWords.join(', ')} & ${lastWord} are fun words.\nHow funny is that?!`);
