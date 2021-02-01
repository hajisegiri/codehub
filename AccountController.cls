public with sharing class AccountController {
    @AuraEnabled(cacheable = true)
    public static List<Account> getAccountList() {
        List<Account> accountList = [
            SELECT
                Id,
                Name,
                Phone,
                AnnualRevenue,
                Industry
            FROM ACCOUNT
            WITH SECURITY_ENFORCED
        ];
        return accountList;
    }
}
