<#? it.isEditor #>
/* tslint:disable:directive-selector-name */
/* tslint:disable:directive-selector-type */
<#?#>
<# var collectionProperties = it.properties.filter(item => item.collection).map(item => item.name); #>

import {
    Component,
    NgModule,
    ElementRef,
    EventEmitter,
    NgZone,
    Input,
    Output<#? it.isEditor #>,
    Directive,
    forwardRef,
    HostListener<#?#><#? collectionProperties.length #>,
    OnChanges,
    DoCheck,
    SimpleChanges<#?#>
} from '@angular/core';

<#? it.isEditor #>

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

<#?#>

import { DxComponent } from '../core/dx.component';
import { DxTemplateHost } from '../core/dx.template-host';
<#? collectionProperties.length #>import { IterableDifferHelper } from '../core/iterable-differ-helper';<#?#>

@Component({
    selector: '<#= it.selector #>',
    template: '',
    providers: [DxTemplateHost<#? collectionProperties.length #>, IterableDifferHelper<#?#>]
})
export class <#= it.className #>Component extends DxComponent<#? collectionProperties.length #> implements OnChanges, DoCheck<#?#> {
    <#~ it.properties :prop:i #>@Input() <#= prop.name #>: any;<#? i < it.properties.length-1 #>
    <#?#><#~#>

    <#~ it.events :event:i #>@Output() <#= event.emit #>: EventEmitter<any>;<#? i < it.events.length-1 #>
    <#?#><#~#>

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost<#? collectionProperties.length #>,
            private _idh: IterableDifferHelper<#?#>) {

        super(elementRef, ngZone, templateHost);
        this.widgetClassName = '<#= it.widgetName #>';
        this._createEventEmitters([
            <#~ it.events :event:i #>{ <#? event.subscribe #>subscribe: '<#= event.subscribe #>', <#?#>emit: '<#= event.emit #>' }<#? i < it.events.length-1 #>,
            <#?#><#~#>
        ]);

        this._properties = [
            <#~ it.properties :prop:i #>'this.<#= prop.name #>'<#? i < it.properties.length-1 #>,
            <#?#><#~#>
        ];

        <#? collectionProperties.length #>
        this._idh.setHost(this);<#?#>
    }
<#? collectionProperties.length #>
    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
<#~ collectionProperties :prop:i #>
        this._idh.setup('<#= prop #>', changes);<#~#>
    }

    ngDoCheck() {<#~ collectionProperties :prop:i #>
        this._idh.doCheck('<#= prop #>');<#~#>
    }<#?#>
}

<#? it.isEditor #>

const CUSTOM_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => <#= it.className #>ValueAccessorDirective),
    multi: true
};

@Directive({
    selector: '<#= it.selector #>[formControlName],<#= it.selector #>[formControl],<#= it.selector #>[ngModel]',
    providers: [CUSTOM_VALUE_ACCESSOR]
})
export class <#= it.className #>ValueAccessorDirective implements ControlValueAccessor {
    @HostListener('valueChange', ['$event']) onChange(_) { }
    onTouched = () => {};

    constructor(private host: <#= it.className #>Component) {

    }

    writeValue(value: any): void {
        this.host.value = value;
    }

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
<#?#>

@NgModule({
  declarations: [
    <#= it.className #>Component<#? it.isEditor #>,
    <#= it.className #>ValueAccessorDirective<#?#>
  ],
  exports: [
    <#= it.className #>Component<#? it.isEditor #>,
    <#= it.className #>ValueAccessorDirective<#?#>
  ],
})
export class <#= it.className #>Module { }
