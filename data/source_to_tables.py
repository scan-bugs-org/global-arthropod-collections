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
        "idigbio": bool,
        "gbif": bool
    }
)

institution_df = source_df[
    ["institutionCode", "institutionName", "state", "country"]
].drop_duplicates(subset=["institutionCode"]).reindex()
collection_df = source_df.drop(["institutionName", "state", "country"], axis=1)

# Trim all institution codes to 4 characters max
for i, row in source_df.iterrows():
    if len(row["institutionCode"]) > 4:
        institution_code = row["institutionCode"][0:4]
        institution_df.at[i, "institutionCode"] = institution_code
        c_row_idx = collection_df.loc[collection_df["institutionCode"] == row["institutionCode"]].index
        collection_df.at[c_row_idx, "institutionCode"] = institution_code

# Trim all collection codes to 4 characters max
for i, row in source_df.iterrows():
    if len(row["collectionCode"]) > 4:
        collection_code = row["collectionCode"][0:4]
        collection_df.at[i, "collectionCode"] = collection_code

assert len(institution_df["institutionCode"].unique()) == len(institution_df)
assert len(collection_df.drop_duplicates(subset=["institutionCode", "collectionCode"])) == len(collection_df)

# print("Institution Columns: {}".format(list(institution_df.columns)))
# print("Collection Columns: {}\n".format(list(collection_df.columns)))
# print(institution_df.head())
# print(collection_df.head())

institution_df.to_csv("institutions.csv", index_label="institutionId")
collection_df.to_csv("collections.csv", index_label="collectionId")

if os.path.exists("entomology_collections.sqlite3"):
    os.remove("entomology_collections.sqlite3")

with sqlite3.connect("entomology_collections.sqlite3") as c:
    c.execute("""
        CREATE TABLE institutions(
            institutionCode TEXT PRIMARY KEY CHECK(length(institutionCode) < 5),
            institutionName TEXT,
            country TEXT,
            state TEXT
        );
    """)
    c.execute("""
        CREATE TABLE collections(
            institutionCode TEXT,
            collectionCode TEXT CHECK(length(institutionCode) < 5),
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
            FOREIGN KEY (institutionCode) REFERENCES institutions(institutionCode),
            PRIMARY KEY (institutionCode, collectionCode)
        );
    """)

    institution_df.to_sql("institutions", c, if_exists="append", index=False)
    collection_df.to_sql("collections", c, if_exists="append", index=False)
