# chat.susi.ai

[![Weblate](https://hosted.weblate.org/widgets/susi-ai/-/chat/svg-badge.svg)](https://hosted.weblate.org/engage/susi-ai/?utm_source=widget)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/db948e1eb4b2457386ba80388e8390cf)](https://www.codacy.com/app/rishiraj824/chat.susi.ai?utm_source=github.com&utm_medium=referral&utm_content=fossasia/chat.susi.ai&utm_campaign=badger)
[![Build Status](https://travis-ci.org/fossasia/chat.susi.ai.svg?branch=master)](https://travis-ci.org/fossasia/chat.susi.ai)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/fossasia/susi_webchat?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Twitter Follow](https://img.shields.io/twitter/follow/susiai_.svg?style=social&label=Follow&maxAge=2592000?style=flat-square)](https://twitter.com/susiai_)

Susi is an artificial intelligence combining pattern matching, internet data, data flow principles and inference engine principles. It will have some reflection abilities and it will be able to remember the users input to produce deductions and a personalized feed-back. Its purpose is to explore the abilities of an artificial companion and to answer the remaining unanswered questions. The SUSI.AI web chat is a front-end that is developed for web access of SUSI.

## Communication

Please join our mailing list to discuss questions regarding the project: https://groups.google.com/group/susiai/

Our chat channel is on gitter here: https://gitter.im/fossasia/susi_webchat

## Technology Stack

### Components
* HTML - Structure of the web page generated.
* CSS - Styling options and details of the web page.
* Javascript(JSON) - Used to store information for deploying the application such as dependencies.
* ReactJS - Structure for deployment of the web page.

## Requirements
* node --version >= 6
* npm --version >= 3

## How to deploy?

### Running on Surge:

* **Step 1:** Install Surge:```$ npm install -g surge```
* **Step 2:** Then cd into that cloned folder of chat.susi.ai
* **Step 3:** Run the App build:```$ npm run build```
* **Step 4:** Switch into the build directory:```cd build```
* **Step 5:** Run surge:```surge```
* **Step 6:** Follow the prompts and provide an email and a password.
* **Step 7:** Go to URL that appears after the above process and provide this link in PR for testing your Changes. 

### Running on localhost:
* **Step 1:** Fork chat.susi.ai repository and clone it to your desktop
* **Step 2:** Then cd into that cloned folder
* **Step 3:** Install all the dependencies by running :```$ npm install```
* **Step 4:** Run on http://localhost:3000 by running :```$ npm run start```
* **Step 5:** Build locally by running : ```$ npm run build ```
* **Step 6:** To deploy at a url use : ```$ npm run deploy ```

### How to connect to Susi Hardware?
* **Step 1:** Configure your Susi Hardware Device using instructions on https://github.com/fossasia/susi_hardware
* **Step 2:** Go to settings > Connect to Susi Hardware
* **Step 3:** Add the default WebSocket URL for your Susi Hardware Device. If you are using webchat on the same device as Susi Hardware, it will be ws://127.0.0.1:9001 . Default port is 9001, unless configured otherwise.
* **Step 4:** On successful connection, you will get a confirmation alert. After that, all your queries to your Susi Hardware Device and their results will show up on Susi Webchat.

### Speech Recognition and Synthesis

SUSI WebChat uses [Web Speech API](https://github.com/mdn/web-speech-api/) for Speech Recognition and Synthesis. To test whether your browser supports Text To Speech, open your browser console and try the following :

```
var msg = new SpeechSynthesisUtterance('Hello World');
window.speechSynthesis.speak(msg)
```

If you get a speech output then the Web API Speech Synthesis is supported by your browser and Text To Speech features of SUSI Web Chat will work. The Web Speech API has support for all latest Chrome browsers as mentioned in the [Web Speech API Mozilla docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API). However there are few bugs with some Chromium versions please check out more on how to fix them locally here in this [link](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=742758)

### Colours and Font Sizes

## Component Colours of Light theme

* Background Colour of the Application - ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff`
* Background Colour Message History -![#f5f4f6](https://placehold.it/15/f5f4f6/000000?text=+) `#f5f4f6`
* Chat bubbles Colour-
    * Chat bubbles of SUSI- ![#fffff](https://placehold.it/15/ffffff/000000?text=+) `#ffffff`
    * Chat bubbles of User-  ![#e0e0e0](https://placehold.it/15/e0e0e0/000000?text=+) `#e0e0e0`
* Top Bar Colour-  ![#4285f4](https://placehold.it/15/0084ff/000000?text=+) `#4285f4`
* Buttons Colour- ![#4285f4](https://placehold.it/15/0084ff/000000?text=+) `#4285f4`
* Colour of search result- ![#ff5e00](https://placehold.it/15/ff5e00/000000?text=+) `#ff5e00`

* Toggle Colour-
    * thumbOnColor- ![#5ab1fc](https://placehold.it/15/5ab1fc/000000?text=+) `#5ab1fc`
    * trackOnColor- ![#4285f4](https://placehold.it/15/0084ff/000000?text=+) `#4285f4`

* User Feedback Colour-
    * Thumbs Up Colour-
         **Voted**- ![#1685e5](https://placehold.it/15/1685e5/000000?text=+) `#1685e5`
         **Unvoted**- ![#90a4ae](https://placehold.it/15/90a4ae/000000?text=+) `#90a4ae`
    * Thumbs Down Colour-
    	 **Voted**- ![#d1462f](https://placehold.it/15/d1462f/000000?text=+) `#d1462f`
         **Unvoted**- ![#90a4ae](https://placehold.it/15/90a4ae/000000?text=+) `#90a4ae`

## Fonts

* Font Type of Chat Message-  "Product Sans", sans-serif
* Font Type of Message Composer-  "Product Sans", sans-serif
* Chat Message font size :14px
* Chat Composer font size : 16px
* Font Colour of Chat Message- ![#001d38](https://placehold.it/15/001d38/000000?text=+) `#001d38`
* Font Colour of Message Composer- ![#001d38](https://placehold.it/15/001d38/000000?text=+) `#001d38`
