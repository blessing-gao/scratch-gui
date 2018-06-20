import ScratchStorage from 'scratch-storage';

import defaultProjectAssets from './default-project';

// const PROJECT_SERVER = 'https://projects.scratch.mit.edu';
// const ASSET_SERVER = 'https://cdn.assets.scratch.mit.edu';
const PROJECT_SERVER = 'http://localhost:8080';
const ASSET_SERVER = 'http://owkomi1zd.bkt.clouddn.com/';
// const ASSET_SERVER = 'http://assets.imayuan.com/';
/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
class Storage extends ScratchStorage {
    constructor () {
        super();
        this.addWebSource(
            [this.AssetType.Project],
            projectAsset => {
                const [projectId, revision] = projectAsset.assetId.split('.');
                return revision ?
                    `${PROJECT_SERVER}/scratch/getProject` :
                    `${PROJECT_SERVER}/scratch/getProject`;
            }
        );
        this.addWebSource(
            [this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound],
            asset => `${ASSET_SERVER}${asset.assetId}.${asset.dataFormat}`
        );
        this.addWebSource(
            [this.AssetType.Sound],
            asset => `static/extension-assets/scratch3_music/${asset.assetId}.${asset.dataFormat}`
        );
        defaultProjectAssets.forEach(asset => this.cache(
            this.AssetType[asset.assetType],
            this.DataFormat[asset.dataFormat],
            asset.data,
            asset.id
        ));
    }
}

const storage = new Storage();

export default storage;
