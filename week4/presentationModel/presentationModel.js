
import { Observable } from "../observable/observable.js";
import { id }         from "../church/church.js";

export { Attribute,
         VALID, VALUE, EDITABLE, LABEL }

const VALUE    = "value";
const VALID    = "valid";
const EDITABLE = "editable";
const LABEL    = "label";

const Attribute = value => {

    const observables = {};

    const hasObs = name => observables.hasOwnProperty(name);

    const getObs = (name, initValue = null) => // lazy initialization
        hasObs(name)
            ? observables[name]
            : observables[name] = Observable(initValue);

    getObs(VALUE, value); // initialize the value at least

    let   convert           = id ; // erspart zusätzlichen Check bei Aufruf von convert() weil die Funktion immer existiert
    const setConverter      = converter => {
        convert = converter;
        setConvertedValue(value);
    };
    const setConvertedValue = val => getObs(VALUE).setValue(convert(val));

    // todo: this might set many validators without discharging old ones
    const setValidator = validate => getObs(VALUE).onChange( val => getObs(VALID).setValue(validate(val))); // wenn sich das Value ändert, wird es mit validate() überprüft und das Ergebnis in VALID eingetragen

    return { getObs, hasObs, setValidator, setConverter, setConvertedValue }
};
