import {TextEncoder} from 'text-encoding';
import projectData from './project-data';

/* eslint-disable import/no-unresolved */
import backdrop from '!raw-loader!./cd21514d0531fdffb22204e0ec5ed84a.svg';
import costume1 from '!raw-loader!./aea5d949532a4142b32728c14384cd6d.svg';
/* eslint-enable import/no-unresolved */

const encoder = new TextEncoder();
const defaultProject = translator => {
    const projectJson = projectData(translator);
    return [{
        id: 0,
        assetType: 'Project',
        dataFormat: 'JSON',
        data: JSON.stringify(projectJson)
    }, {
        id: 'cd21514d0531fdffb22204e0ec5ed84a',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(backdrop)
    }, {
        id: 'aea5d949532a4142b32728c14384cd6d',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(costume1)
    }];
};

export default defaultProject;
