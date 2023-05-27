import { EEmailAction } from '../enum';
export const emailTemplates: {
  [key: string]: { templateName: string; subject: string };
} = {
  [EEmailAction.REGISTER]: {
    subject: 'We are very happy, that you with us now',
    templateName: 'register',
  },
  [EEmailAction.MANAGER]: {
    subject: 'Check out an ad',
    templateName: 'manager',
  },
  [EEmailAction.ADMIN]: {
    subject: 'New marka or model',
    templateName: 'admin',
  },
};
