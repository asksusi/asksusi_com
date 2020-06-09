import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import de from './de.json';
import am from './am.json';
import zh from './zh.json';
import es from './es.json';
import hi from './hi.json';
import fr from './fr.json';
import gr from './gr.json';
import ru from './ru.json';
import nl from './nl.json';
import pb from './pb.json';
import np from './np.json';
import ge from './ge.json';

const Translate = ({ text, prefLanguage }) => {
  const lang = {
    'de-DE': de,
    'am-AM': am,
    'es-SP': es,
    'zh-CH': zh,
    'hi-IN': hi,
    'pb-IN': pb,
    'np-NP': np,
    'fr-FR': fr,
    'ru-RU': ru,
    'gr-GR': gr,
    'nl-NL': nl,
    'ge-GE': ge,
  };

  const getTranslation = (text) => {
    const defaultPrefLanguage = prefLanguage;
    let translatedText;

    if (defaultPrefLanguage !== 'en-US') {
      if (Object.prototype.hasOwnProperty.call(lang, defaultPrefLanguage)) {
        translatedText = lang[defaultPrefLanguage][text];
      }
    }

    return !translatedText ? text : translatedText;
  };

  return <span> {getTranslation(text)} </span>;
};

Translate.propTypes = {
  text: PropTypes.string,
  prefLanguage: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    prefLanguage: store.settings.prefLanguage,
  };
}

export default connect(mapStateToProps, null)(Translate);
