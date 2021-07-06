import { LightningElement, wire } from 'lwc';
import getEpisodeById from '@salesforce/apex/EpisodeController.getEpisodeById';
import getSeasonById from '@salesforce/apex/SeasonController.getSeasonById';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import EPISODE_UPDATE_MESSAGE from '@salesforce/messageChannel/EpisodeUpdate__c';
export default class EpisodeDetailsView extends LightningElement {
    episodeId = null;
    seasonId = null;
    cardTitle = '';
    subscription = null;

    @wire(MessageContext)
    messageContext;

    @wire(getEpisodeById, {inEpisodeId: '$episodeId'})
	episode;

    @wire(getSeasonById, {inSeasonId: '$seasonId'})
    season;

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            EPISODE_UPDATE_MESSAGE,
            (message) => {
                this.handleEpisodeUpdate(message);
            });
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleEpisodeUpdate(message) {
        this.episodeId = message.data.episodeId;
        this.seasonId = message.data.seasonId;
    }

}