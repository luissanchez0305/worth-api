import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MailgunService } from 'nestjs-mailgun';
import { MailgunMessageData } from 'nestjs-mailgun';

@Injectable()
export class MessagesService {
  constructor(
    private readonly httpService: HttpService,
    private mailgunService: MailgunService,
  ) {}

  async sendEmailCode(user: User) {
    const options: MailgunMessageData = {
      from: process.env.MAILGUN_USERNAME,
      to: user.email,
      subject: 'Test desde mailgun',
      /* text: `${user.name} ${user.lastname}, Código: ${user.emailCode}`,
      html: `<h1>Codigo de validacion</h1><p>Hola ${user.name} ${user.lastname},</p><p>Gracias por inscribirte</p>
        <p>Aqui tienes tu codigo de validación</p><p>Código: ${user.emailCode}</p>`,
      cc: 'luis@ifesa.tech',
      bcc: 'luis.sanchez@esferasoluciones.com', */
      'h:X-Mailgun-Variables': `{"code":${user.emailCode}}`,
      template: 'valid_email',
    };
    this.mailgunService.createEmail(process.env.MAILGUN_DOMAIN, options).then(
      function (data) {
        console.log(
          'API Email called successfully. Returned data: ' +
            JSON.stringify(data),
        );
      },
      function (error) {
        console.error(error);
      },
    );
    /* 
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
        console.log(
          'API Email called successfully. Returned data: ' +
            JSON.stringify(data),
        );
      },
      function (error) {
        console.error(error);
      },
    ); */
  }

  async sendSMSCode(user: User) {
    const _res = this.httpService.post(
      'https://nz9p4y.api.infobip.com/sms/2/text/advanced',
      {
        messages: [
          {
            destinations: [
              {
                to: user.phone,
              },
            ],
            from: 'Worth App',
            text: `Codigo de verificacion: ${user.SMSCode}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `App ${process.env.INFOBIT_API_KEY}`,
        },
      },
    );
    const res = await firstValueFrom(_res);
    return res.data;
  }
}
