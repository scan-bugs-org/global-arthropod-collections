#!/usr/bin/env python3

import numpy as np
import pandas as pd
import geopandas as gpd

t_str = np.unicode_
t_int = np.int_
t_float = np.single
t_bool = np.bool

COLUMN_DTYPES = {
    "institutionCode": t_str,
    "institutionName": t_str,
    "collectionCode": t_str,
    "collectionName": t_str,
    "size": t_int,
    "country": t_str,
    "state": t_str,
    "tier": t_int,
    "percentPublic": t_float,
    "type": t_str,
    "lat": t_float,
    "lng": t_float,
    "url": t_str,
    "scan": t_str,
    "scanType": t_str,
    "idigbio": t_str,
    "gbif": t_str,
    "gbifDate": t_str
}

source_df = pd.read_csv(
    "source.csv",
    dtype=COLUMN_DTYPES
)

# Update boolean values
edited_df = source_df.copy()
for i, row in source_df.iterrows():
    scan = str(row["scan"]).lower() == "yes"
    idigbio = str(row["idigbio"]).lower() == "yes"
    gbif = str(row["gbif"]).lower() == "yes"

    edited_df.at[i, "scan"] = scan
    edited_df.at[i, "idigbio"] = idigbio
    edited_df.at[i, "gbif"] = gbif
source_df = edited_df

for c in ["scan", "idigbio", "gbif"]:
    source_df[c] = source_df[c].astype(t_bool)

geo_df = gpd.GeoDataFrame(
    source_df,
    # Leaflet's geometry is reversed
    geometry=gpd.points_from_xy(source_df.lng, source_df.lat)
).drop(["lat", "lng"], axis="columns")

print(geo_df.head())

geo_df.to_file("../public/data/collections.geojson", driver="GeoJSON")
