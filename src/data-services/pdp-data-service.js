import { makeURI } from '../utils/uri';
import capitalize from 'lodash/fp/capitalize';
import flatten from 'lodash/fp/flatten';
import flow from 'lodash/fp/flow';
import get from 'lodash/fp/get';
import join from 'lodash/fp/join';
import map from 'lodash/fp/map';
import padCharsStart from 'lodash/fp/padCharsStart';
import tap from 'lodash/fp/tap';
import uniq from 'lodash/fp/uniq';


const pad2 = padCharsStart('0', 2);

export const date2pdpFormat = date =>
  date && `${date.getFullYear()}/${pad2(date.getMonth()+1)}/${pad2(date.getDate())}`;

const networkSelectorOption2pdpFormat = get('value.name');

export const networkSelectorOptions2pdpFormat = flow(
  map(networkSelectorOption2pdpFormat),
  join(','),
);

// This function maps a variable item (as returned by the SDP backend
// `/variables` endpoint) to the representation used by the PDP data download
// backend for identifying variables. A variable identifier is formed by
// concatenating (without separator) the attribute `standard_name` and the
// string derived from attribute `cell_method` by replacing all occurrences
// of the string 'time: ' with '_'. It is unknown at the date of this
// writing why this replacement is performed. For reference, see PDP backend
// module `pdp_util.filters` and CRMP database view `collapsed_vars_v`,
// column `vars`.
export const variable2PdpVariableIdentifier = ({ standard_name, cell_method }) =>
  standard_name + cell_method.replace(/time: /g, '_');

const variableSelectorOption2pdpFormat = flow(
  get('contexts'),
  map(variable2PdpVariableIdentifier),
);

export const variableSelectorOptions2pdpFormat = flow(
  map(variableSelectorOption2pdpFormat),
  flatten,
  uniq,
  join(','),
);

const frequencyOption2pdpFormat = get('value');

export const frequencyOptions2pdpFormat = flow(
  map(frequencyOption2pdpFormat),
  join(','),
);


export const dataDownloadTarget =
  ({
     startDate, endDate, networks, variables, frequencies, polygon,
     onlyWithClimatology, dataCategory, dataFormat
  }) =>
  makeURI(`${process.env.REACT_APP_PDP_DATA_URL}/pcds/agg/`, {
    'from-date': date2pdpFormat(startDate),
    'to-date': date2pdpFormat(endDate),
    'network-name': networkSelectorOptions2pdpFormat(networks),
    'input-vars': variableSelectorOptions2pdpFormat(variables),
    'input-freq': frequencyOptions2pdpFormat(frequencies),
    'input-polygon': polygon || '',
    'only-with-climatology': onlyWithClimatology ? 'only-with-climatology' : '',
    [`download-${dataCategory}`]: capitalize(dataCategory),
    'data-format': get('value')(dataFormat),
  });

