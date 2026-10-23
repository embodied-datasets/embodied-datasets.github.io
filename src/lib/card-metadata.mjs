import thumbnails from '../data/thumbnail-sources.json';
// Preview URLs and curated facets verified against the linked official pages.
// Other cards use title-derived facets and an explicit missing-preview state.
export const cardMetadata = {
 nuScenes: {facets:['detection','detection3d','segmentation','semantic','tracking','prediction','trajectory','camera','lidar','radar','urban'],source:'https://www.nuscenes.org/',image:'https://www.nuscenes.org/static/media/gen2VehicleFacingLeft-572w.0079f74e.webp'},
 KITTI: {facets:['detection','detection2d','detection3d','tracking','localization','flow','camera','lidar','urban','highway'],source:'https://www.cvlibs.net/datasets/kitti/',image:'https://www.cvlibs.net/datasets/kitti/images/passat_sensors.jpg'},
 Boreas: {facets:[],source:'https://www.boreas.utias.utoronto.ca/',image:'https://www.boreas.utias.utoronto.ca/static/media/boreas-2021-01-26-11-22.69e90bf3fe688b666b3a.png'},
 ACDC: {facets:['segmentation','semantic','panoptic','detection','camera','night','rain','snow','fog'],source:'https://acdc.vision.ee.ethz.ch/',image:'https://acdc.vision.ee.ethz.ch/imgs/GOPR0594_frame_001038_teaser.png'},
 DSEC: {facets:['detection','segmentation','semantic','flow','camera','event','lidar'],source:'https://dsec.ifi.uzh.ch/',image:'https://dsec.ifi.uzh.ch/wp-content/uploads/2021/05/thumbnail.png'}
};

// Official sample assets are kept locally; preserve their source and original URL.
for (const [name, preview] of Object.entries(thumbnails)) {
 cardMetadata[name] = { facets: [], ...cardMetadata[name], ...preview };
}
