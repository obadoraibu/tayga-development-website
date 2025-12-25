/**
 * Lifecycle hooks for Lead content type
 * Automatically sends leads to Bitrix24 and M2Lab after creation
 */

import axios from 'axios';

export default {
  async afterCreate(event: any) {
    const { result } = event;

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

    // 2. Отправка в M2Lab
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


