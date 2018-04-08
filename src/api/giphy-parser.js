const PIC_SCHEMA = {
  defaultTypeName: 'fixed_width_small_still',
  types: [
    {
      name: 'fixed_width_small_still',
      filename: '100w.gif',
      mediaQuery: '(max-width: 767px)'
    },
    {
      name: 'fixed_width',
      filename: '200w.gif',
      mediaQuery: '(min-width: 768px)'
    },
  ]
};


export const parseGiphyVO = (gifVO, typeName = PIC_SCHEMA.defaultTypeName) => {
  const imgType = gifVO.images[typeName];
  const baseUrl = imgType.url.substring(0, imgType.url.lastIndexOf('/') + 1);
  const filename = imgType.url.replace(baseUrl, '');
  return { imgType, baseUrl, filename, title: gifVO.title };
};

export const giphyTypes = PIC_SCHEMA.types.map(type => type);