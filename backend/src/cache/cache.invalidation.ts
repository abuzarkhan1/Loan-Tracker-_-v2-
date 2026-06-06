import { cacheKeys } from "./cache.keys";
import { cacheService } from "./cache.service";

export const cacheInvalidation = {
  async contactChanged(userId: string, contactId?: string) {
    await Promise.all([
      cacheService.delByPattern(cacheKeys.contacts.listPattern(userId)),
      contactId ? cacheService.del(cacheKeys.contacts.detail(userId, contactId)) : cacheService.delByPattern(cacheKeys.contacts.detailPattern(userId)),
      cacheService.delByPattern(cacheKeys.dashboard.pattern(userId)),
    ]);
  },

  async loanChanged(userId: string, options: { loanId?: string; contactId?: string } = {}) {
    await Promise.all([
      cacheService.delByPattern(cacheKeys.loans.listPattern(userId)),
      options.loanId ? cacheService.del(cacheKeys.loans.detail(userId, options.loanId)) : cacheService.delByPattern(cacheKeys.loans.detailPattern(userId)),
      options.contactId ? cacheService.del(cacheKeys.contacts.detail(userId, options.contactId)) : cacheService.delByPattern(cacheKeys.contacts.detailPattern(userId)),
      cacheService.delByPattern(cacheKeys.transactions.pattern(userId)),
      cacheService.delByPattern(cacheKeys.dashboard.pattern(userId)),
    ]);
  },

  async paymentChanged(userId: string, options: { loanId?: string; contactId?: string } = {}) {
    await this.loanChanged(userId, options);
  },

  async financeChanged(userId: string) {
    await Promise.all([
      cacheService.delByPattern(cacheKeys.transactions.pattern(userId)),
      cacheService.delByPattern(cacheKeys.categories.pattern(userId)),
      cacheService.delByPattern(cacheKeys.dashboard.pattern(userId)),
    ]);
  },

  async goalChanged(userId: string, goalId?: string) {
    await Promise.all([
      cacheService.delByPattern(cacheKeys.goals.listPattern(userId)),
      goalId ? cacheService.del(cacheKeys.goals.detail(userId, goalId)) : cacheService.delByPattern(cacheKeys.goals.detailPattern(userId)),
      cacheService.del(cacheKeys.goals.summary(userId)),
      cacheService.delByPattern(cacheKeys.dashboard.pattern(userId)),
    ]);
  },

  async userChanged(userId: string) {
    await cacheService.delByPattern(cacheKeys.userPrefix(userId) + ":*");
  },
};
