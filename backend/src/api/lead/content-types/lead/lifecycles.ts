/**
 * Lifecycle hooks for Lead content type
 * Automatically sends leads to Bitrix24 and M2Lab after creation
 */

import axios from 'axios';

export default {
  async afterCreate(event: any) {
    const { result } = event;
    const emailTo = process.env.MAIL_TO;
    const emailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
    const emailReplyTo = process.env.MAIL_REPLY_TO || process.env.SMTP_USER;

    // 1. Отправка в Bitrix24
    try {
      if (process.env.BITRIX_WEBHOOK_URL) {
        await axios.post(process.env.BITRIX_WEBHOOK_URL, {
          fields: {
            TITLE: `Заявка с сайта TAYGA: ${result.name}`,
            NAME: result.name,
            PHONE: [{ VALUE: result.phone, VALUE_TYPE: "WORK" }],
            COMMENTS: result.message || "Без комментария",
            SOURCE_DESCRIPTION: "Сайт Tayga Development",
            // Дополнительные поля, если нужно:
            // UT_SOURCE: result.source,
          },
          params: { REGISTER_SONET_EVENT: "Y" } // Уведомление менеджеру
        });
        strapi.log.info(`[Lead] Lead ${result.id} sent to Bitrix24`);
      } else {
        strapi.log.warn('[Lead] BITRIX_WEBHOOK_URL not configured, skipping Bitrix24 integration');
      }
    } catch (err: any) {
      strapi.log.error(`[Lead] Failed to send lead ${result.id} to Bitrix24:`, err.message);
      // Не прерываем выполнение, продолжаем отправку в M2Lab
    }

    // 2. Отправка письма на почту
    try {
      if (emailTo && emailFrom) {
        const subject = `Заявка с сайта Tayga Development: ${result.name}`;
        const message = result.message || 'Без комментария';
        const textBody = [
          `Имя: ${result.name}`,
          `Телефон: ${result.phone}`,
          `Сообщение: ${message}`,
          `ID заявки: ${result.id}`,
        ].join('\n');

        const htmlBody = `
          <p><strong>Имя:</strong> ${result.name}</p>
          <p><strong>Телефон:</strong> ${result.phone}</p>
          <p><strong>Сообщение:</strong> ${message}</p>
          <p><strong>ID заявки:</strong> ${result.id}</p>
        `;

        await strapi.plugin('email').service('email').send({
          to: emailTo,
          from: emailFrom,
          replyTo: emailReplyTo,
          subject,
          text: textBody,
          html: htmlBody,
        });
        strapi.log.info(`[Lead] Lead ${result.id} sent to email ${emailTo}`);
      } else {
        strapi.log.warn('[Lead] MAIL_TO or MAIL_FROM not configured, skipping email notification');
      }
    } catch (err: any) {
      strapi.log.error(`[Lead] Failed to send lead ${result.id} to email:`, err.message);
      // Не прерываем выполнение, заявка уже сохранена в Strapi
    }

    // 3. Отправка в M2Lab
    try {
      if (process.env.M2LAB_API_URL && process.env.M2LAB_API_KEY) {
        await axios.post(
          process.env.M2LAB_API_URL,
          {
            name: result.name,
            phone: result.phone,
            comment: result.message || '',
            project_id: "tayga-dev", // ID вашего проекта в системе M2Lab
            api_key: process.env.M2LAB_API_KEY
          },
          {
            headers: {
              // Если M2Lab требует авторизацию через заголовок, раскомментируйте:
              // 'Authorization': `Bearer ${process.env.M2LAB_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        strapi.log.info(`[Lead] Lead ${result.id} sent to M2Lab`);
      } else {
        strapi.log.warn('[Lead] M2LAB_API_URL or M2LAB_API_KEY not configured, skipping M2Lab integration');
      }
    } catch (err: any) {
      strapi.log.error(`[Lead] Failed to send lead ${result.id} to M2Lab:`, err.message);
      // Не прерываем выполнение, заявка уже сохранена в Strapi
    }
  },
};


