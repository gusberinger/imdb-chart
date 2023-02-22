DROP TABLE episodes;
DROP TABLE search;

CREATE TABLE episodes AS
    SELECT
        b.tconst,
        b.primary_title,
        b.start_year,
        b.end_year,
        r.num_votes,
        r.average_rating,
        e.episode_number,
        e.season_number,
        e.parent_tconst
    FROM basics b
    INNER JOIN ratings r ON r.tconst=b.tconst
    INNER JOIN episode_index e ON e.tconst=b.tconst
    WHERE b.title_type='tvEpisode';

CREATE TABLE search AS
    SELECT
        b.tconst,
        b.primary_title,
        b.start_year,
        b.end_year,
        r.num_votes,
        r.average_rating,
        LOWER(unaccent(primary_title)) AS searchable_title
    FROM basics b
    INNER JOIN ratings r ON r.tconst=b.tconst
    WHERE (title_type='tvSeries' OR title_type='tvMiniSeries')
        AND r.num_votes > 100;

CREATE INDEX parent_tconst_index ON episodes (parent_tconst);
ALTER TABLE episodes ADD PRIMARY KEY (tconst);
ALTER TABLE search ADD PRIMARY KEY (tconst);
