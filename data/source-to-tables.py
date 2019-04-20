#!/usr/bin/env python3

import numpy as np
import os
import pandas as pd
import sqlite3

source_df = pd.read_csv(
    "source.csv",
    dtype={
        "institutionCode": str,
        "institutionName": str,
        "country": str,
        "state": str,
        "collectionCode": str,
        "collectionName": str,
        "size": int,
        "tier": int,
        "percentPublic": float,
        "type": str,
        "lat": float,
        "lon": float,
        "url": str,
        "scan": str,
        "idigbio": object,
        "gbif": object
    }
)

all_df = source_df.copy()
for col in ["idigbio", "gbif"]:
    all_df[col] = source_df[col].map({"": False, "No": False, np.NAN: False, "Yes": True}).astype("bool")

# print(all_df.head())

institution_df = all_df[
    ["institutionCode", "institutionName", "state", "country"]
].drop_duplicates(subset="institutionName").reindex()

collection_df = all_df.drop(["state", "country"], axis=1)
collection_df["institutionId"] = pd.Series()

# print(institution_df.head())
# print(collection_df.head())

for i, row in all_df.iterrows():
    inst = institution_df.loc[institution_df["institutionName"] == row["institutionName"]].head(1)
    collection_df.loc[i, "institutionId"] = inst.index.astype("int")

collection_df["institutionId"] = collection_df["institutionId"].astype("int")
collection_df.drop(["institutionName", "institutionCode"], inplace=True, axis=1)

institution_df.to_csv("institutions.csv", index_label="institutionId")
collection_df.to_csv("collections.csv", index_label="collectionId")

if os.path.exists("entomology_collections.sqlite3"):
    os.remove("entomology_collections.sqlite3")

with sqlite3.connect("entomology_collections.sqlite3") as c:
    c.execute("""
        CREATE TABLE institutions(
            institutionId INT PRIMARY KEY,
            institutionCode TEXT,
            institutionName TEXT,
            country TEXT,
            state TEXT
        );
    """)
    c.execute("""
        CREATE TABLE collections(
            collectionId INT PRIMARY KEY,
            collectionCode TEXT,
            collectionName TEXT,
            size INT,
            tier INT,
            percentPublic REAL,
            type TEXT,
            lat REAL,
            lon REAL,
            url TEXT,
            scan TEXT,
            idigbio INT,
            gbif INT,
            institutionId INT,
            FOREIGN KEY (institutionId) REFERENCES institutions(institutionId)
        );
    """)

    institution_df.to_sql("institutions", c, if_exists="append", index_label="institutionId")
    collection_df.to_sql("collections", c, if_exists="append", index_label="collectionId")
