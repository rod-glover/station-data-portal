// This component displays a map with a station marker for each station.
//
// Notes on geometry layer group:
//
//  Terminology
//
//  - Leaflet uses the term 'layer' for all single polygons, markers, etc.
//    Leaflet uses the term 'layer group' for an object (iteself also a
//    layer, i.e, a subclass of `Layer`) that groups layers together.
//
//  Purpose
//
//  - The purpose of the geometry layer group is to allow the user to define
//    a spatial area of interest. This area drives the spatial data averaging
//    performed by various other data display tools (graphs, tables).
//
//  Behaviour
//
//  - The geometry layer group is initially empty. Geometry can be added to
//    it by any combination of drawing (on the map), uploading (e.g., a
//    from GeoJSON file), and editing and/or deleting existing geometry.
//
//  `onSetArea` callback
//
//  - All changes (add, edit) to the contents of the geometry layer group are
//    communicated by the `DataMap` callback prop `onSetArea`. This callback
//    is more or less the whole point of the geometry layer group.
//
//  - `onSetArea` is called with a single GeoJSON object representing the the
//    contents of the layer group. But see next point.


import PropTypes from 'prop-types';
import React, { Component } from 'react';
import without from 'lodash/fp/without';

import { YNWTBaseMap } from 'pcic-react-leaflet-components';
import { FeatureGroup, LayerGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import StationMarkers from '../StationMarkers';
import { geoJSONToLeafletLayers } from '../../../utils/geoJSON-leaflet';

import logger from '../../../logger';

import './StationMap.css';
import LayerControlledFeatureGroup from '../LayerControlledFeatureGroup';

logger.configure({ active: true });

const initialViewport = {
  center: {
    lat: 65.0,
    lng: -120
  },
  zoom: 6
};

export default class StationMap extends Component {
  static propTypes = {
    stations: PropTypes.array.isRequired,
    allNetworks: PropTypes.array.isRequired,
    allVariables: PropTypes.array.isRequired,
    onSetArea: PropTypes.func.isRequired,
  };

  state = {
    geometryLayers: [],
  };

// Handlers for area selection. Converts area to GeoJSON.

  layersToArea = (layers) => {
    // const area = layersToGeoJSON('GeometryCollection', layers);
    // const area = layersToGeoJSON('FeatureCollection', layers);
    // TODO: Verify assertion below (copied from CE, which has a different be).
    // TODO: Handle more general geometry?
    //  See https://github.com/pacificclimate/station-data-portal/pull/18/files#diff-7171e91138869d2b0e1de40b6ea7e584R64-R75
    // The thing that receives this GeoJSON doesn't like `FeatureCollection`s
    // or `GeometryCollection`s.
    // Right now we are therefore only updating with the first Feature, i.e.,
    // first layer. This is undesirable. Best would be to fix the receiver
    // to handle feature selections; next
    const layer0 = layers[0];
    return layer0 && layer0.toGeoJSON();
  };

  onSetArea = () => {
    this.props.onSetArea(this.layersToArea(this.state.geometryLayers));
  };

  layerStyle = (index) => index > 0 ?
    this.props.inactiveGeometryStyle :
    this.props.activeGeometryStyle;

  addGeometryLayer = layer => {
    this.setState(prevState => {
      // Set layer visual style.
      layer.setStyle(this.layerStyle(prevState.geometryLayers.length));
      // Make layer non-interactive so it doesn't block clicks on station
      // markers.
      layer.setStyle({ interactive: false });
      return { geometryLayers: prevState.geometryLayers.concat([layer]) };
    }, this.onSetArea);
  };

  addGeometryLayers = layers => {
    for (const layer of layers) {
      this.addGeometryLayer(layer);
    }
  };

  editGeometryLayers = layers => {
    // May not need to do anything to maintain `state.geometryLayers` here.
    // The contents of the layers are changed, but the layers themselves
    // (as identities) are not changed in number or identity.
    // `geometryLayers` is a list of such identities, so doesn't need to change.
    // Only need to communicate change via onSetArea.
    // Maybe not; maybe better to create a new copy of geometryLayers. Hmmm.
    this.onSetArea();
  };

  deleteGeometryLayers = layers => {
    this.setState(prevState => {
      const geometryLayers = without(layers, prevState.geometryLayers);
      // geometryLayers.forEach((layer, i) => layer.setStyle(this.layerStyle(i)));
      return { geometryLayers };
    }, this.onSetArea);
  };

  eventLayers = e => {
    // Extract the Leaflet layers from an editing event, returning them
    // as an array of layers.
    // Note: `e.layers` is a special class, not an array of layers, so we
    // have to go through this rigmarole to get the layers.
    // The alternative of accessing the private property `e.layers._layers`
    // (a) is naughty, and (b) fails.
    let layers = [];
    e.layers.eachLayer(layer => layers.push(layer));
    return layers;
  };

  handleAreaCreated = e => this.addGeometryLayer(e.layer);
  handleAreaEdited = e => this.editGeometryLayers(this.eventLayers(e));
  handleAreaDeleted = e => this.deleteGeometryLayers(this.eventLayers(e));

  // NOTE: This handler is not used ... yet. But all the infrastructure is
  // in place for it should it be wanted.
  handleUploadArea = (geoJSON) => {
    this.addGeometryLayers(geoJSONToLeafletLayers(geoJSON));
  };

  render() {
    const allowGeometryDraw = true || this.state.geometryLayers.length === 0;

    return (
      <YNWTBaseMap viewport={initialViewport}>
        <LayerControlledFeatureGroup
          layers={this.state.geometryLayers}
        >
          <EditControl
            position={'topleft'}
            draw={{
              marker: false,
              circlemarker: false,
              circle: false,
              polyline: false,
              polygon: allowGeometryDraw && {
                showArea: false,
                showLength: false,
              },
              rectangle: allowGeometryDraw && {
                showArea: false,
                showLength: false,
              },
            }}
            onCreated={this.handleAreaCreated}
            onEdited={this.handleAreaEdited}
            onDeleted={this.handleAreaDeleted}
          />
        </LayerControlledFeatureGroup>
        <LayerGroup>
          <StationMarkers
            stations={this.props.stations}
            allNetworks={this.props.allNetworks}
            allVariables={this.props.allVariables}
          />
        </LayerGroup>
      </YNWTBaseMap>
    );
  }
}

