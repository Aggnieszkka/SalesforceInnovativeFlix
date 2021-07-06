global with sharing class EpisodeController {
    @AuraEnabled(cacheable=true)
    global static List<Episode__c> getEpisodes(Id inSeasonId, Integer inLimit, Integer inOffset){
        return [SELECT Name, ID FROM Episode__c WHERE Season__c = :inSeasonId ORDER BY Number__c LIMIT :inLimit OFFSET :inOffset];
    }

    @AuraEnabled(cacheable=true)
    global static Episode__c getEpisodeById(Id inEpisodeId){
        return [SELECT Name, ID, Description__c, TV_Series__c, Season__c, Number__c FROM Episode__c WHERE ID = :inEpisodeId];
    }

    @AuraEnabled(cacheable=true)
    global static Integer getEpisodesCount(Id inSeasonId){
        return [SELECT Count() FROM Episode__c WHERE Season__c = :inSeasonId];
    }
}
