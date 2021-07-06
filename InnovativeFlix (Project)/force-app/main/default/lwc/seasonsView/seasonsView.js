import { LightningElement, wire, api } from 'lwc';
import SEASON_NAME_FIELD from '@salesforce/schema/Season__c.Name';
import EPISODE_NAME_FIELD from '@salesforce/schema/Episode__c.Name';
import getSeasons from '@salesforce/apex/SeasonController.getSeasons';
import getSeasonsCount from '@salesforce/apex/SeasonController.getSeasonsCount';
import getEpisodes from '@salesforce/apex/EpisodeController.getEpisodes';
import getEpisodesCount from '@salesforce/apex/EpisodeController.getEpisodesCount';
import EPISODE_UPDATE_MESSAGE from '@salesforce/messageChannel/EpisodeUpdate__c';
import { publish, MessageContext } from 'lightning/messageService';
const SEASON_ACTIONS = [
    { label: 'Show episodes', name: 'show_episodes' },
];
const SEASON_COLUMNS = [
	{ label: 'Seasons', fieldName: SEASON_NAME_FIELD.fieldApiName, type: 'text' },
	{
        type: 'action',
        typeAttributes: { rowActions: SEASON_ACTIONS },
    },
];
const EPISODE_ACTIONS = [
    { label: 'Show details', name: 'show_details' },
];
const EPISODE_COLUMNS = [
	{ label: 'Episodes', fieldName: EPISODE_NAME_FIELD.fieldApiName, type: 'text' },
	{
        type: 'action',
        typeAttributes: { rowActions: EPISODE_ACTIONS },
    },
];
export default class SeasonsView extends LightningElement {
	@wire(MessageContext) messageContext;
    @api recordId;

    showEpisodes = false;
    showSeasons = true;
	
	episodesPerPageLimit = 10;
	episodesOffset = 0;
	showEpisodesPreviousPageButton = false;
	showEpisodesNextPageButton = false;
	episodesPage = 1;
	episodesLastPage = 0;
	episodesCount = 0;

	seasonsPerPageLimit = 10;
	seasonsOffset = 0;
	showSeasonsPreviousPageButton = false;
	showSeasonsNextPageButton = false;
	seasonsPage = 1;
	seasonsLastPage = 0;
	seasonsCount = 0;
    
    season_columns = SEASON_COLUMNS;
    @wire(getSeasons, {inSeriesId: '$recordId', inLimit: '$seasonsPerPageLimit', inOffset: '$seasonsOffset'})
    seasons;
    
	episode_columns = EPISODE_COLUMNS;
	searchSeasonId = '';
	@wire(getEpisodes, {inSeasonId: '$searchSeasonId', inLimit: '$episodesPerPageLimit', inOffset: '$episodesOffset'})
	episodes;

	@wire(getEpisodesCount, {inSeasonId: '$searchSeasonId'})
	getEpisodesPagesCount({error, data}){
		if(data){
			this.episodesCount = data;
			this.episodesLastPage = Math.ceil(this.episodesCount / this.episodesPerPageLimit);
			this.episodesPage = 1;
			this.updateEpisodesPagesButtons();
		}
	};
    
	updateEpisodesPagesButtons(){
		if(this.episodesLastPage > this.episodesPage){
			this.showEpisodesNextPageButton = true;
		}
		else{
			this.showEpisodesNextPageButton = false;
		}
		if(this.episodesPage > 1){
			this.showEpisodesPreviousPageButton = true;
		}
		else{
			this.showEpisodesPreviousPageButton = false;
		}
	}

	handleEpisodesFirstPageClick(){
		this.handleEpisodesPageChange(1);
	}

	handleEpisodesPreviousPageClick(){
		this.handleEpisodesPageChange(this.episodesPage - 1);
	}

	handleEpisodesNextPageClick(){
		this.handleEpisodesPageChange(this.episodesPage + 1);
	}

	handleEpisodesLastPageClick(){
		this.handleEpisodesPageChange(this.episodesLastPage);
	}

	handleEpisodesPageChange(page){
		this.episodesPage = page;
		this.updateEpisodesOffset();
		this.updateEpisodesPagesButtons();
	}

	updateEpisodesOffset(){
		this.episodesOffset = (this.episodesPage - 1) * this.episodesPerPageLimit;
	}

	@wire(getSeasonsCount, {inSeriesId: '$recordId'})
	getSeasonsPagesCount({error, data}){
		if(data){
			this.seasonsCount = data;
			this.seasonsLastPage = Math.ceil(this.seasonsCount / this.seasonsPerPageLimit);
			this.seasonsPage = 1;
			this.updateSeasonsPagesButtons();
		}
	};
    
	updateSeasonsPagesButtons(){
		if(this.seasonsLastPage > this.seasonsPage){
			this.showSeasonsNextPageButton = true;
		}
		else{
			this.showSeasonsNextPageButton = false;
		}
		if(this.seasonsPage > 1){
			this.showSeasonsPreviousPageButton = true;
		}
		else{
			this.showSeasonsPreviousPageButton = false;
		}
	}

	handleSeasonsFirstPageClick(){
		this.handleSeasonsPageChange(1);
	}

	handleSeasonsPreviousPageClick(){
		this.handleSeasonsPageChange(this.seasonsPage - 1);
	}

	handleSeasonsNextPageClick(){
		this.handleSeasonsPageChange(this.seasonsPage + 1);
	}

	handleSeasonsLastPageClick(){
		this.handleSeasonsPageChange(this.seasonsLastPage);
	}

	handleSeasonsPageChange(page){
		this.seasonsPage = page;
		this.updateSeasonsOffset();
		this.updateSeasonsPagesButtons();
	}

	updateSeasonsOffset(){
		this.seasonsOffset = (this.seasonsPage - 1) * this.seasonsPerPageLimit;
	}

	handleBackClick(event) {
		this.showEpisodes = false;
		this.showSeasons = true;
	}

	handleSeasonRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'show_episodes':
				this.searchSeasonId = row.Id;
				this.showEpisodes = true;
				this.showSeasons = false;
                break;
            default:
        }
    }

	handleEpisodeRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'show_details':
				this.loadEpisode(row);
                break;
            default:
        }
    }

	loadEpisode(selectedEpisode) {
		if (selectedEpisode) {
			const message = { 
				data:{
					episodeId: selectedEpisode.Id,
					seasonId: this.searchSeasonId
				}
			}; 
			publish(this.messageContext, EPISODE_UPDATE_MESSAGE, message);
		}
    }
}