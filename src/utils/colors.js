export const light = {
  header: '#4285f4',
  pane: '#fcfcfc',
  body: '#f5f5f5',
  composer: '#f9f9f9',
  textarea: '#fff',
  button: '#4285f4',
};

export const dark = {
  header: '#4285f4',
  pane: '#071e3d',
  body: '#0F2645',
  composer: '#1E3554',
  textarea: '#071e3d',
  button: '#4285f4',
};

export const getCustomThemeColors = ({ theme, customThemeValue }) => {
  let header,
    pane,
    body,
    composer,
    button,
    textarea,
    susiMessageBackgroundColor,
    userMessageBackgroundColor;
  if (theme === 'custom') {
    header = customThemeValue.header;
    pane = customThemeValue.pane;
    body = customThemeValue.body;
    composer = customThemeValue.composer;
    button = customThemeValue.button;
    textarea = customThemeValue.textarea;
    susiMessageBackgroundColor = customThemeValue.susiMessageBackgroundColor;
    userMessageBackgroundColor = customThemeValue.userMessageBackgroundColor;
  } else {
    header = theme === 'dark' ? dark.header : light.header;
    pane = theme === 'dark' ? dark.pane : light.pane;
    body = theme === 'dark' ? dark.body : light.body;
    composer = theme === 'dark' ? dark.composer : light.composer;
    button = theme === 'dark' ? dark.button : light.button;
    textarea = theme === 'dark' ? dark.textarea : light.textarea;
  }

  return {
    header,
    pane,
    body,
    composer,
    button,
    textarea,
    susiMessageBackgroundColor,
    userMessageBackgroundColor,
  };
};

export default getCustomThemeColors;
