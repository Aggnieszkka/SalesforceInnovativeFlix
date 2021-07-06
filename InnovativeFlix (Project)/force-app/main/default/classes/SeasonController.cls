global with sharing class SeasonController {
    @AuraEnabled(cacheable=true)
    global static List<Season__c> getSeasons(ID inSeriesId, Integer inLimit, Integer inOffset){
        return [SELECT Name, ID FROM Season__c WHERE TV_Serie__c = :inSeriesId ORDER BY Number__c LIMIT :inLimit OFFSET :inOffset];
    }

    @AuraEnabled(cacheable=true)
    global static Season__c getSeasonById(ID inSeasonId){
        return [SELECT Name, ID FROM Season__c WHERE ID = :inSeasonId];
    }

    @AuraEnabled(cacheable=true)
    global static Integer getSeasonsCount(Id inSeriesId){
        return [SELECT Count() FROM Season__c WHERE TV_Serie__c = :inSeriesId];
    }
}
