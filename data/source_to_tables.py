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

# Trim all institution codes to 4 characters max
for i, row in all_df[all_df["institutionCode"].notnull()].iterrows():
    if len(row["institutionCode"]) > 4:
        institution_code = row["institutionCode"][0:4]
        institution_df.at[i, "institutionCode"] = institution_code
        c_row_idx = collection_df.loc[collection_df["institutionName"] == row["institutionName"]].index
        collection_df.at[c_row_idx, "institutionCode"] = institution_code

# Populate missing institution ID's based on name
for i, row in all_df[~all_df["institutionCode"].notnull() | all_df["institutionCode"].duplicated()].iterrows():
    name_parts = row["institutionName"].split(' ')
    name_parts = [part for part in name_parts if part.lower() not in ["of", "the", "de", "la", ""]]

    if len(name_parts) == 1:
        institution_code = name_parts[0][0:4]
    else:
        institution_code = ''.join([part[0].upper() for part in name_parts if part[0].isalpha()]).strip()
        if len(institution_code) > 4:
            institution_code = institution_code[0:4]

    idx = 2
    while institution_code in institution_df["institutionCode"].unique():
        institution_code = ''.join([part[0:idx].upper() for part in name_parts])
        if len(institution_code) > 4:
            institution_code = institution_code[0:4]
        idx += 1

    i_row_idx = institution_df.loc[institution_df["institutionName"] == row["institutionName"]].index[0]
    c_row_idx = collection_df.loc[collection_df["institutionName"] == row["institutionName"]].index[0]

    institution_df.at[i_row_idx, "institutionCode"] = institution_code
    collection_df.at[c_row_idx, "institutionCode"] = institution_code

collection_df.drop(["institutionName"], axis=1, inplace=True)

# Make sure there's a unique value for each institutionCode
try:
    assert len(institution_df["institutionCode"].unique()) == len(institution_df)
except AssertionError:
    raise Exception(
        "Unique institution codes: {}; Total institutions: {}; Duplicates: {}".format(
            len(institution_df["institutionCode"].unique()),
            len(institution_df),
            list(institution_df[institution_df["institutionCode"].duplicated()]["institutionCode"])
        )
    )

print(institution_df.head())
print(collection_df.head())

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
            institutionCode TEXT,
            FOREIGN KEY (institutionCode) REFERENCES institutions(institutionCode)
        );
    """)

    institution_df.to_sql("institutions", c, if_exists="append", index=False)
    collection_df.to_sql("collections", c, if_exists="append", index_label="collectionId")
