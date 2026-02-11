export interface QuicktypeGenerated {
    meta:    Meta;
    records: Record[];
}

export interface Meta {
    source:     string;
    exportedAt: Date;
}

export interface Record {
    object_id:           string;
    accession_number:    null | string;
    title:               null | string;
    creator:             string[] | null | string;
    date:                DateClass | number | null | string;
    object_type:         string;
    department:          string;
    materials:           string[] | null | string;
    dimensions:          Dimensions | null;
    tags?:               string[] | null;
    credit_line?:        string;
    notes?:              string[] | null;
    provenance?:         any[];
    external_ids?:       ExternalIDS;
    description?:        string;
    flags?:              Flags;
    condition?:          string;
    keywords?:           string[];
    related?:            Related[];
    geo?:                Geo;
    inventory_location?: number;
    rights?:             RightsClass | string;
    transcription?:      null | string;
    series?:             Series;
    location?:           Location;
    variants?:           Variant[];
    edition?:            Edition;
    status?:             string;
}

export interface DateClass {
    display:  string;
    earliest: number | null;
    latest:   number | null;
}

export interface Dimensions {
    display?:  null | string;
    h?:        L | number | null | string;
    w?:        L | number | null | string;
    d?:        L | null | string;
    diameter?: number | string;
    l?:        L;
    unit?:     string;
    wingspan?: string;
}

export interface L {
    value: number;
    unit:  string;
}

export interface Edition {
    number: null;
    notes:  string;
}

export interface ExternalIDS {
    emuseum?:       null | string;
    museumplus?:    null | string;
    imdb?:          null;
    internal_slug?: string;
}

export interface Flags {
    attribution_uncertain?: boolean;
    prototype?:             boolean;
    possible_duplicate?:    boolean;
    materials_incomplete?:  boolean;
    needs_review?:          boolean;
    missing_dimensions?:    boolean;
    needs_research?:        boolean;
}

export interface Geo {
    country: string;
    region:  null;
}

export interface Location {
    site:  string;
    shelf: string;
}

export interface Related {
    type:       string;
    object_id?: string;
    slug?:      string;
}

export interface RightsClass {
    status: string;
    notes:  string;
}

export interface Series {
    title: string;
    type:  string;
}

export interface Variant {
    color?:      string;
    shell?:      string;
    finish?:     string;
    upholstery?: null | string;
    notes?:      null;
}
