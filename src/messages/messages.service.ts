import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.model';
const SibApiV3Sdk = require('sib-api-v3-typescript');

@Injectable()
export class MessagesService {
  constructor() {}

  async sendEmailCode(user: User) {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Configure API key authorization: api-key

    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.SENDINBLUE_API_KEY,
    );

    // Configure API key authorization: partner-key

    // var partnerKey = apiInstance.authentications['partnerKey'];
    // partnerKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const sendSmtpEmail = {
      to: [
        {
          email: user.email,
          name: `${user.name} ${user.lastname}`,
        },
      ],
      templateId: 2,
      params: {
        CODE: user.emailCode,
      },
      headers: {
        'X-Mailin-custom':
          'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
      },
    };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log('API called successfully. Returned data: ' + data);
      },
      function (error) {
        console.error(error);
      },
    );
  }

  async sendSMSCode(user: User) {
    const apiInstance = new SibApiV3Sdk.TransactionalSMSApi();

    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalSMSApiApiKeys.apiKey,
      process.env.SENDINBLUE_API_KEY,
    );

    const sendTransacSms = new SibApiV3Sdk.SendTransacSms();
    sendTransacSms.sender = 'Worth';
    sendTransacSms.recipient = user.phone;
    sendTransacSms.content = `Codigo de verificacion: ${user.SMSCode}`;

    apiInstance.sendTransacSms(sendTransacSms).then(
      function (data) {
        console.log(
          'API called successfully. Returned data: ' + JSON.stringify(data),
        );
      },
      function (error) {
        console.error(error);
      },
    );
  }
}
