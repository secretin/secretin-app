import keepass from 'utils/importers/keepass';
import secretinDB from 'utils/importers/secretin';

const importers = {
  keepass,
  secretin: secretinDB,
};

export default importers;
