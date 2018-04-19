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

export const giphySchemas = PIC_SCHEMA.types.map(type => type);

export const giphyTypes = (function () {
  const obj = {};
  PIC_SCHEMA.types.forEach(type => obj[type.name.toUpperCase()] = type.name);

  return obj;
})();

const checkAvailableMedia = (imgNode, preferedType) => {
  try {
    const media = imgNode[preferedType];
    const source = media.url || media.mp4;
    if (typeof source !== 'string') {
      console.log('bad url', preferedType, imgNode);

    } else {
      return { media, source };
    }
  } catch (error) {
    console.error(error);
  }
}

export const parseGiphyVO = (gifVO, typeName = PIC_SCHEMA.defaultTypeName) => {
  const { media, source } = checkAvailableMedia(gifVO.images, typeName);
  const baseUrl = source.substring(0, source.lastIndexOf('/') + 1);
  const filename = source.replace(baseUrl, '');
  return { media, baseUrl, filename, title: gifVO.title };
};
