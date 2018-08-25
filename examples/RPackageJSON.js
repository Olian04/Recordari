const { Record, R } = require('Record.js');
const URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const EMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

module.exports.RPackageJSON = Record('PackageJSON', {
  name: R.and([
    R.String.Length.Max(214),
    R.or([
      R.String.Matches(/^[a-z0-9\-~][a-z0-9\-._~]*$/), // https://regex101.com/r/r3WfKS/3
      R.String.Matches(/^@[a-z0-9\-~][a-z0-9\-._~]*\/[a-z0-9\-~][a-z0-9\-._~]*$/), // https://regex101.com/r/r3WfKS/4
    ])
  ]),
  version: R.String.Matches(/^(?!0\.0\.\d+$)\d+\.\d+\.\d+$/),
  description: R.String,
  keywords: R.Array.Each.String,
  homepage: R.String.Matches(URL),
  bugs: {
    url: R.String.Matches(URL),
    email: R.String.Matches(EMAIL)
  }
  // WIP
});
