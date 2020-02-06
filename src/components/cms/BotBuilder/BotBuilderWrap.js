import React from 'react';
import BotWizard from './BotWizard';
import imgEventRegistration from '../../../../public/botTemplates/event-registration.jpg';
import imgContactUs from '../../../../public/botTemplates/contact-us.png';
import imgJobApplication from '../../../../public/botTemplates/job-application.jpg';

export const templates = [
  {
    name: 'Event Registration',
    id: 'event',
    image: imgEventRegistration,
    // source: https://pixabay.com/en/event-auditorium-conference-1597531/
    code:
      '::name <Bot_name>\n::category <Category>\n::language <Language>\n::author <author_name>\n::author_url <author_url>\n::description <description> \n::dynamic_content <Yes/No>\n::developer_privacy_policy <link>\n::image images/<image_name_event>\n::terms_of_use <link>\n\n\nWhat is your name? | What is your email? | Can you come to the event?\n!example: Jimmy | user@example.com | yes\n',
  },
  {
    name: 'Job Application',
    id: 'job',
    image: imgJobApplication,
    // source: https://pixabay.com/en/application-request-pen-coolie-1915343/
    code:
      '::name <Bot_name>\n::category <Category>\n::language <Language>\n::author <author_name>\n::author_url <author_url>\n::description <description> \n::dynamic_content <Yes/No>\n::developer_privacy_policy <link>\n::image images/<image_name_job>\n::terms_of_use <link>\n\n\nWhat is your name? | Why do you want this job? | What are your skills?\n!example: Jimmy | It will be helpful for my career | Web developement\n',
  },
  {
    name: 'Contact Form',
    id: 'contact',
    image: imgContactUs,
    // source: https://pixabay.com/en/need-help-contact-us-idea-like-2939262/
    code:
      '::name <Bot_name>\n::category <Category>\n::language <Language>\n::author <author_name>\n::author_url <author_url>\n::description <description> \n::dynamic_content <Yes/No>\n::developer_privacy_policy <link>\n::image images/<image_name_contact>\n::terms_of_use <link>\n\n\nWhat is your name? | What is your email? | What is your message?\n!example: Jimmy | user@example.com | i want to know about sales\n',
  },
];

const BotBuilderWrap = props => {
  document.title = 'SUSI.AI - Botbuilder';
  return <BotWizard templates={templates} />;
};

export default BotBuilderWrap;
