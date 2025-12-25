import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      // Настройка прав доступа для Public роли
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        // Разрешаем доступ к API для всех коллекций и single types
        const neededPermissions = [
          // Collection Types
          'api::project.project.find',
          'api::project.project.findOne',
          'api::apartment.apartment.find',
          'api::apartment.apartment.findOne',
          'api::newsitem.newsitem.find',
          'api::newsitem.newsitem.findOne',
          // Single Types
          'api::hero.hero.find',
          'api::footer.footer.find',
          'api::contact.contact.find',
          'api::sitesettings.sitesettings.find',
        ];

        for (const action of neededPermissions) {
          const existingPermission = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({
              where: {
                role: publicRole.id,
                action: action,
              },
            });

          if (!existingPermission) {
            await strapi
              .query('plugin::users-permissions.permission')
              .create({
                data: {
                  action: action,
                  role: publicRole.id,
                },
              });
          }
        }
      }
    } catch (error) {
      // Игнорируем ошибки при первой установке
      console.log('Bootstrap permissions setup skipped (normal on first install)');
    }
  },
};
