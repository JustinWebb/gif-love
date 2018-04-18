const PIC_SCHEMA = {
  defaultTypeName: 'fixed_width_small_still',
  types: [
    {
      name: 'fixed_width_small_still',
      filename: '100w.gif',
      displayAs: 'grid'
    },
    {
      name: 'fixed_width',
      filename: '200w.gif',
      displayAs: 'grid'
    },
    {
      name: 'preview',
      filename: 'giphy-preview.mp4',
      displayAs: 'portrait'
    },
    {
      name: 'original_mp4',
      filename: 'giphy.mp4',
      displayAs: 'portrait'
    },
  ]
};


export const parseGiphyVO = (gifVO, typeName = PIC_SCHEMA.defaultTypeName) => {
  const imgType = gifVO.images[typeName];
  const baseUrl = imgType.url.substring(0, imgType.url.lastIndexOf('/') + 1);
  const filename = imgType.url.replace(baseUrl, '');
  return { imgType, baseUrl, filename, title: gifVO.title };
};

export const giphySchemas = PIC_SCHEMA.types.map(type => type);

export const giphyTypes = (function () {
  const obj = {};
  PIC_SCHEMA.types.forEach(type => obj[type.name.toUpperCase()] = type.name);

  return obj;
})()
