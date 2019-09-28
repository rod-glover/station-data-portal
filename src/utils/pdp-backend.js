// This module provides utilities needed to interface with the PDP backend,
// specifically with the PCDS station data download endpoint. In general,
// these functions convert values handled by the SDP (selector options, mostly)
// to values accepted by the endpoint (as query parameters).

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

const variableSelectorOption2pdpFormat = flow(
  get('contexts'),
  map('short_name'),
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