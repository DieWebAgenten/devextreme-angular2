import {
    OnChanges,
    AfterViewInit,
    ElementRef,
    SimpleChange,
    NgZone
} from '@angular/core';

import { DxTemplateDirective } from './dx.template';
import { DxTemplateHost } from './dx.template-host';
import { NgEventsStrategy } from './dx.events-strategy';

declare let $: any;

export class DxComponent implements OnChanges, AfterViewInit {
    private _initialOptions: any;
    private _isChangesProcessing = false;
    eventsStrategy: NgEventsStrategy;
    templates: DxTemplateDirective[];
    widgetClassName: string;
    instance: any;

    protected _events: { subscribe?: string, emit: string }[];
    protected _properties: string[];

    private _initTemplates() {
        if (this.templates.length) {
            let initialTemplates = {};
            this.templates.forEach(template => {
                this._initialOptions[template.name] = template.templateAsFunction.bind(template);
                initialTemplates[template.name] = template;
            });
            this._initialOptions._templates = initialTemplates;
        }
    }
    protected _createEventEmitters(events) {
        events.forEach(event => {
            this[event.emit] = this.eventsStrategy.createEmitter<any>(event.emit, event.subscribe);
        });
    }
    private _initEvents(events) {
        this.instance.on('optionChanged', e => {
            let changeEventName = e.name + 'Change';
            if (this.eventsStrategy.hasNgEmitter(changeEventName) && !this._isChangesProcessing) {
                this[e.name] = e.value;
                this.eventsStrategy.fireNgEvent(changeEventName, [e.value]);
            }
        });
    }
    private _initProperties() {
        let defaultOptions = this.instance.option();
        this._properties.forEach(property => {
            this[property] = defaultOptions[property];
        });
    }
    private _createInstance() {
        let $element = $(this.element.nativeElement);
        $element[this.widgetClassName](this._initialOptions);
        this.instance = $element[this.widgetClassName]('instance');
        this.instance.setEventsStrategy(this.eventsStrategy);
    }
    private _createWidget() {
        this._initTemplates();
        this._createInstance();
        this._initEvents();
        this._initProperties();
    }
    constructor(private element: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost) {
        this._initialOptions = {};
        this.templates = [];
        templateHost.setHost(this);
        this.eventsStrategy = new NgEventsStrategy(ngZone);
    }
    setTemplate(template: DxTemplateDirective) {
        this.templates.push(template);
    }
    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        if (this.instance) {
            $.each(changes, (propertyName, change) => {
                this._isChangesProcessing = true; // prevent cycle change event emitting
                this.instance.option(propertyName, change.currentValue);
                this._isChangesProcessing = false;
            });
        } else {
            $.each(changes, (propertyName, change) => {
                this._initialOptions[propertyName] = change.currentValue;
            });
        }
    }
    ngAfterViewInit() {
        this._createWidget();
    }
}




