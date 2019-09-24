#!/usr/bin/env python3

import numpy as np
import os
import pandas as pd
import sqlite3

t_str = np.unicode_
t_int = pd.Int64Dtype
t_float = np.single
t_bool = np.bool

columns = {
    "institutionCode": t_str,
    "institutionName": t_str,
    "collectionCode": t_str,
    "collectionName": t_str,
    "size": t_int(),
    "country": t_str,
    "state": t_str,
    "tier": t_int(),
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
    dtype=columns
)

for i, row in source_df.iterrows():
    scan = str(row["scan"]).lower() == "yes"
    idigbio = str(row["idigbio"]).lower() == "yes"
    gbif = str(row["gbif"]).lower() == "yes"

    source_df.at[i, "scan"] = scan
    source_df.at[i, "idigbio"] = idigbio
    source_df.at[i, "gbif"] = gbif

for c in ["scan", "idigbio", "gbif"]:
    source_df[c] = source_df[c].astype(t_bool)

institution_df = source_df[
    ["institutionCode", "institutionName", "state", "country"]
].drop_duplicates(subset=["institutionCode"]).reindex()
collection_df = source_df.drop(["institutionName", "state", "country"], axis=1)

# Trim all institution codes to 4 characters max
for i, row in source_df.iterrows():
    if pd.isna(row["institutionCode"]):
        institution_name = row["institutionName"]
        institution_code = ''.join([l[0].upper() for l in institution_name.strip().split(" ")])
        institution_df.at[i, "institutionCode"] = institution_code
    else:
        institution_code = row["institutionCode"]

    if len(institution_code) > 4:
        institution_code = institution_code[0:4]
        institution_df.at[i, "institutionCode"] = institution_code
        c_row_idx = collection_df.loc[collection_df["institutionCode"] == row["institutionCode"]].index
        collection_df.at[c_row_idx, "institutionCode"] = institution_code

# Trim all collection codes to 4 characters max
for i, row in source_df.iterrows():
    if not pd.isna(row["collectionCode"]) and len(row["collectionCode"]) > 4:
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
