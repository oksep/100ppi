import {travel} from './travel';

import fs from 'fs';

const result = travel();

fs.writeFile(`result.json`, JSON.stringify(result, null, 2), 'utf8', () => {
});