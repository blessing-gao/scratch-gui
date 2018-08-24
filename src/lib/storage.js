import ScratchStorage from 'scratch-storage';

import defaultProjectAssets from './default-project';

// const PROJECT_SERVER = 'https://projects.scratch.mit.edu';
// const ASSET_SERVER = 'https://cdn.assets.scratch.mit.edu';
// const PROJECT_SERVER = 'http://localhost:8080';
const PROJECT_SERVER = '//cdn.imayuan.com/project/';
// const ASSET_SERVER = 'http://owkomi1zd.bkt.clouddn.com/';
const ASSET_SERVER = '//cdn.imayuan.com/';
/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
class Storage extends ScratchStorage {
    constructor () {
        super();
        defaultProjectAssets.forEach(asset => this.cache(
            this.AssetType[asset.assetType],
            this.DataFormat[asset.dataFormat],
            asset.data,
            asset.id
        ));
        this.addWebSource(
            [this.AssetType.Project],
            this.getProjectURL.bind(this)
        );
        this.addWebSource(
            [this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound],
            this.getAssetURL.bind(this)
        );
        this.addWebSource(
            [this.AssetType.Sound],
            asset => `static/extension-assets/scratch3_music/${asset.assetId}.${asset.dataFormat}`
        );
    }
    setProjectHost (projectHost) {
        this.projectHost = projectHost;
    }
    getProjectURL (projectAsset) {
        return `${this.projectHost}${projectAsset.assetId}.json`;
    }
    setAssetHost (assetHost) {
        this.assetHost = assetHost;
    }
    getAssetURL (asset) {
        return `${this.assetHost}${asset.assetId}.${asset.dataFormat}`;
    }
}

const storage = new Storage();

export default storage;
